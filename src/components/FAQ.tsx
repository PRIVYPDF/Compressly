import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

export const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0); // First one open by default

  const faqList: FAQItem[] = [
    {
      question: 'What is an image compressor?',
      answer:
        'An image compressor is an optimization tool that reduces the digital file size (measured in KB or MB) of pictures while preserving their visual clarity. It accomplishes this by removing non-essential metadata and efficiently re-encoding color and pixel patterns, making images load faster on websites and easier to share via email or upload portals.',
    },
    {
      question: 'How do I compress an image to 20KB?',
      answer:
        'To compress an image to 20KB, upload your photo to Compressly, click the "20 KB" preset button, and click "COMPRESS IMAGE". The engine performs multi-pass quality tuning and will gracefully adapt image resolution if needed so your picture fits under 20KB without harsh pixel distortion.',
    },
    {
      question: 'How do I compress an image to 50KB?',
      answer:
        'To compress an image to 50KB, select the "50 KB" preset and run the compressor. 50KB is an ideal target for email attachments, web publishing, and mobile apps where you need small file size while retaining excellent visual detail.',
    },
    {
      question: 'How do I compress an image to 100KB?',
      answer:
        'Select the "100 KB" preset above. 100KB provides a balanced threshold for blog post headers, product photos, and social media images where high fidelity is essential without unnecessary file bloat.',
    },
    {
      question: 'Can I compress JPG images online?',
      answer:
        'Yes. Compressly is a full-featured JPG compressor that optimizes standard JPEG and JPG files up to 20 MB, adjusting discrete cosine transform (DCT) quantization to achieve your exact target file size.',
    },
    {
      question: 'Can I compress PNG images online?',
      answer:
        'Yes. Compressly handles PNG images efficiently. For transparent graphics, it can export to modern WebP format to maintain alpha transparency while drastically shrinking file size, or convert flat graphics to crisp, lightweight JPG.',
    },
    {
      question: 'Can I compress WebP images?',
      answer:
        'Yes. Modern WebP images are fully supported. You can upload existing WebP files or compress other formats into WebP directly within your browser.',
    },
    {
      question: 'Does compressing an image reduce quality?',
      answer:
        'Compressly is engineered to minimize visible loss of quality. It prioritizes perceptual image clarity and tests multiple compression levels to preserve sharpness. You can inspect the result before downloading using our interactive Before/After comparison slider.',
    },
    {
      question: 'Are my images uploaded or stored?',
      answer:
        'No. Compressly executes 100% locally in your web browser using HTML5 Canvas APIs. Your images are never uploaded to any remote server or stored in a database, ensuring complete confidentiality.',
    },
    {
      question: 'Is Compressly free?',
      answer:
        'Yes, Compressly is completely free with no subscriptions, account signups, or usage limits. You can compress as many images as you need without watermarks.',
    },
  ];

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-16 sm:py-20 border-t border-neutral-200/80">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">
            Search &amp; Answers
          </span>
          <h2 className="mt-2 text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight sm:text-4xl">
            Frequently Asked Questions
          </h2>
          <p className="mt-3 text-neutral-600 text-sm sm:text-base">
            Common questions about image compression, target sizes, and browser privacy.
          </p>
        </div>

        <div className="mt-10 space-y-3">
          {faqList.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={item.question}
                className="rounded-2xl border border-neutral-200/90 bg-white transition shadow-2xs overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => toggle(index)}
                  className="flex w-full items-center justify-between p-4 sm:p-5 text-left font-bold text-neutral-900 transition hover:bg-neutral-50 cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <span className="text-sm sm:text-base pr-4">{item.question}</span>
                  <div
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-neutral-700 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 bg-neutral-900 text-white' : ''
                    }`}
                  >
                    <ChevronDown className="h-4 w-4" />
                  </div>
                </button>

                {/* Always in DOM for SEO crawlability */}
                <div
                  className={`px-4 sm:px-5 pb-5 pt-1 text-xs sm:text-sm text-neutral-600 leading-relaxed border-t border-neutral-100 ${
                    isOpen ? 'block' : 'hidden'
                  }`}
                >
                  {item.answer}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
