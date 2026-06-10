---
name: color-rebalance-decisions
description: Final color distribution rules after second rebalancing pass — 60% primary / 30% lavender / 10% amber
metadata:
  type: feedback
---

The color distribution has been set to a 60/30/10 split after two rounds of tuning. The first pass reduced lavender too aggressively (to ~25%), and the second pass (June 2026) restored it back more strongly to 30%.

**Why:** Lavender is the brand identity color — it must feel omnipresent as the platform's signature. Neutralizing too many elements makes the app feel cold and generic. Amber stays strictly at 10% to retain its "important data" pop.

**How to apply:** Follow these assignment rules in all future component work.

## Lavender (#BC96E6) — 30% — brand identity, interactive + decorative accent

### Interactive elements (always lavender):
- Primary CTA buttons (submit, create, confirm, save): `bg-[#BC96E6] text-[#210B2C]`
- Active/selected nav items in SideNavGroup (navBtnActive, mobileBtnActive)
- Input focus rings: `focus:border-[#BC96E6] focus:ring-[#BC96E6]/40`
- Selected member toggle buttons (MemberOption active, PaidByPicker active, SplitPicker active)
- Admin role badge: `bg-[#BC96E6]/15 text-[#BC96E6]`
- Avatar initials bg: `bg-[#BC96E6]/20 text-[#BC96E6]`
- Interactive links in auth pages ("Registrate", "Iniciá sesión"): `text-[#BC96E6]`
- "Historial" button in AllPlans (ghost): `border-[#BC96E6]/25 text-[#BC96E6] hover:bg-[#BC96E6]/10`
- Required field asterisks: `text-[#BC96E6]`
- Selected members count badge in CreatePlan: `bg-[#BC96E6]/15 text-[#BC96E6]`

### Decorative/structural elements (restored to lavender in second pass):
- Section icon containers (Miembros, Planes, Agregar miembro, Historial, Detalles, Nuevo plan, Editar grupo, Nuevo grupo): `bg-[#BC96E6]/15 text-[#BC96E6]`
- Upload area dashed borders: `border-[#BC96E6]/25 hover:border-[#BC96E6]/45 hover:bg-[#BC96E6]/[0.04]`
- Upload icon inside dashed area: `bg-[#BC96E6]/10 text-[#BC96E6]/60`
- Back button hover (Group, NewGroup link): `hover:text-[#BC96E6] hover:bg-[#BC96E6]/[0.08]`
- Back/close button hover in PlanDetail icon button: `hover:text-[#BC96E6] hover:bg-[#BC96E6]/[0.08] hover:border-[#BC96E6]/20`
- Close button hover in all modals (EditGroupModal, PlanHistory, CreateExpense): `hover:text-[#BC96E6] hover:bg-[#BC96E6]/[0.08] hover:border-[#BC96E6]/20`
- Group/plan image placeholder containers: `bg-[#BC96E6]/10 border-[#BC96E6]/20 text-[#BC96E6]` (MyGroupCard no-image, Group hero no-image, PlanDetail no-image)
- Plan member tags in PlanHistory rows: `bg-[#BC96E6]/10 text-[#BC96E6]/70`
- AcceptInvitation success icon container: `bg-[#BC96E6]/15 border-[#BC96E6]/30 text-[#BC96E6]` (brand moment — joining a group is a lavender success, not emerald)
- Empty state icons (AllMembers, AllPlans, PlanHistory empty): `bg-[#BC96E6]/10 text-[#BC96E6]/40`
- Dashboard empty state feature pills: `bg-[#BC96E6]/10 border-[#BC96E6]/20 text-[#BC96E6]/70`
- Ghost secondary buttons (ConfirmUser "Volver al registro", AcceptInvitation "Ingresar"): `border-[#BC96E6]/25 text-[#BC96E6]/70 hover:bg-[#BC96E6]/[0.08] hover:border-[#BC96E6]/40`
- Decorative dots flanking username in HeaderDashboard center: `bg-[#BC96E6]/50`
- PlanHistory plan row icon: `bg-[#BC96E6]/10 text-[#BC96E6]/60`
- Detalles section description left border in PlanDetail: `border-l-2 border-[#BC96E6]/30`

## Amber (#FFD166) — 10% — strictly financial data + counts + dates

- Expense amounts: `text-[#FFD166] font-bold`
- Balance amounts: `text-[#FFD166] font-bold`
- "le debe a" connector text: `text-[#FFD166]/60`
- "Pagó" username in expense cards: `text-[#FFD166]/60`
- Plan/group/member count badges: `bg-[#FFD166]/10 text-[#FFD166]`
- Plan state badges (Activo, Completado): `bg-[#FFD166]/10 text-[#FFD166]`
- Date metadata (joined date, creation date, plan date): `text-[#FFD166]/60` or `text-[#FFD166]/70`
- Username in HeaderDashboard center: `text-[#FFD166]`
- "Saldar todos" button icon (icon only): `text-[#FFD166]`
- Expense section icon + CTA button in PlanDetail: `bg-[#FFD166]/10 text-[#FFD166]` (expenses are financial = amber)
- Balances section icon in PlanDetail: `bg-[#FFD166]/10 text-[#FFD166]`
- Completed expenses count badge: `bg-white/[0.08] text-white/50` (neutral — saldado history is secondary)
- Decorative dot flanking username (right dot): `bg-[#FFD166]/60` on Login hero

## Neutral (white/opacity) — 60% base — backgrounds, structure, secondary text

- App background: `bg-[#210B2C]`
- Card surfaces: `bg-white/[0.06] border border-white/10 rounded-2xl`
- Secondary text: `text-white/40` to `text-white/60`
- Dividers: `border-white/[0.07]`
- Input backgrounds: `bg-white/[0.08] border-white/20`
- Muted surfaces: `bg-white/[0.04]`
- Completed expenses count badge: `bg-white/[0.08] text-white/50`
- "Historial de gastos saldados" section icon stays neutral: `bg-white/[0.06] text-white/35`
- PlanItem icon (no image): `bg-white/[0.06] text-white/40`
- Cancelled plan badge: `bg-white/10 text-white/40`

## Financial data — always amber regardless of other rules
- Never neutralize amounts, balances, "le debe a" text, or expense sums
