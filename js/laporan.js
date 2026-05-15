// ===== LAPORAN PAGE =====
document.addEventListener("DOMContentLoaded", () => {
  const state = ProgressManager.get();
  const navXp = document.getElementById("nav-xp");
  if (navXp) navXp.textContent = `${state.xp} XP`;

  renderAll();
});

function renderAll() {
  const state = ProgressManager.get();
  const journals = state.jurnalHistory || [];

  renderSummaryCards(journals);
  renderJurnalUmum(journals);
  renderBukuBesar(journals);
  renderNeracaSaldo(journals);
  renderLabaRugi(journals);
  renderNeraca(journals);
}

// ===== TAB SWITCHING =====
function switchTab(tabId) {
  document.querySelectorAll(".report-section").forEach(s => s.classList.remove("active"));
  document.querySelectorAll(".laporan-tab").forEach(t => t.classList.remove("active"));

  document.getElementById(`tab-${tabId}`).classList.add("active");
  event.target.classList.add("active");
}

// ===== SUMMARY CARDS =====
function renderSummaryCards(journals) {
  const container = document.getElementById("summary-cards");
  if (!container) return;

  const ledger = buildLedger(journals);
  const totalAset = sumKategori(ledger, "Aset");
  const totalPendapatan = sumKategori(ledger, "Pendapatan");
  const totalBeban = sumKategori(ledger, "Beban");
  const labaRugi = totalPendapatan - totalBeban;

  container.innerHTML = `
    <div class="report-summary-card">
      <div class="summary-icon">📝</div>
      <div class="summary-value">${journals.length}</div>
      <div class="summary-label">Total Jurnal</div>
    </div>
    <div class="report-summary-card">
      <div class="summary-icon">💰</div>
      <div class="summary-value" style="font-size:1.1rem">${formatRupiah(totalAset)}</div>
      <div class="summary-label">Total Aset</div>
    </div>
    <div class="report-summary-card">
      <div class="summary-icon" style="color:${labaRugi >= 0 ? 'var(--emerald)' : '#ef4444'}">${labaRugi >= 0 ? '📈' : '📉'}</div>
      <div class="summary-value" style="font-size:1.1rem;color:${labaRugi >= 0 ? 'var(--emerald)' : '#ef4444'}">${formatRupiah(labaRugi)}</div>
      <div class="summary-label">${labaRugi >= 0 ? 'Laba Bersih' : 'Rugi Bersih'}</div>
    </div>
  `;
}

// ===== JURNAL UMUM =====
function renderJurnalUmum(journals) {
  const container = document.getElementById("jurnal-umum-content");
  if (!container) return;

  if (journals.length === 0) {
    container.innerHTML = emptyState("Belum ada jurnal", "Buat jurnal di halaman Latihan untuk melihat hasilnya di sini.");
    return;
  }

  const subtitle = document.getElementById("jurnal-subtitle");
  if (subtitle) subtitle.textContent = `${journals.length} transaksi tercatat`;

  container.innerHTML = `
    <table class="financial-table">
      <thead>
        <tr>
          <th>Tanggal</th>
          <th>Keterangan / Akun</th>
          <th>Ref</th>
          <th style="text-align:right">Debit (Rp)</th>
          <th style="text-align:right">Kredit (Rp)</th>
        </tr>
      </thead>
      <tbody>
        ${journals.map(j => {
          const rows = j.entries.map((e, i) => `
            <tr>
              <td>${i === 0 ? formatDate(j.tanggal) : ""}</td>
              <td style="${e.kredit > 0 ? "padding-left:2rem;color:#9d174d" : "font-weight:600;color:var(--navy)"}">${e.kode} — ${e.nama}</td>
              <td>${e.kode}</td>
              <td style="text-align:right">${e.debit > 0 ? formatRupiah(e.debit) : "-"}</td>
              <td style="text-align:right">${e.kredit > 0 ? formatRupiah(e.kredit) : "-"}</td>
            </tr>
          `).join("");
          const desc = `<tr><td></td><td colspan="4" style="font-style:italic;color:#94a3b8;font-size:0.8rem;padding-bottom:8px">${j.deskripsi}</td></tr>`;
          const sep = `<tr class="group-header"><td colspan="5" style="height:4px"></td></tr>`;
          return rows + desc + sep;
        }).join("")}
      </tbody>
    </table>
  `;
}

