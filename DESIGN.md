# Design

<!-- impeccable:design-schema 1 -->

## World

Studio stage for a portfolio that leads with a WebGL project strip. Dark default with a light-theme alternate; copper for primary actions and accents.

## Palette

| Token | Value | Role |
| --- | --- | --- |
| Stage | `#0A0B0D` | Page ground |
| Stage lift | `#14161A` | Elevated panels / image fallback |
| Ink | `#E8E6E1` | Primary text |
| Ink muted | `#9A968C` | Supporting text |
| Ink faint | `#6A665C` | Hints, footer |
| Copper | `#C4A574` | Primary CTA / accent line |
| Line | ink @ 12% | Dividers |

Atmosphere: soft radial lifts — not flat fills. Light theme uses warm paper stage (`#F4F1EA` family) with dark ink.

Theme control: pill toggle at the top-right of the header (`ThemeToggle`).

## Typography

- Display / UI: Familjen Grotesk (400–700), tight tracking on large titles.
- Long read (detail body + summary): Source Serif 4.
- Body measure ~62ch on detail pages.

## Layout

- Index: brand header + theme toggle, short intro, full-width FlexCarousel stage with captions only.
- Detail: back link, cover + meta grid, status, serif body, stack chips, live links, adjacent project links.
- No About section and no View details button on the index.

## Motion

- Signature: FlexCarousel liquid preset intro `rise`, wheel/drag scrubbing, focus-on-click.
- Respect `prefers-reduced-motion` (carousel + global CSS).

## Components

- `ProjectGallery` (React island): FlexCarousel + View details.
- Primary button: copper pill, dark ink label.
- Detail facts as a definition list; stack as quiet outline chips.

## Do / Don't

- Do keep the carousel as the first reading of the work.
- Do label sample projects as illustrative until real cases replace them.
- Don't introduce purple gradients, cream+terracotta portfolio defaults, or dashboard card grids.
- Don't invent client logos or metrics as facts.
