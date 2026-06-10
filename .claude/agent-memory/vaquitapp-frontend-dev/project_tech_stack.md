---
name: project-tech-stack
description: VaquitApp frontend tech stack, design tokens and folder conventions
metadata:
  type: project
---

Frontend: React + TypeScript + Tailwind CSS v4.2.2, bootstrapped with Vite.

**Design tokens (hard-coded hex, not Tailwind color names):**
- Background: #0F172A (pages) / #0A1020 (inner panels)
- Primary: #10B981 (emerald)
- Secondary: #3B82F6 (blue)
- Error: #EF4444
- Text: white (hierarchy via opacity — white, white/70, white/55, white/40)

**Folder structure:** /src/{context, components, pages, hooks, services, assets, utils, types}

**Icons:** Bootstrap Icons via `<i className="bi bi-{name}" />` — never inline SVG.

**Why:** User confirmed this structure is established and stable.

**How to apply:** Always check existing patterns before proposing new ones. The design system is strict — never introduce new brand colors outside the four above.
