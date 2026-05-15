// ===== LATIHAN PAGE =====
let currentSoalIndex = 0;
let journalRows = [];
let rowIdCounter = 0;

document.addEventListener("DOMContentLoaded", () => {
  const state = ProgressManager.get();
  const navXp = document.getElementById("nav-xp");
  if (navXp) navXp.textContent = `${state.xp} XP`;

  // Set today's date
  const dateInput = document.getElementById("journal-date");
  if (dateInput) dateInput.value = new Date().toISOString().split("T")[0];

  renderSoalDots();
  loadSoal(0);
  addJournalRow();
  addJournalRow();
});

// ===== SOAL NAVIGATION =====
function renderSoalDots() {
  const state = ProgressManager.get();
  const container = document.getElementById("soal-dots");
  if (!container) return;

  container.innerHTML = soalLatihan.map((s, i) => {
    const answered = state.answeredSoal[s.id];
    let cls = "";
    if (i === currentSoalIndex) cls = "active";
    else if (answered === "correct") cls = "correct";
    else if (answered === "wrong") cls = "wrong";
    return `<div class="soal-dot ${cls}" onclick="loadSoal(${i})" title="Soal ${i+1}">${i+1}</div>`;
  }).join("");
}

function loadSoal(index) {
  currentSoalIndex = index;
  const soal = soalLatihan[index];
  const state = ProgressManager.get();

  document.getElementById("soal-counter").textContent = `Soal ${index + 1} dari ${soalLatihan.length}`;
  document.getElementById("soal-number").textContent = `Soal #${soal.id}`;
  document.getElementById("soal-text").textContent = soal.pertanyaan;
  document.getElementById("hint-text").textContent = soal.hint;

  const catEl = document.getElementById("soal-category");
  catEl.textContent = `${soal.kategori_icon} ${soal.kategori}`;
  catEl.className = `soal-category tag ${soal.kategori_color}`;

  // Reset feedback
  const fb = document.getElementById("feedback-panel");
  fb.className = "feedback-panel";
  document.getElementById("feedback-answer").style.display = "none";

  // Reset journal
  resetJurnal();
  renderSoalDots();

  // If already answered, show feedback
  const answered = state.answeredSoal[soal.id];
  if (answered) {
    showFeedback(answered === "correct", soal, false);
  }
}

function prevSoal() {
  if (currentSoalIndex > 0) loadSoal(currentSoalIndex - 1);
}

function nextSoal() {
  if (currentSoalIndex < soalLatihan.length - 1) loadSoal(currentSoalIndex + 1);
}

// ===== JOURNAL ROWS =====
function addJournalRow() {
  const id = ++rowIdCounter;
  journalRows.push({ id, akun: "", debit: 0, kredit: 0 });
  renderJournalRows();
}

function removeJournalRow(id) {
  if (journalRows.length <= 2) {
    showToast("Minimal 2 baris jurnal diperlukan", "warning");
    return;
  }
  journalRows = journalRows.filter(r => r.id !== id);
  renderJournalRows();
  updateTotals();
}

function renderJournalRows() {
  const container = document.getElementById("journal-entries");
  if (!container) return;

  container.innerHTML = journalRows.map(row => `
    <div class="journal-entry-row" id="row-${row.id}">
      <select onchange="updateRow(${row.id}, 'akun', this.value)">
        <option value="">-- Pilih Akun --</option>
        ${COA.map(a => `<option value="${a.kode}" ${row.akun === a.kode ? "selected" : ""}>${a.kode} — ${a.nama}</option>`).join("")}
      </select>
      <input type="number" placeholder="0" min="0"
        value="${row.debit || ""}"
        onchange="updateRow(${row.id}, 'debit', this.value)"
        oninput="updateRow(${row.id}, 'debit', this.value)" />
      <input type="number" placeholder="0" min="0"
        value="${row.kredit || ""}"
        onchange="updateRow(${row.id}, 'kredit', this.value)"
        oninput="updateRow(${row.id}, 'kredit', this.value)" />
      <button class="remove-row-btn" onclick="removeJournalRow(${row.id})">×</button>
    </div>
  `).join("");

  updateTotals();
}

function updateRow(id, field, value) {
  const row = journalRows.find(r => r.id === id);
  if (!row) return;
  if (field === "akun") {
    row.akun = value;
  } else {
    row[field] = parseFloat(value) || 0;
    // Auto-clear the other side
    if (field === "debit" && row.debit > 0) row.kredit = 0;
    if (field === "kredit" && row.kredit > 0) row.debit = 0;
  }
  updateTotals();
}

