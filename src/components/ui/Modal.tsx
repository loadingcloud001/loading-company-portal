'use client';

import { useEffect, useState, useCallback, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'fullscreen';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: ModalSize;
  children: ReactNode;
}

const sizeClasses: Record<ModalSize, string> = {
  sm: 'max-w-md rounded-xl',
  md: 'max-w-2xl rounded-xl',
  lg: 'max-w-5xl rounded-xl',
  xl: 'max-w-7xl rounded-xl',
  fullscreen: 'w-screen h-screen',
};

function Modal({ isOpen, onClose, title, size = 'md', children }: ModalProps) {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      // Slight delay for transition
      requestAnimationFrame(() => {
        setVisible(true);
      });
    } else {
      setVisible(false);
    }
  }, [isOpen]);

  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleEscape]);

  if (!mounted || !isOpen) return null;

  const isFullscreen = size === 'fullscreen';

  const modalContent = (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-200 ${
        visible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal panel */}
      <div
        className={`relative z-10 bg-white flex flex-col w-full ${sizeClasses[size]} ${
          isFullscreen ? '' : 'mx-4 max-h-[90vh]'
        } shadow-2xl`}
      >
        {/* Header */}
        {(title || !isFullscreen) && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-200 shrink-0">
            {title && (
              <h2 className="text-lg font-semibold text-zinc-900">{title}</h2>
            )}
            <button
              onClick={onClose}
              className="ml-auto p-1.5 rounded-lg text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        )}

        {/* Body */}
        <div className={`overflow-auto flex-1 ${isFullscreen ? '' : 'p-6'}`}>
          {children}
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}

export { Modal };
export type { ModalProps, ModalSize };
