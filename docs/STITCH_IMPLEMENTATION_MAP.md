# DayTrace — Stitch Implementation Map

> Source of truth mapping: **Stitch HTML/CSS/JS reference → Flutter native implementation**

---

## Workspace Inventory

| # | Stitch Directory | Files | Animation ID | Theme | Type |
|---|---|---|---|---|---|
| 1 | `daytrace_today_active_rainbow_border_shimmer/` | `code.html` (35.7 KB), `screen.png` (228 KB) | **ANIMATION_49** | Theme 1 — Kinetic Editorial Light | Full Today UI + Shader |
| 2 | `daytrace_today_aurora_night_flow/` | `code.html` (36.9 KB), `screen.png` (312 KB) | **ANIMATION_53** | Theme 2 — Kinetic Editorial Dark | Full Today UI + Shader |
| 3 | `daytrace_today_aurora_white_flow/` | `code.html` (37.6 KB), `screen.png` (243 KB) | **ANIMATION_56** | Theme 3 — Aurora Light | Full Today UI + Shader |
| 4 | `shader_1/` | `code.html` (7.7 KB) | **ANIMATION_56** | Theme 3 — Aurora Light | Standalone Shader |
| 5 | `shader_2/` | `code.html` (7.7 KB) | **ANIMATION_53** | Theme 2 — Dark | Standalone Shader |
| 6 | `shader_3/` | `code.html` (6.9 KB) | **ANIMATION_49** | Theme 1 — Light | Standalone Shader |
| 7 | `kinetic_editorial_light/` | `DESIGN.md` (11.3 KB) | — | Theme 1 — Light | Design System |
| 8 | `kinetic_editorial_dark/` | `DESIGN.md` (9.9 KB) | — | Theme 2 — Dark | Design System |
| 9 | `image.png/` | `screen.png` (21.8 KB) | — | — | AI Prompt Widget Reference |

### Reference Screenshots
- `daytrace_today_active_rainbow_border_shimmer/screen.png` → Theme 1 Today visual reference
- `daytrace_today_aurora_night_flow/screen.png` → Theme 2 Today visual reference
- `daytrace_today_aurora_white_flow/screen.png` → Theme 3 Today visual reference

---

## Shader → Native Implementation Map

### ANIMATION_49 → Theme 1: Spectral Rainbow Border Flow

| Property | Value |
|---|---|
| **Stitch Source** | `shader_3/code.html`, `daytrace_today_active_rainbow_border_shimmer/code.html` |
| **Base Color** | `vec3(0.982, 0.980, 0.995)` → `#FAF9FE` porcelain white |
| **Technique** | `roundedBoxSDF` + `spectralPalette` (Inigo Quilez cosine palette) |
| **Noise** | 2D Simplex noise for organic ribbon distortion (`snoise`) |
| **Flow Speed** | `u_time * 0.22` |
| **Edge Behavior** | Glow hugs screen perimeter; concentrated at bottom border + corners |
| **Alpha Peak** | `clamp(totalEdgeWeight * 0.55 + ambientHaze, 0.0, 0.88)` |
| **Palette** | Cyan → Blue → Violet → Magenta → Peach → Yellow → Mint → Cyan |
| **Flutter Target** | `assets/shaders/spectral_border.frag` via `FragmentProgram` |

### ANIMATION_53 → Theme 2: Aurora Night (Dark/OLED)

| Property | Value |
|---|---|
| **Stitch Source** | `shader_2/code.html`, `daytrace_today_aurora_night_flow/code.html` |
| **Base Color** | `vec3(0.043, 0.055, 0.078)` → `#0B0E14` OLED pitch-dark |
| **Technique** | `roundedBoxSDF` + `auroraPalette` + `snoise` curtain distortion |
| **Flow Speed** | `u_time * 0.20` |
| **Edge Behavior** | Same perimeter-hugging structure; vivid on dark background |
| **Alpha Peak** | `clamp(totalEdgeWeight * 0.85 + ambientAuroraVeil, 0.0, 0.95)` |
| **Palette** | Emerald `#00F5A6` → Teal `#0DD1E0` → Indigo `#6161F5` → Magenta `#B838D9` |
| **Flutter Target** | `assets/shaders/aurora_night.frag` via `FragmentProgram` |

