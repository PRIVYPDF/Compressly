/**
 * Utility to generate high-resolution sample test images offline
 * so users can test the compressor immediately with realistic high-detail photos.
 */

export async function createSampleImage(type: 'landscape' | 'minimal'): Promise<File> {
  const width = type === 'landscape' ? 2400 : 1600;
  const height = type === 'landscape' ? 1600 : 1200;

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('Canvas context not available');
  }

  if (type === 'landscape') {
    // Rich scenic landscape with complex gradients and textures (creates ~2.2 MB JPEG)
    // 1. Sky Gradient
    const sky = ctx.createLinearGradient(0, 0, 0, height * 0.6);
    sky.addColorStop(0, '#0f2027');
    sky.addColorStop(0.3, '#203a43');
    sky.addColorStop(0.7, '#2c5364');
    sky.addColorStop(1, '#e29062');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, width, height * 0.6);

    // 2. Glowing Sun
    const sunGrad = ctx.createRadialGradient(
      width * 0.5,
      height * 0.5,
      20,
      width * 0.5,
      height * 0.5,
      300
    );
    sunGrad.addColorStop(0, 'rgba(255, 235, 180, 0.95)');
    sunGrad.addColorStop(0.2, 'rgba(255, 170, 80, 0.7)');
    sunGrad.addColorStop(0.8, 'rgba(255, 120, 50, 0.15)');
    sunGrad.addColorStop(1, 'rgba(255, 100, 50, 0)');
    ctx.fillStyle = sunGrad;
    ctx.beginPath();
    ctx.arc(width * 0.5, height * 0.5, 300, 0, Math.PI * 2);
    ctx.fill();

    // 3. Mountain Ridge 1 (Distant)
    ctx.fillStyle = '#202a36';
    ctx.beginPath();
    ctx.moveTo(0, height * 0.55);
    for (let x = 0; x <= width; x += 60) {
      const y = height * 0.45 + Math.sin(x * 0.005) * 80 + Math.cos(x * 0.015) * 40;
      ctx.lineTo(x, y);
    }
    ctx.lineTo(width, height);
    ctx.lineTo(0, height);
    ctx.closePath();
    ctx.fill();

    // 4. Mountain Ridge 2 (Closer)
    ctx.fillStyle = '#151d27';
    ctx.beginPath();
    ctx.moveTo(0, height * 0.65);
    for (let x = 0; x <= width; x += 40) {
      const y = height * 0.58 + Math.sin(x * 0.008 + 1) * 90 + Math.cos(x * 0.02) * 50;
      ctx.lineTo(x, y);
    }
    ctx.lineTo(width, height);
    ctx.lineTo(0, height);
    ctx.closePath();
    ctx.fill();

    // 5. Water lake with reflection
    const water = ctx.createLinearGradient(0, height * 0.68, 0, height);
    water.addColorStop(0, '#13232f');
    water.addColorStop(0.5, '#1e384b');
    water.addColorStop(1, '#0b161f');
    ctx.fillStyle = water;
    ctx.fillRect(0, height * 0.68, width, height * 0.32);

    // 6. Detailed pine trees on foreground shoreline
    ctx.fillStyle = '#080d12';
    for (let x = 0; x <= width; x += 18) {
      const treeH = 90 + (x % 70) * 1.5;
      const baseY = height * 0.75 + (x % 30);
      ctx.beginPath();
      ctx.moveTo(x, baseY - treeH);
      ctx.lineTo(x - 14, baseY);
      ctx.lineTo(x + 14, baseY);
      ctx.closePath();
      ctx.fill();
    }

    // 7. High-frequency photo grain / noise to test JPEG DCT high-frequency compression
    const imgData = ctx.getImageData(0, 0, width, height);
    const pixels = imgData.data;
    for (let i = 0; i < pixels.length; i += 16) {
      const noise = (Math.random() - 0.5) * 22;
      pixels[i] = Math.min(255, Math.max(0, pixels[i] + noise));
      pixels[i + 1] = Math.min(255, Math.max(0, pixels[i + 1] + noise));
      pixels[i + 2] = Math.min(255, Math.max(0, pixels[i + 2] + noise));
    }
    ctx.putImageData(imgData, 0, 0);

  } else {
    // Clean modern architecture / studio test photo
    const grad = ctx.createLinearGradient(0, 0, width, height);
    grad.addColorStop(0, '#f8fafc');
    grad.addColorStop(0.5, '#e2e8f0');
    grad.addColorStop(1, '#94a3b8');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // Geometric shapes
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.roundRect(width * 0.2, height * 0.2, width * 0.6, height * 0.6, 32);
    ctx.fill();

    ctx.fillStyle = '#2563eb';
    ctx.beginPath();
    ctx.arc(width * 0.5, height * 0.5, 180, 0, Math.PI * 2);
    ctx.fill();
  }

  return new Promise((resolve) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          throw new Error('Blob creation failed');
        }
        const file = new File(
          [blob],
          type === 'landscape' ? 'scenic-mountains-sample.jpg' : 'studio-design-sample.jpg',
          { type: 'image/jpeg' }
        );
        resolve(file);
      },
      'image/jpeg',
      0.95
    );
  });
}