// ===== BUILD LEDGER =====
function buildLedger(journals) {
  const ledger = {}; // { kode: { nama, kategori, subkategori, saldo_normal, debit_total, kredit_total } }

  journals.forEach(j => {
    j.entries.forEach(e => {
      if (!ledger[e.kode]) {
        const coaEntry = COA.find(a => a.kode === e.kode) || {};
        ledger[e.kode] = {
          kode: e.kode,
          nama: e.nama,
          kategori: e.kategori || coaEntry.kategori || "",
          subkategori: coaEntry.subkategori || "",
          saldo_normal: coaEntry.saldo_normal || "debit",
          debit_total: 0,
          kredit_total: 0,
          transactions: []
        };
      }
      ledger[e.kode].debit_total += e.debit || 0;
      ledger[e.kode].kredit_total += e.kredit || 0;
      ledger[e.kode].transactions.push({
        tanggal: j.tanggal,
        deskripsi: j.deskripsi,
        debit: e.debit || 0,
        kredit: e.kredit || 0
      });
    });
  });

  // Calculate saldo
  Object.values(ledger).forEach(akun => {
    if (akun.saldo_normal === "debit") {
      akun.saldo = akun.debit_total - akun.kredit_total;
    } else {
      akun.saldo = akun.kredit_total - akun.debit_total;
    }
  });

  return ledger;
}

function sumKategori(ledger, kategori) {
  return Object.values(ledger)
    .filter(a => a.kategori === kategori)
    .reduce((s, a) => s + a.saldo, 0);
}

// ===== BUKU BESAR =====
function renderBukuBesar(journals) {
  const container = document.getElementById("buku-besar-content");
  if (!container) return;

  if (journals.length === 0) {
    container.innerHTML = emptyState("Belum ada data", "Buat jurnal terlebih dahulu.");
    return;
  }

  const ledger = buildLedger(journals);

  container.innerHTML = Object.values(ledger).map(akun => `
    <div style="margin-bottom:1.5rem">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:0.5rem">
        <div>
          <span style="font-weight:700;color:var(--navy)">${akun.kode} — ${akun.nama}</span>
          <span class="tag tag-teal" style="margin-left:8px">${akun.kategori}</span>
        </div>
        <div style="font-weight:800;color:var(--navy)">Saldo: ${formatRupiah(akun.saldo)}</div>
      </div>
      <table class="financial-table">
        <thead>
          <tr>
            <th>Tanggal</th>
            <th>Keterangan</th>
            <th style="text-align:right">Debit</th>
            <th style="text-align:right">Kredit</th>
            <th style="text-align:right">Saldo</th>
          </tr>
        </thead>
        <tbody>
          ${(() => {
            let runSaldo = 0;
            return akun.transactions.map(t => {
              if (akun.saldo_normal === "debit") {
                runSaldo += t.debit - t.kredit;
              } else {
                runSaldo += t.kredit - t.debit;
              }
              return `
                <tr>
                  <td>${formatDate(t.tanggal)}</td>
                  <td>${t.deskripsi}</td>
                  <td style="text-align:right">${t.debit > 0 ? formatRupiah(t.debit) : "-"}</td>
                  <td style="text-align:right">${t.kredit > 0 ? formatRupiah(t.kredit) : "-"}</td>
                  <td style="text-align:right;font-weight:600;color:${runSaldo >= 0 ? "var(--navy)" : "#ef4444"}">${formatRupiah(runSaldo)}</td>
                </tr>
              `;
            }).join("");
          })()}
          <tr class="subtotal">
            <td colspan="2"><strong>Total</strong></td>
            <td style="text-align:right"><strong>${formatRupiah(akun.debit_total)}</strong></td>
            <td style="text-align:right"><strong>${formatRupiah(akun.kredit_total)}</strong></td>
            <td style="text-align:right"><strong>${formatRupiah(akun.saldo)}</strong></td>
          </tr>
        </tbody>
      </table>
    </div>
  `).join("");
}

