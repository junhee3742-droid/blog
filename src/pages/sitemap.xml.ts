// 사이트맵: /sitemap.xml — 구글·네이버 검색엔진에 블로그 주소 목록을 알려 줘요.
import type { APIRoute } from 'astro';
import { CATEGORIES, LANGS, SITE_URL } from '../config';
import { getPosts, postUrl } from '../lib/posts';
import { escapeXml } from '../lib/rss';

export const GET: APIRoute = async () => {
  const urls: { loc: string; lastmod?: Date }[] = [];
  for (const lang of LANGS) {
    const posts = await getPosts(lang);
    urls.push({ loc: `/${lang}/`, lastmod: posts[0]?.data.date });
    for (const page of ['about', 'subscribe']) urls.push({ loc: `/${lang}/${page}/` });
    for (const category of CATEGORIES) urls.push({ loc: `/${lang}/${category}/` });
    for (const post of posts) urls.push({ loc: postUrl(post), lastmod: post.data.date });
  }
  const body = urls
    .map(({ loc, lastmod }) =>
      `  <url><loc>${escapeXml(SITE_URL + loc)}</loc>${lastmod ? `<lastmod>${lastmod.toISOString()}</lastmod>` : ''}</url>`,
    )
    .join('\n');
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
