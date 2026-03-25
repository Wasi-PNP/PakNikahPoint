/**
 * PakNikahPoint — Core App Utilities
 */

// ── SIDEBAR ──────────────────────────────────────────────────────────
function toggleSidebar() {
  document.getElementById('sidebar').classList.toggle('open');
}

// ── DATE ──────────────────────────────────────────────────────────────
function initDate() {
  const el = document.getElementById('topDate');
  if (!el) return;
  const now = new Date();
  el.textContent = now.toLocaleDateString('en-PK', { weekday:'short', year:'numeric', month:'short', day:'numeric' });
}

// ── TOAST ─────────────────────────────────────────────────────────────
function showToast(msg, type='success') {
  let t = document.getElementById('pnpToast');
  if (!t) {
    t = document.createElement('div');
    t.id = 'pnpToast';
    t.className = 'toast';
    document.body.appendChild(t);
  }
  const icons = { success:'✓', error:'✕', info:'ℹ' };
  t.innerHTML = `<span>${icons[type]||'✓'}</span> ${msg}`;
  t.className = `toast ${type}`;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3200);
}

// ── MODAL ─────────────────────────────────────────────────────────────
function openModal(id) { document.getElementById(id)?.classList.add('open'); }
function closeModal(id) { document.getElementById(id)?.classList.remove('open'); }

// ── PROFILE CARD HTML ─────────────────────────────────────────────────
function buildProfileCard(p, showActions=true) {
  const isGirl = p.gender === 'girl';
  const photoHtml = p.photo
    ? `<img src="${p.photo}" class="profile-photo" alt="${p.name}">`
    : `<div class="profile-photo-placeholder">${isGirl?'♀':'♂'}</div>`;
  const badge = isGirl
    ? `<span class="badge badge-girl">Girl / لڑکی</span>`
    : `<span class="badge badge-boy">Boy / لڑکا</span>`;
  const actions = showActions ? `
    <div class="profile-card-footer">
      <button class="card-btn card-btn-primary" onclick="viewProfile('${p.pnpCode}')">View</button>
      <button class="card-btn card-btn-match" onclick="findMatchFor('${p.pnpCode}')">Match</button>
      <button class="card-btn card-btn-wa" onclick="shareOnWhatsApp('${p.pnpCode}')">WhatsApp</button>
    </div>` : '';
  return `
    <div class="profile-card" onclick="viewProfile('${p.pnpCode}')">
      <div class="profile-card-header ${isGirl?'girl-header':''}">
        ${photoHtml}
        <div class="profile-pnp">${p.pnpCode}</div>
        <div class="profile-name">${p.name||'—'}</div>
        <div class="profile-age-city">${p.age||'?'} yrs • ${p.city||'—'}</div>
        ${badge}
      </div>
      <div class="profile-card-body">
        <div class="profile-detail-row"><span class="detail-key">Education</span><span class="detail-val">${p.education||'—'}</span></div>
        <div class="profile-detail-row"><span class="detail-key">Profession</span><span class="detail-val">${p.profession||'—'}</span></div>
        <div class="profile-detail-row"><span class="detail-key">Caste</span><span class="detail-val">${p.caste||'—'}</span></div>
        <div class="profile-detail-row"><span class="detail-key">Marital</span><span class="detail-val">${p.maritalStatus||'—'}</span></div>
        <div class="profile-detail-row"><span class="detail-key">Height</span><span class="detail-val">${p.height||'—'}</span></div>
        <div class="profile-detail-row"><span class="detail-key">Sect</span><span class="detail-val">${p.sect||'—'}</span></div>
      </div>
      ${actions}
    </div>`;
}

// ── MINI PROFILE ROW ──────────────────────────────────────────────────
function buildMiniProfile(p) {
  const isGirl = p.gender === 'girl';
  const when = p.registeredAt ? new Date(p.registeredAt).toLocaleDateString('en-PK',{month:'short',day:'numeric'}) : '';
  return `
    <div class="mini-profile" onclick="viewProfile('${p.pnpCode}')">
      <div class="mini-avatar">${isGirl?'♀':'♂'}</div>
      <div class="mini-info">
        <div class="mini-name">${p.name||'—'}</div>
        <div class="mini-meta">${p.age} yrs • ${p.city||'—'} • ${p.caste||'—'}</div>
      </div>
      <span class="mini-badge ${isGirl?'badge-girl':'badge-boy'}">${p.pnpCode}</span>
      <span style="font-size:11px;color:var(--text-light)">${when}</span>
    </div>`;
}

