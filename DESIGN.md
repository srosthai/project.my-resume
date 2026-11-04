# Design

<!-- impeccable:design-schema 1 -->

## World

Editorial project archive: a calm, responsive grid on AMOLED black or warm paper, with copper used only for actions and active filters. Clear hierarchy, generous white space, and restrained motion.

## Palette

| Token | Value | Role |
| --- | --- | --- |
| Stage | `#000000` | AMOLED page ground (dark) |
| Stage lift | `#0B0B0B` | Cards and elevated panels |
| Ink | `#F1EFE9` | Primary text |
| Ink muted | `#A09C94` | Supporting text |
| Ink faint | `#6F6B63` | Labels and hints |
| Copper | `#C4A574` | Primary CTA / active filter / accent |
| Success | `#86C79A` | Completed status |
| Line | ink @ 12% | Dividers and card borders |

Atmosphere: true-black stage with very soft graphite lifts, never flat gray fills. Light theme uses the warm paper stage (`#F4F1EA`) with dark ink and a softer card surface.

Theme control: circular icon toggle at the top-right of the header (`ThemeToggle`).

## Typography

- Display / UI: Familjen Grotesk (400–700), tight tracking on large titles.
- Long read (detail lead and body): Source Serif 4.
- Detail body measure ~68ch. Card summaries are clamped to two lines.

## Layout

- Header: sticky, translucent stage background, brand + role on the left, Portfolio link and theme toggle on the right.
- Index: short intro (`Selected work`, project count, one-line lead), category filter chips, then a responsive card grid. One column on phones, two or three on larger screens.
- Cards: 16:9 cover with `object-fit: cover`, category pill, two-line title, two-line summary. Every card shares the same height and internal spacing.
- Detail: back link, category pill, large title, summary as the lead, role/year/status facts, wide 16:9 cover, serif body, feature bullets, tech tags, action buttons, adjacent-project pager.

## Motion

- Theme change: circular reveal from the toggle using the View Transitions API; sun/moon icon rotates and scales via a named view-transition snapshot. CSS color transition is the fallback.
- Page changes: Astro `ClientRouter` fade with matching cover/title transitions where available.
- Hover: subtle card lift, border warmth, and a slow image scale.
- Respect `prefers-reduced-motion` for the theme reveal, page transitions, card animation, and hover transforms.

## Components

- `ProjectGallery` (React island): server-rendered grid plus client-side category filter with `aria-pressed` chips and a live result count.
- `CoverLightbox`: large detail cover with an accessible full-screen viewer.
- `Icon.astro`: shared stroke icons for actions, facts, and links.
- Buttons: `btn--primary` (copper), `btn--ghost` (outline, e.g. GitHub), `pager-link` for adjacent projects.
- Detail facts use icon + label; outbound links get GitHub or external icons.

## Do / Don't

- Do keep the grid and filter as the first reading of the work.
- Do keep cover media at 16:9 with `object-fit: cover` and card heights equal.
- Do label sample projects as illustrative until real cases replace them.
- Don't reintroduce the WebGL carousel or mobile snap deck.
- Don't introduce purple gradients, cream+terracotta portfolio defaults, or dashboard card grids.
- Don't invent client logos or metrics as facts.
