# AGENTS.md

## Project

Astro 7 static portfolio for SROS THAI. Two routes: the project grid at `/` and detail pages at `/projects/[slug]/`, generated from `src/data/projects.ts`. No backend, database, content collections, lint, or typecheck.

`README.md` is the default Astro starter and is stale. `PRODUCT.md` and `DESIGN.md` are the current product and design contracts; follow them. Keep project content honest: never invent roles, metrics, clients, or links. Cover images live in `public/projects/`.

## Commands

- Node `>=22.22.0`; use npm. `package-lock.json` is tracked; `yarn.lock` is ignored.
- `npm run dev` starts the dev server at `http://localhost:4321`.
- `npm run dev -- --background` starts a background dev server. Manage it with `npx astro dev status`, `npx astro dev logs`, and `npx astro dev stop`. Use `--force` after dependency changes if Vite reports `Outdated Optimize Dep` or `_jsxDEV is not a function`.
- `npm run build` builds the static site to `dist/`.
- `npm test` builds the site and runs the Playwright suite against a Vite preview server on port 4322. Tests use Chrome at 1280px and 390px.
- `astro check` is not installed. Running it prompts to add `@astrojs/check` and `typescript`; do not assume it works.

## Architecture

- `src/data/projects.ts` is the hand-maintained source of truth (the previous version is kept in `projects.backup.ts`). Add a `Project` record and a cover under `public/projects/`; `getStaticPaths()` in `src/pages/projects/[slug].astro` creates the page automatically. There is no sync script.
- The listing is a single responsive CSS grid (`ProjectGallery.tsx`), not a carousel. It is server-rendered and hydrated with `client:load`; all cards are present in the initial HTML and the category filter runs client-side.
- `src/pages/projects/[slug].astro` parses `project.body`: `- ` lines become a bullet list, `Tech:` lines become tag chips, and other lines become paragraphs. Keep this parser in sync with the data format.
- `Layout.astro` uses Astro `ClientRouter` for page transitions, a persisted header, and `trailingSlash: 'always'`. Project links must keep the trailing slash or the static preview/static hosts can serve the index page for `/projects/<slug>`.
- Interactive React islands are `ThemeToggle`, the category-filtered `ProjectGallery`, and `CoverLightbox`. `SiteBrand` is server-rendered.
- Styling is hand-written CSS in `src/styles/global.css`; Tailwind v4 is imported and used by legacy effect components. Use the CSS variables (`--ink`, `--stage`, `--copper`, `--line`, etc.) and update both themes. The dark theme is AMOLED true black (`--stage: #000000`) with near-black surfaces.
- SEO lives in `Layout.astro` and `src/lib/seo.ts`: canonical URLs, Open Graph/Twitter metadata, robots directives, theme-color, and JSON-LD. `src/pages/sitemap.xml.ts` and `src/pages/robots.txt.ts` are static endpoints; `public/og-image.jpg` is the 1200x630 social preview. The canonical base comes from `site` in `astro.config.mjs` (default `https://projects.srosthai.me`, override with `SITE_URL`).
- `public/og-image.jpg` uses the AMOLED palette and `public/me-1.png`; detail pages use the project cover as their social image.
- Theme is applied before paint by the inline script in `Layout.astro`; the user's choice is stored in `localStorage.theme`, with the system preference as the default. The script also applies the stored theme on `astro:before-swap` and `astro:after-swap`. `ThemeToggle` uses the View Transitions API with a circular reveal from the button, a named icon snapshot animation, a CSS transition fallback, and no animation under `prefers-reduced-motion`.
- Theme view-transition CSS is scoped to `html.theme-view-transition` so it does not animate Astro page navigation. Named cover/title transitions are disabled while the theme reveal runs.
- `FlexCarousel`, `PortfolioLaunch`, `FlyingButton`, `WorkHeading`, and `Shuffle` remain in the tree but are legacy and unused by the current pages. Do not reintroduce them without checking `DESIGN.md`.
- Favicons are generated from `public/favicon-source.jpg`: `favicon.ico`, `favicon-32x32.png`, `favicon.svg`, and `apple-touch-icon.png`; `Layout.astro` links all four.
- `tests/portfolio.spec.ts` covers the home grid, category filter, card content and equal heights, detail bullets/tech/links, SEO metadata and JSON-LD, favicons, sitemap/robots/OG image, and horizontal overflow. `tests/theme.spec.ts` covers switching, persistence across reload and navigation, accessible naming, system default, and reduced motion.
- `dist/` and `.astro/` are generated; do not edit them.

## Gotchas

- `/projects/<slug>` without the trailing slash is not reliable in static preview; keep `trailingSlash: 'always'` and links ending in `/`.
- The listing filter only works after hydration; the full unfiltered grid is intentionally present in the server HTML.
- Card heights are kept equal by 16:9 media, a two-line title minimum, a two-line summary clamp, and `height: 100%`. Changing those rules will break the equal-height test.
- Project status drives styling through `data-status`. Current values are `completed` and `processing`; `processing` uses copper and `completed` uses the success color.
- The favicon source is the owner's full photo, not a face crop; keep the full image when regenerating icons.
