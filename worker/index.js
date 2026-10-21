// Vibe Lab Notes 댓글 API (Cloudflare Worker + D1)
//
//   GET    /api/comments?post=ko/slug        → 그 글의 댓글 목록
//   POST   /api/comments                     → 댓글 쓰기 { post, name, body, website(함정), turnstileToken? }
//   GET    /api/admin/comments               → 최근 댓글 전체 (관리자)
//   DELETE /api/admin/comments/:id           → 댓글 삭제 (관리자)
//   POST   /api/visit                        → 방문 기록 (모든 페이지가 열릴 때 보내요)
//   GET    /api/admin/stats                  → 오늘·누적 방문자, 최근 30일 (관리자)
//
// 비밀값 (Cloudflare 대시보드 > Workers > vibelabnotes > Settings > Variables and Secrets):
//   ADMIN_PASSWORD   관리자 비밀번호. 없으면 관리자 기능이 꺼져 있어요.
//   TURNSTILE_SECRET Cloudflare Turnstile 비밀 키 (선택). 있으면 로봇 확인을 해요.
//
// 그 밖의 요청(블로그 페이지)은 정적 파일(ASSETS)로 넘겨요.

const POST_RE = /^(ko|en)\/[a-z0-9]+(?:-[a-z0-9]+)*$/;
const NAME_MAX = 30;
const BODY_MAX = 2000;
const RATE_WINDOW_MIN = 10; // 이 시간(분) 동안
const RATE_MAX = 5; //         같은 사람이 쓸 수 있는 댓글 수

let schemaReady = false;

async function ensureSchema(db) {
  if (schemaReady) return;
  await db.batch([
    db.prepare(
      `CREATE TABLE IF NOT EXISTS comments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        post TEXT NOT NULL,
        name TEXT NOT NULL,
        body TEXT NOT NULL,
        created_at TEXT NOT NULL,
        ip_hash TEXT,
        status TEXT NOT NULL DEFAULT 'visible'
      )`,
    ),
    db.prepare('CREATE INDEX IF NOT EXISTS idx_comments_post ON comments (post, created_at)'),
    db.prepare('CREATE INDEX IF NOT EXISTS idx_comments_ip ON comments (ip_hash, created_at)'),
    // 방문자: 하루에 한 사람(IP+브라우저)은 한 번만 세요. 해시에 날짜를 섞어서 날마다 달라지게 해요.
    db.prepare(
      `CREATE TABLE IF NOT EXISTS visitors (
        day TEXT NOT NULL,
        vhash TEXT NOT NULL,
        PRIMARY KEY (day, vhash)
      )`,
    ),
    // 페이지뷰: 날짜별로 페이지가 열린 횟수
    db.prepare(
      `CREATE TABLE IF NOT EXISTS pageviews (
        day TEXT PRIMARY KEY,
        views INTEGER NOT NULL DEFAULT 0
      )`,
    ),
  ]);
  schemaReady = true;
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' },
  });
}

function err(code, status) {
  return json({ error: code }, status);
}

async function sha256(text) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

function clean(value, max) {
  if (typeof value !== 'string') return '';
  // 제어 문자 제거(줄바꿈은 유지), 앞뒤 공백 제거
  return value.replace(/[\u0000-\u0009\u000B-\u001F\u007F]/g, '').trim().slice(0, max + 1);
}

function isAdmin(request, env) {
  const pw = env.ADMIN_PASSWORD;
  if (!pw) return false;
  const header = request.headers.get('authorization') || '';
  const given = header.startsWith('Bearer ') ? header.slice(7) : '';
  if (given.length !== pw.length) return false;
  let diff = 0;
  for (let i = 0; i < pw.length; i++) diff |= pw.charCodeAt(i) ^ given.charCodeAt(i);
  return diff === 0;
}

async function verifyTurnstile(token, ip, secret) {
  if (!token) return false;
  const form = new FormData();
  form.append('secret', secret);
  form.append('response', token);
  if (ip) form.append('remoteip', ip);
  const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', { method: 'POST', body: form });
  const data = await res.json();
  return data.success === true;
}

async function listComments(url, env) {
  const post = url.searchParams.get('post') || '';
  if (!POST_RE.test(post)) return err('bad_post', 400);
  const { results } = await env.DB.prepare(
    `SELECT id, name, body, created_at FROM comments
     WHERE post = ? AND status = 'visible' ORDER BY created_at ASC, id ASC LIMIT 500`,
  )
    .bind(post)
    .all();
  return json({ comments: results });
}

