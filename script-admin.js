(function() {
  if (!sessionStorage.getItem('kmj_admin_auth')) {
    window.location.href = 'homepage.html';
  }
})();

// ── SIDEBAR ──
function toggleSidebar() {
  const sb = document.getElementById('sidebar');
  const bg = document.getElementById('sidebar-bg');
  const ham = document.getElementById('ham');
  const o = sb.classList.toggle('open');
  bg.classList.toggle('open', o);
  ham.classList.toggle('open', o);
}

function closeSidebar() {
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('sidebar-bg').classList.remove('open');
  document.getElementById('ham').classList.remove('open');
}

function showAdminPanel(name, btn) {
  document.querySelectorAll('.apanel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nitem').forEach(b => b.classList.remove('active'));
  document.getElementById('panel-' + name).classList.add('active');
  if (btn) btn.classList.add('active');
  closeSidebar();
  window.scrollTo(0, 0);
}

function adminLogout() {
  sessionStorage.removeItem('kmj_admin_auth');
  window.location.href = 'homepage.html';
}

// ── BOOKING ACTIONS ──
function confirmCard(btn, name) {
  const card = btn.closest('.bcard');
  card.querySelector('.pill').outerHTML = '<span class="pill confirmed">✓ Confirmed</span>';
  card.setAttribute('data-s', 'confirmed');
  btn.closest('.bcard-acts').innerHTML = '<button class="ab v">View</button>';
  updatePendingCount();
  showToast(name + "'s booking confirmed! ✓", 's');
}

function cancelCard(btn) {
  const card = btn.closest('.bcard');
  card.querySelector('.pill').outerHTML = '<span class="pill cancelled">✗ Cancelled</span>';
  card.setAttribute('data-s', 'cancelled');
  btn.closest('.bcard-acts').innerHTML = '<button class="ab v">View</button>';
  updatePendingCount();
  showToast('Booking cancelled.', 'e');
}

function updatePendingCount() {
  const n = document.querySelectorAll('[data-s="pending"]').length;
  document.getElementById('pcount').textContent = n;
}

function filterCards(status, btn) {
  document.querySelectorAll('.fb').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  document.querySelectorAll('#all-bcards .bcard').forEach(c => {
    c.style.display = (status === 'all' || c.getAttribute('data-s') === status) ? '' : 'none';
  });
}

function openDModal(name, ev, date, time, pkg, total, guests, venue, status) {
  const sm = { Pending: 'pending', Confirmed: 'confirmed', Completed: 'completed', Cancelled: 'cancelled' };
  document.getElementById('dmod-title').textContent = name + ' — ' + ev;
  document.getElementById('dmod-body').innerHTML = `
    <div class="dmod-row"><span class="mk">Status</span><span class="mv"><span class="pill ${sm[status] || 'pending'}">${status}</span></span></div>
    <div class="dmod-row"><span class="mk">Date</span><span class="mv">${date}</span></div>
    <div class="dmod-row"><span class="mk">Time</span><span class="mv">${time}</span></div>
    <div class="dmod-row"><span class="mk">Package(s)</span><span class="mv">${pkg}</span></div>
    <div class="dmod-row"><span class="mk">Guests</span><span class="mv">${guests}</span></div>
    <div class="dmod-row"><span class="mk">Venue</span><span class="mv">${venue}</span></div>
    <div class="dmod-row"><span class="mk">Total</span><span class="mv" style="color:var(--accent);font-size:16px">${total}</span></div>`;
  const cb = document.getElementById('dmod-confirm');
  const xb = document.getElementById('dmod-cancel');
  if (status !== 'Pending') { cb.style.display = 'none'; xb.style.display = 'none'; }
  else {
    cb.style.display = '';
    xb.style.display = '';
    cb.onclick = () => { showToast(name + "'s booking confirmed! ✓", 's'); closeDModal(); };
  }
  document.getElementById('doverlay').classList.add('open');
}

function closeDModal(e) {
  if (!e || e.target === document.getElementById('doverlay'))
    document.getElementById('doverlay').classList.remove('open');
}

// ── ADMIN CALENDAR ──
function buildAdminCal() {
  const cal = document.getElementById('acalcells');
  if (!cal) return;
  cal.innerHTML = '';
  const evts = {
    6: [{ l: '10AM Rosa', c: 'var(--green)' }, { l: '4PM Carlo', c: 'var(--accent)' }],
    15: [{ l: '2PM Maria', c: 'var(--accent)' }],
    22: [{ l: '5PM Juan', c: 'var(--brown)' }],
    28: [{ l: '12PM Ana', c: 'var(--green)' }]
  };
  const first = new Date(2026, 2, 1).getDay();
  for (let i = 0; i < first; i++) {
    const e = document.createElement('div');
    e.style.minHeight = '66px';
    cal.appendChild(e);
  }
  for (let d = 1; d <= 31; d++) {
    const el = document.createElement('div');
    el.className = 'acal-cell' + (d === 6 ? ' tc' : '');
    el.innerHTML = `<div class="acal-day">${d}</div>`;
    if (evts[d]) evts[d].forEach(ev => {
      el.innerHTML += `<div class="acev" style="background:${ev.c}">${ev.l}</div>`;
    });
    cal.appendChild(el);
  }
}

// ── TOAST ──
function showToast(msg, type = '') {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.className = 'toast show ' + type;
  setTimeout(() => t.className = 'toast', 3500);
}

// ── INIT ──
buildAdminCal();
