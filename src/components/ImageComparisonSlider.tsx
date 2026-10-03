import React, { useState, useRef, useCallback } from 'react';
import { Columns, SplitSquareVertical } from 'lucide-react';

interface ImageComparisonSliderProps {
  beforeUrl: string;
  afterUrl: string;
  beforeLabel?: string;
  afterLabel?: string;
}

export const ImageComparisonSlider: React.FC<ImageComparisonSliderProps> = ({
  beforeUrl,
  afterUrl,
  beforeLabel = 'Original',
  afterLabel = 'Compressed',
}) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [viewMode, setViewMode] = useState<'slider' | 'side-by-side'>('slider');
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  }, []);

  const handleMouseDown = () => setIsDragging(true);
  const handleMouseUp = () => setIsDragging(false);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      handleMove(e.clientX);
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    if (e.touches.length > 0) {
      handleMove(e.touches[0].clientX);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length > 0) {
      handleMove(e.touches[0].clientX);
    }
  };

  return (
    <div className="w-full space-y-2 max-w-full overflow-hidden">
      <div className="flex items-center justify-between text-xs text-neutral-500 px-0.5 gap-2">
        <span className="font-medium truncate">Preview &amp; Compare</span>
        <div className="flex shrink-0 items-center gap-1 bg-neutral-100 p-0.5 rounded-lg border border-neutral-200">
          <button
            type="button"
            onClick={() => setViewMode('slider')}
            className={`flex items-center gap-1 px-2 py-1 rounded-md text-[11px] sm:text-xs font-medium transition cursor-pointer ${
              viewMode === 'slider'
                ? 'bg-white text-neutral-900 shadow-xs'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            <SplitSquareVertical className="h-3 w-3" />
            <span className="hidden xs:inline">Split</span> Slider
          </button>
          <button
            type="button"
            onClick={() => setViewMode('side-by-side')}
            className={`flex items-center gap-1 px-2 py-1 rounded-md text-[11px] sm:text-xs font-medium transition cursor-pointer ${
              viewMode === 'side-by-side'
                ? 'bg-white text-neutral-900 shadow-xs'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            <Columns className="h-3 w-3" />
            Side by Side
          </button>
        </div>
      </div>

      {viewMode === 'slider' ? (
        <div
          ref={containerRef}
          onMouseMove={handleMouseMove}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleMouseUp}
          className="relative w-full aspect-4/3 sm:aspect-16/10 max-h-[380px] sm:max-h-[420px] rounded-xl overflow-hidden border border-neutral-200 bg-neutral-100 select-none cursor-ew-resize touch-none"
        >
          {/* Compressed Image (Background) */}
          <img
            src={afterUrl}
            alt="Compressed image preview"
            className="absolute inset-0 h-full w-full object-contain pointer-events-none"
          />

          {/* Original Image (Clipped Foreground) */}
          <div
            className="absolute inset-0 overflow-hidden pointer-events-none"
            style={{ width: `${sliderPosition}%` }}
          >
            <img
              src={beforeUrl}
              alt="Original image preview"
              className="absolute inset-0 h-full w-full object-contain pointer-events-none max-w-none"
              style={{
                width: containerRef.current ? `${containerRef.current.clientWidth}px` : '100%',
              }}
            />
          </div>

          {/* Dividing Slider Line */}
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-white shadow-lg pointer-events-none"
            style={{ left: `${sliderPosition}%` }}
          >
            {/* Draggable Handle */}
            <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full bg-white shadow-md border border-neutral-300 text-neutral-700">
              <div className="flex gap-0.5">
                <span className="h-2.5 sm:h-3 w-0.5 rounded-full bg-neutral-500" />
                <span className="h-2.5 sm:h-3 w-0.5 rounded-full bg-neutral-500" />
              </div>
            </div>
          </div>

          {/* Labels */}
          <div className="absolute top-2.5 left-2.5 rounded-md bg-neutral-900/80 px-2 py-0.5 sm:px-2.5 sm:py-1 text-[10px] sm:text-[11px] font-semibold text-white backdrop-blur-xs pointer-events-none">
            {beforeLabel}
          </div>
          <div className="absolute top-2.5 right-2.5 rounded-md bg-neutral-900/80 px-2 py-0.5 sm:px-2.5 sm:py-1 text-[10px] sm:text-[11px] font-semibold text-white backdrop-blur-xs pointer-events-none">
            {afterLabel}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
          <div className="relative aspect-4/3 sm:aspect-16/10 max-h-[260px] sm:max-h-[300px] rounded-xl overflow-hidden border border-neutral-200 bg-neutral-100 flex items-center justify-center p-2">
            <img src={beforeUrl} alt="Original" className="max-h-full max-w-full object-contain" />
            <span className="absolute top-2.5 left-2.5 rounded-md bg-neutral-900/80 px-2 py-0.5 text-[10px] sm:text-[11px] font-semibold text-white backdrop-blur-xs">
              {beforeLabel}
            </span>
          </div>
          <div className="relative aspect-4/3 sm:aspect-16/10 max-h-[260px] sm:max-h-[300px] rounded-xl overflow-hidden border border-neutral-200 bg-neutral-100 flex items-center justify-center p-2">
            <img src={afterUrl} alt="Compressed" className="max-h-full max-w-full object-contain" />
            <span className="absolute top-2.5 left-2.5 rounded-md bg-emerald-700/90 px-2 py-0.5 text-[10px] sm:text-[11px] font-semibold text-white backdrop-blur-xs">
              {afterLabel}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
