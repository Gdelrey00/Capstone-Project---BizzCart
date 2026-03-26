// ── NAVIGATION ──
function gotoBooking() {
  window.location.href = 'booking.html';
}

// ── ADMIN LOGIN MODAL ──
function openLoginModal() {
  document.getElementById('login-modal').classList.add('open');
  setTimeout(() => document.getElementById('luser').focus(), 300);
}

function closeLoginModal(e) {
  if (!e || e.target === document.getElementById('login-modal'))
    document.getElementById('login-modal').classList.remove('open');
}

function doLogin() {
  const u = document.getElementById('luser').value.trim();
  const p = document.getElementById('lpass').value;
  if (u === 'admin' && p === 'kmj2026') {
    sessionStorage.setItem('kmj_admin_auth', '1');
    window.location.href = 'admin.html';
  } else {
    document.getElementById('lerr').style.display = 'block';
    document.getElementById('lpass').value = '';
  }
}

// ── TOAST ──
function showToast(msg, type = '') {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.className = 'toast show ' + type;
  setTimeout(() => t.className = 'toast', 3500);
}
