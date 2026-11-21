# Accessibility (a11y) Conformance Report

## ♿ WCAG 2.1 Level AA Compliance Statement

The **Urban Air Quality Assistant** platform is engineered to ensure inclusive access to environmental intelligence for all users, including individuals with visual, auditory, motor, or cognitive disabilities. The system strictly complies with **Web Content Accessibility Guidelines (WCAG) 2.1 Level AA** standards.

---

## 📐 Accessibility Pillars

### 1. Perceivable
- **Color Contrast**: All text and user interface components achieve contrast ratios exceeding **4.5:1** for standard text and **3:1** for large text against both light (`#F8FAFC`) and dark (`#0B1220`) surfaces.
- **Multi-Modal Data Indicators**: Air Quality severity categories are conveyed simultaneously via:
  - Numerical AQI values
  - Categorical text labels ("Good", "Moderate", "Unhealthy")
  - High-contrast color indicators
  - Accessible iconography with descriptive labels
- **Text Scaling**: Layouts dynamically reflow without loss of content or function when scaled up to **200%**.

### 2. Operable
- **Keyboard Navigation**: All interactive elements (navigation links, buttons, standard switchers, sliders, and audio players) are fully accessible via the `Tab`, `Shift+Tab`, `Enter`, and `Space` keys.
- **Visible Focus Rings**: All interactive controls feature high-visibility focus indicators (`focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:outline-none`).
- **Skip Navigation Link**: A dedicated `<a href="#main-content">Skip to main content</a>` bypass link allows keyboard users to immediately skip navigation menus and jump directly to primary telemetry views.
- **No Keyboard Traps**: Modal dialogs and popovers maintain strict focus trapping with `Escape` key dismissal.

### 3. Understandable
- **Semantic HTML5 Architecture**: Standardized landmarks (`<header>`, `<nav>`, `<main>`, `<aside>`, `<footer>`) provide screen reader users with structural navigation shortcuts.
- **Audio Speech Synthesis**: Live atmospheric briefings can be vocalized via the browser's native Web Speech API with adjustable speech speeds.
- **Error Identification**: Authentication and preference forms provide clear inline error text and validation states with descriptive guidance.

### 4. Robust & Screen Reader Compatible
- **ARIA Attributes**: Icon-only buttons include explicit `aria-label` tags (e.g., `aria-label="Toggle theme"`, `aria-label="Listen to audio briefing"`).
- **Dynamic Updates**: Dynamic telemetry updates utilize `aria-live="polite"` to notify assistive technologies without interrupting user workflows.
- **Screen Reader Tested**: Compatible with NVDA, Apple VoiceOver, and Microsoft Narrator.

---

## 🧪 Automated Accessibility Verification

To verify accessibility compliance via the automated test suite:

```bash
python -m pytest tests/test_accessibility.py -v
```