// ── PROFILE DETAIL MODAL ──────────────────────────────────────────────
function viewProfile(code) {
  const p = PNP_DB.getProfileByCode(code);
  if (!p) return;
  const isGirl = p.gender === 'girl';
  const photoHtml = p.photo
    ? `<img src="${p.photo}" style="width:100px;height:100px;border-radius:50%;object-fit:cover;border:3px solid var(--gold);">`
    : `<div style="width:100px;height:100px;border-radius:50%;background:var(--green-pale);display:flex;align-items:center;justify-content:center;font-size:48px;margin:0 auto;border:3px solid var(--gold);">${isGirl?'♀':'♂'}</div>`;

  let modal = document.getElementById('profileModal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'profileModal';
    modal.className = 'modal-overlay';
    modal.innerHTML = `<div class="modal-box" onclick="event.stopPropagation()">
      <div class="modal-hdr"><h3 id="pmTitle">Profile</h3><button class="modal-close" onclick="closeModal('profileModal')">✕</button></div>
      <div class="modal-body" id="pmBody"></div>
    </div>`;
    modal.onclick = () => closeModal('profileModal');
    document.body.appendChild(modal);
  }

  document.getElementById('pmTitle').textContent = `${p.pnpCode} — ${p.name}`;
  document.getElementById('pmBody').innerHTML = `
    <div style="text-align:center;margin-bottom:20px;padding:20px;background:linear-gradient(135deg,var(--green-deep),var(--green-mid));border-radius:10px;">
      ${photoHtml}
      <div style="font-family:'Cinzel',serif;font-size:11px;color:var(--gold);margin-top:10px;">${p.pnpCode}</div>
      <div style="font-family:'Cinzel',serif;font-size:18px;color:white;font-weight:700;">${p.name}</div>
      <div style="font-size:13px;color:rgba(255,255,255,0.7)">${p.age} yrs • ${p.city}</div>
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:16px;">
      ${detailRow('Education',p.education)}
      ${detailRow('Profession',p.profession)}
      ${detailRow('Caste / Biradari',p.caste)}
      ${detailRow('Sect',p.sect)}
      ${detailRow('Religion',p.religion)}
      ${detailRow('Marital Status',p.maritalStatus)}
      ${detailRow('Height',p.height)}
      ${detailRow('Weight',p.weight)}
      ${detailRow('Complexion',p.complexion)}
      ${detailRow('Residence',p.residence)}
      ${detailRow('Religious Education',p.religiousEducation)}
      ${detailRow('Disability',p.disability)}
      ${detailRow('Disease',p.disease)}
      ${detailRow('Addiction',p.addiction)}
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;padding:14px;background:var(--cream);border-radius:8px;margin-bottom:16px;">
      ${detailRow("Father's Name",p.fatherName)}
      ${detailRow("Father's Profession",p.fatherProfession)}
      ${detailRow("Mother's Name",p.motherName)}
    </div>
    <div style="display:flex;gap:10px;flex-wrap:wrap;">
      <button class="btn-primary" onclick="findMatchFor('${p.pnpCode}');closeModal('profileModal')">❤ Find Match</button>
      <button class="btn-gold" onclick="generateRishtaCard('${p.pnpCode}')">📄 Rishta Card</button>
      <button class="btn-outline" onclick="shareOnWhatsApp('${p.pnpCode}')">📱 WhatsApp Share</button>
      <button style="padding:10px 20px;border:2px solid #c0392b;color:#c0392b;border-radius:8px;font-size:13px;font-weight:600;" onclick="confirmDelete('${p.pnpCode}')">🗑 حذف کریں</button>
    </div>`;
  openModal('profileModal');
}

function detailRow(k, v) {
  return `<div style="background:white;border-radius:8px;padding:10px 12px;border:1px solid rgba(0,0,0,0.06);">
    <div style="font-size:10px;text-transform:uppercase;color:var(--text-light);letter-spacing:0.5px;margin-bottom:3px;">${k}</div>
    <div style="font-size:14px;font-weight:600;color:var(--text-dark);">${v||'—'}</div>
  </div>`;
}