function updateTotals() {
  const totalDebit = journalRows.reduce((s, r) => s + (r.debit || 0), 0);
  const totalKredit = journalRows.reduce((s, r) => s + (r.kredit || 0), 0);
  const balanced = totalDebit > 0 && totalDebit === totalKredit;

  const tdEl = document.getElementById("total-debit");
  const tkEl = document.getElementById("total-kredit");
  const indicator = document.getElementById("balance-indicator");
  const btnSimpan = document.getElementById("btn-simpan");

  if (tdEl) {
    tdEl.textContent = formatRupiah(totalDebit);
    tdEl.className = `totals-value ${balanced ? "balanced" : totalDebit !== totalKredit ? "unbalanced" : ""}`;
  }
  if (tkEl) {
    tkEl.textContent = formatRupiah(totalKredit);
    tkEl.className = `totals-value ${balanced ? "balanced" : totalDebit !== totalKredit ? "unbalanced" : ""}`;
  }

  if (indicator) {
    indicator.className = `balance-indicator ${balanced ? "balanced" : "unbalanced"}`;
    indicator.innerHTML = balanced ? "✅ Balance!" : "⚠️ Belum Balance";
  }

  if (btnSimpan) btnSimpan.disabled = !balanced;
}

function resetJurnal() {
  journalRows = [];
  rowIdCounter = 0;
  addJournalRow();
  addJournalRow();
  document.getElementById("journal-desc").value = "";
  const fb = document.getElementById("feedback-panel");
  if (fb) fb.className = "feedback-panel";
}

// ===== CEK JAWABAN =====
function cekJawaban() {
  const soal = soalLatihan[currentSoalIndex];
  const state = ProgressManager.get();

  // Validate entries
  const validRows = journalRows.filter(r => r.akun && (r.debit > 0 || r.kredit > 0));
  if (validRows.length < 2) {
    showToast("Isi minimal 2 baris jurnal dengan akun dan nominal!", "warning");
    return;
  }

  const totalDebit = validRows.reduce((s, r) => s + r.debit, 0);
  const totalKredit = validRows.reduce((s, r) => s + r.kredit, 0);
  if (totalDebit !== totalKredit) {
    showToast("Jurnal belum balance! Total Debit harus sama dengan Kredit.", "error");
    return;
  }

  // Compare with answer
  const isCorrect = checkAnswer(validRows, soal.jawaban_benar);
  const isPajak = soal.kategori === "Perpajakan";

  ProgressManager.recordAnswer(soal.id, isCorrect, isPajak);

  if (isCorrect) {
    const newState = ProgressManager.addXP(soal.xp);
    showXPPopup(soal.xp);
    const navXp = document.getElementById("nav-xp");
    if (navXp) navXp.textContent = `${newState.xp} XP`;
  }

  showFeedback(isCorrect, soal, true);
  renderSoalDots();
}

function checkAnswer(userRows, correctRows) {
  if (userRows.length !== correctRows.length) return false;

  return correctRows.every(correct => {
    return userRows.some(user => {
      const akunMatch = user.akun === correct.akun;
      const posisiMatch = (correct.posisi === "debit" && user.debit === correct.nominal) ||
                          (correct.posisi === "kredit" && user.kredit === correct.nominal);
      return akunMatch && posisiMatch;
    });
  });
}

function showFeedback(isCorrect, soal, animate) {
  const panel = document.getElementById("feedback-panel");
  const icon = document.getElementById("feedback-icon");
  const title = document.getElementById("feedback-title");
  const text = document.getElementById("feedback-text");
  const answerDiv = document.getElementById("feedback-answer");
  const answerRows = document.getElementById("answer-rows");

  panel.className = `feedback-panel show ${isCorrect ? "correct" : "wrong"}`;
  icon.textContent = isCorrect ? "🎉" : "😅";
  title.textContent = isCorrect ? "Jawaban Benar! Luar biasa!" : "Belum Tepat, Coba Lagi!";
  text.textContent = isCorrect
    ? `Kamu mendapatkan +${soal.xp} XP! Jurnal yang kamu buat sudah benar.`
    : soal.penjelasan_error;

  if (!isCorrect) {
    answerDiv.style.display = "block";
    answerRows.innerHTML = soal.jawaban_benar.map(j => {
      const akun = COA.find(a => a.kode === j.akun);
      return `
        <div class="answer-row">
          <span class="answer-akun">${j.akun} — ${akun ? akun.nama : j.akun}</span>
          <span class="answer-debit">${j.posisi === "debit" ? formatRupiah(j.nominal) : "-"}</span>
          <span class="answer-kredit">${j.posisi === "kredit" ? formatRupiah(j.nominal) : "-"}</span>
        </div>
      `;
    }).join("");
  } else {
    answerDiv.style.display = "none";
  }
}

