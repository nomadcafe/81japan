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

// /api/submit 会带回稳定的 code。此前所有失败都显示同一句「提交失败，请重试」——
// 被限流的人照着提示继续点，只会一直失败。
const ERR = isEn ? {
  rate_limited: 'Too many submissions — please wait a minute',
  too_large: 'Submission is too long — please shorten it',
  empty: 'Please fill in at least one field',
  not_configured: 'Submissions are temporarily unavailable',
  upstream: "Couldn't deliver your submission — please try again later",
} : {
  rate_limited: '提交太频繁了，请等一分钟再试',
  too_large: '内容太长了，请精简一下',
  empty: '内容不能为空',
  not_configured: '投稿服务暂时不可用',
  upstream: '投稿没能送达，请稍后再试',
};

function switchType(type, btn) {
  currentType = type;
  document.querySelectorAll('.type-btn').forEach(b => {
    b.classList.toggle('active', b === btn);
    b.setAttribute('aria-pressed', b === btn ? 'true' : 'false');
  });
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
    if (!el) return;
    const bad = !el.value.trim();
    el.classList.toggle('error', bad);
    el.setAttribute('aria-invalid', bad ? 'true' : 'false');
    if (bad && valid) el.focus();
    if (bad) valid = false;
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
      let code = '';
      try { code = (await res.json()).code || ''; } catch {}
      btnText.textContent = ERR[code] || STR.failed;
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
