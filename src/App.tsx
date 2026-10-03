/**
 * Compressly - Online Image Compressor
 * A fast, minimal, responsive single-tool website.
 */

import React from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { CompressorTool } from './components/CompressorTool';
import { HowItWorks } from './components/HowItWorks';
import { SeoContent } from './components/SeoContent';
import { WhyCompressly } from './components/WhyCompressly';
import { FAQ } from './components/FAQ';
import { AdSlot } from './components/AdSlot';
import { Footer } from './components/Footer';

export default function App() {
  const handleScrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen w-full overflow-x-hidden flex flex-col bg-neutral-50/50 text-neutral-900 selection:bg-neutral-900 selection:text-white">
      {/* Navigation Header */}
      <Header onScrollTo={handleScrollTo} />

      {/* Main Content Area */}
      <main className="flex-1 w-full overflow-x-hidden">
        {/* Hero Section */}
        <Hero />

        {/* Central Working Image Compressor Tool */}
        <section aria-label="Image Compression Tool" className="pb-12">
          <CompressorTool />
        </section>

        {/* Non-intrusive AdSense Slot 1 (Positioned clean below the tool) */}
        <AdSlot slotId="ad-slot-under-tool" />

        {/* Step-by-Step Guide */}
        <HowItWorks />

        {/* SEO-Rich Educational Content & Target Size Guide */}
        <SeoContent />

        {/* 3 Core Value Cards (Fast, Simple, Private) */}
        <WhyCompressly />

        {/* Non-intrusive AdSense Slot 2 (Positioned above FAQ) */}
        <AdSlot slotId="ad-slot-above-faq" />

        {/* Comprehensive FAQ Accordion */}
        <FAQ />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