async function createComment(request, env) {
  let data;
  try {
    data = await request.json();
  } catch {
    return err('bad_json', 400);
  }

  // 로봇 함정: 사람에게는 안 보이는 칸이 채워져 있으면 조용히 성공한 척해요.
  if (typeof data.website === 'string' && data.website.trim() !== '') return json({ ok: true }, 201);

  const post = typeof data.post === 'string' ? data.post : '';
  const name = clean(data.name, NAME_MAX);
  const body = clean(data.body, BODY_MAX);
  if (!POST_RE.test(post)) return err('bad_post', 400);
  if (!name) return err('name_required', 400);
  if (name.length > NAME_MAX) return err('name_too_long', 400);
  if (!body) return err('body_required', 400);
  if (body.length > BODY_MAX) return err('body_too_long', 400);

  const ip = request.headers.get('cf-connecting-ip') || '';

  if (env.TURNSTILE_SECRET) {
    const ok = await verifyTurnstile(data.turnstileToken, ip, env.TURNSTILE_SECRET);
    if (!ok) return err('captcha_failed', 403);
  }

  const ipHash = ip ? await sha256(`vibelabnotes:${ip}`) : null;
  const since = new Date(Date.now() - RATE_WINDOW_MIN * 60 * 1000).toISOString();
  if (ipHash) {
    const row = await env.DB.prepare('SELECT COUNT(*) AS n FROM comments WHERE ip_hash = ? AND created_at > ?')
      .bind(ipHash, since)
      .first();
    if (row && row.n >= RATE_MAX) return err('too_many', 429);
  }

  const createdAt = new Date().toISOString();
  const result = await env.DB.prepare(
    'INSERT INTO comments (post, name, body, created_at, ip_hash) VALUES (?, ?, ?, ?, ?)',
  )
    .bind(post, name, body, createdAt, ipHash)
    .run();

  return json({ ok: true, comment: { id: result.meta.last_row_id, name, body, created_at: createdAt } }, 201);
}

async function adminList(env) {
  const { results } = await env.DB.prepare(
    `SELECT id, post, name, body, created_at, status FROM comments ORDER BY created_at DESC, id DESC LIMIT 200`,
  ).all();
  return json({ comments: results });
}

async function adminDelete(id, env) {
  await env.DB.prepare('DELETE FROM comments WHERE id = ?').bind(id).run();
  return json({ ok: true });
}

const BOT_RE = /bot|crawl|spider|slurp|preview|fetch|monitor|headless|lighthouse|curl|wget|python/i;
const STATS_DAYS = 30;

// 한국 시간(KST) 기준 날짜 'YYYY-MM-DD'
function kstDay(ms = Date.now()) {
  return new Date(ms + 9 * 60 * 60 * 1000).toISOString().slice(0, 10);
}

async function recordVisit(request, env) {
  const ua = request.headers.get('user-agent') || '';
  if (!ua || BOT_RE.test(ua)) return new Response(null, { status: 204 });
  const ip = request.headers.get('cf-connecting-ip') || '';
  const day = kstDay();
  const vhash = await sha256(`vibelabnotes:visit:${day}:${ip}:${ua}`);
  await env.DB.batch([
    env.DB.prepare('INSERT OR IGNORE INTO visitors (day, vhash) VALUES (?, ?)').bind(day, vhash),
    env.DB.prepare(
      'INSERT INTO pageviews (day, views) VALUES (?, 1) ON CONFLICT (day) DO UPDATE SET views = views + 1',
    ).bind(day),
  ]);
  return new Response(null, { status: 204 });
}

async function adminStats(env) {
  const today = kstDay();
  const from = kstDay(Date.now() - (STATS_DAYS - 1) * 24 * 60 * 60 * 1000);
  const [totals, daily] = await env.DB.batch([
    env.DB.prepare(
      `SELECT
        (SELECT COUNT(*) FROM visitors) AS total_visitors,
        (SELECT COUNT(*) FROM visitors WHERE day = ?1) AS today_visitors,
        (SELECT COALESCE(SUM(views), 0) FROM pageviews) AS total_views,
        (SELECT COALESCE(SUM(views), 0) FROM pageviews WHERE day = ?1) AS today_views`,
    ).bind(today),
    env.DB.prepare(
      `SELECT v.day, v.visitors, COALESCE(p.views, 0) AS views
       FROM (SELECT day, COUNT(*) AS visitors FROM visitors WHERE day >= ? GROUP BY day) v
       LEFT JOIN pageviews p ON p.day = v.day
       ORDER BY v.day DESC`,
    ).bind(from),
  ]);
  return json({ today, ...totals.results[0], daily: daily.results });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname.replace(/\/+$/, '');

    if (!path.startsWith('/api/')) return env.ASSETS.fetch(request);

    try {
      await ensureSchema(env.DB);

      if (path === '/api/comments') {
        if (request.method === 'GET') return await listComments(url, env);
        if (request.method === 'POST') return await createComment(request, env);
        return err('method_not_allowed', 405);
      }

      if (path === '/api/visit') {
        if (request.method === 'POST') return await recordVisit(request, env);
        return err('method_not_allowed', 405);
      }

      if (path === '/api/admin/stats') {
        if (!env.ADMIN_PASSWORD) return err('admin_disabled', 503);
        if (!isAdmin(request, env)) return err('unauthorized', 401);
        if (request.method === 'GET') return await adminStats(env);
        return err('method_not_allowed', 405);
      }

      if (path === '/api/admin/comments' || path.startsWith('/api/admin/comments/')) {
        if (!env.ADMIN_PASSWORD) return err('admin_disabled', 503);
        if (!isAdmin(request, env)) return err('unauthorized', 401);
        if (path === '/api/admin/comments' && request.method === 'GET') return await adminList(env);
        const m = path.match(/^\/api\/admin\/comments\/(\d+)$/);
        if (m && request.method === 'DELETE') return await adminDelete(Number(m[1]), env);
        return err('not_found', 404);
      }

      return err('not_found', 404);
    } catch (e) {
      console.error('comments api error', e);
      return err('server_error', 500);
    }
  },
};
