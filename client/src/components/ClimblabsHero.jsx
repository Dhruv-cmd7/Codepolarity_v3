import React, { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';
import logoMark from '../assets/logo.svg';
import logoText from '../assets/logo_text.svg';

/**
 * CodepolarityHero (Climblabs Swiss Pixel Dissolution UI)
 * Custom-crafted for Codepolarity with authentic platform copy, routing, and telemetry.
 */
export default function ClimblabsHero({ user, onOpenAuth, setCurrentPage, theme = 'dark', onToggleTheme }) {
  // Live formatted time ticker with UTC offset
  const [timeString, setTimeString] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12 || 12;

      const offsetMinutes = -now.getTimezoneOffset();
      const offsetHours = Math.floor(Math.abs(offsetMinutes) / 60);
      const sign = offsetMinutes >= 0 ? '+' : '-';
      const utcStr = `UTC${sign}${offsetHours}`;

      setTimeString(`${hours}:${minutes} ${ampm}, ${utcStr}`);
    };

    updateTime();
    const timer = setInterval(updateTime, 1000 * 30);
    return () => clearInterval(timer);
  }, []);

  // Dynamically hide the page scrollbar when inside the Hero Section
  useEffect(() => {
    const handleScroll = () => {
      const heroThreshold = window.innerHeight * 0.85;
      if (window.scrollY < heroThreshold) {
        document.documentElement.classList.add('hide-hero-scrollbar');
      } else {
        document.documentElement.classList.remove('hide-hero-scrollbar');
      }
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.documentElement.classList.remove('hide-hero-scrollbar');
    };
  }, []);


  const handleNavClick = (pageId, sectionId) => {
    if (sectionId) {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }
    if (setCurrentPage && pageId) {
      setCurrentPage(pageId);
    }
  };

  const handlePrimaryCta = () => {
    if (user) {
      setCurrentPage('roadmaps');
    } else if (onOpenAuth) {
      onOpenAuth();
    }
  };

  return (
    <section className="climblabs-hero" aria-label="Codepolarity Platform Overview">
      {/* Ambient background glow aura */}
      <div className="climblabs-hero-ambient-glow" aria-hidden="true" />

      {/* ────────────────── 1. TOP HEADER BAR ────────────────── */}
      <header className="climblabs-header climblabs-anim-header">
        <div className="climblabs-header-left">
          {/* Real Codepolarity Brand Logo */}
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="climblabs-logo-link"
            aria-label="Codepolarity Home"
          >
            <img
              src={logoMark}
              alt="Codepolarity Icon"
              className="h-[24px] sm:h-[26px] w-auto block shrink-0 climblabs-logo-img"
            />
            <img
              src={logoText}
              alt="Codepolarity"
              className="h-[20px] sm:h-[22px] w-auto block shrink-0 climblabs-logo-img"
            />
          </a>

          {/* Time & UTC offset */}
          <div className="climblabs-time-pill" title="Live Local & UTC Time">
            <span>{timeString || '10:00 PM, UTC+5'}</span>
          </div>

        </div>

        {/* Navigation Items + Action CTA */}
        <div className="climblabs-header-right">
          <nav className="climblabs-nav-links" aria-label="Hero Navigation">
            <button
              type="button"
              onClick={() => handleNavClick('roadmaps', null)}
              className="climblabs-nav-item"
            >
              Roadmaps
            </button>
            <button
              type="button"
              onClick={() => handleNavClick('editor', null)}
              className="climblabs-nav-item"
            >
              Online IDE
            </button>
            <button
              type="button"
              onClick={() => handleNavClick('typlab', null)}
              className="climblabs-nav-item"
            >
              Typlab
            </button>
            <button
              type="button"
              onClick={() => handleNavClick('assessment', null)}
              className="climblabs-nav-item"
            >
              Assessment
            </button>
          </nav>

          {onToggleTheme && (
            <button
              type="button"
              onClick={onToggleTheme}
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              className="climblabs-theme-toggle"
            >
              {theme === 'dark' ? (
                <Sun size={15} className="climblabs-toggle-icon" />
              ) : (
                <Moon size={15} className="climblabs-toggle-icon" />
              )}
            </button>
          )}

          <button
            type="button"
            onClick={handlePrimaryCta}
            className="climblabs-cta-top"
            aria-label={user ? 'Go to curriculum roadmaps' : 'Sign in to Codepolarity'}
          >
            {user ? 'RESUME ROADMAPS' : 'SIGN IN'} <span className="climblabs-arrow">↗</span>
          </button>
        </div>
      </header>

      {/* ────────────────── 2. MAIN HERO BODY ────────────────── */}
      <div className="climblabs-hero-body">
        {/* Left Headline Content Area */}
        <div className="climblabs-hero-content">
          <h1 className="climblabs-hero-title climblabs-anim-title">
            The Software
            <br />
            Engineering Platform
          </h1>

          <p className="climblabs-hero-subtitle climblabs-anim-subtitle">
            Master foundational computer science through structured curriculum roadmaps, cloud execution runtimes, and real-time keystroke telemetry.
          </p>

          <div className="climblabs-cta-wrapper climblabs-anim-cta">
            <button
              type="button"
              onClick={handlePrimaryCta}
              className="climblabs-leave-request"
              aria-label={user ? 'Resume your learning curriculum' : 'Start learning for free'}
            >
              <span className="climblabs-bracket climblabs-bracket-left">[</span>
              <span className="climblabs-request-text">
                {user ? 'RESUME CURRICULUM' : 'START LEARNING FREE'}
              </span>
              <span className="climblabs-bracket climblabs-bracket-right">]</span>
            </button>
          </div>
        </div>

        {/* ──────────────── 3. PIXEL DISSOLUTION TRANSITION ──────────────── */}
        <div className="climblabs-pixel-art" aria-hidden="true">
          <PixelTransitionArtwork />
        </div>

        {/* ──────────────── 4. RIGHT BOTTOM NARRATIVE ──────────────── */}
        <div className="climblabs-hero-footer-right climblabs-anim-footer">
          <p className="climblabs-footer-paragraph">
            We combine structured curriculum roadmaps, in-browser execution sandboxes, and real-time keystroke telemetry to help your engineering skills rise higher, faster
          </p>
        </div>
      </div>
    </section>
  );
}

