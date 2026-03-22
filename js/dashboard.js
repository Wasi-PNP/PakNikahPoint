/**
 * PakNikahPoint — Dashboard JS
 */
document.addEventListener('DOMContentLoaded', async () => {
  // پہلے localStorage کا data دکھائیں
  loadDashboard();
  // پھر Google Sheets سے تازہ data لائیں
  const result = await PNP_DB.fetchFromGAS();
  if(result.ok){
    loadDashboard(); // دوبارہ لوڈ کریں تازہ data سے
    console.log('✅ Dashboard اپ ڈیٹ ہوا');
  }
});

function loadDashboard() {
  const boys = PNP_DB.getBoys();
  const girls = PNP_DB.getGirls();
  const matches = PNP_DB.getMatches();

  // Stats
  document.getElementById('totalBoys').textContent    = boys.length;
  document.getElementById('totalGirls').textContent   = girls.length;
  document.getElementById('totalMatches').textContent = matches.length;
  document.getElementById('totalProfiles').textContent = boys.length + girls.length;

  // Latest registrations (last 5)
  const all = [...boys, ...girls].sort((a,b) => new Date(b.registeredAt) - new Date(a.registeredAt)).slice(0,5);
  const regEl = document.getElementById('latestRegs');
  if (all.length) {
    regEl.innerHTML = all.map(buildMiniProfile).join('');
  }

  // Latest matches
  const matchEl = document.getElementById('latestMatchList');
  if (matches.length) {
    matchEl.innerHTML = matches.slice(0,5).map(m => {
      const boy  = PNP_DB.getBoyById(m.boyCode);
      const girl = PNP_DB.getGirlById(m.girlCode);
      if (!boy || !girl) return '';
      const cls = m.score >= 70 ? 'score-high' : m.score >= 50 ? 'score-mid' : 'score-low';
      return `<div class="mini-profile">
        <div class="mini-avatar" style="background:var(--blue-pale);color:var(--blue);">♂</div>
        <div class="mini-info">
          <div class="mini-name">${boy.name} ❤ ${girl.name}</div>
          <div class="mini-meta">${boy.city} • ${boy.caste||''}</div>
        </div>
        <div class="match-score-ring ${cls}" style="width:44px;height:44px;font-size:13px;">
          <div class="score-number" style="font-size:14px;">${m.score}</div>
        </div>
      </div>`;
    }).join('');
  }
}
