---
name: swal-theming-pattern
description: Global SweetAlert2 (Swal) theming pattern using CSS classes in index.css + customClass/buttonsStyling per call
metadata:
  type: project
---

All `Swal.fire` calls across the app (9 calls in 7 files: Register.tsx, ExpenseCard.tsx,
PlanDetail.tsx, AddMember.tsx, AllPlans.tsx, AllMembers.tsx x2, SideNavGroup.tsx x2) were
restyled to match the VaquitApp dark/lavender/amber design system. Theming lives in
`frontend/src/index.css`, appended after the existing animation block (`anim-fade-up`,
scrollbar, `::selection`) — do not remove that block when editing this area again.

## CSS classes added to index.css
- `.va-swal-popup` — panel: `bg-[#210B2C]`, `border-white/10`, `rounded-2xl` (16px),
  deep shadow, Outfit font.
- `.va-swal-title` — white, semibold, 1.25rem, tracking-tight.
- `.va-swal-text` — `text-white/60`, used on `htmlContainer`.
- `.swal2-container.swal2-backdrop-show` (global, no class needed per-call) — dark
  `rgba(33,11,44,0.85)` backdrop with `backdrop-filter: blur(6px)`. SweetAlert2's
  `customClass` interface has NO `backdrop` key, so this MUST be a global selector,
  not passed via `customClass`.
- Icon color overrides for `.swal2-icon.swal2-warning/error/question/success` to match
  brand palette (amber/red/lavender/emerald) instead of Swal defaults.
- `.swal2-timer-progress-bar` — lavender tint `rgba(188,150,230,0.55)` instead of default blue.

## Button variants (require `buttonsStyling: false` on every call that uses them)
- `.va-swal-confirm` — standard confirm: `bg-[#BC96E6]` + `text-[#210B2C]` (lavender,
  dark text). Used for: success/info confirms, "dar admin", "marcar plan completado",
  "entendido" (error single-button).
- `.va-swal-confirm-amber` — append alongside `.va-swal-confirm` for financial/important
  actions (e.g. "saldar todos los gastos"). `bg-[#FFD166]` + `text-[#210B2C]` — this was
  the original contrast bug (white text on amber) and is now fixed.
- `.va-swal-confirm-danger` — append for destructive actions (delete expense, delete
  member, leave group). `bg-[#EF4444]` + `text-white` (red with white text is fine per
  contrast rules).
- `.va-swal-cancel` — ghost button: `bg-white/[0.06]`, `border-white/16`, `text-white/75`,
  hover brightens to `white/10` / `border-white/28` / `text-white/90`.
- All confirm/cancel buttons: `rounded-xl` (0.75rem), `active:scale-[0.98]` via CSS
  `transform: scale(0.98)` on `:active`, focus ring `rgba(188,150,230,0.35)`.

## Usage pattern per call
```ts
Swal.fire({
  // ...title/text/icon/logic — UNCHANGED
  buttonsStyling: false, // only needed if confirmButton/cancelButton classes used
  customClass: {
    popup: "va-swal-popup",
    title: "va-swal-title",
    htmlContainer: "va-swal-text",
    confirmButton: "va-swal-confirm", // or "va-swal-confirm va-swal-confirm-amber" / "...-danger"
    cancelButton: "va-swal-cancel", // omit if showCancelButton is false
  },
})
```

Removed all hardcoded `background`, `color`, `confirmButtonColor`, `cancelButtonColor`
props — fully replaced by the CSS classes above. Only visual props were touched; titles,
texts, icons, `showCancelButton`, `timer`, `reverseButtons`, and all `result.isConfirmed`
logic remained untouched.

## Color choice per call (decision record)
- Register.tsx: success + timer, no buttons → just popup/title/text classes.
- ExpenseCard.tsx delete: destructive → `va-swal-confirm-danger` + cancel.
- PlanDetail.tsx "saldar todos los gastos": financial bulk action → `va-swal-confirm-amber`
  (this was the original `confirmButtonColor: "#FFD166"` with broken white-text contrast).
- AddMember.tsx invite success: standard → `va-swal-confirm` only (no cancel).
- AllPlans.tsx "marcar plan completado": status change, not strictly financial →
  standard `va-swal-confirm` (was amber before, downgraded to lavender for consistency
  since it's not a money-amount action).
- AllMembers.tsx "dar admin": standard → `va-swal-confirm` + cancel.
- AllMembers.tsx "eliminar miembro": destructive → `va-swal-confirm-danger` + cancel.
- SideNavGroup.tsx "no podés abandonar" (error, single button): standard →
  `va-swal-confirm` only.
- SideNavGroup.tsx "abandonar grupo": destructive → `va-swal-confirm-danger` + cancel.
