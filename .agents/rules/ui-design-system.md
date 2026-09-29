# Codepolarity UI Design System Rule
description: Enforce the Codepolarity Swiss Brutalist & Technical Minimalist design system across all UI pages, components, and styling.
globs: ["client/src/**/*"]

---

## Instructions

Whenever creating or modifying UI components, pages, or CSS styles in `client/src`:
1. **Match the Home Page & SignIn Page Aesthetics:**
   - **Theme Identity:** Swiss Brutalist & Technical Minimalist (Climblabs dissolution style).
   - **Typography:** Use `"Google Sans Flex"` for UI copy and `"Google Sans Code"` / `"JetBrains Mono"` for telemetry, badges, brackets, and code.
   - **Brackets Pattern:** Use bracket notation for section badges (`[ CAPABILITIES ]`), form labels (`[ 01 // EMAIL ]`), and buttons (`[ RESUME CURRICULUM ↗ ]`).
   - **Hairline Borders:** Use `1px solid rgba(255, 255, 255, 0.08)` (dark) or `1px solid #e2e8f0` (light). Never use thick or muddy borders.
   - **Color Harmony:** Canvas is deep obsidian `#0a0d14` (dark) and `#f8fafc` (light). Primary accent is electric blue `#3b82f6` and cyan `#38bdf8`.
   - **Directional Arrow:** Use `↗` for active outbound or navigational buttons with hover micro-animations.
   - **Cards:** Include top ID tags (`[ 01 ]`), tight-tracked titles, and recessed visual boxes (`.brutalist-visual-box`).
   - **Dual-Theme Fidelity:** All components must look pristine in both dark mode (`data-theme="dark"`) and light mode (`data-theme="light"`).

Refer to the master specifications in `doc/DESIGN_SYSTEM.md` and `doc/UI_COMPONENTS_GUIDE.md`.
