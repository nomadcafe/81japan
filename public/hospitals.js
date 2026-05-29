// ── 筛选状态 ──
const filterState = { region: '', lang: '', query: '' };

// ── 组合筛选 ──
function applyFilters() {
  const q = filterState.query.trim().toLowerCase();
  const region = filterState.region;
  const lang = filterState.lang.toLowerCase();
  const cards = document.querySelectorAll('#cardList .hospital-card');
  let shown = 0;
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
    const match = matchRegion && matchLang && matchQuery;
    c.style.display = match ? '' : 'none';
    if (match) shown++;
  });
  document.getElementById('shownCount').textContent = shown;
  const enCount = document.getElementById('shownCountEn');
  if (enCount) enCount.textContent = shown;
  document.getElementById('emptyState').style.display = shown === 0 ? '' : 'none';
}

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
  applyFilters();
}

function setSearch(val) {
  document.getElementById('searchInput').value = val;
  filterState.query = val;
  applyFilters();
  scrollToResults();
}

function filterRegion(region, el) {
  document.querySelectorAll('[data-region-filter]').forEach(o => o.classList.remove('active'));
  el.classList.add('active');
  filterState.region = region === '全部' ? '' : region;
  applyFilters();
  scrollToResults();
}

function filterLang(lang, el) {
  document.querySelectorAll('[data-lang-filter]').forEach(o => o.classList.remove('active'));
  el.classList.add('active');
  filterState.lang = lang === '全部' ? '' : lang;
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

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.copy-year').forEach(el => el.textContent = new Date().getFullYear());
});
