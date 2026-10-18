# Design

<!-- impeccable:design-schema 1 -->

## World

Dark studio stage for a portfolio that leads with a WebGL project strip. Graphite ground, chalk type, copper for primary actions only.

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

Atmosphere: soft radial lifts (cool top, warm bottom corner) — not flat black.

## Typography

- Display / UI: Familjen Grotesk (400–700), tight tracking on large titles.
- Long read (detail body + summary): Source Serif 4.
- Body measure ~62ch on detail pages.

## Layout

- Index: brand header, short intro, full-width FlexCarousel stage (~560px / 70dvh), centered View details CTA bound to the active slide, brief About.
- Detail: back link, cover + meta grid, serif body, stack chips, adjacent project links.
- No card grids on the index. Cards are not the structure.

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
