'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import {
  FadeInUp,
  FadeIn,
  StaggerContainer,
  StaggerItem,
  Counter,
} from '@/components/motion';
import { type ReactNode } from 'react';

/* ─── FAQ Accordion ─── */

interface FaqItem {
  question: string;
  answer: string;
}

export function FaqAccordion({ items }: { items: FaqItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="space-y-3">
      {items.map((item, i) => {
        const isOpen = openIndex === i;
        return (
          <div
            key={i}
            className="rounded-xl border border-slate-200 bg-white overflow-hidden transition-shadow hover:shadow-sm"
          >
            <button
              onClick={() => setOpenIndex(isOpen ? null : i)}
              className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left cursor-pointer"
            >
              <span className="text-base font-semibold text-slate-900 leading-snug">
                {item.question}
              </span>
              <ChevronDown
                className={`h-5 w-5 shrink-0 text-slate-400 transition-transform duration-300 ${
                  isOpen ? 'rotate-180' : ''
                }`}
              />
            </button>
            <div
              className={`grid transition-all duration-300 ease-in-out ${
                isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
              }`}
            >
              <div className="overflow-hidden">
                <p className="px-6 pb-5 text-sm leading-relaxed text-slate-600">
                  {item.answer}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ─── Animated Section Wrappers ─── */

export function AnimatedSection({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <FadeInUp className={className} delay={delay}>
      {children}
    </FadeInUp>
  );
}

export function AnimatedFadeIn({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <FadeIn className={className} delay={delay}>
      {children}
    </FadeIn>
  );
}

export function AnimatedStaggerContainer({
  children,
  className,
  staggerDelay = 0.1,
}: {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
}) {
  return (
    <StaggerContainer className={className} staggerDelay={staggerDelay}>
      {children}
    </StaggerContainer>
  );
}

export function AnimatedStaggerItem({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <StaggerItem className={className}>{children}</StaggerItem>;
}

export function AnimatedCounter({
  target,
  suffix = '',
  prefix = '',
  className,
}: {
  target: number;
  suffix?: string;
  prefix?: string;
  className?: string;
}) {
  return (
    <Counter
      target={target}
      suffix={suffix}
      prefix={prefix}
      className={className}
    />
  );
}
