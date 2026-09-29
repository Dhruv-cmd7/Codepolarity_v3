# Codepolarity Design System Specification
**Version:** 3.0  
**Aesthetic Theme:** Swiss Brutalist & Technical Minimalist (Climblabs Dissolution System)  
**Target Atmosphere:** High-precision engineering workbench (inspired by Linear, Vercel, and Swiss Modernism)

---

## 1. Executive Summary & Design Ethos

Codepolarity's visual identity embodies **engineering excellence, geometric precision, and modern Swiss typography**. The UI rejects generic consumer SaaS gradients, overly rounded playful shapes, and cluttered layouts. Instead, it employs:

- **Mathematical Hierarchy**: Clean structural grids, generous white space, and low text density.
- **Architectural Brutalism**: Hairline borders (1px), subtle recessed visual boxes, and monospace telemetry badges.
- **Bracketed Technical Annotations**: Bracketed micro-typography (e.g., `[ 01 // OVERVIEW ]`, `[ RESUME CURRICULUM ↗ ]`).
- **Precision Color System**: Deep obsidian dark mode (`#0a0d14`), clean slate light mode (`#f8fafc`), with electric blue (`#3b82f6`) and cyan (`#38bdf8`) accents.
- **Pixel Dissolution Artwork**: Grid-locked vector steps, floating constellation pixels, and breathing ambient glows.

---

## 2. Core Color Palette & Design Tokens

### 2.1 Dark Mode (Primary & Default)
| Role | Hex / RGBA | Usage |
| :--- | :--- | :--- |
| **Canvas / Background** | `#0a0d14` | Deep obsidian blue-black page background |
| **Surface (Level 1)** | `#0f131a` | Secondary panels, table headers, outer card wrappers |
| **Surface (Level 2 - Cards)** | `#111622` / `rgba(15, 19, 26, 0.7)` | Main interactive cards, bento blocks, modal sheets |
| **Surface (Level 3 - Recessed)** | `rgba(10, 13, 20, 0.85)` / `#151b26` | Visual boxes, terminal windows, telemetry HUDs, inputs |
| **Hairline Border** | `rgba(255, 255, 255, 0.08)` | Default card, container, and divider borders |
| **Border Active / Hover** | `rgba(255, 255, 255, 0.16)` | Card hover, input hover, active outlines |
| **Text Primary (High Contrast)**| `#f8fafc` / `#f3f4f6` | H1-H4 headings, button text, active labels |
| **Text Secondary (Muted)** | `#94a3b8` / `#9ca3af` | Paragraphs, descriptions, subtitles |
| **Text Tertiary (Technical)** | `#64748b` | Monospace tags, brackets, metadata timestamps |
| **Primary Accent (Electric Blue)**| `#3b82f6` | Primary action buttons, active nodes, focus rings |
| **Secondary Accent (Cyan/Sky)**| `#38bdf8` / `#06b6d4` | Live tickers, syntax highlights, metric values |
| **Success Accent (Emerald)** | `#10b981` | Completed modules, passing test runners |
| **Warning / Alert Accent** | `#f59e0b` / `#ef4444` | Calibration warnings, compiler errors, alerts |

### 2.2 Light Mode (Seamless Dual-Tone Mode)
| Role | Hex / RGBA | Usage |
| :--- | :--- | :--- |
| **Canvas / Background** | `#f8fafc` | Clean slate background |
| **Surface (Cards & Panels)** | `#ffffff` | Elevated clean white cards |
| **Surface (Recessed / Box)**| `#f1f5f9` | Visual boxes, terminal backgrounds |
| **Hairline Border** | `rgba(0, 0, 0, 0.08)` / `#e2e8f0` | Subtle, crisp 1px borders |
| **Text Primary** | `#0f172a` / `#1e293b` | Deep slate headings and high-contrast text |
| **Text Secondary** | `#64748b` | Clean neutral secondary text |
| **Brand Logo Rendering** | `filter: none;` | Full-color original SVG brand asset |

---

## 3. Typography Hierarchy

