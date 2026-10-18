# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Astro (existing) with React client islands for interactive surfaces. FlexCarousel (WebGL via `ogl`) on the projects index. [Inferred from repo + brief; user said proceed.]

## Users

Recruiters, hiring managers, and collaborators evaluating SROS THAI’s work through a portfolio.

## Product Purpose

A personal portfolio site that presents projects as a browseable gallery and opens a dedicated detail view for each project. Success means a visitor can scan work quickly, then understand a selected project in depth.

## Positioning

Project discovery is led by a liquid FlexCarousel — not a static grid — so the portfolio feels spatial and intentional before any detail page.

## Operating Context

Visitors land on the index, scrub or click through project covers in the carousel, then open a project for case-study content (summary, role, stack, links). Theme can be toggled dark/light from the header.

## Capabilities and Constraints

- Index: FlexCarousel listing of projects with captions only (no About block, no View details CTA).
- Detail: per-project page with description, status, stack, and outbound links.
- Content source of truth: https://srosthai.me/portfolio (mirrored covers under `public/projects/`).
- Must respect `prefers-reduced-motion` (carousel already does).

## Brand Commitments

Name: SROS THAI. Role: Full Stack Developer. Voice: clear, product-focused.

## Evidence on Hand

Project records and cover images synced from the live portfolio at http://188.166.215.167/portfolio.

## Product Principles

1. Browse first, read second — the carousel is the primary wayfinding.
2. Details earn the click — detail pages carry substance, not filler.
3. Honest content — never invent employers, metrics, or client names as fact.
4. Performance-aware WebGL — degrade gracefully when WebGL2 is unavailable.
5. Keyboard and screen-reader operable carousel region.

## Accessibility & Inclusion

Carousel exposes a labeled region, live announcement of the active slide, and keyboard navigation. Detail pages use standard document structure and focusable links.
