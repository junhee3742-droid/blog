# Blog repo notes

- Astro 5 static site, no integrations. Korean is the primary language; English is secondary.
- Routing is manual (no Astro i18n config): `src/pages/[lang]/...` with `getStaticPaths` over `LANGS` in `src/config.ts`. `/` redirects to `/ko/`.
- Posts: `src/content/posts/{ko,en}/*.md`, schema in `src/content.config.ts`. URL slug = file name. Link translations with a shared `translationKey`.
- Categories: `papers` (논문 정보), `projects` (개발 · 부업). Labels live in `src/i18n.ts`.
- New post template: `templates/post-template.md`.
- Deployed on Vercel from `main`.
