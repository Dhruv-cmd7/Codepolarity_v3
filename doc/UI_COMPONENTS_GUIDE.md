# Codepolarity UI Components Guide
**Aesthetic:** Swiss Brutalist & Technical Minimalist  
**Purpose:** Reusable component anatomy and patterns for exact platform consistency.

---

## 1. Top Navigation & Header Bar

All pages must feature a consistent top header structure matching `ClimblabsHero` and `SignInPage`.

```jsx
<header className="climblabs-header">
  {/* Left: Brand Identity & Live Time Ticker */}
  <div className="climblabs-header-left">
    <a href="/" className="climblabs-logo-link">
      <img src={logoMark} alt="Codepolarity" className="h-[24px] w-auto" />
      <img src={logoText} alt="Codepolarity" className="h-[20px] w-auto" />
    </a>

    <div className="climblabs-time-pill" title="Live Local & UTC Time">
      <span>{timeString || '10:00 PM, UTC+5'}</span>
    </div>
  </div>

  {/* Right: Clean Nav Links, Theme Switcher & Primary Action */}
  <div className="climblabs-header-right">
    <nav className="climblabs-nav-links">
      <button className="climblabs-nav-item">Roadmaps</button>
      <button className="climblabs-nav-item">Online IDE</button>
      <button className="climblabs-nav-item">
        Typlab <span className="climblabs-nav-badge">[v3]</span>
      </button>
      <button className="climblabs-nav-item">Assessment</button>
    </nav>

    {/* Theme Toggle Pill */}
    <button onClick={onToggleTheme} className="climblabs-theme-toggle" aria-label="Toggle theme">
      {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
    </button>

    {/* Action CTA */}
    <button onClick={handleAction} className="climblabs-cta-top">
      RESUME ROADMAPS <span className="climblabs-arrow">↗</span>
    </button>
  </div>
</header>
```

### Component Rules:
- **Hairline Boundary:** Always separated by `1px solid rgba(255, 255, 255, 0.08)` (dark) or `rgba(0,0,0,0.08)` (light).
- **Time Ticker:** Calculate live time with UTC offset (`UTC+5`, `UTC-8`, etc.) on a 30-second interval.
- **Logo Treatment:** When rendering on pure `#0a0d14` background in dark mode, invert logo if needed, and in light mode render with default SVG fills.

---

## 2. Section Header & Badge System

Every section on any page (Roadmaps, Typlab, Assessment, Features) begins with the signature architectural section header.

```jsx
<div className="brutalist-features-header">
  {/* Category Badge */}
  <div className="brutalist-features-badge" aria-hidden="true">
    <span className="brutalist-bracket">[</span>
    <span>CURRICULUM ARCHITECTURE</span>
    <span className="brutalist-bracket">]</span>
  </div>

  {/* Authoritative Title */}
  <h2 className="brutalist-features-title">
    Engineered for Mastery.
  </h2>

  {/* Concise Subtitle */}
  <p className="brutalist-features-subtitle">
    Structured computer science milestones from runtime mechanics to distributed consensus.
  </p>
</div>
```

### Key CSS Classes:
- `.brutalist-features-badge`: Monospace, `letter-spacing: 0.05em`, color `#94a3b8`, bracket color `#64748b`.
- `.brutalist-features-title`: Google Sans Flex, `clamp(1.8rem, 3.2vw, 2.6rem)`, tight tracking `-0.025em`, weight `700`.
- `.brutalist-features-subtitle`: `max-width: 580px`, color `#94a3b8`, line-height `1.6`.

---

## 3. The 4 Architectural Bento / Feature Cards

Cards must follow the 3-tier structure seen in `BrutalistFeatures.jsx`:
1. **Header Row:** Number ID `[ 01 ]`, uppercase category tag, subtle Lucide icon, and `ArrowUpRight` `↗`.
2. **Copy Row:** Clean title (`h3`) and a crisp 1-to-2 sentence description.
3. **Visual Box:** Recessed telemetry or code box (`.brutalist-visual-box`).

