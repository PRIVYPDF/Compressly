/**
 * Client-Side Smart Image Compressor Engine
 * Performs multi-pass binary search quality optimization and adaptive downscaling
 * to reach target file size (e.g. 20KB, 50KB, 100KB, or custom) while preserving
 * the best possible visual clarity.
 */

export interface CompressionOptions {
  targetSizeKB: number;
  preserveDimensions?: boolean;
  outputFormat?: 'auto' | 'jpeg' | 'webp' | 'png';
  onProgress?: (progress: {
    percent: number;
    stage: string;
    currentSizeKB?: number;
    pass?: number;
  }) => void;
}

export interface CompressionResult {
  blob: Blob;
  url: string;
  originalSizeKB: number;
  compressedSizeKB: number;
  savedPercent: number;
  originalWidth: number;
  originalHeight: number;
  finalWidth: number;
  finalHeight: number;
  scaled: boolean;
  format: string;
  mimeType: string;
  qualityUsed: number;
  durationMs: number;
}

/**
 * Format bytes to readable string (e.g. "2.4 MB", "48 KB")
 */
export function formatFileSize(bytes: number): string {
  if (bytes <= 0) return '0 B';
  if (bytes < 1024) return `${bytes} B`;
  const kb = bytes / 1024;
  if (kb < 1024) {
    return `${kb >= 10 ? kb.toFixed(1) : kb.toFixed(2)} KB`;
  }
  const mb = kb / 1024;
  return `${mb.toFixed(2)} MB`;
}

/**
 * Check if an image format is supported
 */
export function isSupportedFormat(mimeType: string, filename: string): boolean {
  const supportedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (supportedMimeTypes.includes(mimeType.toLowerCase())) return true;
  
  const ext = filename.split('.').pop()?.toLowerCase();
  return ['jpg', 'jpeg', 'png', 'webp'].includes(ext || '');
}

/**
 * Reads an image file and extracts dimensions and bitmap
 */
export async function loadImage(file: File): Promise<{
  image: HTMLImageElement;
  width: number;
  height: number;
  hasAlpha: boolean;
}> {
  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const img = new Image();

    img.onload = () => {
      const width = img.naturalWidth || img.width;
      const height = img.naturalHeight || img.height;

      // Quick alpha channel check for PNG images
      let hasAlpha = false;
      if (file.type === 'image/png') {
        try {
          const testCanvas = document.createElement('canvas');
          testCanvas.width = Math.min(width, 100);
          testCanvas.height = Math.min(height, 100);
          const ctx = testCanvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, testCanvas.width, testCanvas.height);
            const data = ctx.getImageData(0, 0, testCanvas.width, testCanvas.height).data;
            for (let i = 3; i < data.length; i += 4) {
              if (data[i] < 250) {
                hasAlpha = true;
                break;
              }
            }
          }
        } catch {
          // Fallback if canvas security throws
          hasAlpha = false;
        }
      }

      resolve({
        image: img,
        width,
        height,
        hasAlpha,
      });
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error('Failed to load image. The file may be corrupt.'));
    };

    img.src = objectUrl;
  });
}

/**
 * Helper to convert canvas to blob promise with strict validation
 */
function canvasToBlob(
  canvas: HTMLCanvasElement,
  mimeType: string,
  quality: number
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    // Quality clamping between 0.05 and 0.99
    const clampedQ = Math.max(0.05, Math.min(0.99, quality));
    canvas.toBlob(
      (blob) => {
        if (blob && blob.size > 0) {
          resolve(blob);
        } else {
          // If browser fails on mimeType or produces 0 bytes, fallback to standard jpeg
          canvas.toBlob((fallbackBlob) => {
            if (fallbackBlob && fallbackBlob.size > 0) {
              resolve(fallbackBlob);
            } else {
              reject(new Error('Failed to generate valid image data from canvas'));
            }
          }, 'image/jpeg', clampedQ);
        }
      },
      mimeType,
      clampedQ
    );
  });
}

/**
 * Smart Compress function
 * Prioritizes visual quality, tests original resolution first,
 * reduces dimensions gradually only when necessary for small targets (e.g. 20KB),
 * and guarantees a clean, uncorrupted, downloadable image.
 */
