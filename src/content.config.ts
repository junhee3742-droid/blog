import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// 글은 src/content/posts/ko/ 또는 src/content/posts/en/ 에 .md 파일로 넣어요.
const posts = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/posts' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    lang: z.enum(['ko', 'en']),
    category: z.enum(['science', 'projects']),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
    // 한국어 글과 영어 번역본을 연결할 때 두 글에 같은 값을 넣어요.
    translationKey: z.string().optional(),
  }),
});

export const collections = { posts };
