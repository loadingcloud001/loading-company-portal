'use client';

import { useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { ExternalLink, Maximize2, Minimize2, Mail } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import type { Demo } from './DemoCard';

interface DemoModalProps {
  demo: Demo | null;
  isOpen: boolean;
  onClose: () => void;
}

function DemoModal({ demo, isOpen, onClose }: DemoModalProps) {
  const locale = useLocale();
  const t = useTranslations('demos');
  const [isFullscreen, setIsFullscreen] = useState(false);

  if (!demo) return null;

  const isZh = locale === 'zh';
  const name = isZh ? demo.nameZh : demo.name;
  const description = isZh
    ? demo.descriptionZh || demo.description
    : demo.description || demo.descriptionZh;

  const handleClose = () => {
    setIsFullscreen(false);
    onClose();
  };

  const modalSize = demo.demoType === 'iframe' && isFullscreen ? 'fullscreen' : 'lg';

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={name} size={modalSize}>
      <div className="flex flex-col h-full">
        {/* Iframe demo */}
        {demo.demoType === 'iframe' && (
          <div className="flex flex-col flex-1">
            <div className="flex items-center justify-end mb-3">
              <button
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 transition-colors cursor-pointer"
              >
                {isFullscreen ? (
                  <>
                    <Minimize2 className="h-4 w-4" />
                    {t('close')}
                  </>
                ) : (
                  <>
                    <Maximize2 className="h-4 w-4" />
                    {t('fullscreen')}
                  </>
                )}
              </button>
            </div>
            <div
              className={`flex-1 rounded-lg overflow-hidden border border-zinc-200 bg-zinc-50 ${
                isFullscreen ? 'min-h-0' : 'min-h-[400px]'
              }`}
            >
              <iframe
                src={demo.url}
                title={name}
                className="w-full h-full min-h-[400px]"
                style={{ height: isFullscreen ? 'calc(100vh - 160px)' : '500px' }}
                allow="fullscreen; clipboard-write"
                sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
              />
            </div>
          </div>
        )}

        {/* Link demo */}
        {demo.demoType === 'link' && (
          <div className="flex flex-col items-center py-10 text-center">
            <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
              <ExternalLink className="h-10 w-10 text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-zinc-900 mb-3">{name}</h3>
            {description && (
              <p className="text-zinc-500 max-w-md leading-relaxed mb-8">
                {description}
              </p>
            )}
            <a
              href={demo.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="primary" size="lg">
                <ExternalLink className="h-4 w-4" />
                {t('openNewTab')}
              </Button>
            </a>
          </div>
        )}

        {/* QR code demo */}
        {demo.demoType === 'qrcode' && (
          <div className="flex flex-col items-center py-10 text-center">
            <h3 className="text-xl font-semibold text-zinc-900 mb-2">{name}</h3>
            {description && (
              <p className="text-zinc-500 max-w-md leading-relaxed mb-8">
                {description}
              </p>
            )}
            <div className="p-6 bg-white rounded-2xl border border-zinc-200 shadow-sm mb-6">
              <QRCodeSVG
                value={demo.url}
                size={220}
                level="H"
                includeMargin={false}
              />
            </div>
            <p className="text-sm text-zinc-400 max-w-sm">
              {t('qrInstruction')}
            </p>
          </div>
        )}

        {/* Request Demo button (all types) */}
        <div className="mt-6 pt-4 border-t border-zinc-200 flex justify-center">
          <Button variant="secondary" size="md">
            <Mail className="h-4 w-4" />
            {t('requestDemo')}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

export { DemoModal };
export type { DemoModalProps };
