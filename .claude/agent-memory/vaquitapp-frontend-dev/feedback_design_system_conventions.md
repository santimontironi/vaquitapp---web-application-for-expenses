---
name: feedback-design-system-conventions
description: Established visual conventions for VaquitApp frontend — gradient backgrounds, card interiors, green visibility rules
metadata:
  type: feedback
---

Fondo de páginas: siempre `bg-linear-to-br from-[#162791] via-[#0e1a78] to-[#060d45]`, nunca color plano.

Interior de cards glassmorphism: `bg-[#0a1260]/80` a `/90`, nunca `bg-[#0f1f7a]` ni `bg-[#012660]`.

Sombras radiales de ambiente: opacidad `0.26-0.28` para verde `#26B170`, y `0.12` para azul `#3B82F6` (no blanco/05).

Líneas decorativas de ambiente: `/50` en las horizontales principales, `/35-/40` en las diagonales y verticales.

Separadores dentro de cards: `bg-linear-to-r from-transparent via-[#26B170]/30-/40 to-transparent`, nunca `via-white/8`.

Íconos de header de sección: `bg-[#26B170]/25 border border-[#26B170]/55 shadow-[0_0_14px_rgba(38,177,112,0.18)]`.

Badges de count/estado: `bg-[#26B170]/15 border border-[#26B170]/40 text-[#26B170]`, nunca `bg-white/8 border-white/18 text-white/55`.

Shine line superior de cards: `via-[#26B170]/70-/80`, no `/50-/60`.

Bordes de cards wrapper `p-px`: `from-[#26B170]/65-/70 via-white/12-/14 to-[#3B82F6]/50-/55`.

Botón historial en AllPlans: cambiar de azul a verde como acento principal.

**Why:** El problema reportado fue fondo plano y verde casi invisible. Estas convenciones aseguran identidad visual fuerte y verde prominente en toda la app.

**How to apply:** En cualquier nuevo componente o página, aplicar estos valores desde el inicio sin esperar correcciones.
