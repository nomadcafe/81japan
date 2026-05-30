// ── 筛选状态 ──
const filterState = { region: '', lang: '', query: '' };

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
}

function setSearch(val) {
  document.getElementById('searchInput').value = val;
  filterState.query = val;
  resetPaging();
  applyFilters();
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
    applyFilters();
  }
});
