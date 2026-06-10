---
name: group-cover-banner-pattern
description: LinkedIn-style cover banner pattern for Group.tsx — full-width, two variants (with/without image), back button floating inside
metadata:
  type: project
---

The Group page header uses a full-width cover-photo banner (h-48 md:h-64, rounded-2xl) with two variants.

**With image variant:**
- `<img>` fills the banner via `absolute inset-0 w-full h-full object-cover`
- Two gradient overlays stacked: `bg-gradient-to-t from-[#210B2C] via-[#210B2C]/60 to-transparent` + `bg-gradient-to-r from-[#210B2C]/50 to-transparent`
- Banner border: `border border-white/10`
- Group name uses `font-black text-3xl md:text-4xl tracking-tight drop-shadow-lg` anchored at `absolute bottom-0 left-0 right-0 px-6 pb-6`

**Without image variant:**
- Background: `bg-gradient-to-br from-[#BC96E6]/20 via-[#210B2C] to-[#210B2C]` + bottom fade overlay
- Decorative concentric circles (right side) in `border-[#BC96E6]/10`, `border-[#BC96E6]/8`, `border-[#BC96E6]/6`
- A vertical hairline at `left-1/2` using `bg-gradient-to-b via-[#BC96E6]/20`
- Circular icon placeholder `w-16 h-16 md:w-20 md:h-20 rounded-full bg-[#BC96E6]/10 border border-[#BC96E6]/20` absolute-positioned right side, vertically centered
- Banner border: `border border-[#BC96E6]/15`
- Group name: same `font-black text-3xl md:text-4xl tracking-tight` at bottom-left

**Back button (both variants):**
- `absolute top-4 left-4` inside the banner `relative` container
- `bg-[#210B2C]/60 hover:bg-[#210B2C]/80 backdrop-blur-sm border border-white/10 hover:border-white/20 rounded-xl px-3 py-1.5 text-sm`
- Text color: `text-white/70 hover:text-white`

**Layout split:**
- Banner lives in its own `max-w-7xl mx-auto px-4 md:px-6 xl:px-8 pt-6 pb-0` wrapper
- Main content (SideNavGroup + panel) in a second `max-w-7xl mx-auto px-4 md:px-6 xl:px-8 py-0 pb-6` wrapper
- The `mb-8` sits on the banner div itself, creating separation before the content grid

**Why:** User requested a LinkedIn cover photo aesthetic — wide banner, text overlaid at the bottom, back button floating inside the banner frame, clearly distinct from the old small icon + text-beside layout.

**How to apply:** Use this exact pattern any time a "group profile" or "entity cover" header is needed. The two-variant conditional (`groupById?.image ? ... : ...`) is the standard approach for optional images in VaquitApp.
