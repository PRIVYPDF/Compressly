import React from 'react';

interface AdSlotProps {
  slotId?: string;
  format?: 'leaderboard' | 'rectangle' | 'horizontal-responsive';
  className?: string;
}

export const AdSlot: React.FC<AdSlotProps> = ({
  slotId = 'adsense-slot-placeholder',
  format = 'horizontal-responsive',
  className = '',
}) => {
  return (
    <aside
      aria-label="Advertisement"
      className={`mx-auto my-8 max-w-4xl px-4 sm:px-6 ${className}`}
    >
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-neutral-300 bg-neutral-100/50 p-4 text-center">
        <span className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400">
          Advertisement
        </span>

        {/* Ad Space Container (Clean, minimal placeholder for AdSense script insertion) */}
        <div
          id={slotId}
          className={`mt-2 flex w-full items-center justify-center rounded-lg bg-neutral-200/40 text-neutral-400 text-xs ${
            format === 'leaderboard'
              ? 'h-[90px] max-w-[728px]'
              : 'min-h-[90px] sm:min-h-[100px] w-full max-w-[728px]'
          }`}
        >
          <span className="text-[11px] font-mono text-neutral-400">
            Ad space reserved for Google AdSense
          </span>
        </div>
      </div>
    </aside>
  );
};
