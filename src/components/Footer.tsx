import React, { useState } from 'react';
import { Layers, X, Shield, FileText, Mail } from 'lucide-react';

export const Footer: React.FC = () => {
  const [activeModal, setActiveModal] = useState<'privacy' | 'terms' | 'contact' | null>(null);

  const closeModal = () => setActiveModal(null);

  return (
    <>
      <footer className="border-t border-neutral-200 bg-white py-12">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            {/* Left: Brand & tagline */}
            <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-neutral-900 text-white">
                  <Layers className="h-4 w-4" />
                </div>
                <span className="font-extrabold text-neutral-900 text-lg">Compressly</span>
              </div>
              <p className="mt-1.5 text-sm text-neutral-500">
                Simple image compression for everyone.
              </p>
            </div>

            {/* Right: Policy links */}
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-neutral-600">
              <button
                type="button"
                onClick={() => setActiveModal('privacy')}
                className="hover:text-neutral-900 transition cursor-pointer"
              >
                Privacy Policy
              </button>
              <button
                type="button"
                onClick={() => setActiveModal('terms')}
                className="hover:text-neutral-900 transition cursor-pointer"
              >
                Terms of Service
              </button>
              <button
                type="button"
                onClick={() => setActiveModal('contact')}
                className="hover:text-neutral-900 transition cursor-pointer"
              >
                Contact
              </button>
            </div>
          </div>

          <div className="mt-8 border-t border-neutral-100 pt-6 text-center text-xs text-neutral-400">
            &copy; {new Date().getFullYear()} Compressly. Built with privacy in mind. No images are stored on remote servers.
          </div>
        </div>
      </footer>

      {/* Modal Dialog for Privacy, Terms, Contact */}
      {activeModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-950/60 p-4 backdrop-blur-xs"
          onClick={closeModal}
        >
          <div
            className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={closeModal}
              className="absolute top-5 right-5 rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-900 transition cursor-pointer"
              aria-label="Close dialog"
            >
              <X className="h-5 w-5" />
            </button>

            {activeModal === 'privacy' && (
              <div className="space-y-4">
                <div className="flex items-center gap-2.5 text-neutral-900">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-neutral-100 text-neutral-800">
                    <Shield className="h-5 w-5" />
                  </div>
                  <h3 className="text-xl font-bold">Privacy Policy</h3>
                </div>
                <div className="text-sm text-neutral-600 space-y-3 leading-relaxed">
                  <p>
                    <strong>1. Zero Data Collection:</strong> Compressly is built around client-side browser execution. When you compress an image, all image processing occurs directly within your device’s browser memory via HTML5 Canvas.
                  </p>
                  <p>
                    <strong>2. No Remote Storage:</strong> Your uploaded images are never sent to, processed by, or permanently saved on any external servers or third-party cloud services.
                  </p>
                  <p>
                    <strong>3. Automatic Memory Cleanup:</strong> Temporary browser memory pointers (Object URLs) are immediately released and garbage collected when you compress another image or leave the tab.
                  </p>
                  <p>
                    <strong>4. Analytics:</strong> We do not track personal identifying information.
                  </p>
                </div>
              </div>
            )}

            {activeModal === 'terms' && (
              <div className="space-y-4">
                <div className="flex items-center gap-2.5 text-neutral-900">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-neutral-100 text-neutral-800">
                    <FileText className="h-5 w-5" />
                  </div>
                  <h3 className="text-xl font-bold">Terms of Service</h3>
                </div>
                <div className="text-sm text-neutral-600 space-y-3 leading-relaxed">
                  <p>
                    <strong>1. Usage License:</strong> Compressly is provided free of charge for personal and commercial usage. You retain 100% of all intellectual property rights to your images.
                  </p>
                  <p>
                    <strong>2. Acceptable Use:</strong> You agree to use the service in accordance with all applicable laws and regulations.
                  </p>
                  <p>
                    <strong>3. Disclaimer of Warranty:</strong> The service is provided "as is" without warranty of any kind. While Compressly aims for maximum visual quality and stability, we are not liable for any issues arising from image manipulation.
                  </p>
                </div>
              </div>
            )}

            {activeModal === 'contact' && (
              <div className="space-y-4">
                <div className="flex items-center gap-2.5 text-neutral-900">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-neutral-100 text-neutral-800">
                    <Mail className="h-5 w-5" />
                  </div>
                  <h3 className="text-xl font-bold">Contact Us</h3>
                </div>
                <div className="text-sm text-neutral-600 space-y-3 leading-relaxed">
                  <p>
                    Have questions, feedback, or suggestions for Compressly? We’d love to hear from you.
                  </p>
                  <div className="rounded-xl bg-neutral-50 p-4 border border-neutral-200">
                    <p className="text-xs text-neutral-500 font-semibold uppercase tracking-wider">
                      Email Inquiries
                    </p>
                    <p className="mt-1 font-mono text-sm font-semibold text-neutral-900">
                      support@compressly.app
                    </p>
                  </div>
                  <p className="text-xs text-neutral-500">
                    We typically respond to inquiries within 24–48 business hours.
                  </p>
                </div>
              </div>
            )}

            <div className="mt-6 border-t border-neutral-100 pt-4 flex justify-end">
              <button
                type="button"
                onClick={closeModal}
                className="rounded-xl bg-neutral-900 px-4 py-2 text-xs font-semibold text-white hover:bg-neutral-800 transition cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
