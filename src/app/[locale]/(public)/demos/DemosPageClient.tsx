'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import {
  ExternalLink,
  Maximize2,
  X,
  QrCode,
  Monitor,
  Smartphone,
  Play,
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

interface Demo {
  id: string;
  name: string;
  slug: string;
  description: string;
  demoType: string;
  url: string;
  thumbnail: string | null;
}

export function DemosPageClient({ demos }: { demos: Demo[] }) {
  const t = useTranslations('demos');
  const [selectedDemo, setSelectedDemo] = useState<Demo | null>(null);

  const typeIcon = (demoType: string) => {
    switch (demoType) {
      case 'iframe':
        return <Monitor className="h-5 w-5" />;
      case 'qrcode':
        return <Smartphone className="h-5 w-5" />;
      default:
        return <ExternalLink className="h-5 w-5" />;
    }
  };

  return (
    <>
      {/* Demo grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {demos.map((demo) => (
          <div
            key={demo.id}
            className="group bg-white rounded-xl border border-zinc-100 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden cursor-pointer"
            onClick={() => setSelectedDemo(demo)}
          >
            {/* Thumbnail / placeholder */}
            <div className="relative h-48 bg-gradient-to-br from-blue-50 to-zinc-50 flex items-center justify-center">
              {demo.thumbnail ? (
                <img
                  src={demo.thumbnail}
                  alt={demo.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    {typeIcon(demo.demoType)}
                  </div>
                </div>
              )}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-200 flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center shadow-lg">
                    <Play className="h-5 w-5 text-primary ml-0.5" />
                  </div>
                </div>
              </div>
            </div>

            {/* Card content */}
            <div className="p-5">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-medium text-primary bg-primary/5 px-2 py-0.5 rounded">
                  {demo.demoType.toUpperCase()}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-zinc-900 mb-2">
                {demo.name}
              </h3>
              <p className="text-sm text-zinc-600 leading-relaxed line-clamp-2">
                {demo.description}
              </p>
              <div className="mt-4">
                <span className="inline-flex items-center gap-1.5 text-sm font-medium text-primary">
                  {t('openDemo')}
                  <ExternalLink className="h-3.5 w-3.5" />
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Request demo CTA */}
      <div className="mt-12 text-center">
        <Link
          href="/contact"
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark transition-colors duration-150"
        >
          {t('requestDemo')}
        </Link>
      </div>

      {/* Demo modal */}
      {selectedDemo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl">
            {/* Modal header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100">
              <h3 className="text-lg font-semibold text-zinc-900">
                {selectedDemo.name}
              </h3>
              <div className="flex items-center gap-2">
                {selectedDemo.demoType === 'link' && (
                  <a
                    href={selectedDemo.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50 rounded-lg transition-colors"
                  >
                    <ExternalLink className="h-4 w-4" />
                    {t('openNewTab')}
                  </a>
                )}
                <button
                  onClick={() => setSelectedDemo(null)}
                  className="p-2 rounded-lg text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 transition-colors cursor-pointer"
                  aria-label={t('close')}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Modal body */}
            <div className="flex-1 overflow-auto p-6">
              {selectedDemo.demoType === 'iframe' && (
                <div className="aspect-video w-full">
                  <iframe
                    src={selectedDemo.url}
                    className="w-full h-full rounded-lg border border-zinc-200"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title={selectedDemo.name}
                  />
                </div>
              )}

              {selectedDemo.demoType === 'link' && (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <ExternalLink className="h-8 w-8 text-primary" />
                  </div>
                  <p className="text-zinc-600 mb-6 max-w-md mx-auto">
                    {selectedDemo.description}
                  </p>
                  <a
                    href={selectedDemo.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark transition-colors duration-150"
                  >
                    {t('openNewTab')}
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
              )}

              {selectedDemo.demoType === 'qrcode' && (
                <div className="text-center py-8">
                  <div className="inline-block bg-white p-6 rounded-xl border border-zinc-200 shadow-sm mb-6">
                    <QRCodeSVG
                      value={selectedDemo.url}
                      size={200}
                      level="H"
                    />
                  </div>
                  <h4 className="font-semibold text-zinc-900 mb-2">
                    {t('scanQR')}
                  </h4>
                  <p className="text-sm text-zinc-600 max-w-md mx-auto">
                    {t('qrInstruction')}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