// ===== NERACA SALDO =====
function renderNeracaSaldo(journals) {
  const container = document.getElementById("neraca-saldo-content");
  if (!container) return;

  if (journals.length === 0) {
    container.innerHTML = emptyState("Belum ada data", "Buat jurnal terlebih dahulu.");
    return;
  }

  const ledger = buildLedger(journals);
  const accounts = Object.values(ledger).sort((a, b) => a.kode.localeCompare(b.kode));

  let totalDebit = 0, totalKredit = 0;

  const rows = accounts.map(akun => {
    const isDebitSaldo = akun.saldo_normal === "debit";
    const debitSaldo = isDebitSaldo ? akun.saldo : 0;
    const kreditSaldo = !isDebitSaldo ? akun.saldo : 0;
    totalDebit += debitSaldo;
    totalKredit += kreditSaldo;
    return `
      <tr>
        <td>${akun.kode}</td>
        <td>${akun.nama}</td>
        <td style="text-align:right">${debitSaldo > 0 ? formatRupiah(debitSaldo) : "-"}</td>
        <td style="text-align:right">${kreditSaldo > 0 ? formatRupiah(kreditSaldo) : "-"}</td>
      </tr>
    `;
  }).join("");

  container.innerHTML = `
    <table class="financial-table">
      <thead>
        <tr>
          <th>Kode</th>
          <th>Nama Akun</th>
          <th style="text-align:right">Debit (Rp)</th>
          <th style="text-align:right">Kredit (Rp)</th>
        </tr>
      </thead>
      <tbody>
        ${rows}
        <tr class="total">
          <td colspan="2"><strong>TOTAL</strong></td>
          <td style="text-align:right"><strong class="${totalDebit === totalKredit ? "amount-positive" : "amount-negative"}">${formatRupiah(totalDebit)}</strong></td>
          <td style="text-align:right"><strong class="${totalDebit === totalKredit ? "amount-positive" : "amount-negative"}">${formatRupiah(totalKredit)}</strong></td>
        </tr>
      </tbody>
    </table>
    ${totalDebit === totalKredit
      ? `<div style="margin-top:1rem;padding:10px 16px;background:#d1fae5;border-radius:var(--radius-sm);color:#065f46;font-weight:700">✅ Neraca Saldo Balance — Total Debit = Total Kredit = ${formatRupiah(totalDebit)}</div>`
      : `<div style="margin-top:1rem;padding:10px 16px;background:#fee2e2;border-radius:var(--radius-sm);color:#991b1b;font-weight:700">⚠️ Neraca Saldo Tidak Balance! Periksa kembali jurnal Anda.</div>`
    }
  `;
}