// ── FIND MATCH ────────────────────────────────────────────────────────
function findMatchFor(code) {
  const p = PNP_DB.getProfileByCode(code);
  if (!p) return;
  // Navigate to matching page with code
  window.location.href = `pages/matching.html?code=${code}`;
}

// ── WHATSAPP SHARE ────────────────────────────────────────────────────
function shareOnWhatsApp(code) {
  const p = PNP_DB.getProfileByCode(code);
  if (!p) return;
  const settings = PNP_DB.getSettings();
  const msg =
    "🌙 *پاک نکاح پوائنٹ — رشتہ پروفائل*\n\n" +
    "*PNP کوڈ:* " + p.pnpCode + "\n" +
    "*نام:* " + p.name + "\n" +
    "*عمر:* " + p.age + " سال\n" +
    "*شہر:* " + (p.city||"—") + "\n" +
    "*تعلیم:* " + (p.education||"—") + "\n" +
    "*پیشہ:* " + (p.profession||"—") + "\n" +
    "*ذات:* " + (p.caste||"—") + "\n" +
    "*مسلک:* " + (p.sect||"—") + "\n" +
    "*ازدواجی حیثیت:* " + (p.maritalStatus||"—") + "\n" +
    "*قد:* " + (p.height||"—") + "\n\n" +
    "📞 *رابطہ:* " + (settings.phone||"PakNikahPoint") + "\n" +
    "_تمام معلومات مکمل رازداری سے محفوظ_ 🤝";

  const waUrl = "https://wa.me/?text=" + encodeURIComponent(msg);
  if (navigator.clipboard) navigator.clipboard.writeText(msg).catch(()=>{});
  const win = window.open(waUrl, "_blank");
  if (!win) showWAModal(msg, waUrl);
  else showToast("✅ WhatsApp کھل رہا ہے", "success");
}

function showWAModal(msg, url) {
  let m = document.getElementById("waModal");
  if (!m) { m=document.createElement("div"); m.id="waModal"; m.className="modal-overlay"; m.onclick=()=>m.classList.remove("open"); document.body.appendChild(m); }
  const enc = encodeURIComponent(msg);
  m.innerHTML = `<div class="modal-box" onclick="event.stopPropagation()" style="max-width:500px;">
    <div class="modal-hdr"><h3>📱 WhatsApp شیئر</h3><button class="modal-close" onclick="document.getElementById('waModal').classList.remove('open')">✕</button></div>
    <div class="modal-body">
      <div style="display:flex;flex-direction:column;gap:10px;margin-bottom:16px;">
        <a href="${url}" target="_blank" class="btn-primary" style="text-align:center;padding:12px;display:block;">📱 WhatsApp Web کھولیں</a>
        <a href="whatsapp://send?text=${enc}" class="btn-gold" style="text-align:center;padding:12px;display:block;color:var(--green-deep);">📲 WhatsApp App کھولیں</a>
      </div>
      <div style="background:var(--cream);border-radius:10px;padding:14px;margin-bottom:12px;">
        <div style="font-size:11px;color:var(--text-light);margin-bottom:8px;">پیغام:</div>
        <div id="waText" style="font-size:13px;white-space:pre-wrap;line-height:1.7;">${msg}</div>
      </div>
      <button onclick="copyWAText()" class="btn-outline" style="width:100%;padding:10px;">📋 پیغام Copy کریں</button>
      <div id="copyDone" style="display:none;text-align:center;color:var(--green-mid);margin-top:8px;font-size:13px;">✅ Copy ہو گیا — WhatsApp میں Paste کریں</div>
    </div></div>`;
  m.classList.add("open");
}

function copyWAText() {
  const text = (document.getElementById("waText")||{}).innerText||"";
  const done = ()=>{ document.getElementById("copyDone").style.display="block"; showToast("✅ Copy ہو گیا!","success"); };
  if (navigator.clipboard) navigator.clipboard.writeText(text).then(done);
  else { const ta=document.createElement("textarea"); ta.value=text; document.body.appendChild(ta); ta.select(); document.execCommand("copy"); document.body.removeChild(ta); done(); }
}


