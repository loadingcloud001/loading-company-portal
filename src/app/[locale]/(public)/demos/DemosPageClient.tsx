'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';
import { Play, ExternalLink, Monitor, Smartphone, X, Maximize2, Minimize2 } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Link } from '@/i18n/navigation';
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
  const [isFullscreen, setIsFullscreen] = useState(false);

  const typeIcon = (demoType: string) => {
    switch (demoType) {
      case 'iframe':
        return <Monitor className="h-6 w-6 text-[#1e40af]" />;
      case 'qrcode':
        return <Smartphone className="h-6 w-6 text-[#1e40af]" />;
      default:
        return <ExternalLink className="h-6 w-6 text-[#1e40af]" />;
    }
  };

  const badgeVariant = (demoType: string): 'info' | 'success' | 'default' => {
    switch (demoType) {
      case 'iframe':
        return 'info';
      case 'link':
        return 'success';
      default:
        return 'default';
    }
  };

  const handleCardClick = (demo: Demo) => {
    if (demo.demoType === 'link') {
      window.open(demo.url, '_blank', 'noopener,noreferrer');
    } else {
      setSelectedDemo(demo);
    }
  };

  const handleCloseModal = () => {
    setSelectedDemo(null);
    setIsFullscreen(false);
  };

  return (
    <>
      {/* Demo Grid — 2 cols md, 3 cols lg */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {demos.map((demo) => (
          <div
            key={demo.id}
            className={cn(
              'group rounded-xl border border-slate-200 bg-white shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden cursor-pointer'
            )}
            onClick={() => handleCardClick(demo)}
          >
            {/* Thumbnail / Icon area */}
            <div className="relative h-48 bg-slate-100 flex items-center justify-center">
              {demo.thumbnail ? (
                <img
                  src={demo.thumbnail}
                  alt={demo.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center gap-3">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#1e40af]/10">
                    {typeIcon(demo.demoType)}
                  </div>
                </div>
              )}

              {/* Hover play overlay */}
              <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/10 transition-colors duration-200">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90 shadow-lg">
                    <Play className="h-5 w-5 text-[#1e40af] ml-0.5" />
                  </div>
                </div>
              </div>
            </div>

            {/* Card body */}
            <div className="p-5">
              <div className="flex items-center gap-2 mb-3">
                <Badge variant={badgeVariant(demo.demoType)}>
                  {demo.demoType.toUpperCase()}
                </Badge>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2 group-hover:text-[#1e40af] transition-colors">
                {demo.name}
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed line-clamp-2">
                {demo.description}
              </p>
              <div className="mt-4">
                <span className="inline-flex items-center gap-1.5 text-sm font-medium text-[#1e40af]">
                  {t('openDemo')}
                  <ExternalLink className="h-3.5 w-3.5" />
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Request Demo CTA */}
      <div className="mt-16 text-center">
        <Link
          href="/contact"
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#1e40af] text-white font-semibold rounded-lg hover:bg-[#1e3a8a] transition-colors duration-150"
        >
          {t('requestDemo')}
        </Link>
      </div>

      {/* Demo Modal */}
      {selectedDemo && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          onClick={handleCloseModal}
        >
          <div
            className={cn(
              'bg-white flex flex-col shadow-2xl',
              isFullscreen
                ? 'w-screen h-screen'
                : 'rounded-2xl w-full max-w-4xl max-h-[90vh]'
            )}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h3 className="text-lg font-semibold text-slate-900">
                {selectedDemo.name}
              </h3>
              <div className="flex items-center gap-2">
                {selectedDemo.demoType === 'iframe' && (
                  <button
                    onClick={() => setIsFullscreen(!isFullscreen)}
                    aria-label={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
                  >
                    {isFullscreen ? (
                      <Minimize2 className="h-4 w-4" />
                    ) : (
                      <Maximize2 className="h-4 w-4" />
                    )}
                  </button>
                )}
                {selectedDemo.demoType === 'link' && (
                  <a
                    href={selectedDemo.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors"
                  >
                    <ExternalLink className="h-4 w-4" />
                    {t('openInNewTab')}
                  </a>
                )}
                <button
                  onClick={handleCloseModal}
                  aria-label="Close"
                  className="p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
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
                    className="w-full h-full rounded-lg border border-slate-200"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title={selectedDemo.name}
                  />
                </div>
              )}

              {selectedDemo.demoType === 'link' && (
                <div className="text-center py-12">
                  <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#1e40af]/10">
                    <ExternalLink className="h-8 w-8 text-[#1e40af]" />
                  </div>
                  <p className="text-slate-600 mb-6 max-w-md mx-auto">
                    {selectedDemo.description}
                  </p>
                  <a
                    href={selectedDemo.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-[#1e40af] text-white font-semibold rounded-lg hover:bg-[#1e3a8a] transition-colors"
                  >
                    {t('openInNewTab')}
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
              )}

              {selectedDemo.demoType === 'qrcode' && (
                <div className="text-center py-8">
                  <div className="inline-block bg-white p-6 rounded-xl border border-slate-200 shadow-sm mb-6">
                    <QRCodeSVG value={selectedDemo.url} size={200} level="H" />
                  </div>
                  <h4 className="font-semibold text-slate-900 mb-2">
                    {t('scanQr')}
                  </h4>
                  <p className="text-sm text-slate-600 max-w-md mx-auto">
                    {t('scanQrDesc')}
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
