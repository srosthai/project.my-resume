# Design

<!-- impeccable:design-schema 1 -->

## World

Editorial project archive: a calm category folder deck on AMOLED black or warm paper, with a complete typographic index below. Copper folders are the one tactile object; clear hierarchy, generous white space, and restrained motion.

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
- Index: short intro (`Selected work`, project count, one-line lead), a folder per discipline, then the complete typographic index. Folders sit four across on wide screens and 2x2 on phones and tablets; only one folder opens at a time.
- Folder previews: each folder holds its two newest projects as paper cards with a 16:9 cover, title, year, and faint document rules. The tab shows the category and the caption shows the full project count.
- Index: every project once, grouped by discipline, as compact numbered rows with title and year. Full-width on phones, two columns on tablets, four on wide screens.
- Detail: back link, category pill, large title, summary as the lead, role/year/status facts, wide 16:9 cover, serif body, feature bullets, tech tags, action buttons, adjacent-project pager.

## Motion

- Theme change: circular reveal from the toggle using the View Transitions API; sun/moon icon rotates and scales via a named view-transition snapshot. CSS color transition is the fallback.
- Page changes: Astro `ClientRouter` fade with matching cover/title transitions where available.
- Folders: an intro drop when first in view, a peel/peek on hover, and a flap-open spread of two papers. Opening another folder closes the previous one.
- Hover/focus: folder tilt and paper lift; index rows warm to copper.
- Respect `prefers-reduced-motion` for the theme reveal, page transitions, folder intro/peek, and hover transforms.

## Components

- `FolderGallery` (React island): server-rendered category folders (vendored ReactBits `Folder`) plus the complete index, with one-open-at-a-time state and preview navigation.
- `Folder`: solid flap folders in copper with warm paper previews; no WebGL glass variant is used.
- `CoverLightbox`: large detail cover with an accessible full-screen viewer.
- `Icon.astro`: shared stroke icons for actions, facts, and links.
- Buttons: `btn--primary` (copper), `btn--ghost` (outline, e.g. GitHub), `pager-link` for adjacent projects.
- Detail facts use icon + label; outbound links get GitHub or external icons.

## Do / Don't

- Do keep the folder deck as the first reading of the work, with the complete index immediately below it.
- Do keep preview media at 16:9 with `object-fit: cover` and every folder on the same paper treatment.
- Do label sample projects as illustrative until real cases replace them.
- Don't show more than two previews per folder; the open fan stops fitting phones.
- Don't reintroduce the WebGL carousel, mobile snap deck, or the old filter-chip grid.
- Don't introduce purple gradients, cream+terracotta portfolio defaults, or dashboard card grids.
- Don't invent client logos or metrics as facts.
