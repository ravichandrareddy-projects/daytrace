---
name: Kinetic Editorial Dark
colors:
  surface: '#111317'
  surface-dim: '#111317'
  surface-bright: '#37393e'
  surface-container-lowest: '#0c0e12'
  surface-container-low: '#1a1c20'
  surface-container: '#1e2024'
  surface-container-high: '#282a2e'
  surface-container-highest: '#333539'
  on-surface: '#e2e2e8'
  on-surface-variant: '#c7c4d7'
  inverse-surface: '#e2e2e8'
  inverse-on-surface: '#2f3035'
  outline: '#908fa0'
  outline-variant: '#464554'
  surface-tint: '#c0c1ff'
  primary: '#c0c1ff'
  on-primary: '#1000a9'
  primary-container: '#8083ff'
  on-primary-container: '#0d0096'
  inverse-primary: '#494bd6'
  secondary: '#d0bcff'
  on-secondary: '#3c0091'
  secondary-container: '#571bc1'
  on-secondary-container: '#c4abff'
  tertiary: '#4cd7f6'
  on-tertiary: '#003640'
  tertiary-container: '#009eb9'
  on-tertiary-container: '#002f38'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#e1e0ff'
  primary-fixed-dim: '#c0c1ff'
  on-primary-fixed: '#07006c'
  on-primary-fixed-variant: '#2f2ebe'
  secondary-fixed: '#e9ddff'
  secondary-fixed-dim: '#d0bcff'
  on-secondary-fixed: '#23005c'
  on-secondary-fixed-variant: '#5516be'
  tertiary-fixed: '#acedff'
  tertiary-fixed-dim: '#4cd7f6'
  on-tertiary-fixed: '#001f26'
  on-tertiary-fixed-variant: '#004e5c'
  background: '#111317'
  on-background: '#e2e2e8'
  surface-variant: '#333539'
typography:
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 34px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 22px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.015em
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: -0.01em
  title-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 22px
    letterSpacing: -0.005em
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 15px
    fontWeight: '400'
    lineHeight: 22px
    letterSpacing: 0em
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
    letterSpacing: 0.005em
  body-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
    letterSpacing: 0.01em
  label-mono-lg:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 18px
    letterSpacing: -0.02em
  label-mono-md:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0em
  label-mono-sm:
    fontFamily: JetBrains Mono
    fontSize: 10px
    fontWeight: '500'
    lineHeight: 12px
    letterSpacing: 0.04em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 0.75rem
  margin: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 0.75rem
  space-lg: 1rem
  space-xl: 1.5rem
---

## Brand & Style

This design system establishes an intimate, hyper-refined personal operating system optimized for high-agency individuals who view their daily life through the lens of intentional focus, quiet mastery, and privacy. The design balances a Minimal Editorial structural discipline with a futuristic cyber-tactile sensibility: high-density metadata presented with pristine typographic restraint, muted deep-charcoal fields, and razor-sharp spectral signals.

The aesthetic rejects both over-saturated gamification and lifeless corporate dashboard templates. Interactions feel silent, instantaneous, and weightless. Surfaces are calibrated to recede into the hardware frame, letting timelines, financial flows, temporal trackers, and contextual intelligence take precedence without sensory fatigue.

## Colors

The color architecture relies on an ink-dense neutral canvas with precisely coded chromatic indicators for cognitive scanning:

- **Neutral Foundations**: Deep Zinc background (`#0F1115`), elevated slate surface tier 1 (`#181B20`), elevated slate surface tier 2 (`#21252C`), structural stroke/divider (`#272B33`), and muted text tracks (`#94A3B8` secondary, `#64748B` tertiary, `#F8FAFC` primary high-contrast). In light mode, the system flips to warm porcelain (`#F8F9FA`) with pure white card surfaces (`#FFFFFF`) and hairline zinc borders (`#E5E7EB`).
- **Core Signal**: Indigo / Electric Cobalt (`#6366F1` dark, `#4F46E5` light) functions as the structural anchor for active states, key CTAs, and selected tab markers.
- **Domain Indicators**:
  - **Emerald** (`#10B981`): Completed tasks, positive deltas, affirmative confirmations.
  - **Amber / Warm Sand** (`#F59E0B`): In-progress rituals, time-sensitive horizons, warnings.
  - **Rose** (`#F43F5E`): Debit transactions, expenses, urgent critical alerts.
  - **Violet** (`#8B5CF6`): Synthetic intelligence synthesis, memory capture, reflective notes.
  - **Cyan** (`#06B6D4`): Deep focus, skill acquisition, physiological tracking.

Never use domain colors for decorative gradients or raw background fills. Apply them exclusively as hairline indicators, pill accents, badge micro-fills (at 10-15% opacity), and tabular metrics.

## Typography

The typographic engine marries the crisp, geometric legibility of Plus Jakarta Sans with the technical precision of JetBrains Mono. 

