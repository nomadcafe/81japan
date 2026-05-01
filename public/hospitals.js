// ── 语言切换 ──
function switchLang(lang, btn) {
  document.querySelectorAll('.lang-opt').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  localStorage.setItem('lang', lang);
  if (lang === 'en') {
    document.body.classList.add('lang-en');
    document.documentElement.setAttribute('lang', 'en');
    document.getElementById('searchInput').placeholder = 'Search by hospital name, city, department…';
    document.querySelectorAll('#sortSelect option').forEach(o => { if(o.dataset.en) o.textContent = o.dataset.en; });
    document.title = '81Japan | Chinese Living Guide in Japan';
    const n = document.getElementById('shownCount');
    const ne = document.getElementById('shownCountEn');
    if (n && ne) ne.textContent = n.textContent;
  } else {
    document.body.classList.remove('lang-en');
    document.documentElement.setAttribute('lang', 'zh');
    document.getElementById('searchInput').placeholder = '搜索医院名称、城市、科室…';
    document.querySelectorAll('#sortSelect option').forEach(o => { if(o.dataset.zh) o.textContent = o.dataset.zh; });
    document.title = '81日本 | 收集的一些在日生活中文指南';
  }
}

const LANG_CONFIG = {
  '中文': { cls: 'lang-cn', sub: 'Chinese' },
  '英文': { cls: 'lang-en', sub: 'English' },
  '粤语': { cls: 'lang-cn', sub: 'Cantonese' },
  '台语': { cls: 'lang-cn', sub: 'Taiwanese' },
  '韩文': { cls: 'lang-en', sub: 'Korean' },
  '俄文': { cls: 'lang-en', sub: 'Russian' },
};
const LANG_TOKEN_RE = /中文|英文|粤语|台语|韩文|俄文/g;