// ===== LABA RUGI =====
function renderLabaRugi(journals) {
  const container = document.getElementById("laba-rugi-content");
  if (!container) return;

  if (journals.length === 0) {
    container.innerHTML = emptyState("Belum ada data", "Buat jurnal terlebih dahulu.");
    return;
  }

  const ledger = buildLedger(journals);
  const pendapatanAkun = Object.values(ledger).filter(a => a.kategori === "Pendapatan");
  const bebanAkun = Object.values(ledger).filter(a => a.kategori === "Beban");

  const totalPendapatan = pendapatanAkun.reduce((s, a) => s + a.saldo, 0);
  const totalBeban = bebanAkun.reduce((s, a) => s + a.saldo, 0);
  const labaRugi = totalPendapatan - totalBeban;

  const dates = journals.map(j => j.tanggal).sort();
  const subtitle = document.getElementById("labarugi-subtitle");
  if (subtitle && dates.length > 0) {
    subtitle.textContent = `Periode: ${formatDate(dates[0])} s/d ${formatDate(dates[dates.length - 1])}`;
  }

  container.innerHTML = `
    <table class="financial-table">
      <thead><tr><th>Keterangan</th><th style="text-align:right">Jumlah (Rp)</th></tr></thead>
      <tbody>
        <tr class="group-header"><td colspan="2">PENDAPATAN</td></tr>
        ${pendapatanAkun.map(a => `
          <tr><td style="padding-left:2rem">${a.kode} — ${a.nama}</td><td style="text-align:right">${formatRupiah(a.saldo)}</td></tr>
        `).join("")}
        <tr class="subtotal">
          <td><strong>Total Pendapatan</strong></td>
          <td style="text-align:right"><strong class="amount-positive">${formatRupiah(totalPendapatan)}</strong></td>
        </tr>
        <tr class="group-header"><td colspan="2">BEBAN</td></tr>
        ${bebanAkun.map(a => `
          <tr><td style="padding-left:2rem">${a.kode} — ${a.nama}</td><td style="text-align:right">${formatRupiah(a.saldo)}</td></tr>
        `).join("")}
        <tr class="subtotal">
          <td><strong>Total Beban</strong></td>
          <td style="text-align:right"><strong class="amount-negative">(${formatRupiah(totalBeban)})</strong></td>
        </tr>
        <tr class="total">
          <td><strong>${labaRugi >= 0 ? "LABA BERSIH" : "RUGI BERSIH"}</strong></td>
          <td style="text-align:right"><strong class="${labaRugi >= 0 ? "amount-positive" : "amount-negative"}">${formatRupiah(labaRugi)}</strong></td>
        </tr>
      </tbody>
    </table>
  `;
}

