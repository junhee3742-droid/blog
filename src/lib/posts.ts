import { getCollection, type CollectionEntry } from 'astro:content';
import type { Category, Lang } from '../config';

export type Post = CollectionEntry<'posts'>;

export async function getPosts(lang: Lang, category?: Category): Promise<Post[]> {
  const posts = await getCollection(
    'posts',
    ({ data }) => !data.draft && data.lang === lang && (!category || data.category === category),
  );
  return posts.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
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
    ({ data }) => !data.draft && data.translationKey === key && data.lang !== post.data.lang,
  );
  return all[0];
}
