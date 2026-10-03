import React from 'react';
import { Target, FileSpreadsheet, Globe, ShieldCheck } from 'lucide-react';

export const SeoContent: React.FC = () => {
  return (
    <section id="about" className="py-16 sm:py-20 border-t border-neutral-200/80 bg-white">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Section 6: Online Image Compressor */}
        <article>
          <div className="text-center sm:text-left max-w-3xl">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">
              Understanding Image Optimization
            </span>
            <h2 className="mt-2 text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight">
              Online Image Compressor
            </h2>
          </div>

          <div className="mt-6 text-sm sm:text-base text-neutral-600 leading-relaxed space-y-4">
            <p>
              Image compression reduces the digital file size of a photo or graphic while maintaining the highest possible visual clarity. High-resolution images often contain redundant metadata and uncompressed pixel information that significantly inflate file size. Using an efficient image size reducer helps you reduce JPG size and reduce PNG size so photos transfer smoothly across mobile networks, load instantly on websites, and meet strict upload guidelines.
            </p>
            <p>
              Compressly is a modern online image compressor built to reach specific kilobyte targets. Whether you upload a JPG, JPEG, PNG, or WebP file, our browser-native algorithm analyzes pixel complexity and performs intelligent multi-pass quality tuning. If you need to compress image to 20KB for passport portals or application forms, Compressly refines compression matrices and adapts resolution gradually only when strictly needed to prevent pixelation. For blogs and digital media, you can compress image to 50KB or compress image to 100KB to achieve the ideal harmony between sharp visual clarity and minimal bandwidth.
            </p>
            <p>
              Unlike conventional cloud utilities, all image processing occurs directly inside your web browser via HTML5 Canvas. Your uploaded files never leave your device and are never sent to or stored on external servers, delivering guaranteed privacy and instant turnaround.
            </p>
          </div>
        </article>

        {/* Section 7: Target Size Content */}
        <article id="target-sizes" className="border-t border-neutral-100 pt-14">
          <div className="text-center sm:text-left max-w-3xl">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">
              Target Size Guide
            </span>
            <h2 className="mt-2 text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight">
              Compress Images to 20KB, 50KB or 100KB
            </h2>
            <p className="mt-2 text-sm sm:text-base text-neutral-600">
              Different use cases demand different file size constraints. Here is how to choose the right target size:
            </p>
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* 20KB Card */}
            <div className="rounded-2xl border border-neutral-200/90 bg-neutral-50/70 p-5 sm:p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="inline-flex items-center justify-center rounded-xl bg-neutral-900 px-3 py-1 font-mono text-xs font-bold text-white">
                    20 KB
                  </span>
                  <FileSpreadsheet className="h-5 w-5 text-neutral-500" />
                </div>
                <h3 className="text-base font-bold text-neutral-900">
                  Strict Portals &amp; Forms
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-neutral-600 leading-relaxed">
                  Useful when a website, job portal, examination board, or government application has a strict, very small file-size limit (such as 20KB or under).
                </p>
              </div>
            </div>

            {/* 50KB Card */}
            <div className="rounded-2xl border border-neutral-200/90 bg-neutral-50/70 p-5 sm:p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="inline-flex items-center justify-center rounded-xl bg-neutral-900 px-3 py-1 font-mono text-xs font-bold text-white">
                    50 KB
                  </span>
                  <Globe className="h-5 w-5 text-neutral-500" />
                </div>
                <h3 className="text-base font-bold text-neutral-900">
                  Web, Email &amp; Mobile
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-neutral-600 leading-relaxed">
                  Useful when you need a smaller image while retaining more visual quality for website performance, email newsletters, and fast-loading web thumbnails.
                </p>
              </div>
            </div>

            {/* 100KB Card */}
            <div className="rounded-2xl border border-neutral-200/90 bg-neutral-50/70 p-5 sm:p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="inline-flex items-center justify-center rounded-xl bg-neutral-900 px-3 py-1 font-mono text-xs font-bold text-white">
                    100 KB
                  </span>
                  <Target className="h-5 w-5 text-neutral-500" />
                </div>
                <h3 className="text-base font-bold text-neutral-900">
                  High Fidelity Balance
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-neutral-600 leading-relaxed">
                  Useful when you need a balance between image quality and file size for hero banners, blog headers, social posts, and product photography.
                </p>
              </div>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
};