- **Primary Proportional (Plus Jakarta Sans)**: Governs display titles, structural navigational hierarchy, long-form thoughts, and card headers. The tight negative tracking in display weights yields an authoritative editorial tone.
- **Data & Metric Monospace (JetBrains Mono)**: Mandatory for all numbers, timestamps (e.g., `07:45:12`), durations (`+42m`), calendar day grids, and financial ledgers (`₹4,850.00`). Monospaced tabular numerals prevent layout jitter during dynamic live updates and allow effortless vertical column alignment.

## Layout & Spacing

Designed strictly around the standard 390x844 Android viewport using an absolute 4px-base increment rhythm (4, 8, 12, 16, 20, 24, 32, 40, 48px).

- **Screen Edges & Safe Areas**:
  - Top Safe Area (Status Bar): 44px top margin reserve.
  - Bottom Safe Area (Gesture Bar): 34px bottom padding reserve.
  - Lateral Screen Padding: Fixed 16px (`margin`) gutter across all primary mobile views.
- **Component Geometry**: Internal card padding alternates between 12px (`space-md`) for compact telemetry rows and 16px (`space-lg`) for interactive modules.
- **Touch Ergonomics**: All interactive elements must adhere to a strict minimum bounding box of 44x44px (with 48px standard for primary actions), even when visual label dimensions are smaller.

## Elevation & Depth

Visual separation relies on a combination of tonal layering, glass-frosted toolbars, and razor-thin hairline borders rather than heavy, muddy drop shadows:

- **Level 0 (Base Canvas)**: Pure deep zinc `#0F1115`.
- **Level 1 (Cards & Feed Surfaces)**: Surface `#181B20` bounded by a 1px uniform perimeter stroke of `#272B33`. No drop shadow.
- **Level 2 (Active Sheets & Modals)**: Surface `#21252C` with a 1px top highlight stroke (`rgba(255, 255, 255, 0.08)`) and an ultra-diffused ambient shadow (`box-shadow: 0 16px 32px -8px rgba(0, 0, 0, 0.60)`).
- **Level 3 (Sticky Navigation & Floating Island Dock)**: Surface `#181B20` rendered at 85% opacity with `backdrop-filter: blur(16px)` and a subtle 1px perimeter glow (`#272B33`).

## Shapes

The design system employs a calibrated concentric radius hierarchy:

- **24px (`rounded-2xl`)**: Bottom sheets, modal dialog containers, and floating system navigation bars.
- **16px (`rounded-xl` / standard card)**: Primary timeline blocks, metric cards, and dashboard tiles.
- **12px (`rounded-lg`)**: Nested child containers, input fields, and action buttons.
- **8px (`rounded-md`)**: Checkbox toggles, utility icons, and sub-action triggers.
- **9999px (`rounded-full` / Pill)**: Status indicator chips, category filter tags, and running timer badges.

## Components

### Buttons
- **Primary**: Solid Cobalt (`#6366F1`), text `#FFFFFF` in semi-bold 14px, 12px radius, 48px height. Active pressed state scales down to `0.98` with an inner glow.
- **Secondary / Ghost**: Flat slate surface (`#181B20`) with 1px border (`#272B33`), text `#F8FAFC`.
- **Destructive**: Hairline Rose border (`rgba(244, 63, 94, 0.3)`) with 10% Rose tint fill, text `#F43F5E`.

### Cards & Timeline Tiles
- Composed of `#181B20` surface with 1px `#272B33` outline and 16px radius.
- Cards incorporate a dedicated micro-header holding a JetBrains Mono category chip (e.g., `GROWTH // DEEP WORK`) left-aligned, and dynamic tabular timestamps (`14:30`) right-aligned.

### Chips & Filter Pills
- Fully rounded (`9999px`), 28px height, 10px horizontal padding. JetBrains Mono 11px uppercase typography.
- Active state uses subtle primary/domain background tint (15% opacity) with a solid 1px active accent border. Inactive state rests on `#181B20` with `#272B33` border.

### Inputs & Search Bars
- 48px height, 12px radius, background `#121418`, border 1px `#272B33`.
- Placeholder text `#64748B`. Focus transitions to a sharp 1px `#6366F1` outline with zero exterior shadow bloom.

### Checkboxes & Segmented Controls
- Checkboxes: 20x20px with 6px corner radius, hairline `#272B33` frame. Checked state triggers a crisp emerald `#10B981` fill with a micro white checkmark.
- Segmented tab tracks: Embedded `#121418` frame containing sliding active indicator cards with `#181B20` background and 1px `#272B33` outline.

### Metric & Ledger Row (Specialized Component)
- Horizontal dual-zone item: Left zone displays item description in Plus Jakarta Sans 14px; right zone displays monetary value (`₹1,240.00`) or duration tally in JetBrains Mono 14px tabular numerals with Rose or Emerald delta signifiers.