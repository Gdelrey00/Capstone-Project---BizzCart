// ── CLIENT BOOKING STATE ──
let svcs = [], selDate = null, selTime = null, calY, calM;
const bookedDays = [8, 14, 20, 27];
const today = new Date();

// ── SERVICE SELECTION ──
function toggleSrv(el, name, price) {
  el.classList.toggle('sel');
  const i = svcs.findIndex(s => s.name === name);
  if (i > -1) svcs.splice(i, 1);
  else svcs.push({ name, price });

  const b = document.getElementById('selbox');
  if (svcs.length) {
    b.style.display = 'block';
    document.getElementById('sellist').textContent = svcs.map(s => s.name).join(', ');
    document.getElementById('seltotal').textContent = '₱' + svcs.reduce((a, s) => a + s.price, 0).toLocaleString();
  } else {
    b.style.display = 'none';
  }
}

// ── STEP NAVIGATION ──
function goStep(n) {
  if (n === 2 && !svcs.length) { showToast('Please select at least one food cart.', 'e'); return; }
  if (n === 3 && !selDate) { showToast('Please pick a date.', 'e'); return; }
  if (n === 3 && !selTime) { showToast('Please pick a time slot.', 'e'); return; }
  if (n === 4) {
    const nm = document.getElementById('f-name').value.trim();
    const ph = document.getElementById('f-phone').value.trim();
    const ev = document.getElementById('f-event').value;
    const gs = document.getElementById('f-guests').value;
    const vn = document.getElementById('f-venue').value.trim();
    if (!nm || !ph || !ev || !gs || !vn) { showToast('Please fill in all required (*) fields.', 'e'); return; }
    fillSum(nm, ph, ev, gs, vn);
  }
  document.querySelectorAll('.bpanel').forEach(p => p.classList.remove('active'));
  document.getElementById('s' + n).classList.add('active');
  updateSteps(n);
  window.scrollTo(0, 0);
}

function updateSteps(a) {
  for (let i = 1; i <= 4; i++) {
    const c = document.getElementById('sc' + i), l = document.getElementById('sl' + i);
    c.classList.remove('active', 'done');
    l.classList.remove('active');
    if (i < a) { c.classList.add('done'); c.innerHTML = '✓'; }
    else if (i === a) { c.classList.add('active'); c.innerHTML = i; l.classList.add('active'); }
    else c.innerHTML = i;
    if (i <= 3) document.getElementById('cn' + i).classList.toggle('done', i < a);
  }
}

function fillSum(nm, ph, ev, gs, vn) {
  const tot = svcs.reduce((a, s) => a + s.price, 0);
  document.getElementById('sum-s').textContent = svcs.map(s => s.name).join(', ');
  document.getElementById('sum-d').textContent = selDate
    ? selDate.toLocaleDateString('en-PH', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })
    : '—';
  document.getElementById('sum-t').textContent = selTime || '—';
  document.getElementById('sum-dur').textContent = document.getElementById('f-dur').value;
  document.getElementById('sum-n').textContent = nm;
  document.getElementById('sum-ph').textContent = ph;
  document.getElementById('sum-ev').textContent = ev;
  document.getElementById('sum-g').textContent = gs;
  document.getElementById('sum-ve').textContent = vn;
  document.getElementById('sum-tot').textContent = '₱' + tot.toLocaleString();
}

function submitBooking() {
  const ref = 'KMJ-' + (Math.floor(Math.random() * 9000) + 1000);
  document.getElementById('refnum').textContent = 'REF #' + ref;
  const nm = document.getElementById('f-name').value;
  const ev = document.getElementById('f-event').value;
  const ds = selDate ? selDate.toLocaleDateString('en-PH', { month: 'long', day: 'numeric', year: 'numeric' }) : '';
  document.getElementById('cfdet').innerHTML =
    `<div>👤 <span>${nm}</span></div>` +
    `<div>🎉 <span>${ev}</span> · ${ds} · ${selTime}</div>` +
    `<div>📦 <span>${svcs.map(s => s.name).join(', ')}</span></div>` +
    `<div>💰 <span>₱${svcs.reduce((a, s) => a + s.price, 0).toLocaleString()}</span></div>`;
  document.querySelectorAll('.bpanel').forEach(p => p.classList.remove('active'));
  document.getElementById('s5').classList.add('active');
  document.getElementById('steps-bar').style.display = 'none';
  showToast('Booking request submitted! 🎉', 's');
}

function resetBooking() {
  svcs = []; selDate = null; selTime = null;
  document.querySelectorAll('.srv').forEach(c => c.classList.remove('sel'));
  document.querySelectorAll('.ts').forEach(s => s.classList.remove('sel'));
  document.getElementById('selbox').style.display = 'none';
  document.querySelectorAll('#s3 input, #s3 textarea').forEach(i => i.value = '');
  document.querySelectorAll('#s3 select').forEach(s => s.selectedIndex = 0);
  document.getElementById('f-dur').value = '4 hours';
  document.getElementById('steps-bar').style.display = 'flex';
  document.querySelectorAll('.bpanel').forEach(p => p.classList.remove('active'));
  document.getElementById('s1').classList.add('active');
  updateSteps(1);
  buildCalendar();
}

// ── CALENDAR ──
function buildCalendar() {
  const d = new Date(calY, calM, 1);
  document.getElementById('callbl').textContent = d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const g = document.getElementById('calgrid');
  Array.from(g.children).slice(7).forEach(c => c.remove());
  const start = d.getDay();
  for (let i = 0; i < start; i++) {
    const e = document.createElement('div');
    e.className = 'cd empty';
    g.appendChild(e);
  }
  const dim = new Date(calY, calM + 1, 0).getDate();
  const todMid = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  for (let day = 1; day <= dim; day++) {
    const el = document.createElement('div');
    el.className = 'cd';
    el.textContent = day;
    const dt = new Date(calY, calM, day);
    if (dt < todMid) {
      el.classList.add('past');
    } else if (bookedDays.includes(day) && calM === today.getMonth() && calY === today.getFullYear()) {
      el.classList.add('bk');
    } else {
      if (dt.toDateString() === today.toDateString()) el.classList.add('today');
      el.onclick = () => {
        document.querySelectorAll('.cd').forEach(x => x.classList.remove('sel'));
        el.classList.add('sel');
        selDate = dt;
        document.getElementById('dchosen').textContent =
          '📅 ' + dt.toLocaleDateString('en-PH', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
      };
    }
    g.appendChild(el);
  }
}

function pickTime(el, t) {
  document.querySelectorAll('.ts:not(.unavail)').forEach(s => s.classList.remove('sel'));
  el.classList.add('sel');
  selTime = t;
}

function changeMonth(d) {
  calM += d;
  if (calM > 11) { calM = 0; calY++; }
  if (calM < 0) { calM = 11; calY--; }
  buildCalendar();
}

// ── TOAST ──
function showToast(msg, type = '') {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.className = 'toast show ' + type;
  setTimeout(() => t.className = 'toast', 3500);
}

// ── INIT ──
calY = today.getFullYear();
calM = today.getMonth();
buildCalendar();
