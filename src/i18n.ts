import type { Category, Lang } from './config';

// 화면에 보이는 고정 문구(메뉴, 버튼 등)의 한/영 번역.
export const UI = {
  ko: {
    home: '홈',
    about: '소개',
    latest: '최근 글',
    noPosts: '아직 글이 없어요.',
    otherLang: 'English',
    backToList: '← 목록으로',
    notFound: '페이지를 찾을 수 없어요.',
  },
  en: {
    home: 'Home',
    about: 'About',
    latest: 'Latest posts',
    noPosts: 'No posts yet.',
    otherLang: '한국어',
    backToList: '← Back to list',
    notFound: 'Page not found.',
  },
} satisfies Record<Lang, Record<string, string>>;

export const CATEGORY_LABEL: Record<Lang, Record<Category, string>> = {
  ko: { papers: '논문 정보', projects: '개발 · 부업' },
  en: { papers: 'Papers', projects: 'Projects' },
};

export const CATEGORY_DESC: Record<Lang, Record<Category, string>> = {
  ko: {
    papers: '읽은 논문 요약과 연구 동향 정리',
    projects: '바이브 코딩으로 만든 도구, 자동화 워크플로우, 부업 프로젝트 기록',
  },
  en: {
    papers: 'Paper summaries and research trends',
    projects: 'Tools, automation workflows and side projects built with AI',
  },
};

export function otherLang(lang: Lang): Lang {
  return lang === 'ko' ? 'en' : 'ko';
}

export function formatDate(date: Date, lang: Lang): string {
  return date.toLocaleDateString(lang === 'ko' ? 'ko-KR' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  });
}