// ── RISHTA CARD ───────────────────────────────────────────────────────
// ═══ Profile Delete Confirm ═══
function confirmDelete(code) {
  const old = document.getElementById('deleteConfirmModal');
  if(old) old.remove();

  const p = PNP_DB.getProfileByCode(code);
  if(!p) return;

  const modal = document.createElement('div');
  modal.id = 'deleteConfirmModal';
  modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.7);z-index:99999;display:flex;align-items:center;justify-content:center;';
  modal.innerHTML = `
    <div style="background:white;border-radius:16px;padding:28px;margin:20px;max-width:340px;width:100%;text-align:center;">
      <div style="font-size:48px;margin-bottom:12px;">🗑</div>
      <h3 style="color:#c0392b;font-size:18px;margin-bottom:8px;">پروفائل حذف کریں؟</h3>
      <p style="color:#666;font-size:14px;margin-bottom:8px;"><strong>${p.name}</strong> — ${p.pnpCode}</p>
      <p style="color:#999;font-size:12px;margin-bottom:20px;">یہ عمل واپس نہیں ہو سکتا۔ Google Sheet سے بھی حذف ہو جائے گا۔</p>
      <div style="display:flex;gap:10px;">
        <button onclick="doDelete('${code}')" 
          style="flex:1;background:#c0392b;color:white;border:none;padding:12px;border-radius:8px;font-weight:700;cursor:pointer;font-size:14px;">
          ✅ ہاں، حذف کریں
        </button>
        <button onclick="document.getElementById('deleteConfirmModal').remove()" 
          style="flex:1;background:#f5f5f5;color:#333;border:none;padding:12px;border-radius:8px;font-weight:700;cursor:pointer;">
          منسوخ
        </button>
      </div>
    </div>`;
  document.body.appendChild(modal);
}

function doDelete(code) {
  PNP_DB.deleteProfile(code);
  document.getElementById('deleteConfirmModal').remove();
  closeModal('profileModal');
  showToast('✅ پروفائل حذف ہو گئی', 'info');
  // profiles page پر refresh کریں
  if(typeof filterProfiles === 'function') filterProfiles();
  else setTimeout(() => location.reload(), 500);
}

