import React, { useState, useEffect, useRef, useCallback } from "react";
import { cn } from "@/lib/utils";

const DEFAULT_CHARS = '.,:-=+*#%@░▒▓█!?&$0123456789┐└┘┴┬├┤┼▄▀~;"^';

export type AsciiGlitchRippleProps<T extends React.ElementType = "a"> = {
  children: string;
  as?: T;
  className?: string;
  dur?: number;
  chars?: string;
  preserveSpaces?: boolean;
  spread?: number;
} & Omit<React.ComponentPropsWithoutRef<T>, "children" | "as" | "className">;

export function AsciiGlitchRipple<T extends React.ElementType = "a">({
  children,
  as,
  className,
  dur = 1000,
  chars = DEFAULT_CHARS,
  preserveSpaces = true,
  spread = 1.2,
  onMouseEnter,
  ...props
}: AsciiGlitchRippleProps<T>) {
  const Component = as || "a";
  const textContent = typeof children === "string" ? children : String(children ?? "");
  const [displayText, setDisplayText] = useState<string>(textContent);
  const animFrameRef = useRef<number | null>(null);
  const isAnimatingRef = useRef<boolean>(false);

  useEffect(() => {
    if (!isAnimatingRef.current) {
      setDisplayText(textContent);
    }
  }, [textContent]);

  const triggerRipple = useCallback(() => {
    if (!textContent) return;

    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
    }

    isAnimatingRef.current = true;
    const startTime = performance.now();
    const len = textContent.length;

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / dur, 1);

      // Wave math: wave front travels from -spread to 1 + spread
      const head = progress * (1 + spread);
      const tail = head - spread;

      let result = "";
      for (let i = 0; i < len; i++) {
        const char = textContent[i];
        if (preserveSpaces && char === " ") {
          result += " ";
          continue;
        }

        const pos = len > 1 ? i / (len - 1) : 0;

        if (pos >= tail && pos <= head) {
          const randomChar = chars[Math.floor(Math.random() * chars.length)];
          result += randomChar;
        } else {
          result += char;
        }
      }

      setDisplayText(result);

      if (progress < 1) {
        animFrameRef.current = requestAnimationFrame(animate);
      } else {
        setDisplayText(textContent);
        isAnimatingRef.current = false;
      }
    };

    animFrameRef.current = requestAnimationFrame(animate);
  }, [textContent, dur, chars, preserveSpaces, spread]);

  useEffect(() => {
    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, []);

  const handleMouseEnter = (e: React.MouseEvent) => {
    triggerRipple();
    if (onMouseEnter) {
      (onMouseEnter as React.MouseEventHandler)(e);
    }
  };

  return (
    <Component
      className={cn("inline-block transition-colors duration-200 cursor-pointer", className)}
      onMouseEnter={handleMouseEnter}
      {...(props as any)}
    >
      {displayText}
    </Component>
  );
}

export function AsciiGlitchRippleDemo() {
  return (
    <AsciiGlitchRipple
      as="a"
      href="#"
      dur={1000}
      spread={1.2}
      className="text-lg font-mono hover:text-white"
    >
      Roadside Picnic — Arkady & Boris Strugatsky
    </AsciiGlitchRipple>
  );
}

export default AsciiGlitchRipple;
