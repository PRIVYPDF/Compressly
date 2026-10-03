import React from 'react';
import { UploadCloud, SlidersHorizontal, DownloadCloud } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      number: '01',
      title: 'Upload your image',
      description: 'Drag and drop any JPG, PNG, or WEBP image up to 20 MB directly into the browser.',
      icon: UploadCloud,
    },
    {
      number: '02',
      title: 'Choose your target size',
      description: 'Select a preset to compress image to 20KB, compress image to 50KB, or compress image to 100KB — or enter any custom target.',
      icon: SlidersHorizontal,
    },
    {
      number: '03',
      title: 'Compress and download',
      description: 'Our engine finds the optimal compression quality in milliseconds. Inspect and download.',
      icon: DownloadCloud,
    },
  ];

  return (
    <section id="how-it-works" className="py-16 sm:py-20 border-t border-neutral-200/80">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">
            Simple 3-Step Process
          </span>
          <h2 className="mt-2 text-2xl sm:text-3xl lg:text-4xl font-extrabold text-neutral-900 tracking-tight">
            How to Compress an Image Online
          </h2>
          <p className="mt-3 text-neutral-600 text-sm sm:text-base">
            Compress your images in seconds with zero complicated settings.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.number}
                className="relative rounded-2xl border border-neutral-200/90 bg-white p-6 sm:p-7 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-neutral-100 text-neutral-900">
                      <Icon className="h-6 w-6 stroke-[1.75]" />
                    </div>
                    <span className="font-mono text-2xl font-black text-neutral-300">
                      {step.number}
                    </span>
                  </div>
                  <h3 className="mt-6 text-lg font-bold text-neutral-900">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm text-neutral-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