function generateRishtaCard(code) {
  const p = PNP_DB.getProfileByCode(code);
  if (!p) return;
  const settings = PNP_DB.getSettings();
  const isGirl = p.gender === 'girl';

  let win = window.open('', '_blank');
  win.document.write(`<!DOCTYPE html><html><head>
    <meta charset="UTF-8"><title>Rishta Card — ${p.name}</title>
    <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Crimson+Pro:wght@300;400;500;600&display=swap" rel="stylesheet">
    <style>
      body{font-family:'Crimson Pro',serif;background:#f5f0e8;display:flex;justify-content:center;align-items:flex-start;padding:30px;min-height:100vh;}
      .card{background:white;border:3px double #C9A84C;border-radius:12px;padding:36px;max-width:620px;width:100%;position:relative;}
      .card::before{content:'';position:absolute;inset:8px;border:1px solid rgba(201,168,76,0.3);border-radius:8px;pointer-events:none;}
      .header{text-align:center;margin-bottom:24px;padding-bottom:20px;border-bottom:2px solid #f5f0e8;}
      .bureau-name{font-family:'Cinzel',serif;font-size:22px;color:#0D3B2E;font-weight:700;letter-spacing:1px;}
      .bureau-sub{color:#C9A84C;font-size:13px;margin-top:4px;}
      .pnp-chip{display:inline-block;background:#0D3B2E;color:#C9A84C;font-family:'Cinzel',serif;font-size:12px;padding:4px 14px;border-radius:20px;letter-spacing:2px;margin-top:10px;}
      .photo-section{display:flex;justify-content:center;margin:20px 0;}
      .photo-circle{width:110px;height:110px;border-radius:50%;border:3px solid #C9A84C;object-fit:cover;background:#E8F5EF;display:flex;align-items:center;justify-content:center;font-size:52px;}
      .name-section{text-align:center;margin-bottom:20px;}
      .main-name{font-family:'Cinzel',serif;font-size:22px;color:#0D3B2E;font-weight:700;}
      .grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:20px;}
      .item{background:#FAF6EE;border-radius:8px;padding:10px 14px;border-left:3px solid #C9A84C;}
      .item-key{font-size:10px;text-transform:uppercase;color:#7A7A7A;letter-spacing:0.5px;margin-bottom:3px;}
      .item-val{font-size:15px;font-weight:600;color:#1C1C1C;}
      .footer{text-align:center;margin-top:20px;padding-top:16px;border-top:1px solid #f5f0e8;font-size:12px;color:#7A7A7A;}
      .arabic{font-size:18px;color:#C9A84C;margin-bottom:8px;}
      @media print{body{background:white;padding:0;}.no-print{display:none!important;}}
    </style>
  </head><body>
    <div class="card">
      <div class="header">
        <div class="arabic">بسم الله الرحمن الرحيم</div>
        <div class="bureau-name">${settings.bureauName||'PakNikahPoint'}</div>
        <div class="bureau-sub">Professional Matchmaking • پاک نکاح پوائنٹ</div>
        <div class="pnp-chip">${p.pnpCode}</div>
      </div>
      <div class="photo-section">
        ${p.photo?`<img src="${p.photo}" class="photo-circle">`:`<div class="photo-circle">${isGirl?'♀':'♂'}</div>`}
      </div>
      <div class="name-section">
        <div class="main-name">${p.name}</div>
        <div style="color:#7A7A7A;font-size:14px;margin-top:4px;">${p.age} years old • ${p.city}</div>
      </div>
      <div class="grid">
        <div class="item"><div class="item-key">Education</div><div class="item-val">${p.education||'—'}</div></div>
        <div class="item"><div class="item-key">Profession</div><div class="item-val">${p.profession||'—'}</div></div>
        <div class="item"><div class="item-key">Caste / Biradari</div><div class="item-val">${p.caste||'—'}</div></div>
        <div class="item"><div class="item-key">Sect</div><div class="item-val">${p.sect||'—'}</div></div>
        <div class="item"><div class="item-key">Marital Status</div><div class="item-val">${p.maritalStatus||'—'}</div></div>
        <div class="item"><div class="item-key">Religion</div><div class="item-val">${p.religion||'—'}</div></div>
        <div class="item"><div class="item-key">Height</div><div class="item-val">${p.height||'—'}</div></div>
        <div class="item"><div class="item-key">Complexion</div><div class="item-val">${p.complexion||'—'}</div></div>
        <div class="item"><div class="item-key">Residence</div><div class="item-val">${p.residence||'—'}</div></div>
        <div class="item"><div class="item-key">Religious Edu</div><div class="item-val">${p.religiousEducation||'—'}</div></div>
      </div>
      <div class="footer">
        <div style="display:flex;align-items:center;justify-content:center;gap:12px;margin-bottom:8px;">
          <img src="/PakNikahPoint/assets/logo-pnp.jpg" alt="PNP" style="width:50px;height:50px;border-radius:50%;border:2px solid #C9A84C;object-fit:cover;">
          <div style="font-family:'Cinzel',serif;font-size:15px;color:#0D3B2E;font-weight:700;">${settings.bureauName||'PakNikahPoint'}</div>
        </div>
        <div style="display:flex;justify-content:center;gap:16px;flex-wrap:wrap;margin-bottom:6px;">
          ${settings.phone ? `<span>📞 ${settings.phone}</span>` : ''}
          ${settings.email ? `<span>📧 ${settings.email}</span>` : ''}
          ${settings.city  ? `<span>📍 ${settings.city}</span>`  : ''}
        </div>
        <div style="margin-top:6px;font-size:11px;">رشتے عزت، اعتماد اور ذمہ داری کے ساتھ</div>
        <div style="margin-top:4px;color:#C9A84C;">اللهم بارك لهم وبارك عليهم وجمع بينهما في خير</div>
      </div>
    </div>
    <div class="no-print" style="position:fixed;top:20px;right:20px;display:flex;flex-direction:column;gap:10px;max-width:220px;">

      <!-- تصویر show/hide -->
      <div style="background:white;border:2px solid #ddd;border-radius:10px;padding:12px;">
        <div style="font-size:12px;font-weight:700;color:#0D3B2E;margin-bottom:8px;">📷 تصویر آپشن</div>
        <label style="display:flex;align-items:center;gap:8px;cursor:pointer;font-size:13px;">
          <input type="checkbox" id="showPhoto" checked onchange="toggleCardPhoto(this.checked)" style="width:16px;height:16px;">
          تصویر دکھائیں
        </label>
      </div>

      <!-- PDF -->
      <button onclick="window.print()" style="background:#0D3B2E;color:#C9A84C;border:none;padding:12px 20px;border-radius:10px;cursor:pointer;font-size:14px;font-weight:700;width:100%;">
        📄 PDF / Print کریں
      </button>

      <!-- WhatsApp -->
      <button onclick="shareCardWA()" style="background:#25D366;color:white;border:none;padding:12px 20px;border-radius:10px;cursor:pointer;font-size:14px;font-weight:700;width:100%;">
        💬 WhatsApp بھیجیں
      </button>

      <!-- بند کریں -->
      <button onclick="window.close()" style="background:white;border:2px solid #ccc;padding:10px 20px;border-radius:10px;cursor:pointer;font-size:13px;width:100%;">
        ✕ بند کریں
      </button>
    </div>

    <script>
    function toggleCardPhoto(show) {
      const ps = document.querySelector('.photo-section');
      if(ps) ps.style.display = show ? 'flex' : 'none';
    }
    function shareCardWA() {
      const name   = document.querySelector('.main-name') ? document.querySelector('.main-name').textContent : '';
      const pnp    = document.querySelector('.pnp-chip')  ? document.querySelector('.pnp-chip').textContent  : '';
      const bureau = document.querySelector('.bureau-name') ? document.querySelector('.bureau-name').textContent : 'PakNikahPoint';
      const items  = document.querySelectorAll('.item');
      let details  = '';
      items.forEach(function(item) {
        const k = item.querySelector('.item-key');
        const v = item.querySelector('.item-val');
        if(k && v) details += '• *' + k.textContent + ':* ' + v.textContent + '\n';
      });
      const footer = document.querySelector('.footer');
      const phone  = footer ? footer.querySelector('span:first-child') : null;
      const email  = footer ? footer.querySelector('span:nth-child(2)') : null;

      const msg = 'السلام علیکم!\n\n' +
        '📋 *رشتہ کارڈ — ' + pnp + '*\n\n' +
        '👤 *نام:* ' + name + '\n\n' +
        details + '\n' +
        '🏢 *' + bureau + '*\n' +
        (phone ? '📞 ' + phone.textContent + '\n' : '') +
        (email ? '📧 ' + email.textContent + '\n' : '') +
        '\n_رشتے عزت، اعتماد اور ذمہ داری کے ساتھ_ 🤝\n\n' +
        '⚠️ تصویر سمیت PDF کے لیے Print بٹن استعمال کریں';

      window.open('https://wa.me/?text=' + encodeURIComponent(msg), '_blank');
    }
    </script>
  </body></html>`);
  win.document.close();
}

