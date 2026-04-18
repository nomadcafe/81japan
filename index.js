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
    // 同步两个shownCount
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

function openModal(name, nameJa, addr, phone, langs, depts, hours, closed, note) {
  document.getElementById('mTitle').textContent = name;
  document.getElementById('mTitleJa').textContent = nameJa;
  document.getElementById('mAddr').textContent = addr;
  document.getElementById('mPhone').textContent = phone;
  document.getElementById('mHours').textContent = hours;
  document.getElementById('mClosed').textContent = closed;

  const noteEl = document.getElementById('mNote');
  if (note && note.trim()) {
    noteEl.textContent = '⚠ 注意：' + note;
    noteEl.style.display = '';
  } else {
    noteEl.textContent = '';
    noteEl.style.display = 'none';
  }

  const langsEl = document.getElementById('mLangs');
  langsEl.innerHTML = '';
  langs.split(' ').forEach(lang => {
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
  depts.split(' / ').forEach(d => {
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
    if (method === 'region') {
      return (a.dataset.region || '').localeCompare(b.dataset.region || '', 'zh');
    }
    if (method === 'dept') {
      return (a.dataset.depts || '').localeCompare(b.dataset.depts || '', 'zh');
    }
    // 默认：最近更新，按卡片footer里的更新时间倒序
    const parseDate = c => {
      const t = c.querySelector('.card-footer span') ? c.querySelector('.card-footer span').textContent : '';
      const m = t.match(/(\d{4})年(\d{1,2})月/);
      return m ? parseInt(m[1]) * 100 + parseInt(m[2]) : 0;
    };
    return parseDate(b) - parseDate(a);
  });

  cards.forEach(c => list.appendChild(c));
  // 重新触发fade动画
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

function handleRegionSelect(val) {
  if (val === '全部地区') {
    const allBtn = document.querySelector('[data-region-filter="全部"]');
    if (allBtn) filterRegion('全部', allBtn);
  } else {
    const sidebarBtn = document.querySelector('[data-region-filter="' + val + '"]');
    if (sidebarBtn) filterRegion(val, sidebarBtn);
    else { document.getElementById('searchInput').value = val; filterCards(); }
  }
}

function filterRegion(region, el) {
  document.querySelectorAll('[data-region-filter]').forEach(o => o.classList.remove('active'));
  el.classList.add('active');
  // 同步顶部下拉菜单
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

// ── 自动统计数字 ──
function updateStats() {
  const cards = document.querySelectorAll('#cardList .hospital-card');
  const total = cards.length;

  // 顶部统计
  const totalEl = document.getElementById('totalCount');
  if (totalEl) totalEl.textContent = total;

  // 都道府县去重
  const regions = new Set();
  cards.forEach(c => { if (c.dataset.region) regions.add(c.dataset.region.trim()); });
  const regionEl = document.getElementById('regionCount');
  if (regionEl) regionEl.textContent = regions.size;

  // 专科去重
  const depts = new Set();
  cards.forEach(c => {
    if (c.dataset.depts) c.dataset.depts.split(' ').forEach(d => { if (d) depts.add(d.trim()); });
  });
  const deptEl = document.getElementById('deptCount');
  if (deptEl) deptEl.textContent = depts.size;

  // 侧边栏地区计数
  const regionMap = { 'fc-all': '全部', 'fc-tokyo': '东京', 'fc-osaka': '大阪',
    'fc-fukuoka': '福冈', 'fc-sapporo': '札幌', 'fc-nagoya': '名古屋', 'fc-kobe': '神户' };
  Object.entries(regionMap).forEach(([id, key]) => {
    const el = document.getElementById(id);
    if (!el) return;
    if (key === '全部') { el.textContent = total; return; }
    const count = Array.from(cards).filter(c => c.dataset.region === key).length;
    el.textContent = count;
    // 隐藏0条的地区
    el.closest('.filter-option').style.display = count === 0 ? 'none' : '';
  });

  // 侧边栏语言计数
  const cnCount = Array.from(cards).filter(c => c.dataset.lang && c.dataset.lang.includes('中文')).length;
  const enCount = Array.from(cards).filter(c => c.dataset.lang && c.dataset.lang.includes('英文')).length;
  const flAll = document.getElementById('fl-all');
  const flCn = document.getElementById('fl-cn');
  const flEn = document.getElementById('fl-en');
  if (flAll) flAll.textContent = total;
  if (flCn) flCn.textContent = cnCount;
  if (flEn) flEn.textContent = enCount;
}

// 页面加载后立即统计 + 恢复语言设置
document.addEventListener('DOMContentLoaded', () => {
  updateStats();
  const savedLang = localStorage.getItem('lang');
  if (savedLang === 'en') {
    const langBtns = document.querySelectorAll('.lang-opt');
    if (langBtns.length >= 2) switchLang('en', langBtns[1]);
  }
});
window.addEventListener('load', updateStats);

document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
document.querySelectorAll('.copy-year').forEach(el => el.textContent = new Date().getFullYear());
