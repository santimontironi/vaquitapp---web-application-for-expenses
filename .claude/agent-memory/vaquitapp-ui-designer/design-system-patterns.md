---
name: design-system-patterns
description: Established Tailwind class patterns for all core VaquitApp components — cards, modals, buttons, inputs, headers, section panels
metadata:
  type: project
---

## Auth Pages (Login, Register)
- Full page: `min-h-screen bg-[#210B2C] flex items-center justify-center px-4 py-12`
- Card container: `w-full max-w-md`
- Brand header: `flex items-center gap-3 justify-center mb-10` with logo `w-10 h-10 rounded-xl overflow-hidden`
- Form card: `bg-white/[0.06] border border-white/10 rounded-2xl p-6 md:p-8 backdrop-blur-sm`
- Footer link line: `text-center text-white/40 text-sm mt-6` with `text-[#BC96E6] hover:text-[#BC96E6]/80 font-medium transition-colors duration-150`

## Section Panel Cards (AllMembers, AddMember, AllPlans, CreatePlan)
- Outer card: `bg-white/[0.06] border border-white/10 rounded-2xl p-5`
- Section divider: `border-t border-white/[0.07] mb-4`
- Section header icon: `w-8 h-8 rounded-xl bg-[#BC96E6]/15 flex items-center justify-center flex-shrink-0` with `text-[#BC96E6] text-sm`

## Modals (EditGroupModal, CreateExpense, PlanHistory)
- Fixed overlay: `fixed inset-0 z-50 flex items-center justify-center p-4`
- Backdrop: `absolute inset-0 bg-[#210B2C]/80 backdrop-blur-md`
- Panel wrapper: `relative w-full max-w-md z-10`
- Panel: `bg-[#210B2C] border border-white/10 rounded-2xl p-6 shadow-2xl`
- Modal close button: `w-8 h-8 flex items-center justify-center rounded-xl bg-white/[0.07] border border-white/10 text-white/40 hover:text-white/70 hover:bg-white/[0.12] transition-all duration-150 cursor-pointer`
- Scrollable modals: use `max-h-[85vh] flex flex-col` on panel with `overflow-y-auto` on content area

## Inputs
- Standard: `w-full bg-white/[0.08] border border-white/20 rounded-xl px-4 py-3 text-white placeholder:text-white/30 text-sm focus:outline-none focus:border-[#BC96E6] focus:ring-1 focus:ring-[#BC96E6]/40 transition-colors duration-150`
- With icon: add `pl-10` and absolute icon `left-3.5 top-1/2 -translate-y-1/2 text-white/30 text-sm pointer-events-none`
- Textarea: same as input + `resize-none`
- Amount input (financial): `text-[#FFD166] font-bold text-lg` (emphasize monetary value)
- Field label: `text-xs font-semibold tracking-wider uppercase text-white/40`

## Primary Button
- `w-full bg-[#BC96E6] text-[#210B2C] font-semibold rounded-xl px-5 py-3 flex items-center justify-center gap-2 hover:bg-[#BC96E6]/90 active:scale-[0.98] transition-all duration-150 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed`
- Loading spinner inside: `w-4 h-4 border-2 border-[#210B2C]/30 border-t-[#210B2C] rounded-full animate-spin`

## Ghost/Secondary Button
- `inline-flex items-center gap-2 border border-white/20 text-white/80 rounded-xl px-6 py-3 hover:bg-white/[0.07] hover:border-white/30 transition-all duration-150 cursor-pointer`

## Error/Alert Banners
- Error: `flex items-center gap-2 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-xl px-4 py-3`
- Success state: icon `text-emerald-400`, container `bg-emerald-500/10`
- Field error text: `flex items-center gap-1.5 text-red-400 text-xs`

## HeaderDashboard
- `bg-[#210B2C] border-b border-white/10 sticky top-0 z-30`
- Inner: `max-w-screen-xl mx-auto px-4 md:px-6 xl:px-8 h-16 flex items-center justify-between gap-4`
- Avatar: `w-9 h-9 rounded-full bg-[#BC96E6]/20 flex items-center justify-center border border-[#BC96E6]/30`

## Image upload label (dashed area)
- `flex items-center gap-4 bg-white/[0.05] border border-white/15 border-dashed rounded-xl px-5 py-4 cursor-pointer hover:bg-white/[0.08] hover:border-white/25 transition-all duration-150`
- Icon container inside: `w-12 h-12 rounded-xl bg-white/[0.07] flex items-center justify-center flex-shrink-0`
- Hidden file input: `className="hidden"`

## List rows (members, expenses, balance items)
- Standard row: `flex items-center gap-3 bg-white/[0.04] border border-white/[0.07] rounded-xl px-4 py-3`
- Completed/muted row: `bg-white/[0.03] border border-white/[0.06]`

## Empty states
- Container: `flex flex-col items-center text-center py-10 gap-3`
- Icon box: `w-12 h-12 rounded-xl bg-white/[0.05] flex items-center justify-center`
- Icon: `text-white/20 text-xl`
- Text: `text-white/30 text-sm`

## SideNavGroup
- Desktop aside: `hidden md:block w-52 xl:w-56 flex-shrink-0`
- Desktop sticky card: `bg-white/[0.05] border border-white/10 rounded-2xl p-3 sticky top-24`
- Active nav item: `bg-[#BC96E6]/15 text-[#BC96E6] border border-[#BC96E6]/20`
- Inactive nav item: `text-white/50 hover:text-white/80 hover:bg-white/[0.06]`
- Danger nav item: `text-red-400/60 hover:text-red-400 hover:bg-red-500/[0.08]`
- Mobile bar: `flex md:hidden` with `bg-white/[0.05] border border-white/10 rounded-2xl p-2`

**Why:** See [[color-usage-decisions]] for color assignments and [[component-variants]] for interactive states.