// ===== SIMPAN JURNAL =====
function simpanJurnal() {
  const validRows = journalRows.filter(r => r.akun && (r.debit > 0 || r.kredit > 0));
  const totalDebit = validRows.reduce((s, r) => s + r.debit, 0);
  const totalKredit = validRows.reduce((s, r) => s + r.kredit, 0);

  if (totalDebit !== totalKredit || totalDebit === 0) {
    showToast("Jurnal harus balance sebelum disimpan!", "error");
    return;
  }

  const date = document.getElementById("journal-date").value;
  const desc = document.getElementById("journal-desc").value || "Jurnal tanpa keterangan";

  // Bangun entries dengan semua field yang dibutuhkan laporan
  const entries = validRows.map(r => {
    const coaEntry = COA.find(a => a.kode === r.akun) || {};
    return {
      kode: r.akun,
      nama: coaEntry.nama || r.akun,
      kategori: coaEntry.kategori || "",
      subkategori: coaEntry.subkategori || "",
      saldo_normal: coaEntry.saldo_normal || "debit",
      debit: r.debit || 0,
      kredit: r.kredit || 0
    };
  });

  const newState = ProgressManager.addJurnal({
    tanggal: date,
    deskripsi: desc,
    entries: entries
  });

  const navXp = document.getElementById("nav-xp");
  if (navXp) navXp.textContent = `${newState.xp} XP`;

  showToast("✅ Jurnal berhasil disimpan ke Buku Besar!", "success");
  resetJurnal();
}

// ===== KUNCI JAWABAN =====
function lihatKunciJawaban() {
  const soal = soalLatihan[currentSoalIndex];
  const content = document.getElementById("kunci-content");

  content.innerHTML = `
    <p style="margin-bottom:1rem;color:var(--text-secondary)">${soal.pertanyaan}</p>
    <div style="background:var(--bg);border-radius:var(--radius-sm);padding:1rem">
      <div style="display:grid;grid-template-columns:2fr 1fr 1fr;gap:8px;font-size:0.75rem;font-weight:700;text-transform:uppercase;color:var(--text-muted);margin-bottom:8px">
        <span>Akun</span><span>Debit</span><span>Kredit</span>
      </div>
      ${soal.jawaban_benar.map(j => {
        const akun = COA.find(a => a.kode === j.akun);
        return `
          <div style="display:grid;grid-template-columns:2fr 1fr 1fr;gap:8px;padding:8px 0;border-bottom:1px solid var(--border);font-size:0.875rem">
            <span style="color:var(--navy);font-weight:600">${j.akun} — ${akun ? akun.nama : j.akun}</span>
            <span style="color:#1e40af;font-weight:600">${j.posisi === "debit" ? formatRupiah(j.nominal) : "-"}</span>
            <span style="color:#9d174d;font-weight:600">${j.posisi === "kredit" ? formatRupiah(j.nominal) : "-"}</span>
          </div>
        `;
      }).join("")}
    </div>
    <div style="margin-top:1rem;padding:1rem;background:#fffbeb;border-radius:var(--radius-sm);border-left:3px solid #f59e0b;font-size:0.875rem;color:var(--text-secondary)">
      <strong style="color:#92400e">Penjelasan:</strong> ${soal.penjelasan_error}
    </div>
  `;

  document.getElementById("kunci-modal").classList.add("active");
}

function closeModal(id) {
  document.getElementById(id).classList.remove("active");
}

// ===== XP POPUP =====
function showXPPopup(xp) {
  const popup = document.getElementById("xp-popup");
  if (!popup) return;
  popup.textContent = `+${xp} XP ⚡`;
  popup.classList.add("show");
  setTimeout(() => popup.classList.remove("show"), 2500);
}
