// RSS 피드: /ko/rss.xml, /en/rss.xml
import type { APIRoute } from 'astro';
import { LANGS, SITE, SITE_URL, type Lang } from '../../config';
import { CATEGORY_LABEL } from '../../i18n';
import { getPosts, postUrl } from '../../lib/posts';
import { buildRss } from '../../lib/rss';

export function getStaticPaths() {
  return LANGS.map((lang) => ({ params: { lang } }));
}

export const GET: APIRoute = async ({ params }) => {
  const lang = params.lang as Lang;
  const posts = (await getPosts(lang)).slice(0, 50);
  const homeUrl = `${SITE_URL}/${lang}/`;
  const xml = buildRss({
    title: SITE.title[lang],
    description: SITE.description[lang],
    homeUrl,
    feedUrl: `${homeUrl}rss.xml`,
    language: lang === 'ko' ? 'ko-KR' : 'en-US',
    items: posts.map((post) => ({
      title: post.data.subtitle ? `${post.data.title} – ${post.data.subtitle}` : post.data.title,
      url: `${SITE_URL}${postUrl(post)}`,
      date: post.data.date,
      description: post.data.description,
      category: CATEGORY_LABEL[lang][post.data.category],
    })),
  });
  return new Response(xml, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } });
};
