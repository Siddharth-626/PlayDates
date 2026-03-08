## 2025-05-14 - [Auth flow accessibility and feedback]
**Learning:** Authentication flows were missing `<form>` wrappers, preventing standard keyboard "Enter" key submission. Additionally, async authentication operations lacked loading states, leaving users without visual feedback during network requests.
**Action:** Always wrap input fields in a `<form>` for accessibility and implement `isLoading` states with spinners for all async submission buttons.
