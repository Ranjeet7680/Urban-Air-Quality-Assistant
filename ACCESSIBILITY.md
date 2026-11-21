# Accessibility (a11y) Conformance Report & VPAT

## ♿ WCAG 2.1 Level AA & AAA Conformance Statement

The **Urban Air Quality Assistant** platform is engineered to ensure universal and inclusive access to planetary environmental intelligence for all citizens, researchers, and public health officials, including individuals with visual, auditory, motor, or cognitive disabilities.

The application adheres strictly to **Web Content Accessibility Guidelines (WCAG) 2.1 Level AA** standards with key Level AAA enhancements (Section 508 and EN 301 549 compliant).

---

## 📋 WCAG 2.1 Conformance Matrix

| WCAG Principle | Guideline | Status | Platform Implementation |
| :--- | :--- | :---: | :--- |
| **1. Perceivable** | **1.1 Text Alternatives** | ✅ Pass | All charts, status badges, satellite plots, and interactive gauges include descriptive `alt` text, SVG `<title>`, or `aria-label` descriptors. |
| | **1.3 Adaptable** | ✅ Pass | Semantic landmark elements (`<header>`, `<nav>`, `<main id="main-content">`, `<aside>`, `<footer>`) structure every screen. |
| | **1.4 Distinguishable (Contrast)** | ✅ Pass | Contrast ratio exceeds **4.5:1** for standard body text and **3:1** for large headings and icons against both light (`#F8FAFC`) and dark (`#0B1220`) themes. |
| | **1.4.1 Use of Color** | ✅ Pass | Color is never used as the sole conveyor of information: numerical values, category text ("Good", "Hazardous"), icons, and standard labels accompany all color bars. |
| **2. Operable** | **2.1 Keyboard Accessible** | ✅ Pass | Every interactive control, modal, drawer, tab, map control, and audio player is navigable via `Tab`, `Shift+Tab`, `Enter`, `Space`, and arrow keys. |
| | **2.4.1 Bypass Blocks** | ✅ Pass | Screen reader and keyboard skip link `<a href="#main-content">Skip to main content</a>` positioned at the top of the DOM. |
| | **2.4.7 Focus Visible** | ✅ Pass | High-visibility focus indicators with `focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none` on all interactive targets. |
| | **2.1.2 No Keyboard Trap** | ✅ Pass | Modals, drawers, and popovers maintain strict focus trapping with `Escape` key dismissal. |
| **3. Understandable** | **3.1 Readable** | ✅ Pass | Primary language declared via `<html lang="en">`. Measurement units ($\mu g/m^3$, $ppb$, $km/h$) and regulatory standards explicitly labeled. |
| | **3.2 Predictable** | ✅ Pass | Intuitive, consistent navigation paradigms across Landing, Onboarding, and Dashboard views. |
| | **3.3 Input Assistance** | ✅ Pass | Form field validation with descriptive error messages, focus movement on error, and password show/hide toggles. |
| **4. Robust** | **4.1 Compatible** | ✅ Pass | ARIA roles (`role="region"`, `role="status"`, `role="alert"`) and `aria-live="polite"` for non-disruptive dynamic telemetry streaming. |
| | **4.1.2 Name, Role, Value** | ✅ Pass | Form elements and controls have explicit programmatic names accessible to assistive technologies (NVDA, VoiceOver, JAWS). |

---

## 🎙️ Assistive Technology & Multimodal Features

1. **Native Web Speech API Audio Briefing**:
   - Synthesizes real-time atmospheric conditions, dominant pollutants, and medical precautions into natural spoken audio for visually impaired or on-the-go users.
   - Includes speech speed adjustment (`0.75x`, `1.0x`, `1.25x`) and sound-wave audio feedback.

2. **Voice Input Speech Recognition**:
   - Users can query the AirSense AI conversational engine using natural voice speech dictation (`webkitSpeechRecognition`).

3. **Color-Blindness Accessible Indicators**:
   - Palette indicators conform to deuteranopia, protanopia, and tritanopia contrast requirements with unambiguous high-contrast category badges.

---

## 🧪 Automated Testing & Verification

Automated accessibility tests verify semantic HTML, landmark ids, skip links, and ARIA attributes:

```bash
# Run automated accessibility test suite
python -m pytest tests/test_accessibility.py -v
```
