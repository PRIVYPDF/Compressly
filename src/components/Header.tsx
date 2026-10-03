import React from 'react';
import { Layers } from 'lucide-react';

interface HeaderProps {
  onScrollTo: (id: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ onScrollTo }) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-neutral-200/80 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <a
          href="#"
          className="group flex items-center gap-2.5 text-neutral-950 font-bold text-xl tracking-tight transition hover:opacity-90"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-neutral-900 text-white shadow-sm transition group-hover:scale-105">
            <Layers className="h-5 w-5" />
          </div>
          <span className="font-extrabold text-neutral-900 text-lg">Compressly</span>
          <span className="hidden sm:inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700 border border-emerald-200/60">
            Free &amp; Private
          </span>
        </a>

        {/* Navigation */}
        <nav className="flex items-center gap-4 sm:gap-6 text-xs sm:text-sm font-medium text-neutral-600">
          <button
            onClick={() => onScrollTo('how-it-works')}
            className="transition hover:text-neutral-950 cursor-pointer"
          >
            How It Works
          </button>
          <button
            onClick={() => onScrollTo('target-sizes')}
            className="transition hover:text-neutral-950 cursor-pointer"
          >
            Target Sizes
          </button>
          <button
            onClick={() => onScrollTo('faq')}
            className="transition hover:text-neutral-950 cursor-pointer"
          >
            FAQ
          </button>
        </nav>
      </div>
    </header>
  );
};
