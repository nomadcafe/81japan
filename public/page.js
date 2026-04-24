function switchLang(lang, btn) {
  document.querySelectorAll('.lang-opt').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  localStorage.setItem('lang', lang);
  if (lang === 'en') {
    document.body.classList.add('lang-en');
    document.documentElement.setAttribute('lang', 'en');
  } else {
    document.body.classList.remove('lang-en');
    document.documentElement.setAttribute('lang', 'zh');
  }
  const titleEl = document.querySelector('title');
  if (titleEl && titleEl.dataset.zh && titleEl.dataset.en) {
    titleEl.textContent = lang === 'en' ? titleEl.dataset.en : titleEl.dataset.zh;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const savedLang = localStorage.getItem('lang');
  if (savedLang === 'en') {
    const langBtns = document.querySelectorAll('.lang-opt');
    if (langBtns.length >= 2) switchLang('en', langBtns[1]);
  }
});
