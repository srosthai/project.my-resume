# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Astro (existing) with React client islands for interactive surfaces. FlexCarousel (WebGL via `ogl`) on the projects index. [Inferred from repo + brief; user said proceed.]

## Users

Recruiters, hiring managers, and collaborators evaluating a software engineer’s work through a portfolio. [Inferred]

## Product Purpose

A personal resume/portfolio site that presents projects as a browseable gallery and opens a dedicated detail view for each project. Success means a visitor can scan work quickly, then understand a selected project in depth. [Inferred from brief]

## Positioning

Project discovery is led by a liquid FlexCarousel — not a static grid — so the portfolio feels spatial and intentional before any detail page. [Inferred from brief]

## Operating Context

Visitors land on the index, scrub or click through project covers in the carousel, then open “view details” for case-study content (summary, role, stack, links). [Inferred]

## Capabilities and Constraints

- Index: FlexCarousel listing of projects with captions; selection opens project detail.
- Detail: per-project page with richer description and outbound links.
- Content: sample/synthetic projects until real case studies are supplied — labeled as illustrative in PRODUCT evidence, not as fabricated client claims.
- Must respect `prefers-reduced-motion` (carousel already does).
- [Open] Owner display name, real project copy, and live URLs TBD.

## Brand Commitments

None pinned beyond the FlexCarousel interaction and a clean, professional presentation. [Inferred]

## Evidence on Hand

No real project assets or CV copy in the repo yet. First ship uses illustrative sample projects and Unsplash cover images; replace with owner material later.

## Product Principles

1. Browse first, read second — the carousel is the primary wayfinding.
2. Details earn the click — detail pages carry substance, not filler.
3. Honest content — never invent employers, metrics, or client names as fact.
4. Performance-aware WebGL — degrade gracefully when WebGL2 is unavailable.
5. Keyboard and screen-reader operable carousel region.

## Accessibility & Inclusion

Carousel exposes a labeled region, live announcement of the active slide, and keyboard navigation. Detail pages use standard document structure and focusable links.
