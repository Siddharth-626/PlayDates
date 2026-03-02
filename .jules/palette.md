## 2025-05-15 - Accessibility of Icon-only Buttons
**Learning:** Using `div` with `onClick` for interactive elements like chat buttons or image upload triggers creates accessibility barriers for keyboard and screen reader users. Semantic `<button>` elements with `aria-label` and `focus-visible` styles are essential for a robust UX.
**Action:** Always refactor interactive `div` elements to `<button>` or `<a>` tags and ensure they have descriptive ARIA labels.