// ===== NERACA =====
function renderNeraca(journals) {
  const container = document.getElementById("neraca-content");
  if (!container) return;

  if (journals.length === 0) {
    container.innerHTML = emptyState("Belum ada data", "Buat jurnal terlebih dahulu.");
    return;
  }

  const ledger = buildLedger(journals);

  const asetLancar = Object.values(ledger).filter(a => a.subkategori === "Aset Lancar");
  const asetTetap = Object.values(ledger).filter(a => a.subkategori === "Aset Tetap");
  const kewLancar = Object.values(ledger).filter(a => a.subkategori === "Kewajiban Lancar");
  const kewPanjang = Object.values(ledger).filter(a => a.subkategori === "Kewajiban Jangka Panjang");
  const ekuitas = Object.values(ledger).filter(a => a.kategori === "Ekuitas");

  const pendapatan = Object.values(ledger).filter(a => a.kategori === "Pendapatan");
  const beban = Object.values(ledger).filter(a => a.kategori === "Beban");
  const labaRugi = pendapatan.reduce((s, a) => s + a.saldo, 0) - beban.reduce((s, a) => s + a.saldo, 0);

  const totalAsetLancar = asetLancar.reduce((s, a) => s + a.saldo, 0);
  const totalAsetTetap = asetTetap.reduce((s, a) => s + a.saldo, 0);
  const totalAset = totalAsetLancar + totalAsetTetap;
  const totalKewLancar = kewLancar.reduce((s, a) => s + a.saldo, 0);
  const totalKewPanjang = kewPanjang.reduce((s, a) => s + a.saldo, 0);
  const totalKewajiban = totalKewLancar + totalKewPanjang;
  const totalEkuitas = ekuitas.reduce((s, a) => s + a.saldo, 0) + labaRugi;
  const totalPasiva = totalKewajiban + totalEkuitas;

  const dates = journals.map(j => j.tanggal).sort();
  const subtitle = document.getElementById("neraca-subtitle");
  if (subtitle && dates.length > 0) {
    subtitle.textContent = `Per tanggal: ${formatDate(dates[dates.length - 1])}`;
  }

  const renderGroup = (items) => items.map(a => `
    <tr><td style="padding-left:1.5rem">${a.kode} — ${a.nama}</td><td style="text-align:right">${formatRupiah(a.saldo)}</td></tr>
  `).join("");

  container.innerHTML = `
    <div class="neraca-grid">
      <!-- AKTIVA -->
      <div>
        <table class="financial-table">
          <thead><tr><th colspan="2">AKTIVA (ASET)</th></tr></thead>
          <tbody>
            <tr class="group-header"><td colspan="2">Aset Lancar</td></tr>
            ${renderGroup(asetLancar)}
            <tr class="subtotal"><td><strong>Total Aset Lancar</strong></td><td style="text-align:right"><strong>${formatRupiah(totalAsetLancar)}</strong></td></tr>
            <tr class="group-header"><td colspan="2">Aset Tetap</td></tr>
            ${renderGroup(asetTetap)}
            <tr class="subtotal"><td><strong>Total Aset Tetap</strong></td><td style="text-align:right"><strong>${formatRupiah(totalAsetTetap)}</strong></td></tr>
            <tr class="total"><td><strong>TOTAL AKTIVA</strong></td><td style="text-align:right"><strong>${formatRupiah(totalAset)}</strong></td></tr>
          </tbody>
        </table>
      </div>
      <!-- PASIVA -->
      <div>
        <table class="financial-table">
          <thead><tr><th colspan="2">PASIVA (KEWAJIBAN + EKUITAS)</th></tr></thead>
          <tbody>
            <tr class="group-header"><td colspan="2">Kewajiban Lancar</td></tr>
            ${renderGroup(kewLancar)}
            <tr class="subtotal"><td><strong>Total Kewajiban Lancar</strong></td><td style="text-align:right"><strong>${formatRupiah(totalKewLancar)}</strong></td></tr>
            <tr class="group-header"><td colspan="2">Kewajiban Jangka Panjang</td></tr>
            ${renderGroup(kewPanjang)}
            <tr class="subtotal"><td><strong>Total Kewajiban</strong></td><td style="text-align:right"><strong>${formatRupiah(totalKewajiban)}</strong></td></tr>
            <tr class="group-header"><td colspan="2">Ekuitas</td></tr>
            ${renderGroup(ekuitas)}
            <tr><td style="padding-left:1.5rem">Laba/Rugi Periode Berjalan</td><td style="text-align:right;color:${labaRugi >= 0 ? "var(--emerald)" : "#ef4444"}">${formatRupiah(labaRugi)}</td></tr>
            <tr class="subtotal"><td><strong>Total Ekuitas</strong></td><td style="text-align:right"><strong>${formatRupiah(totalEkuitas)}</strong></td></tr>
            <tr class="total"><td><strong>TOTAL PASIVA</strong></td><td style="text-align:right"><strong>${formatRupiah(totalPasiva)}</strong></td></tr>
          </tbody>
        </table>
        ${Math.abs(totalAset - totalPasiva) < 1
          ? `<div style="margin-top:1rem;padding:10px 16px;background:#d1fae5;border-radius:var(--radius-sm);color:#065f46;font-weight:700">✅ Neraca Balance!</div>`
          : `<div style="margin-top:1rem;padding:10px 16px;background:#fee2e2;border-radius:var(--radius-sm);color:#991b1b;font-weight:700">⚠️ Neraca Tidak Balance. Selisih: ${formatRupiah(Math.abs(totalAset - totalPasiva))}</div>`
        }
      </div>
    </div>
  `;
}

// ===== CLEAR JURNAL =====
function clearJurnal() {
  if (!confirm("Hapus semua jurnal yang tersimpan? Tindakan ini tidak bisa dibatalkan.")) return;
  const state = ProgressManager.get();
  state.jurnalHistory = [];
  state.totalJurnal = 0;
  ProgressManager.save(state);
  showToast("Semua jurnal telah dihapus.", "warning");
  renderAll();
}

// ===== HELPERS =====
function formatDate(dateStr) {
  if (!dateStr) return "-";
  try {
    return new Date(dateStr).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" });
  } catch { return dateStr; }
}

function emptyState(title, text) {
  return `
    <div class="empty-state">
      <div class="empty-state-icon">📭</div>
      <div class="empty-state-title">${title}</div>
      <div class="empty-state-text">${text}</div>
      <a href="latihan.html" class="btn btn-navy">Mulai Buat Jurnal →</a>
    </div>
  `;
}
