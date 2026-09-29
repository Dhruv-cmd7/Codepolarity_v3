# Page Consistency Blueprint & Checklist
**Platform:** Codepolarity v3  
**Standard:** 100% Aesthetic Cohesion with Landing Page & SignIn Page

---

## 1. Page Architecture Standard

Every full-page view in Codepolarity (e.g., `RoadmapExplorer.jsx`, `Assessment.jsx`, `CodeEditor.jsx`, `Typlab.jsx`, `ProfileDashboard.jsx`) must adhere to this architectural structure:

```
┌─────────────────────────────────────────────────────────────┐
│ 1. Header Bar: Logo + Live Time Ticker + Nav + Theme Toggle │
├─────────────────────────────────────────────────────────────┤
│ 2. Ambient Aura: radial-gradient breathing background       │
├─────────────────────────────────────────────────────────────┤
│ 3. Page Title Block:                                        │
│    - Monospace Category Badge: [ 01 // SECTION ]            │
│    - Authoritative H1: Google Sans Flex (-0.025em tracking) │
│    - Crisp Subtitle: High legibility, low text density      │
├─────────────────────────────────────────────────────────────┤
│ 4. Main Interactive Canvas / Grid:                          │
│    - 1px hairline bordered cards / panels                   │
│    - Monospace telemetry tags: [ 01 ], [ METRICS ], etc.    │
│    - Recessed visual / terminal / HUD display box           │
├─────────────────────────────────────────────────────────────┤
│ 5. Action Tier: Bracketed CTAs: [ EXECUTE CODE ↗ ]          │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Page Consistency Checklist

Before considering any page or component complete, verify every item on this checklist:

### Typography
- [ ] **Google Sans Flex** is used for all headlines, titles, button labels, and descriptions.
- [ ] **Monospace** (`Google Sans Code` / `JetBrains Mono`) is strictly used for badges, code, index numbers, and telemetry.
- [ ] Headings have tight negative letter-spacing (`-0.02em` to `-0.03em`).
- [ ] Uppercase tags have positive tracking (`letter-spacing: 0.05em`).
- [ ] No generic serif or default system fonts are visible.

### Brackets & Technical Symbols
- [ ] Section badges use the bracket pattern: `[ SECTION_NAME ]` with dimmed brackets.
- [ ] Action buttons use directional up-right arrows (`↗`) for outbound/active interactions.
- [ ] Form input labels include index numbers: `[ 01 // FIELD_NAME ]`.
- [ ] Numbers have technical formatting: `[ 01 ]`, `[ 02 ]`, `[ v3 ]`.

### Borders & Geometry
- [ ] Hairline borders: strictly `1px solid rgba(255, 255, 255, 0.08)` (dark) or `1px solid #e2e8f0` (light).
- [ ] Zero heavy 2px+ borders.
- [ ] Border radius is disciplined: `6px`–`8px` for inner badges/buttons, `12px`–`16px` for cards.
- [ ] Recessed panels have subtle dark background (`rgba(10, 13, 20, 0.85)`).

### Color & Contrast
- [ ] Background is obsidian dark `#0a0d14` (dark mode) or clean slate `#f8fafc` (light mode).
- [ ] High contrast text: primary text `#f8fafc` / `#f3f4f6`, muted `#94a3b8`, tertiary `#64748b`.
- [ ] Accent colors are applied strategically: electric blue `#3b82f6` for primary focus, cyan `#38bdf8` for active status/metrics.
- [ ] Avoid generic rainbow colors. Stick to the curated blue/cyan palette.

### Light & Dark Theme Support
- [ ] Component respects `theme` (`'dark'` or `'light'`) and `data-theme` attribute.
- [ ] Text contrast remains high in light mode (switches to `#0f172a` / `#475569`).
- [ ] Card borders switch from white alpha to black alpha / `#e2e8f0`.
- [ ] Brand logo does not disappear or get washed out in either mode.

### Motion & Micro-interactions
- [ ] Lenis smooth scroll active on long pages.
- [ ] Hover states use smooth cubic-bezier transitions (`0.2s cubic-bezier(0.16, 1, 0.3, 1)`).
- [ ] Micro-animations for button arrows (`translate(2px, -2px)` on hover).
- [ ] Brackets expand slightly on button hover.

---

## 3. Blueprint Starter Template for New Pages

```jsx
import React, { useState, useEffect } from 'react';
import { ArrowUpRight, Activity } from 'lucide-react';

export default function ExamplePage({ user, setCurrentPage, theme = 'dark', onToggleTheme }) {
  const [timeString, setTimeString] = useState('');

  // Live UTC time ticker
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
      setTimeString(`${hours}:${minutes} ${ampm}, UTC${sign}${offsetHours}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="page-shell" style={{ background: 'var(--bg-primary)', color: 'var(--text-main)', minHeight: '100vh' }}>
      {/* Ambient background aura */}
      <div className="climblabs-hero-ambient-glow" aria-hidden="true" />

      {/* Main Content Container */}
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '120px 24px 80px' }}>
        
        {/* Section Header */}
        <div className="brutalist-features-header">
          <div className="brutalist-features-badge">
            <span className="brutalist-bracket">[</span>
            <span>SYSTEM // MODULE</span>
            <span className="brutalist-bracket">]</span>
          </div>

          <h1 className="brutalist-features-title">
            Page Title Here.
          </h1>

          <p className="brutalist-features-subtitle">
            Precision engineering description with low text density and high clarity.
          </p>
        </div>

        {/* 2-Column or 3-Column Architectural Grid */}
        <div className="brutalist-grid" style={{ marginTop: '48px' }}>
          
          {/* Card 01 */}
          <div className="brutalist-card">
            <div className="brutalist-card-top">
              <div className="brutalist-card-id">
                <span className="brutalist-num">[ 01 ]</span>
                <span className="brutalist-tag">STATUS</span>
              </div>
              <div className="brutalist-card-icon-wrap">
                <Activity size={18} className="brutalist-card-icon" />
                <ArrowUpRight size={18} className="brutalist-card-arrow" />
              </div>
            </div>

            <div className="brutalist-card-content">
              <h3 className="brutalist-card-title">Telemetry Overview</h3>
              <p className="brutalist-card-desc">
                Real-time execution telemetry and milestone verification benchmarks.
              </p>
            </div>

            <div className="brutalist-visual-box">
              <div className="brutalist-telemetry-hud">
                <div className="brutalist-telemetry-stat">
                  <span className="brutalist-stat-big">100%</span>
                  <span className="brutalist-stat-label">[ OPERATIONAL ]</span>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
```