// ── 渲染 ──
function escapeHtml(s) {
  return String(s ?? '').replace(/[&<>"']/g, c =>
    ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}

function formatUpdated(s) {
  const m = (s || '').match(/^(\d{4})-(\d{1,2})$/);
  return m ? `${m[1]}年${parseInt(m[2], 10)}月` : (s || '');
}

function createHospitalCard(h) {
  const card = document.createElement('div');
  card.className = 'hospital-card fade-in';
  card.setAttribute('role', 'listitem');
  card.dataset.name = h.searchKeys || h.name;
  card.dataset.region = h.region || '';
  card.dataset.lang = (h.langDetail || (h.langs || []).join(' '));
  card.dataset.depts = (h.depts || []).join(' ');

  const badges = [];
  const langSet = new Set(h.langs || []);
  if (langSet.has('中文')) badges.push('<span class="badge badge-cn">中文</span>');
  if (langSet.has('英文')) badges.push('<span class="badge badge-en">英文</span>');
  (h.extraBadges || []).forEach(b =>
    badges.push(`<span class="badge badge-new">${escapeHtml(b.label)}</span>`));

  const info = [];
  if (h.addressShort) info.push(`<div class="info-item"><span class="info-icon">📍</span>${escapeHtml(h.addressShort)}</div>`);
  if (h.warning) info.push(`<div class="info-item"><span class="info-icon">⚠️</span>${escapeHtml(h.warning)}</div>`);
  else if (h.hoursShort) info.push(`<div class="info-item"><span class="info-icon">🕐</span>${escapeHtml(h.hoursShort)}</div>`);

  const depts = (h.depts || []).map(d => `<span class="dept-tag">${escapeHtml(d)}</span>`).join('');

  const actions = [];
  const telDigits = (h.phone || '').replace(/[^\d+]/g, '');
  if (telDigits.length >= 9) {
    actions.push(`<a class="card-action" href="tel:${escapeHtml(telDigits)}" onclick="event.stopPropagation()" aria-label="拨打 ${escapeHtml(h.name)}"><span aria-hidden="true">📞</span> <span class="zh-only">电话</span><span class="en-only">Call</span></a>`);
  }
  const mapAddr = h.address || h.addressShort;
  if (mapAddr) {
    const mapQuery = encodeURIComponent(h.name + ' ' + mapAddr);
    actions.push(`<a class="card-action" href="https://www.google.com/maps/search/?api=1&query=${mapQuery}" target="_blank" rel="noopener noreferrer" onclick="event.stopPropagation()" aria-label="在地图查看 ${escapeHtml(h.name)}"><span aria-hidden="true">🗺</span> <span class="zh-only">地图</span><span class="en-only">Map</span></a>`);
  }

  card.innerHTML = `
    <div class="card-row1">
      <div>
        <div class="hospital-name">${escapeHtml(h.name)}</div>
        <div class="hospital-name-ja">${escapeHtml(h.jpName || '')}</div>
      </div>
      <div class="badges">${badges.join('')}</div>
    </div>
    <div class="card-info">
      <div class="card-info-row">${info.join('')}</div>
    </div>
    <div class="card-depts">${depts}</div>
    <div class="card-footer">
      <span class="card-updated">${escapeHtml(formatUpdated(h.updated))}</span>
      <div class="card-actions">${actions.join('')}</div>
    </div>
  `;
  card.addEventListener('click', () => openModal(h));
  return card;
}

function renderHospitals(data) {
  const list = document.getElementById('cardList');
  if (!list) return;
  list.innerHTML = '';
  const frag = document.createDocumentFragment();
  data.forEach(h => frag.appendChild(createHospitalCard(h)));
  list.appendChild(frag);
}

function injectHospitalSchema(data) {
  const old = document.getElementById('hospital-list-schema');
  if (old) old.remove();
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    '@id': 'https://www.81japan.com/#hospital-list',
    'name': '在日中文医院列表',
    'description': '日本全国提供中文医疗服务的医院与诊所',
    'url': 'https://www.81japan.com/',
    'numberOfItems': data.length,
    'itemListElement': data.map((h, i) => ({
      '@type': 'ListItem',
      'position': i + 1,
      'name': h.name,
    })),
  };
  const s = document.createElement('script');
  s.type = 'application/ld+json';
  s.id = 'hospital-list-schema';
  s.textContent = JSON.stringify(schema);
  document.head.appendChild(s);
}

// ── 详情弹窗 ──
function openModal(h) {
  document.getElementById('mTitle').textContent = h.name || '';
  document.getElementById('mTitleJa').textContent = h.jpName || '';
  document.getElementById('mAddr').textContent = h.address || h.addressShort || '—';
  document.getElementById('mPhone').textContent = h.phone || '—';
  document.getElementById('mHours').textContent = h.hours || h.hoursShort || '—';
  document.getElementById('mClosed').textContent = h.closed || '—';

  const noteEl = document.getElementById('mNote');
  if (h.note && h.note.trim()) {
    noteEl.textContent = '⚠ 注意：' + h.note;
    noteEl.style.display = '';
  } else {
    noteEl.textContent = '';
    noteEl.style.display = 'none';
  }

  const langsEl = document.getElementById('mLangs');
  langsEl.innerHTML = '';
  const src = h.langDetail || (h.langs || []).join(' ');
  const tokens = src.match(LANG_TOKEN_RE) || [];
  const seen = new Set();
  tokens.forEach(lang => {
    if (seen.has(lang)) return;
    seen.add(lang);
    const cfg = LANG_CONFIG[lang];
    if (!cfg) return;
    const div = document.createElement('div');
    div.className = 'lang-badge-large ' + cfg.cls;
    div.textContent = lang;
    const small = document.createElement('small');
    small.textContent = cfg.sub;
    div.appendChild(small);
    langsEl.appendChild(div);
  });

  const deptsEl = document.getElementById('mDepts');
  deptsEl.innerHTML = '';
  (h.depts || []).forEach(d => {
    const div = document.createElement('div');
    div.className = 'dept-item';
    div.textContent = d;
    deptsEl.appendChild(div);
  });

  document.getElementById('modalOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function openMap() {
  const name = document.getElementById('mTitle').textContent;
  const addr = document.getElementById('mAddr').textContent;
  const query = encodeURIComponent(name + ' ' + addr);
  window.open('https://www.google.com/maps/search/?api=1&query=' + query, '_blank', 'noopener,noreferrer');
}

function closeModal() {
  document.getElementById('modalOverlay').classList.remove('open');
  document.body.style.overflow = '';
}

function closeModalOnBg(e) {
  if (e.target === document.getElementById('modalOverlay')) closeModal();
}

// ── 搜索 / 筛选 / 排序 ──
function setSearch(val) {
  document.getElementById('searchInput').value = val;
  filterCards();
}

function resetFilterHighlights() {
  const allRegion = document.querySelector('[data-region-filter="全部"]');
  if (allRegion) { document.querySelectorAll('[data-region-filter]').forEach(o => o.classList.remove('active')); allRegion.classList.add('active'); }
  const allLang = document.querySelector('[data-lang-filter="全部"]');
  if (allLang) { document.querySelectorAll('[data-lang-filter]').forEach(o => o.classList.remove('active')); allLang.classList.add('active'); }
  const sel = document.querySelector('.search-select');
  if (sel) sel.value = '全部地区';
}

function filterCards() {
  const q = document.getElementById('searchInput').value.toLowerCase();
  const cards = document.querySelectorAll('#cardList .hospital-card');
  let shown = 0;
  cards.forEach(c => {
    const text = (c.dataset.name + c.dataset.region + c.dataset.depts + c.dataset.lang).toLowerCase();
    const match = !q || text.includes(q);
    c.style.display = match ? '' : 'none';
    if (match) shown++;
  });
  document.getElementById('shownCount').textContent = shown;
  const enCount = document.getElementById('shownCountEn');
  if (enCount) enCount.textContent = shown;
  document.getElementById('emptyState').style.display = shown === 0 ? '' : 'none';
}

function sortCards(method) {
  const list = document.getElementById('cardList');
  const cards = Array.from(list.querySelectorAll('.hospital-card'));

  cards.sort((a, b) => {
    if (method === 'region') return (a.dataset.region || '').localeCompare(b.dataset.region || '', 'zh');
    if (method === 'dept')   return (a.dataset.depts  || '').localeCompare(b.dataset.depts  || '', 'zh');
    const parseDate = c => {
      const t = c.querySelector('.card-footer span') ? c.querySelector('.card-footer span').textContent : '';
      const m = t.match(/(\d{4})年(\d{1,2})月/);
      return m ? parseInt(m[1]) * 100 + parseInt(m[2]) : 0;
    };
    return parseDate(b) - parseDate(a);
  });

  cards.forEach(c => list.appendChild(c));
  cards.forEach((c, i) => {
    c.style.opacity = '0';
    c.style.transform = 'translateY(8px)';
    setTimeout(() => {
      c.style.transition = 'opacity 0.25s ease, transform 0.25s ease';
      c.style.opacity = '';
      c.style.transform = '';
    }, i * 40);
  });
}

function filterRegion(region, el) {
  document.querySelectorAll('[data-region-filter]').forEach(o => o.classList.remove('active'));
  el.classList.add('active');
  const sel = document.querySelector('.search-select');
  if (sel) sel.value = region === '全部' ? '全部地区' : region;
  if (region === '全部') {
    document.getElementById('searchInput').value = '';
    filterCards();
  } else {
    setSearch(region);
  }
}

function filterLang(lang, el) {
  document.querySelectorAll('[data-lang-filter]').forEach(o => o.classList.remove('active'));
  el.classList.add('active');
  if (lang === '全部') {
    document.getElementById('searchInput').value = '';
    filterCards();
  } else {
    setSearch(lang);
  }
}

// ── 统计数字 ──
function updateStats() {
  const cards = document.querySelectorAll('#cardList .hospital-card');
  const total = cards.length;

  const totalEl = document.getElementById('totalCount');
  if (totalEl) totalEl.textContent = total;

  const regions = new Set();
  cards.forEach(c => { if (c.dataset.region) regions.add(c.dataset.region.trim()); });
  const regionEl = document.getElementById('regionCount');
  if (regionEl) regionEl.textContent = regions.size;

  const depts = new Set();
  cards.forEach(c => {
    if (c.dataset.depts) c.dataset.depts.split(' ').forEach(d => { if (d) depts.add(d.trim()); });
  });
  const deptEl = document.getElementById('deptCount');
  if (deptEl) deptEl.textContent = depts.size;

  const regionMap = { 'fc-all': '全部', 'fc-tokyo': '东京', 'fc-osaka': '大阪',
    'fc-fukuoka': '福冈', 'fc-sapporo': '札幌', 'fc-nagoya': '名古屋', 'fc-kobe': '神户' };
  Object.entries(regionMap).forEach(([id, key]) => {
    const el = document.getElementById(id);
    if (!el) return;
    if (key === '全部') { el.textContent = total; return; }
    const count = Array.from(cards).filter(c => c.dataset.region === key).length;
    el.textContent = count;
    el.closest('.filter-option').style.display = count === 0 ? 'none' : '';
  });

  const cnCount = Array.from(cards).filter(c => c.dataset.lang && c.dataset.lang.includes('中文')).length;
  const enCount = Array.from(cards).filter(c => c.dataset.lang && c.dataset.lang.includes('英文')).length;
  const flAll = document.getElementById('fl-all');
  const flCn = document.getElementById('fl-cn');
  const flEn = document.getElementById('fl-en');
  if (flAll) flAll.textContent = total;
  if (flCn) flCn.textContent = cnCount;
  if (flEn) flEn.textContent = enCount;

  // 同步英文视图的计数
  const shown = document.getElementById('shownCount');
  const shownEn = document.getElementById('shownCountEn');
  if (shown && shownEn) {
    shown.textContent = total;
    shownEn.textContent = total;
  }
}

// ── 初始化 ──
async function init() {
  try {
    const res = await fetch('hospitals.json', { cache: 'no-cache' });
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const data = await res.json();
    renderHospitals(data);
    injectHospitalSchema(data);
    updateStats();
  } catch (err) {
    console.error('Failed to load hospitals.json:', err);
    const list = document.getElementById('cardList');
    if (list) list.innerHTML = '<div style="padding:40px;text-align:center;color:var(--ink-3);">加载医院数据失败，请刷新页面重试。</div>';
  }

  const savedLang = localStorage.getItem('lang');
  if (savedLang === 'en') {
    const btns = document.querySelectorAll('.lang-opt');
    if (btns.length >= 2) switchLang('en', btns[1]);
  }
}

document.addEventListener('DOMContentLoaded', init);
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
document.querySelectorAll('.copy-year').forEach(el => el.textContent = new Date().getFullYear());