/**
 * PixelTransitionArtwork
 * Grid-locked scalable vector blocks replicating the exact stepped dissolution terrain,
 * negative light pixel cutouts, and floating square constellations.
 */
function PixelTransitionArtwork() {
  const s = 48; // Each pixel grid unit size
  const totalCols = 32;
  const viewBoxWidth = totalCols * s; // 1536
  const viewBoxHeight = 960;

  // Solid dark base boundary points (column 0 to 31 -> starting row)
  // Merged with step blocks so each column is a single seamless rectangle with no horizontal seams
  const terrainBase = [
    { col: 0, row: 15 },
    { col: 1, row: 15 },
    { col: 2, row: 17 },
    { col: 3, row: 17 },
    { col: 4, row: 17 },
    { col: 5, row: 17 },
    { col: 6, row: 17 },
    { col: 7, row: 16 },
    { col: 8, row: 16 },
    { col: 9, row: 14 },
    { col: 10, row: 13 },
    { col: 11, row: 10 },
    { col: 12, row: 10 },
    { col: 13, row: 10 },
    { col: 14, row: 11 },
    { col: 15, row: 11 },
    { col: 16, row: 12 },
    { col: 17, row: 9 },
    { col: 18, row: 8 },
    { col: 19, row: 10 },
    { col: 20, row: 10 },
    { col: 21, row: 8 },
    { col: 22, row: 9 },
    { col: 23, row: 8 },
    { col: 24, row: 10 },
    { col: 25, row: 9 },
    { col: 26, row: 8 },
    { col: 27, row: 9 },
    { col: 28, row: 8 },
    { col: 29, row: 9 },
    { col: 30, row: 8 },
    { col: 31, row: 9 },
  ];

  // Specific detached floating black pixel blocks (vertically adjacent blocks combined into single units)
  const floatingBlocks = [
    // Middle-right Tetris cluster
    { col: 19, row: 3, w: 1, h: 1 },
    { col: 21, row: 3, w: 1, h: 1 },
    { col: 20, row: 4, w: 1, h: 2 }, // Combined row 4 & 5 to eliminate horizontal seam
    { col: 22, row: 5, w: 1, h: 1 },

    // Right-hand floating cluster
    { col: 25, row: 5, w: 1, h: 2 }, // Combined row 5 & 6 to eliminate horizontal seam
    { col: 26, row: 6, w: 1, h: 1 },
    { col: 27, row: 6, w: 1, h: 1 },
  ];

  // Grid-locked negative light pixel cutouts inside the dark base
  // Adjacent cutouts are merged into single rectangles so no dividing seams or protrusions occur
  const cutouts = [
    { col: 13, row: 13, w: 1, h: 1 },
    { col: 17, row: 11, w: 2, h: 1 }, // Combined col 17 & 18 into single 2-wide cutout
    { col: 23, row: 10, w: 1, h: 1 },
    { col: 24, row: 11, w: 2, h: 1 }, // Combined col 24 & 25 into single 2-wide cutout
    { col: 27, row: 10, w: 1, h: 1 },
    { col: 29, row: 10, w: 1, h: 1 },
  ];

  return (
    <svg
      className="climblabs-pixel-svg climblabs-pixel-unit"
      viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
      preserveAspectRatio="none"
      shapeRendering="crispEdges"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Unified stepped dark terrain and pixel blocks with seamless solid fills */}
      <g className="climblabs-pixel-terrain" fill="#202a3d" stroke="none" strokeWidth="0">
        {terrainBase.map((item, idx) => {
          const colX = item.col * s;
          const colY = item.row * s;
          const colHeight = viewBoxHeight - colY + 120;
          const colWidth = idx === terrainBase.length - 1 ? s + 30 : s;
          return (
            <rect
              key={`base-${idx}`}
              x={colX}
              y={colY}
              width={colWidth}
              height={colHeight}
              className="climblabs-base-col"
            />
          );
        })}

        {/* Cohesive pixel blocks snapped precisely to 48px grid boundaries */}
        {floatingBlocks.map((block, idx) => (
          <rect
            key={`block-${idx}`}
            x={block.col * s}
            y={block.row * s}
            width={block.w * s}
            height={block.h * s}
            className="climblabs-pixel-block"
          />
        ))}
      </g>

      {/* Signature vertical lines and step tops across the bottom terrain */}
      <g className="climblabs-vertical-grid" aria-hidden="true">
        {terrainBase.map((item, idx) => {
          const colX = item.col * s;
          const colY = item.row * s;
          const prevItem = terrainBase[idx - 1];
          const topY = prevItem ? Math.min(colY, prevItem.row * s) : colY;
          const colWidth = idx === terrainBase.length - 1 ? s + 30 : s;
          return (
            <g key={`lines-${idx}`}>
              {/* Vertical line dividing the column all the way down to bottom */}
              <line
                x1={colX}
                y1={topY}
                x2={colX}
                y2={viewBoxHeight + 120}
                className="climblabs-vertical-line"
              />
              {/* Horizontal hairline step top */}
              <line
                x1={colX}
                y1={colY}
                x2={colX + colWidth}
                y2={colY}
                className="climblabs-step-line"
              />
            </g>
          );
        })}
        {/* Rightmost boundary line */}
        <line
          x1={viewBoxWidth}
          y1={terrainBase[terrainBase.length - 1].row * s}
          x2={viewBoxWidth}
          y2={viewBoxHeight + 120}
          className="climblabs-vertical-line"
        />
      </g>

      {/* Negative cutouts snapped precisely to 48px grid boundaries */}
      <g className="climblabs-cutouts" fill="#0a0d14" stroke="none" strokeWidth="0">
        {cutouts.map((cutout, idx) => (
          <rect
            key={`cutout-${idx}`}
            x={cutout.col * s}
            y={cutout.row * s}
            width={cutout.w * s}
            height={cutout.h * s}
            className="climblabs-negative-cutout"
          />
        ))}
      </g>
    </svg>
  );
}
