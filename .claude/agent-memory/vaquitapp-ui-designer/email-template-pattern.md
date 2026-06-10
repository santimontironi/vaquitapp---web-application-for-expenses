---
name: email-template-pattern
description: Pattern for HTML transactional emails (e.g. account confirmation) — inline styles only, table layout, brand colors
metadata:
  type: project
---

VaquitApp transactional emails live in `backend/utils/emailTemplates.js` (ES module), exported as functions like `getConfirmAccountEmailHtml(username, urlConfirmed)` that return a full HTML string. Controllers (e.g. `backend/controllers/auth.controller.js`) import the function and pass the result as `mailOptions.html`, keeping `mailOptions.text` as a plain-text fallback.

**Why:** Email clients (Gmail, Outlook) don't support Tailwind/external CSS or web fonts reliably — every style must be inline, layout via `<table role="presentation">`, max-width ~600px centered.

**How to apply for future email templates:**
- Inline styles only, no `<style>` blocks beyond a hidden preheader `div`.
- `font-family: 'Outfit', 'Segoe UI', Arial, sans-serif` (Outfit won't load in most clients but is kept as the first preference for clients that support web fonts).
- Outer body bg slightly darker than card (`#160720`) so the `#210B2C` card "floats" with `border:1px solid rgba(255,255,255,0.08)` and `border-radius:20px`.
- Brand mark: circular badge `background-color:rgba(188,150,230,0.12); border:1px solid rgba(188,150,230,0.25)` containing a 🐄 emoji (no hosted logo image available — local assets in `frontend/src/assets`/`frontend/public/images` aren't publicly reachable URLs, so emoji mascot is the safe choice).
- Eyebrow label uppercase lavender `#BC96E6`, heading white bold ~26px.
- CTA button: `background-color:#BC96E6` pill/rounded `<a>` with `color:#210B2C; font-weight:700`.
- Expiration notice: pill with `background-color:rgba(255,209,102,0.1); color:#FFD166; font-weight:600` — amber reserved for this kind of "important data/alert" per [[color-rebalance-decisions]].
- Always include the raw URL as visible text/link below the button (lavender `#BC96E6` underlined) for when the button doesn't render.
- Footer: muted white text (`rgba(255,255,255,0.3-0.35)`) with "ignore if you didn't request this" + copyright line, separated by a 1px `rgba(255,255,255,0.08)` divider.
