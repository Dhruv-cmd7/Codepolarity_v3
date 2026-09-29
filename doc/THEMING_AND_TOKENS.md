# Theming & Design Tokens Reference
**Platform:** Codepolarity v3  
**Theme Engine:** Dual-Tone CSS Variables (`data-theme="dark"` / `data-theme="light"`)

---

## 1. CSS Variable Architecture (`client/src/index.css`)

The application switches themes dynamically by setting `data-theme="dark"` or `data-theme="light"` on `document.documentElement`.

### 1.1 Dark Theme Tokens (Default)
```css
:root, [data-theme="dark"] {
  /* Canvas & Surfaces */
  --bg-primary: #0a0d14;
  --bg-secondary: #0f131a;
  --bg-input: #151b26;

  --theme-bg: var(--bg-primary);
  --theme-surface: #0f131a;
  --theme-surface-container: #151b26;
  --theme-surface-container-low: #101520;
  --theme-surface-container-high: #1c2331;
  --theme-on-surface: #f3f4f6;
  --theme-on-surface-variant: #9ca3af;
  --theme-outline: rgba(255, 255, 255, 0.08);
  --theme-outline-variant: rgba(255, 255, 255, 0.04);
  --theme-tonal: #151b26;

  /* Accent Hierarchy */
  --accent-blue: #3b82f6;
  --accent-cyan: #06b6d4;
  --accent-purple: #8b5cf6;
  --accent-green: #10b981;
  --accent-red: #ef4444;
  --accent-yellow: #f59e0b;

  /* Text Contrast */
  --text-main: #f3f4f6;
  --text-secondary: #94a3b8;
  --text-muted: #64748b;

  /* Glassmorphism & Hairline Outlines */
  --glass-bg: rgba(10, 13, 20, 0.96);
  --glass-border: rgba(255, 255, 255, 0.07);
  --glass-border-hover: rgba(255, 255, 255, 0.12);

  /* Primary Button Tokens */
  --btn-primary-bg: #f3f4f6;
  --btn-primary-text: #0a0d14;
  --btn-primary-hover: #ffffff;

  /* Secondary Button Tokens */
  --btn-secondary-bg: #0f131a;
  --btn-secondary-border: #1c2331;
  --btn-secondary-hover-bg: #151b26;
  --btn-secondary-hover-border: #2c384e;
}
```

### 1.2 Light Theme Tokens
```css
[data-theme="light"] {
  /* Canvas & Surfaces */
  --bg-primary: #f8fafc;
  --bg-secondary: #ffffff;
  --bg-input: #ffffff;

  --theme-bg: #f8fafc;
  --theme-surface: #ffffff;
  --theme-surface-container: #f1f5f9;
  --theme-surface-container-low: #f8fafc;
  --theme-surface-container-high: #e2e8f0;
  --theme-on-surface: #0f172a;
  --theme-on-surface-variant: #64748b;
  --theme-outline: rgba(0, 0, 0, 0.08);
  --theme-outline-variant: rgba(0, 0, 0, 0.04);
  --theme-tonal: #e2e8f0;

  /* Text Contrast */
  --text-main: #0f172a;
  --text-secondary: #475569;
  --text-muted: #64748b;

  /* Glassmorphism & Hairline Outlines */
  --glass-bg: rgba(255, 255, 255, 0.96);
  --glass-border: rgba(0, 0, 0, 0.08);
  --glass-border-hover: rgba(0, 0, 0, 0.14);

  /* Primary Button Tokens */
  --btn-primary-bg: #0f172a;
  --btn-primary-text: #ffffff;
  --btn-primary-hover: #1e293b;

  /* Secondary Button Tokens */
  --btn-secondary-bg: #ffffff;
  --btn-secondary-border: #cbd5e1;
  --btn-secondary-hover-bg: #f8fafc;
  --btn-secondary-hover-border: #94a3b8;
}
```

---

## 2. Brand Logo Inversion & Visibility Rules

When rendering `logoMark` and `logoText` in dark vs light mode:
- **Dark Theme (`theme === 'dark'`):**
  If rendering on deep dark canvas `#0a0d14`, the SVG text and icon can utilize `filter: brightness(0) invert(1)` or clean white fill to ensure crisp contrast against the obsidian background.
- **Light Theme (`theme === 'light'`):**
  Use `filter: none`. Both the icon mark and brand text will display their authentic deep slate / navy brand pigments.

---

## 3. Spacing Scale

| Token | Pixels | Application |
| :--- | :--- | :--- |
| `--space-xs` | `4px` | Pill badge padding, icon gap |
| `--space-sm` | `8px` | Small button padding, chip gap |
| `--space-md` | `16px` | Card internal padding, input padding |
| `--space-lg` | `24px` | Grid column gap, card header margin |
| `--space-xl` | `32px` | Section margins, bento gaps |
| `--space-2xl`| `48px` | Section header bottom spacing |
| `--space-3xl`| `64px` | Major section top/bottom padding |
| `--space-4xl`| `80px` | Hero bottom spacing, footer top padding |

---

## 4. Typography Scale

- **Display 1 (Hero Title):** `clamp(2.5rem, 5vw, 4.2rem)` | Line-height `1.05` | Letter-spacing `-0.03em`
- **Display 2 (Section Title):** `clamp(1.8rem, 3.2vw, 2.6rem)` | Line-height `1.15` | Letter-spacing `-0.025em`
- **Heading 3 (Card Title):** `1.25rem` (`20px`) | Line-height `1.25` | Letter-spacing `-0.02em`
- **Body Regular:** `0.92rem` - `1.0rem` | Line-height `1.6`
- **Body Small / Captions:** `0.82rem` - `0.88rem` | Line-height `1.5`
- **Monospace Micro / Telemetry:** `0.72rem` - `0.78rem` | Tracking `0.05em` | Uppercase