### ANIMATION_56 → Theme 3: Aurora Light (White)

| Property | Value |
|---|---|
| **Stitch Source** | `shader_1/code.html`, `daytrace_today_aurora_white_flow/code.html` |
| **Base Color** | `vec3(0.982, 0.980, 0.995)` → `#FAF9FE` porcelain white |
| **Technique** | `roundedBoxSDF` + `auroraPalette` + `snoise` curtain distortion |
| **Flow Speed** | `u_time * 0.20` |
| **Edge Behavior** | Same structure as ANIMATION_53 but tuned for white base |
| **Alpha Peak** | `clamp(totalEdgeWeight * 0.62 + ambientVeil, 0.0, 0.90)` |
| **Palette** | Emerald `#00E699` → Teal `#00CBE8` → Indigo `#5D5FEF` → Magenta `#C035C8` |
| **Flutter Target** | `assets/shaders/aurora_light.frag` via `FragmentProgram` |

### Shared Shader Math (all three)

```
Functions: mod289, permute, snoise (2D simplex noise)
SDF: roundedBoxSDF(vec2 p, vec2 b, float r)
Uniforms: u_time, u_resolution, u_mouse
Edge calc: distFromEdge, edgeGlow, bottomConcentration, topConcentration, sideConcentration
Flow: flowCoord = fract(uv.x * K - uv.y * K2 - t + noiseCurtain)
Compose: mix(baseColor, paletteColor, finalAlpha)
```

---

## CSS Animation → Flutter Animation Map

| Stitch CSS | Purpose | Flutter Implementation |
|---|---|---|
| `aurora-perimeter-shift` 6s infinite | Bottom shimmer bar gradient sweep | `AnimationController` + `ShaderMask` or gradient `Alignment` tween |
| `aurora-border-shift` 5s infinite | Dark theme shimmer bar | Same approach, different palette |
| `rainbow-perimeter-shift` 6s infinite | Theme 1 rainbow shimmer | Same approach, rainbow palette |
| `animate-ping` | Live session indicator pulse | `AnimationController` with `ScaleTransition` + `FadeTransition` |
| `animate-pulse` | Status dot breathing | `AnimationController` with opacity tween |
| `active:scale-95` | Tap press feedback | `GestureDetector` + `AnimatedScale` or `Transform.scale` |

---

## Design Token Map

### Theme 1: Kinetic Editorial Light

| Token | Stitch Value | Flutter `DayTraceThemeTokens` Field |
|---|---|---|
| `background` | `#FAF8FF` | `background` |
| `surface` | `#FFFFFF` | `surface` |
| `surface-container-low` | `#F2F3FF` | `surfaceSecondary` |
| `surface-container-high` | `#E2E7FF` | `surfaceElevated` |
| `on-surface` | `#0F172A` / `#131B2E` | `textPrimary` |
| `on-surface-variant` | `#464555` | `textSecondary` |
| `outline` | `#777587` | `textMuted` |
| `outline-variant` | `#C7C4D8` / `#E2E8F0` | `border` |
| `primary` | `#3525CD` / `#4F46E5` | `primary` |
| `secondary` | `#00A369` / `#059669` | `secondary` |
| `tertiary` | `#06B6D4` | `tertiary` |
| `error` | `#BA1A1A` | `danger` |
| Nav bg | `white/85 backdrop-blur` | `navigationBackground` |
| Glass opacity | `white/85` | `glassOpacity: 0.85` |

### Theme 2: Kinetic Editorial Dark

