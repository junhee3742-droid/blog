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
    goHome: '홈으로 가기',
    entries: '기록',
    since: '첫 기록',
    browse: '분야별로 보기',
  },
  en: {
    home: 'Home',
    about: 'About',
    latest: 'Latest posts',
    noPosts: 'No posts yet.',
    otherLang: '한국어',
    backToList: '← Back to list',
    notFound: 'Page not found.',
    goHome: 'Go to home',
    entries: 'Entries',
    since: 'First entry',
    browse: 'Browse by topic',
  },
} satisfies Record<Lang, Record<string, string>>;

export const CATEGORY_LABEL: Record<Lang, Record<Category, string>> = {
  ko: { science: '과학 · 연구 소식', projects: '개발 · 부업' },
  en: { science: 'Science & Research', projects: 'Projects' },
};

export const CATEGORY_DESC: Record<Lang, Record<Category, string>> = {
  ko: {
    science: '논문 요약, 노벨상, 신약 임상시험 결과 같은 과학 · 연구 소식',
    projects: '바이브 코딩으로 만든 도구, 자동화 워크플로우, 부업 프로젝트 기록',
  },
  en: {
    science: 'Paper summaries, Nobel prizes, clinical trial results and other science news',
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

// 실험 노트 도장 같은 날짜: 2026.09.25
export function stampDate(date: Date): string {
  return date.toISOString().slice(0, 10).replace(/-/g, '.');
}

// 글 개수: '글 3편' / '3 posts'
export function countLabel(n: number, lang: Lang): string {
  if (lang === 'ko') return `글 ${n}편`;
  return n === 1 ? '1 post' : `${n} posts`;
}
