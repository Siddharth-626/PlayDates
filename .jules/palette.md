## 2025-05-14 - Interactive Div Pattern
**Learning:** Found a recurring pattern of using `div` with `onClick` for interactive elements (e.g., chat buttons, back buttons). This breaks keyboard accessibility as `div` is not focusable by default and does not communicate "button" intent to screen readers.
**Action:** Always refactor interactive `div` elements to semantic `button` elements and ensure they have descriptive `aria-label` attributes and `focus-visible` styles.
