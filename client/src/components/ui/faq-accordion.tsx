"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface FaqItem {
  question: string;
  answer: React.ReactNode;
}

export interface FaqAccordionProps extends React.HTMLAttributes<HTMLDivElement> {
  items?: FaqItem[];
  title?: string;
  subtitle?: string;
  badge?: string;
}

const DEFAULT_ITEMS: FaqItem[] = [
  { question: "What is Vengeance UI?", answer: "Vengeance UI is a high-performance, dark-mode first component library designed for the next generation of web applications." },
  { question: "Can I use it with Tailwind CSS?", answer: "Yes! All components are built on top of Tailwind CSS and highly customizable using utility classes." },
  { question: "Are the components accessible?", answer: "Accessibility is a core focus. We ensure proper ARIA attributes, keyboard navigation, and semantic HTML structure." },
  { question: "Do I need to install a heavy npm package?", answer: "No. Vengeance UI provides a CLI that lets you copy and paste only the components you need directly into your project." },
  { question: "Is it compatible with React and Next.js?", answer: "Absolutely. The library is built with React in mind and perfectly supports Next.js Server Components and client-side rendering." },
];

export function FaqAccordion({
  items = DEFAULT_ITEMS,
  title,
  subtitle,
  badge,
  className,
  ...props
}: FaqAccordionProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggleItem = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className={cn("w-full max-w-[1040px] mx-auto flex flex-col items-center justify-center relative font-sans", className)} {...props}>
      {(title || badge) && (
        <div className="faq-header w-full flex flex-col items-center justify-center text-center">
          {badge && (
            <div className="faq-badge">
              <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
              {badge}
            </div>
          )}
          {title && (
            <h2 className="faq-title text-center">
              {title}
            </h2>
          )}
          {subtitle && (
            <p className="faq-subtitle text-center">
              {subtitle}
            </p>
          )}
        </div>
      )}

      <div className="flex flex-col gap-3.5 w-full">
        {items.map((item, index) => {
          const isActive = activeIndex === index;
          return (
            <div
              key={index}
              className={cn(
                "w-full rounded-2xl border transition-all duration-300 overflow-hidden",
                isActive 
                  ? "border-l-4 border-l-sky-500 dark:border-l-sky-400 border-slate-200 dark:border-white/15 bg-white dark:bg-[#0f1420] shadow-md dark:shadow-xl dark:shadow-sky-950/20" 
                  : "border-l-4 border-l-transparent border-slate-200 dark:border-white/[0.08] bg-white/80 dark:bg-[#0f131a]/90 hover:border-slate-300 dark:hover:border-white/20 hover:bg-slate-50 dark:hover:bg-[#151b26]"
              )}
            >
              <button
                type="button"
                className="w-full flex items-center justify-between px-6 py-5 sm:py-6 text-left cursor-pointer outline-none select-none gap-4"
                onClick={() => toggleItem(index)}
                aria-expanded={isActive}
              >
                <div className="flex items-center gap-4 sm:gap-5 min-w-0 flex-1">
                  <span
                    className={cn(
                      "font-mono text-xs sm:text-sm font-semibold w-9 h-7 flex items-center justify-center rounded-lg shrink-0 tracking-wider transition-all duration-200",
                      isActive
                        ? "text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/90 border border-sky-200 dark:border-sky-800/60 shadow-sm"
                        : "text-slate-500 dark:text-neutral-400 bg-slate-100 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800/80"
                    )}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span
                    className={cn(
                      "text-base sm:text-lg font-semibold tracking-tight transition-colors duration-200 leading-snug",
                      isActive
                        ? "text-slate-900 dark:text-white font-bold"
                        : "text-slate-700 dark:text-neutral-200 hover:text-slate-900 dark:hover:text-white"
                    )}
                  >
                    {item.question}
                  </span>
                </div>

                <div
                  className={cn(
                    "shrink-0 w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center border transition-all duration-300",
                    isActive
                      ? "bg-sky-50 dark:bg-sky-950 border-sky-200 dark:border-sky-700/80 text-sky-600 dark:text-sky-400 rotate-180 shadow-md"
                      : "bg-slate-100 dark:bg-neutral-900/80 border-slate-200 dark:border-neutral-800 text-slate-500 dark:text-neutral-400 hover:border-slate-300 dark:hover:border-neutral-700 hover:text-slate-900 dark:hover:text-white"
                  )}
                >
                  <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300" />
                </div>
              </button>

              <div
                className={cn(
                  "grid transition-all duration-300 ease-in-out w-full",
                  isActive ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                )}
              >
                <div className="overflow-hidden">
                  <div className="faq-answer-content border-t border-slate-100 dark:border-white/[0.08] text-base sm:text-lg font-normal leading-relaxed text-slate-600 dark:text-neutral-300/90">
                    {item.answer}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default FaqAccordion;
