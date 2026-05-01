// ── 语言切换 ──
function switchLang(lang, btn) {
  document.querySelectorAll('.lang-opt').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  localStorage.setItem('lang', lang);
  if (lang === 'en') {
    document.body.classList.add('lang-en');
    document.documentElement.setAttribute('lang', 'en');
    document.getElementById('searchInput').placeholder = 'Search by hospital name, city, department…';
    document.querySelectorAll('#sortSelect option').forEach(o => { if (o.dataset.en) o.textContent = o.dataset.en; });
    document.title = '81Japan | Chinese Living Guide in Japan';
    const n = document.getElementById('shownCount');
    const ne = document.getElementById('shownCountEn');
    if (n && ne) ne.textContent = n.textContent;
  } else {
    document.body.classList.remove('lang-en');
    document.documentElement.setAttribute('lang', 'zh');
    document.getElementById('searchInput').placeholder = '搜索医院名称、城市、科室…';
    document.querySelectorAll('#sortSelect option').forEach(o => { if (o.dataset.zh) o.textContent = o.dataset.zh; });
    document.title = '81日本 | 收集的一些在日生活中文指南';
  }
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

function filterRegion(region, el) {
  document.querySelectorAll('[data-region-filter]').forEach(o => o.classList.remove('active'));
  el.classList.add('active');
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

document.addEventListener('DOMContentLoaded', () => {
  const savedLang = localStorage.getItem('lang');
  if (savedLang === 'en') {
    const btns = document.querySelectorAll('.lang-opt');
    if (btns.length >= 2) switchLang('en', btns[1]);
  }
  document.querySelectorAll('.copy-year').forEach(el => el.textContent = new Date().getFullYear());
});
