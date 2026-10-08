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
    noteClose: '오늘의 노트는 여기서 덮을게요.',
    noteThanks: '구독과 관심은 뉴로니에게 힘이 돼요!',
    subscribe: '구독하기',
    subscribeCta: '새 노트 구독하기 →',
    comments: '댓글',
    commentEmpty: '아직 댓글이 없어요. 첫 댓글을 남겨 주세요!',
    commentName: '닉네임',
    commentBody: '댓글 내용',
    commentSubmit: '댓글 남기기',
    commentPosting: '올리는 중…',
    commentPosted: '댓글이 등록됐어요. 고마워요!',
    commentError: '댓글을 올리지 못했어요. 잠시 후 다시 시도해 주세요.',
    commentTooMany: '댓글을 너무 빨리 쓰고 있어요. 잠시 후 다시 시도해 주세요.',
    commentCaptcha: '로봇 확인을 완료해 주세요.',
    commentLoadError: '댓글을 불러오지 못했어요.',
    commentNote: '로그인 없이 닉네임만으로 남길 수 있어요.',
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
    noteClose: "That's where I close today's note.",
    noteThanks: 'Your interest keeps Neuroni going!',
    subscribe: 'Subscribe',
    subscribeCta: 'Subscribe to new notes →',
    comments: 'Comments',
    commentEmpty: 'No comments yet. Be the first!',
    commentName: 'Name',
    commentBody: 'Comment',
    commentSubmit: 'Post comment',
    commentPosting: 'Posting…',
    commentPosted: 'Thanks! Your comment is posted.',
    commentError: "Couldn't post your comment. Please try again in a moment.",
    commentTooMany: "You're commenting too fast. Please wait a moment.",
    commentCaptcha: 'Please complete the robot check.',
    commentLoadError: "Couldn't load comments.",
    commentNote: 'No sign-in needed, just a name.',
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

// 노트 번호: 3 → 'No.003'
export function noteNumber(n: number): string {
  return `No.${String(n).padStart(3, '0')}`;
}

// 글 맨 위 인사: 'No.003 노트를 펼쳐요' / 'Opening note No.003'
export function noteOpenLabel(n: number, lang: Lang): string {
  return lang === 'ko' ? `${noteNumber(n)} 노트를 펼쳐요` : `Opening note ${noteNumber(n)}`;
}