| Token | Stitch Value | Flutter `DayTraceThemeTokens` Field |
|---|---|---|
| `background` | `#0B0E14` / `#111317` | `background` |
| `surface` | `#121620` / `rgba(255,255,255,0.04)` | `surface` |
| `surface-container` | `#1E2024` | `surfaceSecondary` |
| `surface-container-high` | `#1A202C` / `#282A2E` | `surfaceElevated` |
| `on-surface` | `#F1F5F9` / `#E2E2E8` | `textPrimary` |
| `on-surface-variant` | `#94A3B8` | `textSecondary` |
| `outline` | `#908FA0` | `textMuted` |
| `outline-variant` | `#2D3748` / `#464554` | `border` |
| `primary` | `#C0C1FF` / `#818CF8` | `primary` |
| `secondary` | `#00F5A6` / `#34D399` | `secondary` |
| `tertiary` | `#0DD1E0` / `#22D3EE` | `tertiary` |
| `error` | `#FFB4AB` | `danger` |
| Nav bg | `#0B0E14/80 backdrop-blur` | `navigationBackground` |
| Glass opacity | `rgba(255,255,255,0.04)` | `glassOpacity: 0.04` |

### Theme 3: Aurora Light

Uses **same token structure as Theme 1** with identical color values. The difference is the **shader** (ANIMATION_56 aurora vs ANIMATION_49 rainbow).

---

## Typography Map

| Stitch Token | Size | Weight | Letter Spacing | Line Height | Flutter `TextStyle` |
|---|---|---|---|---|---|
| `display-lg-mobile` | 32px (light) / 30px (dark) | 800 | -0.02em | 40px / 38px | `displayLargeMobile` |
| `headline-xl` | 30px / 26px | 700 | -0.015em | 38px / 32px | `headlineXl` |
| `headline-lg` | 24px / 22px | 700 | -0.01em | 32px / 28px | `headlineLg` |
| `headline-md` | 20px / 18px | 600 | -0.005em / -0.01em | 28px / 24px | `headlineMd` |
| `body-lg` | 16px / 15px | 400 | 0em | 26px / 22px | `bodyLg` |
| `body-md` | 14px / 13px | 400 | 0em / 0.005em | 22px / 18px | `bodyMd` |
| `body-sm` | 12px | 400 | 0.01em | 18px / 16px | `bodySm` |
| `label-lg` | 14px | 600 | 0.005em | 20px | `labelLg` |
| `label-md` | 12px | 600 | 0.02em | 16px | `labelMd` |
| `label-sm` | 11px | 700 | 0.04em | 14px | `labelSm` |

**Fonts:**
- Primary: `Plus Jakarta Sans` (400, 500, 600, 700, 800)
- Mono (dark theme metrics): `JetBrains Mono` (500)
- Icons: `Material Symbols Outlined`

---

## Component → Widget Map

| Stitch Component | Flutter Widget | Notes |
|---|---|---|
| Full-screen WebGL canvas (z-0) | `DayTraceAnimatedBackground` | `FragmentProgram` shader in `CustomPainter` |
| Inset box-shadow perimeter glow | `DayTraceAmbientBorder` | `CustomPainter` with gradient path stroke |
| Bottom shimmer bar (3px) | `DayTraceShimmerBar` | `AnimatedBuilder` + `LinearGradient` alignment tween |
| Corner blur orbs | `DayTraceCornerGlow` | `Container` with `BoxDecoration` radial gradient + `BackdropFilter` |
| Header (64px, backdrop-blur) | `DayTraceHeader` | `SliverAppBar` or custom fixed header |
| Metric card (2×2 grid) | `DayTraceMetricCard` | Glassmorphic `Container` with theme tokens |
| Live Focus card | `DayTraceFocusCard` | Complex card with aurora gradient stripe, progress, actions |
| Schedule block row | `DayTraceScheduleBlock` | List tile with left indicator, state-based styling |
| Bottom nav (5 items) | `DayTraceBottomNavigation` | Custom `BottomNavigationBar` with glow indicator |
| FAB (56px, gradient) | `DayTraceFAB` | `FloatingActionButton` with `ShaderMask` gradient |
| Status chip/pill | `DayTraceChip` | `Container` with `9999px` radius, theme-aware colors |
| Weather chip | `DayTraceChip` variant | Same component, weather-specific content |
| Planning cutoff banner | `DayTraceBanner` | Card with icon, text, action button |
| Section header | `DayTraceSectionHeader` | Title + count badge + action link |

---

## Today Screen Layout (Top → Bottom)

