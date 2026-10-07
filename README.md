# Vibe Lab Notes

논문 정보와 바이브 코딩 프로젝트를 기록하는 한국어/영어 블로그. [Astro](https://astro.build)로 만들었고 Cloudflare Workers에 배포합니다 (https://vibelabnotes.junhee3742.workers.dev).

## 주소 구조

| 주소 | 내용 |
|---|---|
| `/` | 한국어 홈으로 이동 |
| `/ko/`, `/en/` | 언어별 홈 |
| `/ko/papers/` | 논문 정보 |
| `/ko/projects/` | 개발 · 부업 |
| `/ko/posts/<파일이름>/` | 글 한 편 |
| `/ko/about/` | 소개 |

## 새 글 쓰기

1. `templates/post-template.md` 를 복사해서 `src/content/posts/ko/` 에 넣어요. 파일 이름이 주소가 돼요 (예: `paper-collector.md` → `/ko/posts/paper-collector/`). 파일 이름은 영어 소문자와 `-` 로 쓰는 걸 추천해요.
2. 맨 위 `title`, `description`, `date`, `category` 를 채우고 본문을 써요.
3. 공개할 때 `draft: true` 를 지워요.
4. GitHub에 올리면 Cloudflare가 자동으로 사이트를 다시 만들어요.

영어 번역본은 `src/content/posts/en/` 에 같은 방식으로 넣고, 두 글에 같은 `translationKey` 를 넣으면 언어 전환 버튼이 서로 연결돼요.

## 설정 바꾸기

- 블로그 이름, 소개 문구: `src/config.ts`
- 메뉴, 카테고리 이름 번역: `src/i18n.ts`
- 색상, 글꼴: `src/styles/global.css`

## 내 컴퓨터에서 미리 보기 (선택)

[Node.js](https://nodejs.org) 설치 후:

```bash
npm install
npm run dev
```

`http://localhost:4321` 에서 볼 수 있어요.