// ── SCORE BADGE ───────────────────────────────────────────────────────
function scoreBadge(score) {
  const cls = score >= 70 ? 'score-high' : score >= 50 ? 'score-mid' : 'score-low';
  return `<div class="match-score-ring ${cls}"><div class="score-number">${score}</div><div class="score-label">/ 100</div></div>`;
}

// ── QUICK SEARCH ──────────────────────────────────────────────────────
let searchTimeout;
function runQuickSearch(val) {
  clearTimeout(searchTimeout);
  const sec = document.getElementById('searchResultsSection');
  if (!val || val.length < 2) {
    if (sec) sec.style.display = 'none';
    return;
  }
  searchTimeout = setTimeout(() => {
    const results = PNP_DB.quickSearch(val);
    if (sec) {
      sec.style.display = 'block';
      const body = document.getElementById('searchResultsBody');
      if (!results.length) { body.innerHTML = '<div class="empty-msg">No profiles found.</div>'; return; }
      body.innerHTML = results.map(buildMiniProfile).join('');
    }
  }, 300);
}
function clearQuickSearch() {
  const sec = document.getElementById('searchResultsSection');
  if (sec) sec.style.display = 'none';
  const inp = document.getElementById('quickSearch');
  if (inp) inp.value = '';
}

// ── INIT ──────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initDate();
  // PNP_DB.seedSampleData(); // Sample data بند کر دیا گیا

  // پرانے counters صاف کریں — اب actual data سے count ہوگا
  localStorage.removeItem('pnp_cb');
  localStorage.removeItem('pnp_cg');
  // Highlight active nav
  const path = window.location.pathname.split('/').pop();
  document.querySelectorAll('.nav-item').forEach(a => {
    const href = a.getAttribute('href')?.split('/').pop();
    if (href === path || (path === '' && href === 'index.html')) a.classList.add('active');
    else a.classList.remove('active');
  });
});