```jsx
<div className="brutalist-card" onClick={() => navigateTo('roadmaps')}>
  {/* Tier 1: ID & Icon Bar */}
  <div className="brutalist-card-top">
    <div className="brutalist-card-id">
      <span className="brutalist-num">[ 01 ]</span>
      <span className="brutalist-tag">ROADMAPS</span>
    </div>
    <div className="brutalist-card-icon-wrap">
      <Route size={18} className="brutalist-card-icon" />
      <ArrowUpRight size={18} className="brutalist-card-arrow" />
    </div>
  </div>

  {/* Tier 2: Title & Narrative */}
  <div className="brutalist-card-content">
    <h3 className="brutalist-card-title">Curriculum Pathways</h3>
    <p className="brutalist-card-desc">
      Structured milestones from fundamentals to distributed architecture.
    </p>
  </div>

  {/* Tier 3: Recessed Interactive Visual Box */}
  <div className="brutalist-visual-box">
    {/* Visual elements: Nodes, Terminal, Telemetry HUD, or Cheatsheet */}
    <div className="brutalist-roadmap-nodes">
      <div className="brutalist-node active">
        <span className="brutalist-node-dot" />
        <span>Foundations</span>
      </div>
      <div className="brutalist-node-line active" />
      <div className="brutalist-node">
        <span className="brutalist-node-dot locked" />
        <span>System Design</span>
      </div>
    </div>
    <div className="brutalist-visual-meta">
      <span className="brutalist-meta-action">[ OPEN ROADMAPS ↗ ]</span>
    </div>
  </div>
</div>
```

---

## 4. Input Fields & Form Elements

Form inputs follow the precise styling from `SignInPage.jsx`:

```jsx
<div className="brutalist-input-group">
  <div className="brutalist-label-row">
    <label className="brutalist-label">[ 01 // EMAIL ADDRESS ]</label>
  </div>
  <div className="brutalist-field-wrap">
    <Mail size={15} className="brutalist-field-icon" />
    <input
      type="email"
      placeholder="you@domain.com"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      className="brutalist-input"
    />
  </div>
</div>
```

### Input Field Specs:
- **Background:** `#151b26` (Dark) / `#ffffff` (Light).
- **Border:** `1px solid rgba(255, 255, 255, 0.09)` (Dark) / `1px solid #cbd5e1` (Light).
- **Border Radius:** `8px`.
- **Focus Ring:** `border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);`.
- **Typography:** Google Sans Flex, `0.92rem`, placeholder `#475569`.

---

## 5. Action Buttons (Brutalist CTA System)

### 5.1 Primary Bracketed Button
```jsx
<button className="brutalist-submit-btn">
  <span className="brutalist-bracket">[</span>
  <span>AUTHENTICATE & ENTER ↗</span>
  <span className="brutalist-bracket">]</span>
</button>
```
- **CSS:** Background `#f3f4f6`, text `#0a0d14`, font Google Sans Flex weight `600`, letter-spacing `0.02em`.
- **Hover:** Subtle lift (`translateY(-1px)`), brackets expand (`margin: 0 4px`), box shadow `0 8px 24px rgba(0, 0, 0, 0.3)`.

### 5.2 Secondary Outlined Button
```jsx
<button className="hero-btn-secondary">
  <span>Open Sandbox IDE</span>
</button>
```
- **CSS:** Background `#0f131a`, border `1px solid #1c2331`, text `#cbd5e1`, hover background `#151b26`, hover border `#2c384e`.

---

## 6. Telemetry HUD & Status Indicators

Used on dashboards, profiles, assessment screens, and typing telemetry:

```jsx
<div className="brutalist-telemetry-hud">
  <div className="brutalist-telemetry-stat">
    <span className="brutalist-stat-big">94.8%</span>
    <span className="brutalist-stat-label">[ ACCURACY ]</span>
  </div>
  <div className="brutalist-telemetry-divider" />
  <div className="brutalist-telemetry-stat">
    <span className="brutalist-stat-big">112</span>
    <span className="brutalist-stat-label">[ WPM VELOCITY ]</span>
  </div>
  <div className="brutalist-telemetry-divider" />
  <div className="brutalist-telemetry-stat">
    <span className="brutalist-stat-big">0.02s</span>
    <span className="brutalist-stat-label">[ LATENCY ]</span>
  </div>
</div>
```