export async function compressImage(
  file: File,
  options: CompressionOptions
): Promise<CompressionResult> {
  const startTime = performance.now();
  const targetBytes = Math.round(options.targetSizeKB * 1024);
  const originalBytes = file.size;
  const originalSizeKB = originalBytes / 1024;

  options.onProgress?.({ percent: 10, stage: 'Analyzing image data...' });

  const { image, width: origWidth, height: origHeight, hasAlpha } = await loadImage(file);

  if (origWidth <= 0 || origHeight <= 0) {
    throw new Error('Invalid image dimensions detected.');
  }

  // Determine output mime type
  let mimeType = 'image/jpeg';
  if (options.outputFormat === 'webp') {
    mimeType = 'image/webp';
  } else if (options.outputFormat === 'jpeg') {
    mimeType = 'image/jpeg';
  } else if (options.outputFormat === 'png') {
    mimeType = 'image/png';
  } else {
    // Auto mode: preserve transparency with WebP, otherwise JPEG for maximum compatibility & compression
    if (file.type === 'image/webp') {
      mimeType = 'image/webp';
    } else if (file.type === 'image/png') {
      mimeType = hasAlpha ? 'image/webp' : 'image/jpeg';
    } else {
      mimeType = 'image/jpeg';
    }
  }

  // Initialize canvas
  const canvas = document.createElement('canvas');
  let currentWidth = origWidth;
  let currentHeight = origHeight;
  let scaled = false;

  canvas.width = currentWidth;
  canvas.height = currentHeight;
  let ctx = canvas.getContext('2d', { alpha: mimeType !== 'image/jpeg' });

  if (!ctx) {
    throw new Error('Unable to initialize canvas rendering context.');
  }

  // Fill solid background for non-alpha JPEG to avoid black artifacting
  if (mimeType === 'image/jpeg') {
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, currentWidth, currentHeight);
  }
  ctx.drawImage(image, 0, 0, currentWidth, currentHeight);

  options.onProgress?.({ percent: 25, stage: 'Testing original resolution quality...' });

  let bestBlob: Blob | null = null;
  let bestQuality = 0.85;
  let bestDiff = Infinity;

  // Gradual scale steps: Test full resolution (1.0x) first!
  // Only if 20KB or tight target cannot be reached without severe quality loss,
  // step down gradually (0.85x, 0.72x, 0.60x, 0.50x, 0.40x).
  const scaleSteps = options.preserveDimensions
    ? [1.0]
    : [1.0, 0.85, 0.72, 0.60, 0.50, 0.40, 0.30];

  for (let stepIndex = 0; stepIndex < scaleSteps.length; stepIndex++) {
    const scaleFactor = scaleSteps[stepIndex];
    const isOriginalScale = scaleFactor === 1.0;

    // Apply gradual dimension reduction only if not on original scale
    if (!isOriginalScale) {
      scaled = true;
      currentWidth = Math.max(160, Math.round(origWidth * scaleFactor));
      currentHeight = Math.max(160, Math.round(origHeight * scaleFactor));

      canvas.width = currentWidth;
      canvas.height = currentHeight;
      ctx = canvas.getContext('2d', { alpha: mimeType !== 'image/jpeg' });
      if (ctx) {
        if (mimeType === 'image/jpeg') {
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, currentWidth, currentHeight);
        }
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(image, 0, 0, currentWidth, currentHeight);
      }
    }

    // Binary search over quality
    // On original scale, don't drop quality below 0.18 to prevent gross pixelation.
    // On scaled images, we can maintain higher quality (0.35 - 0.95) for crisp, clean results.
    let minQ = isOriginalScale ? 0.18 : 0.25;
    let maxQ = 0.95;
    let stepBestBlob: Blob | null = null;
    let stepBestQuality = 0.8;

    const progressBase = 25 + (stepIndex / scaleSteps.length) * 65;

    for (let iter = 0; iter < 6; iter++) {
      const q = (minQ + maxQ) / 2;
      const testBlob = await canvasToBlob(canvas, mimeType, q);
      const testSize = testBlob.size;

      options.onProgress?.({
        percent: Math.round(progressBase + (iter / 6) * (65 / scaleSteps.length)),
        stage: `Optimizing quality: ${(q * 100).toFixed(0)}%...`,
        currentSizeKB: testSize / 1024,
      });

      if (testSize <= targetBytes) {
        // Fits under target! Track this and try higher quality for sharper visual fidelity
        stepBestBlob = testBlob;
        stepBestQuality = q;
        minQ = q; // try better quality
      } else {
        // Exceeds target, need lower quality or gradual scale down
        maxQ = q;
        if (!stepBestBlob || testSize < stepBestBlob.size) {
          stepBestBlob = testBlob;
          stepBestQuality = q;
        }
      }
    }

    if (stepBestBlob) {
      const diff = Math.abs(stepBestBlob.size - targetBytes);
      if (diff < bestDiff || !bestBlob) {
        bestDiff = diff;
        bestBlob = stepBestBlob;
        bestQuality = stepBestQuality;
      }

      // If we successfully hit <= targetBytes (or within 3% tolerance), STOP!
      // This ensures we do not downscale any further than strictly needed!
      if (stepBestBlob.size <= targetBytes || stepBestBlob.size <= targetBytes * 1.03) {
        break;
      }
    }
  }

  // Final validation: Ensure blob is never null, empty, or 0 bytes
  if (!bestBlob || bestBlob.size === 0) {
    bestBlob = await canvasToBlob(canvas, mimeType, 0.7);
  }

  if (!bestBlob || bestBlob.size === 0) {
    throw new Error('Image compression failed to produce a valid file. Please try again.');
  }

  options.onProgress?.({ percent: 100, stage: 'Finalizing compressed image...' });

  const compressedSizeKB = bestBlob.size / 1024;
  const savedBytes = Math.max(0, originalBytes - bestBlob.size);
  const savedPercent = Math.round((savedBytes / originalBytes) * 100);

  const url = URL.createObjectURL(bestBlob);
  const durationMs = Math.round(performance.now() - startTime);

  let formatLabel = 'JPG';
  if (mimeType === 'image/webp') formatLabel = 'WebP';
  if (mimeType === 'image/png') formatLabel = 'PNG';

  return {
    blob: bestBlob,
    url,
    originalSizeKB,
    compressedSizeKB,
    savedPercent,
    originalWidth: origWidth,
    originalHeight: origHeight,
    finalWidth: currentWidth,
    finalHeight: currentHeight,
    scaled,
    format: formatLabel,
    mimeType,
    qualityUsed: Math.round(bestQuality * 100),
    durationMs,
  };
}
