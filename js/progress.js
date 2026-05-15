// ===== PROGRESS MANAGER =====
const ProgressManager = {
  defaultState: {
    xp: 0,
    level: 1,
    totalSoal: 0,
    totalBenar: 0,
    totalJurnal: 0,
    soalPajak: 0,
    streak: 0,
    lastActive: null,
    answeredSoal: {},   // { soalId: 'correct'|'wrong' }
    earnedBadges: [],
    jurnalHistory: [],  // array of journal entries
    moduleProgress: { akuntansi: 45, pajak: 10, keuangan: 20 }
  },

  get() {
    try {
      const raw = localStorage.getItem("akunpintar_progress");
      return raw ? { ...this.defaultState, ...JSON.parse(raw) } : { ...this.defaultState };
    } catch { return { ...this.defaultState }; }
  },

  save(state) {
    localStorage.setItem("akunpintar_progress", JSON.stringify(state));
  },

  addXP(amount) {
    const state = this.get();
    const oldLevel = state.level;
    state.xp += amount;
    const levelInfo = getLevelInfo(state.xp);
    state.level = levelInfo.level;
    this.save(state);
    this.checkBadges(state);
    if (state.level > oldLevel) {
      showToast(`🎉 Level Up! Kamu sekarang Level ${state.level}: ${levelInfo.title}`, "success");
    }
    return state;
  },

  recordAnswer(soalId, isCorrect, isPajak = false) {
    const state = this.get();
    if (!state.answeredSoal[soalId]) {
      state.totalSoal++;
      if (isCorrect) {
        state.totalBenar++;
        if (isPajak) state.soalPajak++;
      }
    }
    state.answeredSoal[soalId] = isCorrect ? "correct" : "wrong";
    this.save(state);
    this.checkBadges(state);
    return state;
  },

  addJurnal(entries) {
    const state = this.get();
    state.totalJurnal++;
    state.jurnalHistory.push({
      id: Date.now(),
      tanggal: new Date().toISOString().split("T")[0],
      entries: entries
    });
    this.save(state);
    this.checkBadges(state);
    return state;
  },

  checkBadges(state) {
    let newBadge = false;
    allBadges.forEach(badge => {
      if (!state.earnedBadges.includes(badge.id) && badge.syarat(state)) {
        state.earnedBadges.push(badge.id);
        newBadge = true;
        setTimeout(() => showToast(`🏆 Badge Baru: ${badge.emoji} ${badge.nama}!`, "success"), 500);
      }
    });
    if (newBadge) this.save(state);
  },

  updateStreak() {
    const state = this.get();
    const today = new Date().toDateString();
    if (state.lastActive !== today) {
      const yesterday = new Date(Date.now() - 86400000).toDateString();
      state.streak = state.lastActive === yesterday ? state.streak + 1 : 1;
      state.lastActive = today;
      this.save(state);
    }
    return state;
  },

  reset() {
    localStorage.removeItem("akunpintar_progress");
    showToast("Data berhasil direset!", "warning");
    setTimeout(() => location.reload(), 1000);
  },

  getAccuracy() {
    const state = this.get();
    if (state.totalSoal === 0) return 0;
    return Math.round((state.totalBenar / state.totalSoal) * 100);
  }
};

// ===== TOAST NOTIFICATION =====
function showToast(message, type = "info") {
  const toast = document.getElementById("toast");
  if (!toast) return;
  toast.textContent = message;
  toast.className = `toast ${type} show`;
  clearTimeout(toast._timeout);
  toast._timeout = setTimeout(() => { toast.className = "toast"; }, 3500);
}

// ===== RESET PROGRESS =====
function resetProgress() {
  if (confirm("Yakin ingin mereset semua data progres? Tindakan ini tidak bisa dibatalkan.")) {
    ProgressManager.reset();
  }
}
