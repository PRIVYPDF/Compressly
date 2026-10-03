import React from 'react';
import { Zap, CheckCheck, Shield } from 'lucide-react';

export const WhyCompressly: React.FC = () => {
  const benefits = [
    {
      title: 'Fast',
      description: 'Compress images quickly in your browser.',
      icon: Zap,
    },
    {
      title: 'Simple',
      description: 'No complicated settings or software.',
      icon: CheckCheck,
    },
    {
      title: 'Private',
      description: 'Images are processed without permanent storage.',
      icon: Shield,
    },
  ];

  return (
    <section className="py-16 sm:py-20 bg-neutral-100/60 border-t border-neutral-200/80">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">
            Engineered for Precision
          </span>
          <h2 className="mt-2 text-3xl font-extrabold text-neutral-900 tracking-tight sm:text-4xl">
            Why Use Compressly?
          </h2>
          <p className="mt-3 text-neutral-600 text-sm sm:text-base">
            Designed to give you exact target sizes without compromising on privacy.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {benefits.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="rounded-2xl border border-neutral-200/90 bg-white p-7 shadow-xs text-center flex flex-col items-center"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-neutral-100 text-neutral-900 mb-5">
                  <Icon className="h-7 w-7 stroke-[1.75]" />
                </div>
                <h3 className="text-xl font-bold text-neutral-900">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm text-neutral-600 leading-relaxed max-w-xs">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
