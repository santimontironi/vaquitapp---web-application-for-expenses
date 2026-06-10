---
name: login-hero-pattern
description: Premium Login page hero block design — gradient card with logo glow, decorative dots, separator, and tagline
metadata:
  type: project
---

The Login page brand hero was redesigned (June 2026) to feel visually striking as the first thing users see. It replaced a plain horizontal logo+text stack.

**Why:** The original hero was underwhelming — a small logo and plain text on a flat dark background. The goal was to make the entry point feel premium and immediately on-brand.

**How to apply:** Use this pattern for the Login page hero block. Do not apply to Register (which has a simpler context) unless explicitly asked.

## Final pattern

```tsx
{/* Brand hero */}
<div className="mb-10">
  <div className="bg-gradient-to-br from-[#BC96E6]/20 via-[#210B2C] to-[#FFD166]/10 border border-[#BC96E6]/30 rounded-2xl px-8 py-7 backdrop-blur-sm flex flex-col items-center text-center">
    {/* Logo with glow */}
    <div className="w-16 h-16 rounded-2xl overflow-hidden flex-shrink-0 mb-4 drop-shadow-[0_0_16px_rgba(188,150,230,0.45)]">
      <img src="images/logo.png" alt="VaquitApp Logo" className="w-full h-full object-cover" />
    </div>

    {/* App name with decorative dots */}
    <div className="flex items-center gap-2.5 mb-2">
      <span className="w-1.5 h-1.5 rounded-full bg-[#BC96E6]/60 inline-block" />
      <h1 className="text-white font-bold text-3xl tracking-tight drop-shadow-[0_0_12px_rgba(188,150,230,0.30)]">VaquitApp</h1>
      <span className="w-1.5 h-1.5 rounded-full bg-[#FFD166]/60 inline-block" />
    </div>

    {/* Tagline */}
    <p className="text-white/50 text-sm tracking-wide">Dividí gastos, no amistades.</p>

    {/* Decorative separator */}
    <div className="w-16 h-px bg-[#BC96E6]/40 mt-4" />
  </div>
</div>
```

## Key design decisions
- Container: `bg-gradient-to-br from-[#BC96E6]/20 via-[#210B2C] to-[#FFD166]/10` — lavender top-left to dark center to amber bottom-right, subtle depth
- Border: `border-[#BC96E6]/30` — reinforces lavender brand
- Logo: `w-16 h-16 rounded-2xl` (larger than before: was w-10) with `drop-shadow-[0_0_16px_rgba(188,150,230,0.45)]` for glow
- App name: `text-3xl font-bold tracking-tight` (was text-xl) with subtle `drop-shadow` glow
- Decorative dots: left = lavender `bg-[#BC96E6]/60`, right = amber `bg-[#FFD166]/60` — brand colors flanking the name
- Tagline: `text-white/50 text-sm tracking-wide` — elegant, muted
- Separator: `w-16 h-px bg-[#BC96E6]/40` — lavender thin line, centered
- The form card below is unchanged — only the hero block was redesigned

See [[color-rebalance-decisions]] for color usage rules.
