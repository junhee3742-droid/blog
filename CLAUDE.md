# Blog repo notes

- Astro 5 static site, no integrations. Korean is the primary language; English is secondary.
- Routing is manual (no Astro i18n config): `src/pages/[lang]/...` with `getStaticPaths` over `LANGS` in `src/config.ts`. `/` redirects to `/ko/`.
- Posts: `src/content/posts/{ko,en}/*.md`, schema in `src/content.config.ts`. URL slug = file name. Link translations with a shared `translationKey`.
- Categories: `science` (과학 · 연구 소식), `projects` (개발 · 부업). Labels live in `src/i18n.ts`.
- New post template: `templates/post-template.md`.
- Deployed on Cloudflare Workers (static assets) from `main`: https://vibelabnotes.com (custom domain, bought on Cloudflare Registrar; old URL https://vibelabnotes.junhee3742.workers.dev). Moved off Vercel because the Hobby plan forbids ads.
- Posts are also edited in the browser via /admin (Sveltia CMS, config in public/admin/config.yml), which commits straight to main. Always `git pull --rebase` before editing.
