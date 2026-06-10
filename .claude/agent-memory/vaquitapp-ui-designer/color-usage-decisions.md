---
name: color-usage-decisions
description: Specific color assignments for VaquitApp — financial data, role badges, plan states, balance displays, interactive surfaces
metadata:
  type: project
---

## Financial / Monetary Data — `#FFD166` (amber)
- Expense amounts in ExpenseCard: `text-[#FFD166] font-bold text-base`
- Balance debt amounts in PlanDetail: `text-[#FFD166] font-bold text-base`
- Completed expense amounts: `text-[#FFD166] font-bold text-sm`
- Amount input in CreateExpense: `text-[#FFD166] font-bold text-lg`
- ExpenseCard receipt icon container: `bg-[#FFD166]/10` with icon `text-[#FFD166]`
- Balance section header icon container: `bg-[#FFD166]/10` with icon `text-[#FFD166]`

## Role Badges
- Admin badge: `bg-[#BC96E6]/15 text-[#BC96E6] text-xs font-semibold px-2.5 py-1 rounded-full` (brand lavender)
- Member badge: `bg-white/10 text-white/60 text-xs font-medium px-2.5 py-1 rounded-full` (neutral)
- Admin indicator dot on avatar: `bg-[#BC96E6]` with inner icon `text-[#210B2C]`

## Plan State Badges
- Active: `bg-[#BC96E6]/15 text-[#BC96E6]` (lavender — NOT emerald, keeps brand omnipresent)
- Completed: `bg-[#BC96E6]/15 text-[#BC96E6]`
- Cancelled: `bg-white/10 text-white/40`

## Balance / Settlement States
- All settled (no debts): icon `text-emerald-400`, container `bg-emerald-500/10`
- Has debts: amounts in `text-[#FFD166]`
- "Saldar todos" button: `border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10`

## Confirmation / Status Pages (ConfirmUser, AcceptInvitation)
- Success state: `bg-emerald-500/10` container, `text-emerald-400` icon
- Error state: `bg-red-500/10` container, `text-red-400` icon
- Success for group join (AcceptInvitation): `bg-[#BC96E6]/10` container, `text-[#BC96E6]` icon (brand color used for positive group-related action)

## Interactive Element Surfaces
- Section icon containers: `bg-[#BC96E6]/15` (brand tint)
- Gastos section header icon: `bg-[#FFD166]/10 text-[#FFD166]` (financial section = amber)
- Balances section header icon: `bg-[#FFD166]/10 text-[#FFD166]` (financial)
- ExpenseCard icon: `bg-[#FFD166]/10` (financial)
- History/completed icon: `bg-[#BC96E6]/15 text-[#BC96E6]` (lavender — NOT grey anymore)
- Delete buttons: `bg-red-500/10 border-red-500/20 text-red-400 hover:bg-red-500/20`
- Grant admin buttons: `bg-[#BC96E6]/10 border-[#BC96E6]/20 text-[#BC96E6] hover:bg-[#BC96E6]/20`

## Avatar Initials
- Standard avatar: `bg-[#BC96E6]/20 flex items-center justify-center` with `text-[#BC96E6] font-semibold`
- Avatar sizes: `w-6 h-6` (compact list), `w-7 h-7` (stacked in PlanItem), `w-8 h-8` (balance rows), `w-9 h-9` (header), `w-10 h-10` (member detail), `w-11 h-11` (desktop MemberItem)

## Empty State Icons
- All empty state icon containers: `bg-[#BC96E6]/10` (NOT bg-white/[0.05] grey)
- All empty state icon colors: `text-[#BC96E6]/40` or `text-[#BC96E6]/50`
- Exception: financial empty states (expenses list) use `bg-[#FFD166]/10 text-[#FFD166]/40`
- Exception: successful settlement empty state uses `bg-emerald-500/10 text-emerald-400`

## Image Upload Areas (dashed borders)
- Border: `border-[#BC96E6]/20 border-dashed`
- Hover: `hover:bg-[#BC96E6]/[0.05] hover:border-[#BC96E6]/35`
- Upload icon placeholder: `bg-[#BC96E6]/10 text-[#BC96E6]/60`

## Hover States on Interactive Elements
- Back/nav buttons: `hover:text-[#BC96E6]/80`
- Icon buttons (back arrow boxes): `hover:text-[#BC96E6] hover:bg-[#BC96E6]/10 hover:border-[#BC96E6]/20`
- Modal close (X) buttons: `hover:text-[#BC96E6] hover:bg-[#BC96E6]/10 hover:border-[#BC96E6]/20`
- Logout button: `hover:bg-[#BC96E6]/[0.08] hover:text-[#BC96E6]/80 hover:border-[#BC96E6]/25`
- Group card hover: `hover:border-[#BC96E6]/30` (replaces `hover:border-white/20`)
- Plan item hover: `hover:border-[#BC96E6]/25` (replaces `hover:border-white/15`)

## Count Badges (non-financial)
- Always use lavender: `bg-[#BC96E6]/15 border-[#BC96E6]/20 text-[#BC96E6]` (group count, member count, plan count, history count)
- NOT neutral grey for any count that represents brand content

## "Historial" / Secondary Action Buttons
- `border-[#BC96E6]/25 text-[#BC96E6] hover:bg-[#BC96E6]/10 hover:border-[#BC96E6]/40` (NOT grey/white)

## "Agregar gasto" Button (PlanDetail)
- Amber tint, NOT primary lavender: `bg-[#FFD166]/10 border-[#FFD166]/25 text-[#FFD166] hover:bg-[#FFD166]/20`
- **Why:** Opens a financial action modal, amber pre-signals the financial context

## Financial Label Text
- "Pagó: [username]" — username part: `text-[#FFD166]/60`
- "le debe a" connector in balance rows: `text-[#FFD166]/60`
- "Dividido entre:" names: `text-white/50` (slightly elevated from muted, not amber — secondary financial info)

## Dashboard Empty State Feature Pills
- `bg-[#BC96E6]/10 border-[#BC96E6]/20 text-[#BC96E6]/70 px-3 py-2 rounded-xl` (pill cards, not inline text spans)

**Why:** amber (`#FFD166`) reserved exclusively for money/amounts/financial data, lavender (`#BC96E6`) for identity/brand/organization/admin/navigation, emerald for positive outcomes (settled debts, confirmations), red for destructive actions. Never swap these semantic roles.
