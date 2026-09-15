"use client";

import React, { useEffect, useState, useMemo } from "react";
import { cn } from "@/lib/utils";

export interface PerspectiveGridProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Number of rows in the grid (default: 20) */
  rows?: number;
  /** Number of columns in the grid (default: 20) */
  cols?: number;
  /** Fallback grid dimension if rows or cols are not provided (default: 20) */
  gridSize?: number;
  /** Whether to show the gradient overlay (default: true) */
  showOverlay?: boolean;
  /** Fade radius percentage for the gradient overlay (default: 80) */
  fadeRadius?: number;
  /** Additional CSS classes for the grid container */
  className?: string;
  /** Optional content to render over the perspective grid */
  children?: React.ReactNode;
}

export function PerspectiveGrid({
  rows = 20,
  cols = 20,
  gridSize,
  showOverlay = true,
  fadeRadius = 80,
  className,
  children,
  ...props
}: PerspectiveGridProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const rowCount = rows ?? gridSize ?? 20;
  const colCount = cols ?? gridSize ?? 20;

  // Memoize tiles array to prevent unnecessary re-renders
  const tiles = useMemo(
    () => Array.from({ length: rowCount * colCount }),
    [rowCount, colCount]
  );

  return (
    <div
      className={cn(
        "relative w-full h-full min-h-[350px] overflow-hidden bg-transparent flex items-center justify-center",
        className
      )}
      style={{
        perspective: "2000px",
        transformStyle: "preserve-3d",
      }}
      {...props}
    >
      <div
        className="absolute w-[90rem] max-w-none aspect-square grid origin-center pointer-events-auto"
        style={{
          left: "50%",
          top: "48%",
          transform:
            "translate(-50%, -50%) rotateX(35deg) rotateY(-8deg) rotateZ(18deg) scale(1.65)",
          transformStyle: "preserve-3d",
          gridTemplateColumns: `repeat(${colCount}, 1fr)`,
          gridTemplateRows: `repeat(${rowCount}, 1fr)`,
        }}
      >
        {mounted &&
          tiles.map((_, i) => (
            <div
              key={i}
              className="tile min-h-[1px] min-w-[1px] border border-neutral-300/35 dark:border-white/[0.06] bg-transparent transition-colors duration-[1500ms] hover:duration-0 hover:bg-neutral-300/40 hover:border-neutral-400 dark:hover:bg-sky-500/15 dark:hover:border-sky-400/40"
            />
          ))}
      </div>

      {showOverlay && (
        <div
          className="absolute inset-0 pointer-events-none z-10"
          style={{
            background: `radial-gradient(ellipse at 50% 50%, transparent 20%, var(--bg-primary, #0a0d14) ${fadeRadius}%)`,
          }}
        />
      )}

      {children && (
        <div className="relative z-20 pointer-events-auto">
          {children}
        </div>
      )}
    </div>
  );
}

export function PerspectiveGridDemo() {
  return (
    <div className="relative w-full h-[500px] flex items-center justify-center overflow-hidden rounded-xl border border-neutral-200 dark:border-neutral-800 bg-black">
      <PerspectiveGrid rows={20} cols={20}>
        <div className="text-center select-none">
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-neutral-800 dark:text-neutral-200 drop-shadow-md">
            Hover Me
          </h2>
        </div>
      </PerspectiveGrid>
    </div>
  );
}
