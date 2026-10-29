import { getCollection, type CollectionEntry } from 'astro:content';
import type { Category, Lang } from '../config';

export type Post = CollectionEntry<'posts'>;

// 공개된 글: 임시저장이 아니고, 날짜(예약 시각)가 이미 지난 글.
// 날짜가 미래면 그 시각 이후 다시 빌드될 때 자동으로 나타나요 (.github/workflows/scheduled-publish.yml).
export function isPublished(data: Post['data']): boolean {
  return !data.draft && data.date.valueOf() <= Date.now();
}

export async function getPosts(lang: Lang, category?: Category): Promise<Post[]> {
  const posts = await getCollection(
    'posts',
    ({ data }) => isPublished(data) && data.lang === lang && (!category || data.category === category),
  );
  // 최신 날짜순 정렬. 같은 날짜에 여러 편이 올라오면 제목(①, ②, ③...) 역순이 최신 글이 되도록 정렬
  return posts.sort(
    (a, b) => b.data.date.valueOf() - a.data.date.valueOf() || b.data.title.localeCompare(a.data.title, 'ko'),
  );
}

// 'ko/hello-world' → 'hello-world'
export function postSlug(post: Post): string {
  return post.id.replace(/^(ko|en)\//, '');
}

export function postUrl(post: Post): string {
  return `/${post.data.lang}/posts/${postSlug(post)}/`;
}

// 같은 translationKey 를 가진 다른 언어 글을 찾아요.
export async function findTranslation(post: Post): Promise<Post | undefined> {
  const key = post.data.translationKey;
  if (!key) return undefined;
  const all = await getCollection(
    'posts',
    ({ data }) => isPublished(data) && data.translationKey === key && data.lang !== post.data.lang,
  );
  return all[0];
}
