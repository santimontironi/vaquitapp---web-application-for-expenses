---
name: feedback-visual-intensity
description: User prefers very vivid, saturated visual effects — high-opacity gradients, pronounced glows, strong borders
metadata:
  type: feedback
---

The user explicitly requested a complete visual redesign because the UI felt "apagada" (dim/muted). They want an aesthetic closer to Linear, Vercel or Raycast.

**Rule:** Never use subtle opacities (0.05-0.18) for gradient backgrounds, card borders, icon backgrounds, or glow effects. Use the intense range instead.

**Why:** The default tendency to be conservative with opacities made the whole app feel flat and lifeless.

**How to apply:**
- Radial gradient backgrounds: use 0.40-0.55 opacity (not 0.10-0.22)
- Card border gradients (p-px wrappers): use 0.65-0.80 opacity (not 0.30-0.45)
- Icon background fills: use 0.18-0.25 opacity (not 0.08-0.12)
- Icon border: use 0.45-0.55 opacity (not 0.20-0.30)
- Box shadows with rgba color: use 0.45-0.70 for hover states (not 0.20-0.35)
- Glow drop-shadows on logos/icons: use 0.85-0.95 (not 0.45-0.65)
- Shine lines (via-color/XX): use 0.60-0.70 (not 0.25-0.35)
- Card inner blobs: use 0.10-0.14 opacity (not 0.04-0.06)
- Secondary text: use text-white/55 or text-white/60 (not text-white/30 or text-white/40) for supporting copy
- Loader: use #10B981 (emerald) color instead of white