### 3.1 Primary Font: Google Sans Flex
Used for all titles, section headings, body paragraphs, and standard UI controls.
- **Font Family**: `"Google Sans Flex", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`
- **Hero Title (`H1`)**: `clamp(2.5rem, 5vw, 4.2rem)`, weight `700`, line-height `1.05`, letter-spacing `-0.03em`.
- **Section Heading (`H2`)**: `clamp(1.8rem, 3vw, 2.5rem)`, weight `700`, line-height `1.15`, letter-spacing `-0.025em`.
- **Card Title (`H3`)**: `1.25rem` (`20px`), weight `600`, line-height `1.25`, letter-spacing `-0.02em`.
- **Body / Subtitle**: `0.88rem` - `1.02rem`, weight `400` to `500`, line-height `1.6`, color `#94a3b8` (dark) or `#64748b` (light).

### 3.2 Monospace Technical Font: Google Sans Code / JetBrains Mono
Used for telemetry indicators, bracketed numbers, terminal logs, code snippets, and timestamps.
- **Font Family**: `"Google Sans Code", "JetBrains Mono", ui-monospace, SFMono-Regular, monospace`
- **Telemetry Index**: `font-size: 0.75rem` - `0.95rem`, weight `700`, letter-spacing `0.05em`.
- **Section & Badge Tags**: `font-size: 0.72rem` - `0.78rem`, weight `600`, text-transform `uppercase`, tracking `0.05em`.
- **Micro Metadata**: `font-size: 0.68rem` - `0.76rem`, color `#64748b`.

---

## 4. Architectural Motifs & Signatures

### 4.1 The Bracket Motif `[ ... ]`
Every primary action, form field descriptor, section tag, and card identifier uses stylized technical brackets:
```jsx
// Section Tag
<div className="brutalist-features-badge">
  <span className="brutalist-bracket">[</span>
  <span>CAPABILITIES</span>
  <span className="brutalist-bracket">]</span>
</div>

// Technical Form Label
<label className="brutalist-label">[ 01 // EMAIL ]</label>

// Primary CTA Button
<button className="climblabs-leave-request">
  <span className="climblabs-bracket">[</span>
  <span>START LEARNING FREE ↗</span>
  <span className="climblabs-bracket">]</span>
</button>
```
*Rule:* Brackets should be subtly dimmer (`opacity: 0.5` or `color: #64748b`) than the enclosed text, accentuating the inner copy.

### 4.2 The North-East Directional Arrow `↗`
Outbound actions, card drill-downs, and mode transitions use the mathematical diagonal arrow `↗` (`&nearr;` / `\u2197`), not bulky arrow icons.
- Hover animations apply a micro-shift: `transform: translate(2px, -2px); transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1);`.

### 4.3 Hairline Borders (1px)
Never use 2px+ thick borders or rounded cartoon borders. All borders are:
- `border: 1px solid rgba(255, 255, 255, 0.08);` (Dark)
- `border: 1px solid rgba(0, 0, 0, 0.08);` (Light)
- `border-radius: 8px` for inner elements, `12px` - `16px` for cards, `24px` for main floating app containers.

### 4.4 Recessed Visual Boxes (`.brutalist-visual-box`)
Cards should feature a recessed lower visual panel depicting live engineering telemetry, code execution, node paths, or HUD metrics.
```css
.brutalist-visual-box {
  background: rgba(10, 13, 20, 0.85);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 8px;
  padding: 16px 18px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin-top: auto;
}
```

### 4.5 Live Time Ticker Pill
Both the Home Hero and the Auth/Sign-In pages feature a live UTC time ticker pill (`climblabs-time-pill`):
- Displays local time with UTC offset: e.g., `10:55 PM, UTC+5`.
- Font: Monospace, `font-size: 0.78rem`, color `#94a3b8`, hairline pill border.

---

## 5. Animation & Motion Design

1. **Easing Function**: Use the Swiss spring bezier for UI transitions:
   `cubic-bezier(0.16, 1, 0.3, 1)` or `cubic-bezier(0.34, 1.56, 0.64, 1)`.
2. **Scroll Physics**: Smooth wheel scrolling powered by **Lenis** (`duration: 1.2, smoothWheel: true`).
3. **Ambient Breathe**: Subtle ambient background radial aura pulsing softly over `11s` (`climblabsAmbientBreathe`).
4. **No Jitter**: Interactive hovers use pure opacity and subtle translation (`translateY(-2px)` or `translateX(2px)`), avoiding layout reflows.
