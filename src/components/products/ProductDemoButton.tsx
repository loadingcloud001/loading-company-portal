'use client';

import { useState, useRef, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { Play, X, Maximize2, Minimize2, ExternalLink } from 'lucide-react';

interface ProductDemoButtonProps {
  demoUrl: string;
  demoType: string;
  productName: string;
}

export function ProductDemoButton({
  demoUrl,
  demoType,
  productName,
}: ProductDemoButtonProps) {
  const t = useTranslations('products');
  const [open, setOpen] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const handleOpen = useCallback(() => {
    if (demoType === 'link') {
      window.open(demoUrl, '_blank', 'noopener,noreferrer');
    } else {
      setOpen(true);
    }
  }, [demoUrl, demoType]);

  const handleClose = useCallback(() => {
    setOpen(false);
    setFullscreen(false);
  }, []);

  const toggleFullscreen = useCallback(() => {
    setFullscreen((prev) => !prev);
  }, []);

  return (
    <>
      {/* Try Demo Button */}
      <button
        onClick={handleOpen}
        className="inline-flex items-center gap-2 px-8 py-3.5 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition-colors duration-200"
      >
        <Play className="h-4 w-4 fill-current" />
        {t('tryDemo')}
        {demoType === 'link' && <ExternalLink className="h-3.5 w-3.5 opacity-80" />}
      </button>

      {/* Iframe Modal — only for demoType === 'iframe' */}
      {demoType === 'iframe' && open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
          onClick={(e) => e.target === e.currentTarget && handleClose()}
        >
          <div
            className={
              fullscreen
                ? 'fixed inset-0 flex flex-col bg-white'
                : 'relative flex flex-col bg-white rounded-xl shadow-2xl w-[90vw] max-w-5xl h-[80vh]'
            }
          >
            {/* Modal header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 bg-slate-50 rounded-t-xl shrink-0">
              <span className="font-semibold text-slate-800 text-sm truncate max-w-[60%]">
                {productName} — {t('demoAvailable')}
              </span>
              <div className="flex items-center gap-2">
                <a
                  href={demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-[#1e40af] hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  {t('openInNewTab')}
                </a>
                <button
                  onClick={toggleFullscreen}
                  className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
                  aria-label={fullscreen ? t('exitFullscreen') : t('fullscreen')}
                >
                  {fullscreen ? (
                    <Minimize2 className="h-4 w-4" />
                  ) : (
                    <Maximize2 className="h-4 w-4" />
                  )}
                </button>
                <button
                  onClick={handleClose}
                  className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
                  aria-label={t('closeDemo')}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Iframe */}
            <iframe
              ref={iframeRef}
              src={demoUrl}
              className="flex-1 w-full border-0"
              title={`${productName} demo`}
              allow="fullscreen"
              loading="lazy"
            />
          </div>
        </div>
      )}
    </>
  );
}
