---
name: component-variants
description: Interactive state variants for VaquitApp components — picker buttons, nav items, member toggles, plan cards
metadata:
  type: project
---

## MemberOption (plan member toggle)
- Active: `bg-[#BC96E6]/15 border-[#BC96E6]/30 text-[#BC96E6]` with inner avatar `bg-[#BC96E6]/25 text-[#BC96E6]`
- Inactive: `bg-white/[0.05] border-white/10 text-white/50 hover:bg-white/[0.09] hover:text-white/70 hover:border-white/20`
- Pattern: pill button with initial avatar + username + checkmark icon when active

## PaidByPicker buttons
- Same active/inactive pattern as MemberOption but includes radio-dot indicator (circle with filled dot)
- Active radio dot: `border-[#BC96E6]` outer, `bg-[#BC96E6] w-2.5 h-2.5 rounded-full` inner
- Inactive radio: `border-white/20` outer, no inner dot

## SplitPicker buttons
- Uses `bi-check-circle-fill text-[#BC96E6]` icon when selected, `bi-circle text-white/25` when not
- Same active/inactive bg/border/text as MemberOption

## PlanItem card
- Base: `bg-white/[0.04] border border-white/[0.08] rounded-xl overflow-hidden`
- Hover: `hover:bg-white/[0.07] hover:border-[#BC96E6]/25 transition-all duration-200 cursor-pointer group`
- Hover border is lavender (NOT white/15)
- With image: gradient overlay `bg-gradient-to-t from-[#210B2C]/80 to-transparent` — title over image
- Without image: icon+name header in card body, `bg-[#BC96E6]/15` icon container
- Member avatars: stacked with `-space-x-2`, `border-2 border-[#210B2C]` to create separation
- "Activo" badge: `bg-[#BC96E6]/15 text-[#BC96E6]` (NOT emerald — lavender keeps brand omnipresent)

## SideNavGroup nav button states
- Active: `bg-[#BC96E6]/15 text-[#BC96E6] border border-[#BC96E6]/20 rounded-xl`
- Inactive: `text-white/50 hover:text-white/80 hover:bg-white/[0.06] rounded-xl`
- Danger (leave group): `text-red-400/60 hover:text-red-400 hover:bg-red-500/[0.08]`
- Mobile icon buttons: `w-10 h-10 rounded-xl` (square, icon only)
- Desktop text buttons: `flex items-center gap-2.5 w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium`

## AddMember role radio cards
- Radio input hidden with `sr-only peer`
- Visible card: `peer-checked:border-[#BC96E6] peer-checked:bg-[#BC96E6]/10` using Tailwind peer modifier
- Inner icon container when checked: `peer-checked:bg-[#BC96E6]/20`
- Inner icon and text use `peer-checked:text-[#BC96E6]` to shift to lavender on selection
- Note: requires `className` on the label (not the input) to apply peer-checked styles

## MyGroupCard
- Card: `bg-white/[0.06] border border-white/10 rounded-2xl overflow-hidden hover:bg-white/[0.09] hover:border-[#BC96E6]/30 hover:scale-[1.01] transition-all duration-200`
- Hover border is lavender (NOT white/20) — brand identity bleeds into hover state
- Image placeholder area: `h-36 bg-[#BC96E6]/[0.07]` with centered icon
- Edit button (admin only): `w-8 h-8 rounded-lg bg-white/[0.07] border border-white/10 text-white/40 hover:text-[#BC96E6] hover:bg-[#BC96E6]/10 hover:border-[#BC96E6]/20`

## MemberItem — dual layout pattern
- Mobile (`flex md:hidden`): compact row, small avatars, icon-only action buttons
- Desktop (`hidden md:flex`): wider row with email shown, full action buttons

## Loader
- Uses `PropagateLoader` from react-spinners with `color="#BC96E6"` (brand lavender)
- Wrapper: `flex items-center justify-center py-8`

**Why:** Interactive states always use lavender `#BC96E6` tint for selected/active, neutral `white/[0.05-0.09]` for unselected/hover, and red tints for destructive actions. Consistent peer-checked pattern for radio-style selectors. See [[design-system-patterns]] for structural patterns.
