// 블로그 전체 설정. 이름이 정해지면 여기만 바꾸면 돼요.

export const LANGS = ['ko', 'en'] as const;
export type Lang = (typeof LANGS)[number];

export const CATEGORIES = ['science', 'projects'] as const;
export type Category = (typeof CATEGORIES)[number];

export const SITE = {
  title: {
    ko: 'Vibe Lab Notes',
    en: 'Vibe Lab Notes',
  },
  description: {
    ko: '신경과학 대학원생이 논문을 읽고, AI로 연구·생산성 도구를 직접 만드는 기록',
    en: 'A neuroscience grad student reading papers and building research tools with AI',
  },
} satisfies Record<string, Record<Lang, string>>;
