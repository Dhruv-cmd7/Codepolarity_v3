# Codepolarity Agent Directives & UI Design Standards

> **MANDATORY INSTRUCTION FOR ALL AI CODING SESSIONS:**  
> When creating, modifying, or refactoring ANY user interface, page, modal, or component in this repository (`Codepolarity_v3`), you **MUST** strictly conform to the **Codepolarity Swiss Brutalist & Technical Minimalist Design System** established on the Home Page (`LandingPage.jsx`, `ClimblabsHero.jsx`, `BrutalistFeatures.jsx`) and Auth Page (`SignInPage.jsx`).

---

## Core Rules for UI Development

### 1. Typography & Hierarchy
- **Font Stack:** Always use `"Google Sans Flex"` for headings, titles, buttons, and body copy.
- **Monospace Stack:** Always use `"Google Sans Code"`, `"JetBrains Mono"`, or `monospace` for all telemetry, code, status tags, timestamps, numbers, and brackets.
- **Letter Spacing:** Apply tight negative tracking (`letter-spacing: -0.02em` to `-0.03em`) on major titles (`H1`, `H2`). Apply positive tracking (`0.05em`) on uppercase tags.
- **No Serif / Generic Default Fonts:** Never fall back to default Times or generic unstyled browser fonts.

### 2. The Bracket & Symbol Signature
- **Brackets `[ ... ]`:** All section indicators, tags, button labels, and input labels must use stylized brackets:
  - Example: `[ 01 // OVERVIEW ]`, `[ CAPABILITIES ]`, `[ RESUME CURRICULUM ↗ ]`.
  - Dim the brackets slightly relative to the enclosed text (`opacity: 0.5` or `color: #64748b`).
- **North-East Action Arrow `↗`:** Use `↗` for action links and button indicators, with micro-shift animation on hover.

### 3. Hairline Borders & Structural Geometry
- **Hairline 1px Borders:** Borders must strictly be `1px solid rgba(255, 255, 255, 0.08)` (dark mode) or `1px solid #e2e8f0` (light mode).
- **Never use 2px+ thick or muddy borders.**
- **Bento Card Structure:** Every card has:
  1. Top bar with `[ 01 ]` ID badge, category tag, icon, and `ArrowUpRight` `↗`.
  2. Headline (`H3`) and concise description.
  3. Recessed visual box (`.brutalist-visual-box`) with code/nodes/telemetry.

### 4. Color Palette & Dark/Light Theming
- **Dark Mode (Default):** Canvas `#0a0d14`, surfaces `#0f131a` / `#111622`, input `#151b26`, text `#f8fafc`, muted `#94a3b8`.
- **Light Mode:** Canvas `#f8fafc`, surfaces `#ffffff`, input `#ffffff`, text `#0f172a`, muted `#64748b`.
- **Accents:** Electric blue `#3b82f6` (primary action), cyan `#38bdf8` (telemetry/active), emerald `#10b981` (success).
- **Brand Logo:** Ensure logo visibility in both dark and light modes.

### 5. Technical Input Fields
- Inputs must use dark recessed backgrounds `#151b26` with hairline border and subtle focus rings (`box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15)`).
- Input labels must follow the indexed format: `[ 01 // USERNAME ]`, `[ 02 // EMAIL ]`.

---

## Detailed Documentation References
Refer to the following guides in the `doc/` directory before writing code:
- [doc/DESIGN_SYSTEM.md](file:///d:/project/Codepolarity_v3/doc/DESIGN_SYSTEM.md) — Master design system specs and ethos.
- [doc/UI_COMPONENTS_GUIDE.md](file:///d:/project/Codepolarity_v3/doc/UI_COMPONENTS_GUIDE.md) — Exact component code snippets & classes.
- [doc/THEMING_AND_TOKENS.md](file:///d:/project/Codepolarity_v3/doc/THEMING_AND_TOKENS.md) — Color tokens and theme switcher rules.
- [doc/PAGE_CONSISTENCY_CHECKLIST.md](file:///d:/project/Codepolarity_v3/doc/PAGE_CONSISTENCY_CHECKLIST.md) — Complete consistency checklist and starter template.
