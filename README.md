# Vibe Lab Notes

과학 · 연구 소식과 바이브 코딩 프로젝트를 기록하는 한국어/영어 블로그. [Astro](https://astro.build)로 만들었고 Cloudflare Workers에 배포합니다 (https://vibelabnotes.junhee3742.workers.dev).

## 주소 구조

| 주소 | 내용 |
|---|---|
| `/` | 한국어 홈으로 이동 |
| `/ko/`, `/en/` | 언어별 홈 |
| `/ko/science/` | 과학 · 연구 소식 |
| `/ko/projects/` | 개발 · 부업 |
| `/ko/posts/<파일이름>/` | 글 한 편 |
| `/ko/about/` | 소개 |
| `/admin/` | 글 관리 화면 (본인만 로그인 가능) |
| `/ko/rss.xml`, `/en/rss.xml` | RSS 피드 (새 글 최대 50개) |
| `/ko/subscribe/` | 구독 안내 (Feedly·Inoreader 버튼, 주소 복사) |

## 관리자 화면에서 글 쓰기 (추천)

`블로그주소/admin/` 에 들어가면 브라우저에서 글을 쓰고 고칠 수 있어요 ([Sveltia CMS](https://github.com/sveltia/sveltia-cms)).

1. 처음 한 번: **Sign In with Token** → 안내 링크로 GitHub 토큰을 만들어 붙여 넣어요. (권한: `blog` 저장소의 Contents 읽기/쓰기)
2. **한국어 글** 또는 **영어 글**에서 새 글을 만들거나 기존 글을 열어요.
3. 다 쓰고 **저장(Save)** 하면 GitHub에 올라가고, 3~5분 뒤 블로그에 반영돼요.
4. 공개 전이면 **임시저장** 스위치를 켜 두세요. 블로그에 안 보여요.

설정 파일: `public/admin/config.yml`

## 댓글

- 모든 글 아래에 댓글창이 있어요. 독자는 로그인 없이 닉네임만 쓰면 돼요.
- 댓글은 Cloudflare D1 데이터베이스에 저장돼요 (`worker/index.js`, 설정은 `wrangler.jsonc`).
- 스팸 방지: 로봇 함정 칸, 같은 사람은 10분에 5개까지. 더 필요하면 Turnstile(로봇 확인)을 켜요: `src/config.ts`의 `TURNSTILE_SITE_KEY` + Cloudflare 비밀값 `TURNSTILE_SECRET`.
- 댓글 지우기: `블로그주소/admin/comments.html` 에서 관리자 비밀번호로 로그인. 비밀번호는 Cloudflare 대시보드 → Workers → vibelabnotes → Settings → Variables and Secrets 에 `ADMIN_PASSWORD`(Secret)로 넣어요.

## 파일로 직접 새 글 쓰기

1. `templates/post-template.md` 를 복사해서 `src/content/posts/ko/` 에 넣어요. 파일 이름이 주소가 돼요 (예: `paper-collector.md` → `/ko/posts/paper-collector/`). 파일 이름은 영어 소문자와 `-` 로 쓰는 걸 추천해요.
2. 맨 위 `title`, `description`, `date`, `category` 를 채우고 본문을 써요.
3. 대표 이미지를 넣고 싶으면 이미지를 `public/images/posts/` 에 넣고, 맨 위에 `cover: /images/posts/파일이름.png` 와 `coverAlt: 이미지 설명` 을 적어요 (없으면 생략해도 돼요).
4. 공개할 때 `draft: true` 를 지워요.
5. GitHub에 올리면 Cloudflare가 자동으로 사이트를 다시 만들어요.

### 스티커 넣기

본문 중간에 마스코트 스티커를 넣을 수 있어요. 이미지 문법으로 한 줄 쓰면 돼요.

```md
![고민](/stickers/thinking.svg)
```

`[ ]` 안의 글자는 그림 설명(화면 낭독기용)이에요. 스티커는 작게(약 96px) 글 사이에 붙고, 두 개를 한 줄에 이어 쓰면 나란히 보여요.

| 파일 | 뜻 |
|---|---|
| `/stickers/happy.svg` | 기쁨 |
| `/stickers/thinking.svg` | 고민 |
| `/stickers/surprised.svg` | 놀람 |
| `/stickers/idea.svg` | 아이디어 |
| `/stickers/caution.svg` | 주의 |
| `/stickers/celebrate.svg` | 축하 |
| `/stickers/tired.svg` | 피곤 |
| `/stickers/thumbs-up.svg` | 좋아요 |

### 영어 번역본

영어 번역본은 `src/content/posts/en/` 에 같은 방식으로 넣고, 두 글에 같은 `translationKey` 를 넣으면 언어 전환 버튼이 서로 연결돼요.

## 설정 바꾸기

- 블로그 이름, 소개 문구: `src/config.ts`
- 메뉴, 카테고리 이름 번역: `src/i18n.ts`
- 색상, 글꼴: `src/styles/global.css`
- 로고: `src/components/Logo.astro`, 파비콘: `public/favicon.svg`
- 마스코트, 스티커 그림: `public/mascot.svg`, `public/stickers/`

## 내 컴퓨터에서 미리 보기 (선택)

[Node.js](https://nodejs.org) 설치 후:

```bash
npm install
npm run dev
```

`http://localhost:4321` 에서 볼 수 있어요.
