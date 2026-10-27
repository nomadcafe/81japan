export const prerender = false;

const TG_TOKEN = import.meta.env.TELEGRAM_BOT_TOKEN;
const TG_CHAT = import.meta.env.TELEGRAM_CHAT_ID;

// Telegram 单条上限 4096 字（按解析掉 HTML 标签后的正文算）。
// 新增医院最多 9 个字段，每个 400 字以内，主消息就不会超限；JSON 片段另发一条。
const MAX_FIELD = 400;
const TG_LIMIT = 4096;
// 正常投稿不到 10KB；先看 content-length，免得把超大请求体整个读进内存再解析
const MAX_BODY = 32 * 1024;

const ALLOWED_ORIGINS = ['https://www.81japan.com', 'https://81japan.com'];

// 注意：这是进程内计数。Vercel serverless 每个实例各算各的，
// 所以它挡的是「同一实例上的连续猛点」，不是全局配额。
// 真要全局限流得接外部存储（KV/Redis），当前投稿量还用不上。
const RATE_WINDOW_MS = 60_000;
const RATE_LIMIT = 5;
const ipBuckets = new Map();
let lastSweep = 0;

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8' },
  });
}

// code 是稳定标识，由前端翻成对应语言（error 仅留作日志/直接调用者可读）
function fail(code, error, status) {
  return json({ ok: false, code, error }, status);
}

function isAllowedOrigin(request) {
  if (import.meta.env.DEV) return true;
  const origin = request.headers.get('origin');
  if (origin) return ALLOWED_ORIGINS.includes(origin);
  const referer = request.headers.get('referer') || '';
  return ALLOWED_ORIGINS.some(o => referer === o || referer.startsWith(o + '/'));
}

// x-real-ip 由 Vercel 边缘写入，客户端伪造不了；x-forwarded-for 的第一段
// 在别的代理链路上可能是客户端自己填的，随便换个值就能绕过限流，只作兜底。
function getClientIp(request, clientAddress) {
  const real = request.headers.get('x-real-ip');
  if (real) return real.trim();
  const fwd = request.headers.get('x-forwarded-for') || clientAddress || '';
  return fwd.split(',')[0].trim() || 'unknown';
}

// 清掉整窗都没再出现的 IP。只清时间戳不清 key 的话，
// 实例活得越久 Map 越大，永远不会缩回去。
function sweep(now) {
  if (now - lastSweep < RATE_WINDOW_MS) return;
  lastSweep = now;
  for (const [ip, hits] of ipBuckets) {
    if (!hits.length || now - hits[hits.length - 1] >= RATE_WINDOW_MS) ipBuckets.delete(ip);
  }
}

function isRateLimited(ip) {
  const now = Date.now();
  sweep(now);
  const recent = (ipBuckets.get(ip) || []).filter(t => now - t < RATE_WINDOW_MS);
  if (recent.length >= RATE_LIMIT) {
    ipBuckets.set(ip, recent);
    return true;
  }
  recent.push(now);
  ipBuckets.set(ip, recent);
  return false;
}

function escapeHtml(s) {
  return String(s ?? '').replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
}

function truncate(s, n = MAX_FIELD) {
  const str = String(s ?? '').trim();
  return str.length > n ? str.slice(0, n) + '…' : str;
}

function pushField(lines, label, value) {
  const v = truncate(value);
  if (v) lines.push(`<b>${escapeHtml(label)}</b>: ${escapeHtml(v)}`);
}

function langsFrom(lang) {
  const s = String(lang ?? '');
  const out = [];
  if (s.includes('中文')) out.push('中文');
  if (s.includes('英文')) out.push('英文');
  return out;
}

const REGION_RULES = [
  ['横浜', ['横浜', '横滨', '橫濱', '横濱', '川崎', '神奈川']],
  ['东京', ['东京', '東京', '埼玉', '千叶', '千葉']],
  ['京都', ['京都']],
  ['神户', ['神户', '神戸', '兵库', '兵庫']],
  ['大阪', ['大阪']],
  ['福冈', ['福冈', '福岡']],
  ['札幌', ['札幌', '北海道']],
  ['名古屋', ['名古屋', '爱知', '愛知']],
];

function regionFrom(addr) {
  const s = String(addr ?? '');
  for (const [region, kws] of REGION_RULES) {
    if (kws.some(k => s.includes(k))) return region;
  }
  return '';
}

function deptsFrom(dept) {
  return String(dept ?? '')
    .split(/[、，,/;；\s]+/)
    .map(x => x.trim())
    .filter(Boolean);
}

