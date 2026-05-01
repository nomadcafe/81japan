export const prerender = false;

const TG_TOKEN = import.meta.env.TELEGRAM_BOT_TOKEN;
const TG_CHAT = import.meta.env.TELEGRAM_CHAT_ID;

const MAX_FIELD = 1000;
const MAX_TOTAL = 4096;

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8' },
  });
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
  const url = truncate(data['网址']);
  const noteParts = [truncate(data['备注']), url ? `官网: ${url}` : ''].filter(Boolean);
  const obj = {
    name: truncate(data['医院名称']),
    jpName: '',
    region: '',
    address: truncate(data['所在地']),
    addressShort: truncate(data['所在地']),
    phone: truncate(data['电话']),
    langs: langsFrom(data['语言服务']),
    langDetail: truncate(data['语言服务']),
    depts: deptsFrom(data['科室']),
    hours: '',
    hoursShort: '',
    closed: '',
    note: noteParts.join(' / '),
    updated: ymNow(),
    searchKeys: truncate(data['医院名称']),
  };
  return ',' + JSON.stringify(obj, null, 2);
}

export async function POST({ request, clientAddress }) {
  if (!TG_TOKEN || !TG_CHAT) {
    console.error('Missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID');
    return json({ ok: false, error: '服务未配置' }, 500);
  }

  let data;
  try {
    data = await request.json();
  } catch {
    return json({ ok: false, error: '无法解析表单' }, 400);
  }
  if (!data || typeof data !== 'object') {
    return json({ ok: false, error: '无法解析表单' }, 400);
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
    return json({ ok: false, error: '内容不能为空' }, 400);
  }

  lines.push('');
  lines.push(`<i>${new Date().toISOString()}</i>`);

  if (type.includes('新增')) {
    lines.push('');
    lines.push('📋 <b>JSON 片段</b>（点击复制，粘贴到 hospitals.json 末尾 <code>]</code> 之前）');
    lines.push(`<pre>${escapeHtml(buildHospitalSnippet(data))}</pre>`);
  }

  let text = lines.join('\n');
  if (text.length > MAX_TOTAL) text = text.slice(0, MAX_TOTAL - 1) + '…';

  try {
    const res = await fetch(`https://api.telegram.org/bot${TG_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        chat_id: TG_CHAT,
        text,
        parse_mode: 'HTML',
        disable_web_page_preview: true,
      }),
    });
    if (!res.ok) {
      const body = await res.text();
      console.error('Telegram error', res.status, body);
      return json({ ok: false, error: '通知发送失败' }, 502);
    }
  } catch (err) {
    console.error('Telegram fetch failed', err);
    return json({ ok: false, error: '通知发送失败' }, 502);
  }

  return json({ ok: true });
}
