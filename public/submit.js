let currentType = 'new';

function switchType(type, btn) {
  currentType = type;
  document.querySelectorAll('.type-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById('fields-new').style.display = type === 'new' ? '' : 'none';
  document.getElementById('fields-fix').style.display = type === 'fix' ? '' : 'none';
  document.getElementById('fields-other').style.display = type === 'other' ? '' : 'none';
  const types = { new: '新增医院', fix: '纠错/补充', other: '其他建议' };
  document.getElementById('typeHidden').value = types[type];
}

function updateChar(el, id) {
  const max = 300;
  if (el.value.length > max) el.value = el.value.slice(0, max);
  document.getElementById(id).textContent = el.value.length + ' / ' + max;
}

document.getElementById('submitForm').addEventListener('submit', async function(e) {
  e.preventDefault();
  const required = { new: ['f-name','f-location','f-lang'], fix: ['f-fix-name','f-fix-desc'], other: ['f-other'] };
  let valid = true;
  required[currentType].forEach(id => {
    const el = document.getElementById(id);
    if (!el || !el.value.trim()) { el && el.classList.add('error'); valid = false; }
    else el && el.classList.remove('error');
  });
  if (!valid) return;

  const btn = document.getElementById('submitBtn');
  const btnText = document.getElementById('btnText');
  btn.disabled = true;
  btnText.innerHTML = '<span class="zh-only">提交中…</span><span class="en-only">Submitting…</span>';
  if (document.body.classList.contains('lang-en')) {
    btnText.querySelector('.zh-only').style.display = 'none';
    btnText.querySelector('.en-only').style.display = 'inline';
  }

  try {
    const res = await fetch(this.action, { method:'POST', body: new FormData(this), headers:{'Accept':'application/json'} });
    if (res.ok) {
      document.getElementById('formCard').style.display = 'none';
      document.getElementById('successCard').style.display = 'block';
    } else {
      btnText.innerHTML = '<span>提交失败，请重试</span>';
      btn.disabled = false;
    }
  } catch {
    btnText.innerHTML = '<span>网络错误，请重试</span>';
    btn.disabled = false;
  }
});

function resetForm() {
  document.getElementById('submitForm').reset();
  document.getElementById('formCard').style.display = '';
  document.getElementById('successCard').style.display = 'none';
  document.getElementById('submitBtn').disabled = false;
  document.getElementById('btnText').innerHTML = '<span class="zh-only">提交投稿</span><span class="en-only">Submit</span>';
  switchType('new', document.querySelector('.type-btn'));
  ['c1','c2','c3'].forEach(id => { const el = document.getElementById(id); if(el) el.textContent = '0 / 300'; });
}

function switchLang(lang, btn) {
  document.querySelectorAll('.lang-opt').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  localStorage.setItem('lang', lang);
  if (lang === 'en') {
    document.body.classList.add('lang-en');
    document.documentElement.setAttribute('lang', 'en');
    document.title = 'Contribute · 81Japan';
  } else {
    document.body.classList.remove('lang-en');
    document.documentElement.setAttribute('lang', 'zh');
    document.title = '投稿 · 81日本';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const savedLang = localStorage.getItem('lang');
  if (savedLang === 'en') {
    const langBtns = document.querySelectorAll('.lang-opt');
    if (langBtns.length >= 2) switchLang('en', langBtns[1]);
  }
  document.querySelectorAll('.copy-year').forEach(el => el.textContent = new Date().getFullYear());
});