```
SafeArea
├── [z-0] PersistentShaderLayer (FragmentProgram canvas)
├── [z-20] CornerGlowOverlay (bottom-left, bottom-right blur orbs)
├── [z-30] AmbientBorderOverlay (inset glow + shimmer bar)
├── [z-10] ScrollableContent
│   ├── ContextBar (date, time, weather chip, flow chip)
│   ├── Greeting ("Good morning, {name}")
│   ├── MetricGrid (2×2: Planned, Recorded, Done, Spent)
│   ├── FocusCard (live session with timer + actions)
│   ├── PlanningCutoffBanner
│   ├── ScheduleSection
│   │   ├── SectionHeader ("Today's Schedule", "8 Blocks")
│   │   └── ScheduleBlockList (8 items)
│   └── BottomSpacer (for nav clearance)
├── [z-40] FAB (bottom-right)
└── [z-50] BottomNavigation (5 tabs)
```

---

## Navigation Icons

| Tab | Icon (Material Symbols) | Active State |
|---|---|---|
| Today | `wb_sunny` | Filled, theme accent, bottom glow dot |
| Timeline | `schedule` | Filled on active |
| Money | `account_balance_wallet` | Filled on active |
| Memory | `auto_awesome` | Filled on active |
| More | `grid_view` | Filled on active |

---

## Spacing & Dimensions

| Token | Light Value | Dark Value | Usage |
|---|---|---|---|
| `margin-mobile` | 16px | 16px | Screen edge padding |
| `gutter-mobile` | 16px | 12px | Grid gap |
| `space-xs` | 4px | 4px | Micro spacing |
| `space-sm` | 8px | 8px | Icon-label gaps |
| `space-md` | 16px | 12px | Card padding |
| `space-lg` | 24px | 16px | Section spacing |
| `space-xl` | 40px | 24px | Major section breaks |
| `header-height` | 64px | 64px | Fixed header |
| `nav-height` | 64px | 64px | Fixed bottom nav |
| `radius-card` | 16px (`2xl`) | 16px (`2xl`) | Cards |
| `radius-button` | 12px (`xl`) | 12px (`xl`) | Buttons |
| `radius-pill` | 9999px | 9999px | Chips/pills |

---

## Elevation & Depth

| Level | Light | Dark |
|---|---|---|
| L0 Base | `#FAF8FF`, no shadow | `#0B0E14`, no shadow |
| L1 Cards | `white/85`, `border-slate-200/80`, `shadow-sm` | `#121620/75`, `border-white/10`, `shadow-[0_4px_16px_rgba(0,0,0,0.25)]` |
| L2 Focus | `white/90`, `shadow-[0_4px_24px]` | `#121620/85`, `shadow-[0_8px_32px]` |
| L3 Nav/Header | `white/85 backdrop-blur-xl` | `#0B0E14/80 backdrop-blur-xl` |

---

## Ambient Overlay Specifications

### Theme 1 (Rainbow)
- Inset shadow: `inset 0 0 24px rgba(99,102,241,0.12), inset 0 -3px 12px rgba(0,240,255,0.25)`
- Shimmer: `linear-gradient(90deg, #38bdf8, #818cf8, #c084fc, #f472b6, #fb923c, #34d399, #38bdf8)`
- Corner blooms: `cyan-400/25`, `fuchsia-500/20`

### Theme 2 (Aurora Night)
- Inset shadow: `inset 0 0 28px rgba(0,245,166,0.08), inset 0 -3px 16px rgba(13,209,224,0.22)`
- Shimmer: `linear-gradient(90deg, #00f5a6, #0dd1e0, #6366f1, #b838d9, #00f5a6)`
- Corner blooms: `emerald-400/20`, `purple-500/20`

### Theme 3 (Aurora Light)
- Inset shadow: `inset 0 0 28px rgba(0,230,153,0.12), inset 0 -3px 16px rgba(0,203,232,0.22)`
- Shimmer: `linear-gradient(90deg, #00e699, #00cbe8, #5d5fef, #c035c8, #00e699)`
- Corner blooms: `emerald-400/25`, `indigo-500/20`
