---
name: pattern-mygroupcard-premium
description: Visual refinements applied to MyGroupCard.tsx (group card) — amber border modulation, image overlay depth, no-image variant texture, and description label treatment
metadata:
  type: project
---

Refinements applied to `frontend/src/components/groups/MyGroupCard.tsx` to elevate the
group card without losing its intentional amber identity (see
[[feedback-amber-design-intentional]] in user auto-memory — amber border/strip/CTA on
this card is the user's deliberate choice, never convert to lavender/neutral).

**Border + glow modulation (rest vs hover):**
```
border border-[#FFD166]/60 shadow-[0_0_24px_rgba(255,209,102,0.10)]
hover:shadow-[0_0_36px_rgba(255,209,102,0.18)] hover:border-[#FFD166]/80
```
Rest state softened from `/80` → `/60` so it "breathes" better in a grid; hover
intensifies both border and glow together for a satisfying focus effect. Still clearly
amber at all times.

**Image variant overlay:**
- Gradient changed from `via-[#210B2C]/40 to-transparent` → `via-[#210B2C]/50
  to-[#210B2C]/5` for richer depth and better title legibility against bright photos.
- Title gets `tracking-tight` + `group-hover:text-[#FFD166] transition-colors
  duration-200` — a subtle amber glow-up on hover that ties the title to the card's
  amber identity without adding new chrome.

**No-image variant — added character:**
- Subtle decorative grid texture behind content: `absolute inset-0 opacity-[0.06]
  [background-image:linear-gradient(#BC96E6_1px,transparent_1px),linear-gradient(90deg,#BC96E6_1px,transparent_1px)]
  [background-size:24px_24px] pointer-events-none` — very faint lavender grid lines,
  echoes the "technical" feel without competing with content.
- Initial avatar (`w-16 h-16 rounded-2xl bg-[#BC96E6]/20 border border-[#BC96E6]/30`)
  gains `group-hover:border-[#BC96E6]/50 transition-colors duration-200`.
- Decorative blur glow gains `group-hover:bg-[#BC96E6]/15` (from static `/10`).
- Title gets `tracking-tight` + `mb-1.5` (was `mb-1`) for slightly more breathing room.

**Description text — removed literal "Descripción: " prefix:**
Both variants previously rendered `<p>Descripción: <span className="text-white/65">...`
with the label in full-white plain text — looked unpolished/unfinished.
- **No-image variant**: prefix removed entirely, description now just
  `text-white/60 text-sm leading-relaxed line-clamp-2` directly under the title (title +
  description read as one block, label was redundant here since it sits right under the
  group name).
- **Image variant** (separate block below the photo): converted the label into a proper
  micro-label matching the rest of the app —
  `text-xs uppercase tracking-wider font-semibold text-white/40 mb-1.5` reading
  "Descripción", with the description text below at `text-white/65 text-sm
  leading-relaxed line-clamp-2`. This variant has more vertical room so the label adds
  useful structure rather than clutter.

**Untouched per constraints:**
- Bottom strip (`bg-[#FFD166]/8 border-t border-[#FFD166]/15`), role badges, "Ver grupo"
  amber pill, "Desde {date}" row — all unchanged.
- "Editar" lavender pill — see [[pattern-pill-secondary-action]], not modified.
- No new entrance animations (parent `MyGroups.tsx` already handles stagger via
  `motion.div`).
