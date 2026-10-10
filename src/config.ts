// 블로그 전체 설정. 이름이 정해지면 여기만 바꾸면 돼요.

export const LANGS = ['ko', 'en'] as const;
export type Lang = (typeof LANGS)[number];

export const CATEGORIES = ['science', 'projects'] as const;
export type Category = (typeof CATEGORIES)[number];

// 배포 주소. og:image 처럼 전체 주소가 필요한 곳에 써요.
export const SITE_URL = 'https://vibelabnotes.com';

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

// 댓글: Cloudflare Turnstile(로봇 확인) 사이트 키. 비워 두면 로봇 확인 없이 동작해요.
// 켜려면 여기에 사이트 키를 넣고, Worker 비밀값 TURNSTILE_SECRET 도 같이 설정하세요.
export const TURNSTILE_SITE_KEY: string = '';
