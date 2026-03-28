## 2025-05-15 - [Accessibility: Nested interactive elements]
**Learning:** Nesting interactive elements like a `span` with an `onClick` inside a `button` is an accessibility anti-pattern. It can lead to redundant event triggers and confuses screen readers, as the button already captures the click event for the entire area.

**Action:** Always ensure that buttons do not contain other interactive elements. Move any click logic to the parent button and use non-interactive elements for visual structure within the button.

## 2025-05-15 - [Accessibility: Semantic Buttons]
**Learning:** Using `div` or `span` with `onClick` for interactive actions is a common anti-pattern in this app. These elements lack native keyboard support and are not correctly identified by assistive technologies as actionable.

**Action:** Refactor interactive `div` and `span` elements to semantic `<button>` elements. Ensure they have an `aria-label` for icon-only buttons and proper focus styles for keyboard navigation.
