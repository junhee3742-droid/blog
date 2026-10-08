// RSS 2.0 피드 XML 만들기. Astro 없이도 테스트할 수 있게 순수 함수로 둬요.

export interface FeedItem {
  title: string;
  url: string;
  date: Date;
  description: string;
  category: string;
}

export interface Feed {
  title: string;
  description: string;
  /** 블로그 홈 주소 (끝에 / 포함) */
  homeUrl: string;
  /** 이 피드 파일 자체의 주소 */
  feedUrl: string;
  language: string;
  items: FeedItem[];
}

export function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export function buildRss(feed: Feed): string {
  const items = feed.items
    .map(
      (item) => `    <item>
      <title>${escapeXml(item.title)}</title>
      <link>${escapeXml(item.url)}</link>
      <guid isPermaLink="true">${escapeXml(item.url)}</guid>
      <pubDate>${item.date.toUTCString()}</pubDate>
      <description>${escapeXml(item.description)}</description>
      <category>${escapeXml(item.category)}</category>
    </item>`,
    )
    .join('\n');
  const lastBuild = feed.items[0] ? `\n    <lastBuildDate>${feed.items[0].date.toUTCString()}</lastBuildDate>` : '';
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(feed.title)}</title>
    <link>${escapeXml(feed.homeUrl)}</link>
    <description>${escapeXml(feed.description)}</description>
    <language>${escapeXml(feed.language)}</language>
    <atom:link href="${escapeXml(feed.feedUrl)}" rel="self" type="application/rss+xml" />${lastBuild}
${items}
  </channel>
</rss>
`;
}
