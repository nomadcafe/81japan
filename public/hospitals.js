// ── 筛选状态 ──
const filterState = { region: '', lang: '', query: '' };

// ── URL 同步 ──
// 首页 JSON-LD 里声明了 SearchAction → /?q={search_term_string}，这里负责消费它；
// 顺带把语言筛选也写进 URL，结果可以直接分享。
// 地区不进 URL —— 地区本身就是独立页面（/osaka 等）。
// canonical 始终是无参数的，所以带参 URL 不会造成重复内容。
const LANG_PARAM = { '中文': 'chinese', '英文': 'english', '越南语': 'vietnamese' };
const LANG_FROM_PARAM = Object.fromEntries(
  Object.entries(LANG_PARAM).map(([zh, en]) => [en, zh])
);

// 把当前搜索词与语言筛选写回地址栏（用 replaceState，避免每敲一个字就多一条历史）
function syncUrl() {
  if (!window.history || !history.replaceState) return;
  const p = new URLSearchParams();
  if (filterState.query.trim()) p.set('q', filterState.query.trim());
  if (filterState.lang) p.set('lang', LANG_PARAM[filterState.lang] || filterState.lang);
  const qs = p.toString();
  history.replaceState(null, '', qs ? `${location.pathname}?${qs}` : location.pathname);
}

// 从地址栏恢复筛选状态（页面加载时调用一次）
function readUrl() {
  const p = new URLSearchParams(location.search);
  const q = p.get('q') || '';
  const langParam = p.get('lang') || '';
  const lang = LANG_FROM_PARAM[langParam] || (langParam in LANG_PARAM ? langParam : '');

  if (q) {
    filterState.query = q;
    const input = document.getElementById('searchInput');
    if (input) input.value = q;
  }
  if (lang) {
    filterState.lang = lang;
    // 同步侧栏高亮：本页可能没有该语言的选项（如地区页语言不足），此时只保留筛选
    const opts = document.querySelectorAll('[data-lang-filter]');
    const target = document.querySelector(`[data-lang-filter="${lang}"]`);
    if (target) {
      opts.forEach((o) => o.classList.remove('active'));
      target.classList.add('active');
    }
  }
}

// ── 分页（“加载更多”）──
const PAGE_SIZE = 12;
let visibleCount = PAGE_SIZE;
const isEn = location.pathname.startsWith('/en');
const moreLabel = (n) => isEn ? `Show ${Math.min(PAGE_SIZE, n)} more · ${n} left` : `加载更多 · 还剩 ${n} 家`;

// ── 组合筛选 ──
function applyFilters() {
  const q = filterState.query.trim().toLowerCase();
  const region = filterState.region;
  const lang = filterState.lang.toLowerCase();
  const cards = document.querySelectorAll('#cardList .hospital-card');
  const matched = [];
  cards.forEach(c => {
    const cRegion = c.dataset.region || '';
    const cLang = (c.dataset.lang || '').toLowerCase();
    const cText = (
      (c.dataset.name || '') + ' ' +
      cRegion + ' ' +
      (c.dataset.depts || '') + ' ' +
      cLang
    ).toLowerCase();
    const matchRegion = !region || cRegion === region;
    const matchLang = !lang || cLang.includes(lang);
    const matchQuery = !q || cText.includes(q);
    if (matchRegion && matchLang && matchQuery) matched.push(c);
    else c.style.display = 'none';
  });

  // 只显示前 visibleCount 家匹配结果，其余先收起
  matched.forEach((c, i) => { c.style.display = i < visibleCount ? '' : 'none'; });

  const shown = matched.length;
  document.getElementById('shownCount').textContent = shown;
  const enCount = document.getElementById('shownCountEn');
  if (enCount) enCount.textContent = shown;
  document.getElementById('emptyState').style.display = shown === 0 ? '' : 'none';
  updateLoadMore(shown);
}

function updateLoadMore(matchedTotal) {
  const btn = document.getElementById('loadMoreBtn');
  if (!btn) return;
  const remaining = matchedTotal - visibleCount;
  if (remaining > 0) {
    btn.textContent = moreLabel(remaining);
    btn.style.display = '';
  } else {
    btn.style.display = 'none';
  }
}

function loadMore() {
  visibleCount += PAGE_SIZE;
  applyFilters();
}

// 改变筛选条件时重置分页，回到第一页
function resetPaging() { visibleCount = PAGE_SIZE; }

// 点击侧栏筛选后，结果会变少导致页面变矮，浏览器把滚动位置夹到新底部（看起来像“跳到最下方”）。
// 这里把视口滚回结果列表顶部（避开 sticky 导航的高度）。
function scrollToResults() {
  const layout = document.querySelector('.main-layout');
  if (!layout) return;
  const nav = document.querySelector('nav');
  const offset = nav ? nav.offsetHeight + 8 : 0;
  const top = layout.getBoundingClientRect().top + window.scrollY - offset;
  window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
}

function onSearchInput() {
  filterState.query = document.getElementById('searchInput').value;
  resetPaging();
  applyFilters();
  syncUrl();
}

function setSearch(val) {
  document.getElementById('searchInput').value = val;
  filterState.query = val;
  resetPaging();
  applyFilters();
  syncUrl();
  scrollToResults();
}

function filterRegion(region, el) {
  document.querySelectorAll('[data-region-filter]').forEach(o => o.classList.remove('active'));
  el.classList.add('active');
  filterState.region = region === '全部' ? '' : region;
  resetPaging();
  applyFilters();
  scrollToResults();
}

function filterLang(lang, el) {
  document.querySelectorAll('[data-lang-filter]').forEach(o => o.classList.remove('active'));
  el.classList.add('active');
  filterState.lang = lang === '全部' ? '' : lang;
  resetPaging();
  applyFilters();
  syncUrl();
  scrollToResults();
}

// ── 排序 ──
function sortCards(method) {
  const list = document.getElementById('cardList');
  const cards = Array.from(list.querySelectorAll('.hospital-card'));

  cards.sort((a, b) => {
    if (method === 'region') return (a.dataset.region || '').localeCompare(b.dataset.region || '', 'zh');
    if (method === 'dept')   return (a.dataset.depts  || '').localeCompare(b.dataset.depts  || '', 'zh');
    const parseDate = c => {
      const m = (c.dataset.updated || '').match(/^(\d{4})-(\d{1,2})$/);
      return m ? parseInt(m[1]) * 100 + parseInt(m[2]) : 0;
    };
    return parseDate(b) - parseDate(a);
  });

  cards.forEach(c => list.appendChild(c));
  resetPaging();
  applyFilters();

  // 仅对当前可见的卡片做入场动画
  const visible = cards.filter(c => c.style.display !== 'none');
  visible.forEach((c, i) => {
    c.style.opacity = '0';
    c.style.transform = 'translateY(8px)';
    setTimeout(() => {
      c.style.transition = 'opacity 0.25s ease, transform 0.25s ease';
      c.style.opacity = '';
      c.style.transform = '';
    }, i * 40);
  });
}

// ── 注入“加载更多”按钮 + 初始分页 ──
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.copy-year').forEach(el => el.textContent = new Date().getFullYear());

  const list = document.getElementById('cardList');
  if (list) {
    const btn = document.createElement('button');
    btn.id = 'loadMoreBtn';
    btn.className = 'load-more-btn';
    btn.type = 'button';
    btn.onclick = loadMore;
    btn.style.display = 'none';
    list.insertAdjacentElement('afterend', btn);
    readUrl();
    applyFilters();
  }
});
