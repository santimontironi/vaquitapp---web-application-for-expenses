---
name: pattern-pill-secondary-action
description: Tailwind class pattern for secondary action buttons (e.g. "Editar") that live inside badge rows on cards, must be visible at rest without competing with the primary CTA
metadata:
  type: project
---

When a card has a row of small uppercase pill badges (role badges, "Ver grupo" CTA, etc.)
and needs an additional secondary ACTION button (like "Editar grupo" for admins), style it
as a pill matching the badge family rather than a low-contrast icon-only button.

**Pattern (lavender, interactive action pill):**
```
flex items-center gap-1.5 bg-[#BC96E6]/15 border border-[#BC96E6]/30 text-[#BC96E6]
text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide
hover:bg-[#BC96E6]/25 hover:border-[#BC96E6]/50 active:scale-[0.98]
transition-all duration-150 cursor-pointer
```
Pair with a small bootstrap icon (`text-[10px]`) + short label text (e.g. "Editar").

**Why:** A 28x28px icon-only button at `text-white/35` (only visible on hover) was
reported as "barely visible" by the user. Lifting it to the same visual family as
existing badges (`Admin`, `Ver grupo` — `text-[10px] font-bold px-2.5 py-1 rounded-full
uppercase tracking-wide`) but with lavender at 15% bg / 30% border at REST (not just on
hover) makes it discoverable immediately while staying clearly secondary to amber CTAs
like "Ver grupo".

**How to apply:**
- Used in `frontend/src/components/groups/MyGroupCard.tsx` for the admin-only "Editar"
  button inside the bottom strip (`px-5 py-4 bg-[#FFD166]/8 border-t border-[#FFD166]/15`).
- Reuse this pattern anywhere a secondary action (edit, manage, settings) needs to sit
  next to role/status badges or amber highlight badges inside a clickable `<Link>` card.
  Always keep `e.preventDefault(); e.stopPropagation()` on the button's onClick when the
  parent is a Link.
- Do not use this lavender-pill treatment for purely informational badges — reserve it
  for things the user can click to take an action.
- Reminder: amber (`#FFD166`) usage on card borders/strips/CTAs in this app is the
  user's intentional choice — don't repurpose amber for action buttons.
