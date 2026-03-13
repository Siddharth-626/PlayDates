## 2025-05-14 - Fix Hardcoded Firebase API Key
**Vulnerability:** Hardcoded sensitive credentials in version control.
**Learning:** Hardcoded API keys in configuration files are easily exposed. For Next.js client-side code, secrets must be prefixed with `NEXT_PUBLIC_` and accessed via `process.env`.
**Prevention:** Use environment variables for all sensitive configuration and ensure `.env` files are in `.gitignore`.
