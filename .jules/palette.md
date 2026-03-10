## 2025-05-15 - Improving Responsiveness in Auth Flows

**Learning:** Replacing debounced submission logic with immediate 'isLoading' states and spinners significantly improves perceived performance. Users prefer immediate visual feedback over a silent delay, even if the actual operation takes the same amount of time. Additionally, wrapping authentication inputs in a `<form>` element is a critical accessibility "micro-win" that enables standard keyboard navigation (Enter key submission) that users instinctively expect.

**Action:** Always prefer reactive loading states (using `isLoading` and `disabled` props) over debouncing for primary action buttons. Ensure all authentication and search inputs are contained within semantic `<form>` elements to support keyboard users.
