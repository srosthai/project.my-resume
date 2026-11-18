# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Astro 7 static site with React islands for the theme toggle, the category folder deck, and the image lightbox. Astro `ClientRouter` handles page transitions; the project index is a row of category folders over a complete typographic index. The dark theme is AMOLED true black, with a warm-paper light alternate.

## Users

Recruiters, hiring managers, and collaborators evaluating SROS THAI’s work through a portfolio.

## Product Purpose

A personal portfolio site that presents projects as a browsable archive grouped by discipline and opens a dedicated detail view for each project. Success means a visitor can scan work quickly, open a category for a preview, find any project in the complete index, then understand a selected project in depth.

## Positioning

Project discovery is led by four tactile category folders and a calm, readable index — not a carousel, filter bar, or dashboard. The archive feels editorial and intentional before any detail page.

## Operating Context

Visitors land on the index, open a discipline folder for a two-project preview or use the complete index below, then open a project for case-study content (summary, role, status, stack, links). The theme can be toggled dark/light from the header.

## Capabilities and Constraints

- Index: one folder per discipline (Full Stack, Frontend, Backend, Desktop App) with two 16:9 project previews, plus a complete grouped index of every project. Four folders across on wide screens, 2x2 on phones and tablets; one folder open at a time.
- Detail: per-project page with a large cover, summary lead, role/year/status, parsed feature bullets, tech tags, and outbound links.
- Content source of truth: `src/data/projects.ts`; the previous version is kept in `src/data/projects.backup.ts`. Covers live under `public/projects/`.
- Must respect `prefers-reduced-motion` for theme transitions, page transitions, card motion, and hover effects.
- SEO: canonical URLs, Open Graph/Twitter cards, a 1200x630 social preview, JSON-LD for the person, website, profile page, projects, and breadcrumbs, plus sitemap and robots endpoints.
- Static output; no backend or database.

## Brand Commitments

Name: SROS THAI. Role: Full Stack Developer. Voice: clear, product-focused.

## Evidence on Hand

Project records and cover images synced from the live portfolio at http://188.166.215.167/portfolio.

## Product Principles

1. Browse by discipline first — the folder deck and complete index are the primary wayfinding.
2. Details earn the click — detail pages carry substance, not filler.
3. Honest content — never invent employers, metrics, or client names as fact.
4. Performance-aware static delivery — no WebGL dependency for the project listing.
5. Keyboard and screen-reader operable filters, cards, and theme control.

## Accessibility & Inclusion

The filter group is labeled, active filters use `aria-pressed`, and the result count is announced politely. Cards expose their title, type, and summary as one link. Detail pages use standard document structure, focusable links, and a labeled image dialog. Theme changes respect reduced-motion preferences.
