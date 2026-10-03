import React from 'react';
import { ShieldCheck, Zap, Sparkles } from 'lucide-react';

export const Hero: React.FC = () => {
  return (
    <section className="pt-6 pb-4 text-center sm:pt-10 sm:pb-6">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        {/* Main H1 - Exact specification */}
        <h1 className="text-3xl font-extrabold tracking-tight text-neutral-900 sm:text-5xl lg:text-6xl">
          Compress Images Online
        </h1>

        {/* Subtitle - Exact specification */}
        <p className="mt-3 text-base text-neutral-600 sm:text-lg lg:text-xl font-normal max-w-2xl mx-auto leading-relaxed">
          Compress images to 20KB, 50KB, 100KB or a custom size — quickly and easily.
        </p>

        {/* Trust line - Exact specification */}
        <p className="mt-2 text-xs sm:text-sm font-medium text-neutral-500 tracking-wide">
          Free &bull; Fast &bull; Private &bull; No Sign Up
        </p>
      </div>
    </section>
  );
};
