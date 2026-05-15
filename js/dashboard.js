// ===== DASHBOARD INIT =====
document.addEventListener("DOMContentLoaded", () => {
  const state = ProgressManager.updateStreak();
  renderDashboard(state);
});

function renderDashboard(state) {
  const levelInfo = getLevelInfo(state.xp);
  const nextLevel = levelSystem.find(l => l.level === state.level + 1) || levelInfo;
  const xpInLevel = state.xp - levelInfo.minXP;
  const xpNeeded = nextLevel.maxXP - levelInfo.minXP;
  const xpPercent = Math.min(100, Math.round((xpInLevel / xpNeeded) * 100));

  // Nav XP
  const navXp = document.getElementById("nav-xp");
  if (navXp) navXp.textContent = `${state.xp} XP`;

  // Streak
  const streakEl = document.getElementById("streak-count");
  if (streakEl) streakEl.textContent = state.streak;

  // Level
  const levelEl = document.getElementById("user-level");
  if (levelEl) levelEl.textContent = state.level;

  const levelTitle = document.getElementById("level-title");
  if (levelTitle) levelTitle.textContent = levelInfo.title;

  const currentXp = document.getElementById("current-xp");
  if (currentXp) currentXp.textContent = state.xp;

  const nextXp = document.getElementById("next-level-xp");
  if (nextXp) nextXp.textContent = nextLevel.maxXP;

  const xpBar = document.getElementById("xp-progress-bar");
  if (xpBar) xpBar.style.width = xpPercent + "%";

  // Stats
  const totalSoal = document.getElementById("total-soal");
  if (totalSoal) totalSoal.textContent = state.totalSoal;

  const totalBenar = document.getElementById("total-benar");
  if (totalBenar) totalBenar.textContent = state.totalBenar;

  const akurasi = document.getElementById("akurasi");
  if (akurasi) akurasi.textContent = ProgressManager.getAccuracy() + "%";

  const totalJurnal = document.getElementById("total-jurnal");
  if (totalJurnal) totalJurnal.textContent = state.totalJurnal;

  // Badges
  renderBadges(state.earnedBadges);
}

function renderBadges(earnedBadges) {
  const container = document.getElementById("badges-container");
  if (!container) return;

  container.innerHTML = allBadges.map(badge => {
    const earned = earnedBadges.includes(badge.id);
    return `
      <div class="badge-item ${earned ? "" : "locked"}" title="${badge.deskripsi}">
        <div class="badge-emoji">${badge.emoji}</div>
        <div class="badge-name">${badge.nama}</div>
      </div>
    `;
  }).join("");
}