function ymNow() {
  const d = new Date();
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}`;
}

function buildHospitalSnippet(data) {
  const name = truncate(data['医院名称']);
  const url = truncate(data['网址']);
  const noteParts = [truncate(data['备注']), url ? `官网: ${url}` : ''].filter(Boolean);
  const hours = truncate(data['营业时间']);
  const obj = {
    name,
    jpName: name,
    region: regionFrom(data['所在地']),
    address: truncate(data['所在地']),
    addressShort: truncate(data['所在地']),
    phone: truncate(data['电话']),
    langs: langsFrom(data['语言服务']),
    langDetail: truncate(data['语言服务']),
    depts: deptsFrom(data['科室']),
    hours,
    hoursShort: hours,
    closed: '',
    note: noteParts.join(' / '),
    updated: ymNow(),
    searchKeys: name,
  };
  return ',' + JSON.stringify(obj, null, 2);
}

export async function POST({ request, clientAddress }) {
  if (!isAllowedOrigin(request)) {
    return fail('forbidden', '禁止访问', 403);
  }

  const ip = getClientIp(request, clientAddress);
  if (isRateLimited(ip)) {
    return fail('rate_limited', '请求过于频繁，请稍后再试', 429);
  }

  if (!TG_TOKEN || !TG_CHAT) {
    console.error('Missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID');
    return fail('not_configured', '服务未配置', 500);
  }

  const declared = Number(request.headers.get('content-length') || 0);
  if (declared > MAX_BODY) {
    return fail('too_large', '内容过长', 413);
  }

  let data;
  try {
    const raw = await request.text();
    if (raw.length > MAX_BODY) return fail('too_large', '内容过长', 413);
    data = JSON.parse(raw);
  } catch {
    return fail('bad_request', '无法解析表单', 400);
  }
  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    return fail('bad_request', '无法解析表单', 400);
  }

  // Honeypot: 机器人通常会填所有字段
  if (truncate(data['_honey'])) return json({ ok: true });

  const type = truncate(data['投稿类型']) || '未指定';

  const lines = [`📥 <b>新投稿</b> · ${escapeHtml(type)}`, '━━━━━━━━━━'];

  if (type.includes('新增')) {
    pushField(lines, '医院', data['医院名称']);
    pushField(lines, '所在地', data['所在地']);
    pushField(lines, '语言', data['语言服务']);
    pushField(lines, '科室', data['科室']);
    pushField(lines, '电话', data['电话']);
    pushField(lines, '网址', data['网址']);
    pushField(lines, '营业时间', data['营业时间']);
    pushField(lines, '备注', data['备注']);
  } else if (type.includes('纠错')) {
    pushField(lines, '医院', data['纠错-医院名称']);
    pushField(lines, '问题', data['纠错-问题描述']);
  } else {
    pushField(lines, '建议', data['建议内容']);
  }

  pushField(lines, '联系', data['联系方式']);

  // 基础校验：除类型外至少有一个字段
  if (lines.length <= 2) {
    return fail('empty', '内容不能为空', 400);
  }

  lines.push('');
  lines.push(`<i>${new Date().toISOString()}</i>`);

  // 以前是拼成一条再按字数硬截断：一截就截在 <pre><code> 中间，
  // Telegram 解析不了 HTML 整条拒收，投稿方看到的是「送达失败」。
  // 现在 JSON 片段单独一条，过长就不发片段，主消息照常送达。
  const messages = [lines.join('\n')];
  if (type.includes('新增')) {
    const snippet = buildHospitalSnippet(data);
    messages.push(
      snippet.length < TG_LIMIT - 200
        ? `📋 <b>JSON 片段</b>（点右上角 COPY，粘贴到 src/data/hospitals.json 末尾 <code>]</code> 之前）\n<pre><code class="language-json">${escapeHtml(snippet)}</code></pre>`
        : '📋 字段太长，没生成 JSON 片段，请按上一条手动整理',
    );
  }

  try {
    for (const text of messages) await sendTelegram(text);
  } catch (err) {
    console.error('Telegram send failed', err);
    return fail('upstream', '通知发送失败', 502);
  }

  return json({ ok: true });
}

async function sendTelegram(text) {
  const res = await fetch(`https://api.telegram.org/bot${TG_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    signal: AbortSignal.timeout(8000),
    body: JSON.stringify({
      chat_id: TG_CHAT,
      text,
      parse_mode: 'HTML',
      disable_web_page_preview: true,
    }),
  });
  if (!res.ok) throw new Error(`Telegram ${res.status}: ${await res.text()}`);
}
