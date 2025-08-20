# commit. — Web (Astro + Cloudflare Workers)

Single-page marketing/landing site. Built with Astro and deployed to Cloudflare Workers.

## Stack

- Astro 5
- Adapter: @astrojs/cloudflare (Workers runtime)
- Tooling: ESLint, Prettier, Wrangler

---

## Getting started

1) Install deps (from repo root recommended):

    pnpm install

2) Start server :

    astro build 

    pnpm dev # start the dev server

    wrangler dev # start the production server


---

## Project structure

    apps/web/
    ├─ public/
    ├─ src/
    │  └─ pages/
    │     └─ index.astro        # landing page
    ├─ astro.config.mjs
    ├─ wrangler.jsonc
    ├─ worker-configuration.d.ts
    ├─ eslint.config.mjs
    ├─ tsconfig.json
    └─ package.json

