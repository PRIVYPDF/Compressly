import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Upload,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  Download,
  RotateCcw,
  Sparkles,
  ArrowRight,
  Sliders,
  FileCheck,
  Maximize2
} from 'lucide-react';
import {
  compressImage,
  formatFileSize,
  isSupportedFormat,
  loadImage,
  CompressionResult
} from '../utils/compressor';
import { createSampleImage } from '../utils/samples';
import { ImageComparisonSlider } from './ImageComparisonSlider';

type TargetPreset = '20' | '50' | '100' | 'custom';

export const CompressorTool: React.FC = () => {
  // File state
  const [file, setFile] = useState<File | null>(null);
  const [filePreviewUrl, setFilePreviewUrl] = useState<string | null>(null);
  const [dimensions, setDimensions] = useState<{ width: number; height: number } | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Target size state
  const [selectedPreset, setSelectedPreset] = useState<TargetPreset>('50');
  const [customSizeKB, setCustomSizeKB] = useState<string>('75');
  const [preserveDimensions, setPreserveDimensions] = useState(false);

  // Compression processing state
  const [isCompressing, setIsCompressing] = useState(false);
  const [progress, setProgress] = useState<{ percent: number; stage: string }>({
    percent: 0,
    stage: ''
  });

  // Result state
  const [result, setResult] = useState<CompressionResult | null>(null);
  const [isSampleLoading, setIsSampleLoading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const toolContainerRef = useRef<HTMLDivElement>(null);

  // Cleanup object URLs when file or result changes
  useEffect(() => {
    return () => {
      if (filePreviewUrl) URL.revokeObjectURL(filePreviewUrl);
      if (result?.url) URL.revokeObjectURL(result.url);
    };
  }, [filePreviewUrl, result]);

  // Handle file validation and loading
  const processSelectedFile = useCallback(async (selectedFile: File) => {
    setErrorMessage(null);
    setResult(null);

    // Validate type
    if (!isSupportedFormat(selectedFile.type, selectedFile.name)) {
      setErrorMessage('Please upload a valid image file (JPG, JPEG, PNG, or WEBP).');
      return;
    }

    // Validate size (max 20 MB)
    const maxBytes = 20 * 1024 * 1024;
    if (selectedFile.size > maxBytes) {
      setErrorMessage('File size exceeds the 20 MB limit. Please select a smaller image.');
      return;
    }

    // Create preview
    if (filePreviewUrl) {
      URL.revokeObjectURL(filePreviewUrl);
    }
    const preview = URL.createObjectURL(selectedFile);
    setFile(selectedFile);
    setFilePreviewUrl(preview);

    try {
      const imgInfo = await loadImage(selectedFile);
      setDimensions({ width: imgInfo.width, height: imgInfo.height });
    } catch {
      setErrorMessage('Could not load image dimensions. The file might be corrupted.');
    }
  }, [filePreviewUrl]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processSelectedFile(e.target.files[0]);
    }
  };

  const handleLoadSample = async (type: 'landscape' | 'minimal') => {
    try {
      setIsSampleLoading(true);
      const sample = await createSampleImage(type);
      await processSelectedFile(sample);
    } catch (err) {
      setErrorMessage('Failed to generate sample image.');
    } finally {
      setIsSampleLoading(false);
    }
  };

  // Get effective target size in KB
  const getTargetSizeKB = (): number => {
    if (selectedPreset === '20') return 20;
    if (selectedPreset === '50') return 50;
    if (selectedPreset === '100') return 100;
    const customVal = parseFloat(customSizeKB);
    return isNaN(customVal) || customVal < 5 ? 50 : customVal;
  };

  const handleCompress = async () => {
    if (!file) return;

    setIsCompressing(true);
    setErrorMessage(null);
    setProgress({ percent: 10, stage: 'Preparing image engine...' });

    const targetKB = getTargetSizeKB();

    try {
      const compressionResult = await compressImage(file, {
        targetSizeKB: targetKB,
        preserveDimensions,
        onProgress: (p) => {
          setProgress({ percent: p.percent, stage: p.stage });
        }
      });

      setResult(compressionResult);

      // Scroll smoothly down to the comparison result
      setTimeout(() => {
        const resultElement = document.getElementById('compression-result-card');
        if (resultElement) {
          resultElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      }, 100);
    } catch (err) {
      setErrorMessage(
        err instanceof Error ? err.message : 'An unexpected error occurred during compression.'
      );
    } finally {
      setIsCompressing(false);
    }
  };

  const handleDownload = () => {
    if (!result || !file) return;

    const link = document.createElement('a');
    const originalBaseName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
    const extension = result.mimeType === 'image/webp' ? 'webp' : result.mimeType === 'image/png' ? 'png' : 'jpg';
    link.download = `${originalBaseName}-compressly-${Math.round(result.compressedSizeKB)}kb.${extension}`;
    link.href = result.url;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleReset = () => {
    if (filePreviewUrl) URL.revokeObjectURL(filePreviewUrl);
    if (result?.url) URL.revokeObjectURL(result.url);
    setFile(null);
    setFilePreviewUrl(null);
    setDimensions(null);
    setResult(null);
    setErrorMessage(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    
    // Scroll back to top of tool
    if (toolContainerRef.current) {
      toolContainerRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div ref={toolContainerRef} className="mx-auto max-w-4xl px-3 sm:px-6 w-full">
      {/* Main Container Card - Visual Focus */}
      <div className="rounded-2xl sm:rounded-3xl border border-neutral-200/90 bg-white p-4 sm:p-8 shadow-sm">
        {/* Error notification */}
        {errorMessage && (
          <div className="mb-5 flex items-start gap-2.5 rounded-xl border border-rose-200 bg-rose-50 p-3.5 sm:p-4 text-xs sm:text-sm text-rose-800">
            <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 shrink-0 text-rose-600 mt-0.5" />
            <div>
              <p className="font-semibold">Notice</p>
              <p className="mt-0.5">{errorMessage}</p>
            </div>
          </div>
        )}

        {/* STEP 1: Upload state (when no file is chosen yet) */}
        {!file && (
          <div className="space-y-4 sm:space-y-6">
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`group relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-6 sm:p-14 text-center cursor-pointer transition-all duration-200 ${
                dragActive
                  ? 'border-neutral-900 bg-neutral-100/80 scale-[0.99]'
                  : 'border-neutral-300 hover:border-neutral-900 hover:bg-neutral-50/60'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                onChange={handleFileChange}
                className="hidden"
              />

              {/* Upload Icon */}
              <div className="flex h-12 w-12 sm:h-16 sm:w-16 items-center justify-center rounded-2xl bg-neutral-100 border border-neutral-200 text-neutral-800 transition group-hover:scale-110 group-hover:bg-neutral-900 group-hover:text-white">
                <Upload className="h-6 w-6 sm:h-8 sm:w-8 stroke-[1.75]" />
              </div>

              {/* Primary Headings - Exact user specification */}
              <h2 className="mt-4 sm:mt-5 text-lg font-bold text-neutral-900 sm:text-2xl">
                Drop your image here
              </h2>
              <p className="mt-1 text-xs sm:text-sm font-semibold text-neutral-500 group-hover:text-neutral-900 transition">
                or click to browse
              </p>

              {/* Supported info - Exact user specification */}
              <div className="mt-4 sm:mt-6 flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs text-neutral-500">
                <span className="font-medium text-neutral-700">Supported:</span>
                <span className="rounded-md bg-neutral-100 px-1.5 py-0.5 font-mono text-[10px] sm:text-[11px] text-neutral-800">
                  JPG
                </span>
                <span className="rounded-md bg-neutral-100 px-1.5 py-0.5 font-mono text-[10px] sm:text-[11px] text-neutral-800">
                  JPEG
                </span>
                <span className="rounded-md bg-neutral-100 px-1.5 py-0.5 font-mono text-[10px] sm:text-[11px] text-neutral-800">
                  PNG
                </span>
                <span className="rounded-md bg-neutral-100 px-1.5 py-0.5 font-mono text-[10px] sm:text-[11px] text-neutral-800">
                  WEBP
                </span>
                <span className="text-neutral-300">•</span>
                <span>Maximum file size: 20 MB</span>
              </div>
            </div>

            {/* Quick Test Sample Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5 rounded-xl bg-neutral-50 p-3 sm:p-3.5 border border-neutral-200/80 text-xs text-neutral-600">
              <span className="flex items-center gap-1.5 font-medium text-center sm:text-left">
                <Sparkles className="h-4 w-4 text-blue-600 shrink-0" />
                Don't have an image ready? Test right away:
              </span>
              <button
                type="button"
                disabled={isSampleLoading}
                onClick={() => handleLoadSample('landscape')}
                className="w-full sm:w-auto rounded-lg bg-white px-3 py-1.5 font-semibold text-neutral-800 border border-neutral-300 shadow-2xs hover:bg-neutral-100 transition cursor-pointer disabled:opacity-50 text-center"
              >
                {isSampleLoading ? 'Generating...' : 'Landscape photo (2.4 MB)'}
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: File loaded state (image preview, metadata & target size controls) */}
        {file && filePreviewUrl && (
          <div className="space-y-6 sm:space-y-8">
            {/* Image Details Banner */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 rounded-xl sm:rounded-2xl border border-neutral-200 bg-neutral-50/70 p-3.5 sm:p-5">
              <div className="flex items-center gap-3 sm:gap-4 min-w-0 w-full sm:w-auto">
                <div className="relative h-14 w-14 sm:h-16 sm:w-16 shrink-0 overflow-hidden rounded-xl border border-neutral-300 bg-white">
                  <img
                    src={filePreviewUrl}
                    alt="Image preview"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-sm sm:text-base font-bold text-neutral-900 max-w-[200px] xs:max-w-[260px] sm:max-w-md">
                    {file.name}
                  </h3>
                  <div className="mt-1 flex flex-wrap items-center gap-2 sm:gap-3 text-xs text-neutral-600 font-medium">
                    <span className="inline-flex items-center gap-1">
                      <FileCheck className="h-3.5 w-3.5 text-neutral-500" />
                      Original: <strong className="text-neutral-900 font-bold">{formatFileSize(file.size)}</strong>
                    </span>
                    {dimensions && (
                      <>
                        <span className="text-neutral-300 hidden xs:inline">•</span>
                        <span className="inline-flex items-center gap-1 font-mono text-[11px]">
                          <Maximize2 className="h-3 w-3 text-neutral-500" />
                          {dimensions.width} × {dimensions.height} px
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={handleReset}
                className="w-full sm:w-auto shrink-0 flex items-center justify-center gap-1.5 rounded-lg border border-neutral-300 bg-white px-3 py-1.5 text-xs font-semibold text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900 transition cursor-pointer shadow-2xs"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Change image
              </button>
            </div>

            {/* TARGET SIZE SECTION */}
            <div className="space-y-3.5 sm:space-y-4">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-base sm:text-lg font-bold text-neutral-900 tracking-tight">
                  Choose Target Size
                </h3>
                <span className="text-xs text-neutral-500 shrink-0">
                  Target size: <span className="font-semibold text-neutral-900">{getTargetSizeKB()} KB</span>
                </span>
              </div>

              {/* 4 simple preset buttons: 20 KB, 50 KB, 100 KB, Custom */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedPreset('20')}
                  className={`flex flex-col items-center justify-center rounded-xl p-3 sm:p-4 border text-center transition cursor-pointer ${
                    selectedPreset === '20'
                      ? 'border-neutral-900 bg-neutral-900 text-white shadow-xs'
                      : 'border-neutral-200 bg-white text-neutral-800 hover:border-neutral-400 hover:bg-neutral-50'
                  }`}
                >
                  <span className="text-base sm:text-lg font-bold">20 KB</span>
                  <span className={`text-[10px] sm:text-[11px] mt-0.5 ${selectedPreset === '20' ? 'text-neutral-300' : 'text-neutral-500'}`}>
                    Ultra lightweight
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedPreset('50')}
                  className={`flex flex-col items-center justify-center rounded-xl p-3 sm:p-4 border text-center transition cursor-pointer ${
                    selectedPreset === '50'
                      ? 'border-neutral-900 bg-neutral-900 text-white shadow-xs'
                      : 'border-neutral-200 bg-white text-neutral-800 hover:border-neutral-400 hover:bg-neutral-50'
                  }`}
                >
                  <span className="text-base sm:text-lg font-bold">50 KB</span>
                  <span className={`text-[10px] sm:text-[11px] mt-0.5 ${selectedPreset === '50' ? 'text-neutral-300' : 'text-neutral-500'}`}>
                    Ideal for web &amp; email
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedPreset('100')}
                  className={`flex flex-col items-center justify-center rounded-xl p-3 sm:p-4 border text-center transition cursor-pointer ${
                    selectedPreset === '100'
                      ? 'border-neutral-900 bg-neutral-900 text-white shadow-xs'
                      : 'border-neutral-200 bg-white text-neutral-800 hover:border-neutral-400 hover:bg-neutral-50'
                  }`}
                >
                  <span className="text-base sm:text-lg font-bold">100 KB</span>
                  <span className={`text-[10px] sm:text-[11px] mt-0.5 ${selectedPreset === '100' ? 'text-neutral-300' : 'text-neutral-500'}`}>
                    High fidelity balance
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedPreset('custom')}
                  className={`flex flex-col items-center justify-center rounded-xl p-3 sm:p-4 border text-center transition cursor-pointer ${
                    selectedPreset === 'custom'
                      ? 'border-neutral-900 bg-neutral-900 text-white shadow-xs'
                      : 'border-neutral-200 bg-white text-neutral-800 hover:border-neutral-400 hover:bg-neutral-50'
                  }`}
                >
                  <span className="text-base sm:text-lg font-bold">Custom</span>
                  <span className={`text-[10px] sm:text-[11px] mt-0.5 ${selectedPreset === 'custom' ? 'text-neutral-300' : 'text-neutral-500'}`}>
                    Set exact target KB
                  </span>
                </button>
              </div>

              {/* Natural SEO Helper Note */}
              <p className="text-[11px] text-neutral-500 px-0.5 leading-relaxed">
                Choose a preset to compress image to 20KB, compress image to 50KB, compress image to 100KB, or set a custom target.
              </p>

              {/* Custom Size Input Area */}
              {selectedPreset === 'custom' && (
                <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-3.5 sm:p-5 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                    <label htmlFor="custom-size-input" className="text-xs sm:text-sm font-semibold text-neutral-800">
                      Enter target file size:
                    </label>
                    <div className="relative flex items-center w-full sm:w-auto">
                      <input
                        id="custom-size-input"
                        type="number"
                        min="5"
                        max="15000"
                        step="5"
                        value={customSizeKB}
                        onChange={(e) => setCustomSizeKB(e.target.value)}
                        className="w-full sm:w-32 rounded-lg border border-neutral-300 bg-white px-3 py-2 pr-10 text-right font-mono font-bold text-neutral-900 shadow-2xs focus:border-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900"
                      />
                      <span className="absolute right-3 text-xs font-semibold text-neutral-500 pointer-events-none">
                        KB
                      </span>
                    </div>
                  </div>

                  {/* Range Slider for rapid adjustment */}
                  <div className="pt-1">
                    <input
                      type="range"
                      min="10"
                      max="1000"
                      step="10"
                      value={parseFloat(customSizeKB) || 50}
                      onChange={(e) => setCustomSizeKB(e.target.value)}
                      className="w-full accent-neutral-900 cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] sm:text-[11px] text-neutral-500 font-mono mt-1">
                      <span>10 KB</span>
                      <span>250 KB</span>
                      <span>500 KB</span>
                      <span>1000 KB</span>
                    </div>
                  </div>

                  {/* Quick Preset Badges */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-1 text-xs">
                    <span className="text-neutral-500 font-medium text-[11px]">Quick options:</span>
                    {['150', '250', '500', '800'].map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => setCustomSizeKB(preset)}
                        className="rounded-md border border-neutral-300 bg-white px-2 py-0.5 font-mono text-[11px] text-neutral-700 hover:bg-neutral-100 cursor-pointer"
                      >
                        {preset} KB
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quality & Downscaling Option */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none text-xs text-neutral-600">
                  <input
                    type="checkbox"
                    checked={preserveDimensions}
                    onChange={(e) => setPreserveDimensions(e.target.checked)}
                    className="rounded border-neutral-300 text-neutral-900 focus:ring-neutral-900"
                  />
                  <span>Strictly preserve original pixel dimensions</span>
                </label>
                <span className="text-[10px] sm:text-[11px] text-neutral-400">
                  {preserveDimensions
                    ? 'Only adjusts image compression quality'
                    : 'Gradually reduces dimensions only when necessary'}
                </span>
              </div>
            </div>

            {/* MAIN CTA: COMPRESS IMAGE */}
            <div className="pt-2">
              <button
                type="button"
                disabled={isCompressing}
                onClick={handleCompress}
                className="w-full relative flex items-center justify-center gap-2 rounded-2xl bg-neutral-900 py-3.5 sm:py-4 px-4 sm:px-6 text-sm sm:text-base font-bold text-white shadow-sm transition hover:bg-neutral-800 active:scale-[0.99] disabled:opacity-60 cursor-pointer"
              >
                {isCompressing ? (
                  <>
                    <div className="h-4 w-4 sm:h-5 sm:w-5 animate-spin rounded-full border-2 border-white/20 border-t-white" />
                    <span>Compressing image... {progress.percent}%</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 sm:h-5 sm:w-5" />
                    <span>COMPRESS IMAGE</span>
                  </>
                )}
              </button>

              {/* Compression Progress Bar */}
              {isCompressing && (
                <div className="mt-3.5 space-y-1.5">
                  <div className="h-2 w-full overflow-hidden rounded-full bg-neutral-100">
                    <div
                      className="h-full bg-neutral-900 transition-all duration-200 ease-out"
                      style={{ width: `${progress.percent}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-neutral-500">
                    <span>{progress.stage || 'Processing image...'}</span>
                    <span className="font-mono">{progress.percent}%</span>
                  </div>
                </div>
              )}
            </div>

            {/* RESULT SECTION (After Compression) */}
            {result && (
              <div
                id="compression-result-card"
                className="mt-8 sm:mt-10 rounded-2xl border-2 border-neutral-900 bg-neutral-50/50 p-4 sm:p-7 space-y-5 sm:space-y-6"
              >
                {/* Result header */}
                <div className="flex items-center justify-between border-b border-neutral-200 pb-3.5">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                    <h3 className="text-base sm:text-lg font-bold text-neutral-900">
                      Compression Complete
                    </h3>
                  </div>
                  <span className="text-xs text-neutral-500 font-medium">
                    Processed in {result.durationMs}ms
                  </span>
                </div>

                {/* Exact Comparison Card Stats - As Requested */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-4">
                  {/* Original Size */}
                  <div className="rounded-xl border border-neutral-200 bg-white p-3.5 sm:p-4 text-center">
                    <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-neutral-500">
                      Original Size
                    </span>
                    <p className="mt-0.5 sm:mt-1 text-xl sm:text-2xl font-black text-neutral-900">
                      {formatFileSize(file.size)}
                    </p>
                    <span className="text-[10px] sm:text-[11px] text-neutral-400 font-mono">
                      {result.originalWidth} × {result.originalHeight} px
                    </span>
                  </div>

                  {/* Compressed Size */}
                  <div className="rounded-xl border border-neutral-900 bg-neutral-900 p-3.5 sm:p-4 text-center text-white">
                    <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-neutral-300">
                      Compressed Size
                    </span>
                    <p className="mt-0.5 sm:mt-1 text-xl sm:text-2xl font-black text-emerald-400">
                      {formatFileSize(result.blob.size)}
                    </p>
                    <span className="text-[10px] sm:text-[11px] text-neutral-300 font-mono">
                      {result.finalWidth} × {result.finalHeight} px ({result.format})
                    </span>
                  </div>

                  {/* Size Reduced */}
                  <div className="rounded-xl border border-emerald-200 bg-emerald-50/80 p-3.5 sm:p-4 text-center">
                    <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-emerald-800">
                      Size Reduced
                    </span>
                    <p className="mt-0.5 sm:mt-1 text-xl sm:text-2xl font-black text-emerald-700">
                      {result.savedPercent}%
                    </p>
                    <span className="text-[10px] sm:text-[11px] text-emerald-600 font-medium">
                      Saved {formatFileSize(file.size - result.blob.size)}
                    </span>
                  </div>
                </div>

                {/* Adaptive scaling notice if resolution was scaled for extreme targets */}
                {result.scaled && (
                  <div className="rounded-xl bg-blue-50 border border-blue-200/80 p-3 text-xs text-blue-900 flex items-start gap-2">
                    <Sparkles className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
                    <span>
                      To achieve your target of <strong>{getTargetSizeKB()} KB</strong> with crisp clarity,
                      resolution was adapted to {result.finalWidth} × {result.finalHeight} px.
                    </span>
                  </div>
                )}

                {/* Before / After Image Preview */}
                <ImageComparisonSlider
                  beforeUrl={filePreviewUrl}
                  afterUrl={result.url}
                  beforeLabel={`Original (${formatFileSize(file.size)})`}
                  afterLabel={`Compressed (${formatFileSize(result.blob.size)})`}
                />

                {/* Action Buttons: Primary & Secondary */}
                <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3 pt-2">
                  {/* Primary: DOWNLOAD COMPRESSED IMAGE */}
                  <button
                    type="button"
                    onClick={handleDownload}
                    className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-neutral-900 py-3.5 sm:py-4 px-4 sm:px-6 text-sm sm:text-base font-bold text-white shadow-xs hover:bg-neutral-800 transition active:scale-[0.99] cursor-pointer"
                  >
                    <Download className="h-4 w-4 sm:h-5 sm:w-5" />
                    <span>DOWNLOAD COMPRESSED IMAGE</span>
                  </button>

                  {/* Secondary: COMPRESS ANOTHER IMAGE */}
                  <button
                    type="button"
                    onClick={handleReset}
                    className="flex items-center justify-center gap-2 rounded-xl border border-neutral-300 bg-white py-3.5 sm:py-4 px-4 sm:px-5 text-sm sm:text-base font-bold text-neutral-800 hover:bg-neutral-100 transition cursor-pointer"
                  >
                    <RotateCcw className="h-4 w-4 text-neutral-600" />
                    <span>COMPRESS ANOTHER IMAGE</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
