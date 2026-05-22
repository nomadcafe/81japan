let currentType = 'new';
const isEn = location.pathname.startsWith('/en/') || location.pathname === '/en';

const STR = isEn ? {
  submitting: 'Submitting…',
  submit: 'Submit',
  failed: 'Submission failed, please try again',
  networkError: 'Network error, please try again',
} : {
  submitting: '提交中…',
  submit: '提交投稿',
  failed: '提交失败，请重试',
  networkError: '网络错误，请重试',
};

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
  btnText.textContent = STR.submitting;

  try {
    const payload = Object.fromEntries(new FormData(this));
    const res = await fetch(this.action, {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    });
    if (res.ok) {
      document.getElementById('formCard').style.display = 'none';
      document.getElementById('successCard').style.display = 'block';
    } else {
      btnText.textContent = STR.failed;
      btn.disabled = false;
    }
  } catch {
    btnText.textContent = STR.networkError;
    btn.disabled = false;
  }
});

function resetForm() {
  document.getElementById('submitForm').reset();
  document.getElementById('formCard').style.display = '';
  document.getElementById('successCard').style.display = 'none';
  document.getElementById('submitBtn').disabled = false;
  document.getElementById('btnText').textContent = STR.submit;
  switchType('new', document.querySelector('.type-btn'));
  ['c1','c2','c3'].forEach(id => { const el = document.getElementById(id); if(el) el.textContent = '0 / 300'; });
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.copy-year').forEach(el => el.textContent = new Date().getFullYear());
});
