// ===== EXPORT EXCEL — AkunPintar =====
// Menggunakan SheetJS (xlsx) untuk generate file Excel lengkap
// Sheet 1: Jurnal Umum | Sheet 2: Buku Besar | Sheet 3: Neraca Saldo
// Sheet 4: Laba/Rugi   | Sheet 5: Neraca

function exportToExcel() {
  const state = ProgressManager.get();
  const journals = state.jurnalHistory || [];

  if (journals.length === 0) {
    showToast("Belum ada jurnal untuk diekspor. Buat jurnal terlebih dahulu!", "warning");
    return;
  }

  // Pastikan SheetJS sudah dimuat
  if (typeof XLSX === "undefined") {
    showToast("Library Excel sedang dimuat, coba lagi sebentar...", "warning");
    return;
  }

  const wb = XLSX.utils.book_new();
  wb.Props = {
    Title: "Laporan Keuangan AkunPintar",
    Subject: "Laporan Keuangan",
    Author: "AkunPintar",
    CreatedDate: new Date()
  };

  const ledger = buildLedger(journals);
  const tanggalExport = new Date().toLocaleDateString("id-ID", { day:"2-digit", month:"long", year:"numeric" });

  // ============================================================
  // SHEET 1 — JURNAL UMUM
  // ============================================================
  const wsJurnal = buildSheetJurnalUmum(journals, tanggalExport);
  XLSX.utils.book_append_sheet(wb, wsJurnal, "1. Jurnal Umum");

  // ============================================================
  // SHEET 2 — BUKU BESAR
  // ============================================================
  const wsBukuBesar = buildSheetBukuBesar(ledger, tanggalExport);
  XLSX.utils.book_append_sheet(wb, wsBukuBesar, "2. Buku Besar");

  // ============================================================
  // SHEET 3 — NERACA SALDO
  // ============================================================
  const wsNeracaSaldo = buildSheetNeracaSaldo(ledger, tanggalExport);
  XLSX.utils.book_append_sheet(wb, wsNeracaSaldo, "3. Neraca Saldo");

  // ============================================================
  // SHEET 4 — LABA RUGI
  // ============================================================
  const wsLabaRugi = buildSheetLabaRugi(ledger, journals, tanggalExport);
  XLSX.utils.book_append_sheet(wb, wsLabaRugi, "4. Laba Rugi");

  // ============================================================
  // SHEET 5 — NERACA
  // ============================================================
  const wsNeraca = buildSheetNeraca(ledger, journals, tanggalExport);
  XLSX.utils.book_append_sheet(wb, wsNeraca, "5. Neraca");

  // Download file
  const fileName = `LaporanKeuangan_AkunPintar_${new Date().toISOString().split("T")[0]}.xlsx`;
  XLSX.writeFile(wb, fileName);
  showToast("✅ File Excel berhasil diunduh!", "success");
}

// ============================================================
// HELPER: Style cells
// ============================================================
function styleHeader(ws, cellRef, opts = {}) {
  if (!ws[cellRef]) return;
  ws[cellRef].s = {
    font: { bold: true, color: { rgb: opts.fontColor || "FFFFFF" }, sz: opts.sz || 11 },
    fill: { fgColor: { rgb: opts.bg || "1A2744" } },
    alignment: { horizontal: opts.align || "center", vertical: "center", wrapText: true },
    border: borderAll()
  };
}

function styleCell(ws, cellRef, opts = {}) {
  if (!ws[cellRef]) return;
  ws[cellRef].s = {
    font: { bold: opts.bold || false, color: { rgb: opts.color || "1A2744" }, sz: opts.sz || 10 },
    fill: { fgColor: { rgb: opts.bg || "FFFFFF" } },
    alignment: { horizontal: opts.align || "left", vertical: "center" },
    border: borderAll(),
    numFmt: opts.numFmt || ""
  };
}

function borderAll() {
  const b = { style: "thin", color: { rgb: "E2E8F0" } };
  return { top: b, bottom: b, left: b, right: b };
}

function borderThick() {
  const b = { style: "medium", color: { rgb: "1A2744" } };
  return { top: b, bottom: b, left: b, right: b };
}

function rupiahFmt() { return '#,##0'; }

function addTitle(data, title, subtitle) {
  data.push([title]);
  data.push([subtitle]);
  data.push(["Diekspor oleh: AkunPintar | " + new Date().toLocaleDateString("id-ID", { weekday:"long", day:"2-digit", month:"long", year:"numeric" })]);
  data.push([]);
}

// ============================================================
// SHEET 1 — JURNAL UMUM
// ============================================================
function buildSheetJurnalUmum(journals, tanggalExport) {
  const data = [];

  // Judul
  data.push(["JURNAL UMUM"]);
  data.push(["CV / Perusahaan — AkunPintar"]);
  data.push(["Tanggal Export: " + tanggalExport]);
  data.push([]);
  // Header kolom
  data.push(["No.", "Tanggal", "Kode Akun", "Nama Akun", "Keterangan", "Debit (Rp)", "Kredit (Rp)"]);

  let no = 1;
  let totalDebit = 0, totalKredit = 0;
  const dataStartRow = 6; // baris data mulai (1-indexed)
  let currentRow = dataStartRow;

  journals.forEach((j, ji) => {
    j.entries.forEach((e, ei) => {
      data.push([
        ei === 0 ? no++ : "",
        ei === 0 ? j.tanggal : "",
        e.kode,
        e.nama,
        ei === 0 ? j.deskripsi : "",
        e.debit > 0 ? e.debit : 0,
        e.kredit > 0 ? e.kredit : 0
      ]);
      totalDebit += e.debit || 0;
      totalKredit += e.kredit || 0;
      currentRow++;
    });
    // Baris kosong antar transaksi
    data.push(["", "", "", "", "", "", ""]);
    currentRow++;
  });

  // Total
  data.push(["", "", "", "", "TOTAL", totalDebit, totalKredit]);
  // Baris cek balance dengan rumus IF
  const totalRow = data.length;
  data.push(["", "", "", "", "STATUS BALANCE",
    { f: `IF(F${totalRow}=G${totalRow},"✅ BALANCE","❌ TIDAK BALANCE")` }, ""
  ]);

  const ws = XLSX.utils.aoa_to_sheet(data);

  // Lebar kolom
  ws["!cols"] = [
    { wch: 5 },   // No
    { wch: 14 },  // Tanggal
    { wch: 10 },  // Kode
    { wch: 28 },  // Nama Akun
    { wch: 35 },  // Keterangan
    { wch: 18 },  // Debit
    { wch: 18 },  // Kredit
  ];

  // Merge judul
  ws["!merges"] = [
    { s: { r: 0, c: 0 }, e: { r: 0, c: 6 } },
    { s: { r: 1, c: 0 }, e: { r: 1, c: 6 } },
    { s: { r: 2, c: 0 }, e: { r: 2, c: 6 } },
  ];

  // Style judul
  if (ws["A1"]) ws["A1"].s = { font: { bold: true, sz: 16, color: { rgb: "1A2744" } }, alignment: { horizontal: "center" } };
  if (ws["A2"]) ws["A2"].s = { font: { sz: 12, color: { rgb: "64748B" } }, alignment: { horizontal: "center" } };
  if (ws["A3"]) ws["A3"].s = { font: { sz: 10, color: { rgb: "94A3B8" } }, alignment: { horizontal: "center" } };

  // Style header kolom (baris 5, index 4)
  ["A5","B5","C5","D5","E5","F5","G5"].forEach(c => styleHeader(ws, c));

  return ws;
}

// ============================================================
// SHEET 2 — BUKU BESAR
// ============================================================
function buildSheetBukuBesar(ledger, tanggalExport) {
  const data = [];

  data.push(["BUKU BESAR"]);
  data.push(["CV / Perusahaan — AkunPintar"]);
  data.push(["Tanggal Export: " + tanggalExport]);
  data.push([]);

  const accounts = Object.values(ledger).sort((a, b) => a.kode.localeCompare(b.kode));

  accounts.forEach(akun => {
    // Header akun
    data.push([`${akun.kode} — ${akun.nama}`, "", "", "", "", `Kategori: ${akun.kategori}`, `Saldo Normal: ${akun.saldo_normal.toUpperCase()}`]);
    data.push(["Tanggal", "Keterangan", "Debit (Rp)", "Kredit (Rp)", "Saldo (Rp)", "", ""]);

    let runSaldo = 0;
    const txStartRow = data.length + 1;

    akun.transactions.forEach((t, i) => {
      if (akun.saldo_normal === "debit") {
        runSaldo += t.debit - t.kredit;
      } else {
        runSaldo += t.kredit - t.debit;
      }
      data.push([
        t.tanggal,
        t.deskripsi,
        t.debit > 0 ? t.debit : 0,
        t.kredit > 0 ? t.kredit : 0,
        runSaldo,
        "", ""
      ]);
    });

    // Subtotal dengan rumus SUM
    const txEndRow = data.length;
    data.push([
      "TOTAL",
      "",
      { f: `SUM(C${txStartRow}:C${txEndRow})` },
      { f: `SUM(D${txStartRow}:D${txEndRow})` },
      { f: `IF(B${txStartRow-1}="debit",C${txEndRow+1}-D${txEndRow+1},D${txEndRow+1}-C${txEndRow+1})` },
      "", ""
    ]);
    data.push([]);
  });

  const ws = XLSX.utils.aoa_to_sheet(data);

  ws["!cols"] = [
    { wch: 14 }, { wch: 35 }, { wch: 18 }, { wch: 18 }, { wch: 18 }, { wch: 20 }, { wch: 20 }
  ];

  ws["!merges"] = [
    { s: { r: 0, c: 0 }, e: { r: 0, c: 6 } },
    { s: { r: 1, c: 0 }, e: { r: 1, c: 6 } },
    { s: { r: 2, c: 0 }, e: { r: 2, c: 6 } },
  ];

  if (ws["A1"]) ws["A1"].s = { font: { bold: true, sz: 16, color: { rgb: "1A2744" } }, alignment: { horizontal: "center" } };

  return ws;
}

// ============================================================
// SHEET 3 — NERACA SALDO
// ============================================================
function buildSheetNeracaSaldo(ledger, tanggalExport) {
  const data = [];

  data.push(["NERACA SALDO"]);
  data.push(["CV / Perusahaan — AkunPintar"]);
  data.push(["Tanggal Export: " + tanggalExport]);
  data.push([]);
  data.push(["No.", "Kode Akun", "Nama Akun", "Kategori", "Saldo Normal", "Debit (Rp)", "Kredit (Rp)"]);

  const accounts = Object.values(ledger).sort((a, b) => a.kode.localeCompare(b.kode));
  let no = 1;
  let totalD = 0, totalK = 0;
  const dataStart = 6;

  accounts.forEach(akun => {
    const isDebit = akun.saldo_normal === "debit";
    const debitVal = isDebit ? akun.saldo : 0;
    const kreditVal = !isDebit ? akun.saldo : 0;
    totalD += debitVal;
    totalK += kreditVal;
    data.push([no++, akun.kode, akun.nama, akun.kategori, akun.saldo_normal.toUpperCase(), debitVal, kreditVal]);
  });

  const lastDataRow = data.length;
  // Total dengan SUM
  data.push([
    "", "", "", "", "TOTAL",
    { f: `SUM(F${dataStart}:F${lastDataRow})` },
    { f: `SUM(G${dataStart}:G${lastDataRow})` }
  ]);
  // Cek balance dengan IF
  const totalRow = data.length;
  data.push([
    "", "", "", "", "STATUS",
    { f: `IF(F${totalRow}=G${totalRow},"✅ BALANCE","❌ TIDAK BALANCE")` },
    ""
  ]);
  // VLOOKUP contoh — cari nama akun berdasarkan kode
  data.push([]);
  data.push(["--- CONTOH RUMUS VLOOKUP ---", "", "", "", "", "", ""]);
  data.push(["Cari Nama Akun (kode 1101):",
    { f: `VLOOKUP("1101",B${dataStart}:C${lastDataRow},2,FALSE)` },
    "", "", "", "", ""
  ]);
  data.push(["Cari Kategori Akun (kode 1101):",
    { f: `VLOOKUP("1101",B${dataStart}:D${lastDataRow},3,FALSE)` },
    "", "", "", "", ""
  ]);

  const ws = XLSX.utils.aoa_to_sheet(data);

  ws["!cols"] = [
    { wch: 5 }, { wch: 10 }, { wch: 28 }, { wch: 16 }, { wch: 14 }, { wch: 18 }, { wch: 18 }
  ];
  ws["!merges"] = [
    { s: { r: 0, c: 0 }, e: { r: 0, c: 6 } },
    { s: { r: 1, c: 0 }, e: { r: 1, c: 6 } },
    { s: { r: 2, c: 0 }, e: { r: 2, c: 6 } },
  ];

  if (ws["A1"]) ws["A1"].s = { font: { bold: true, sz: 16, color: { rgb: "1A2744" } }, alignment: { horizontal: "center" } };
  ["A5","B5","C5","D5","E5","F5","G5"].forEach(c => styleHeader(ws, c));

  return ws;
}

// ============================================================
// SHEET 4 — LABA RUGI
// ============================================================
function buildSheetLabaRugi(ledger, journals, tanggalExport) {
  const data = [];
  const dates = journals.map(j => j.tanggal).sort();
  const periode = dates.length > 0
    ? `${dates[0]} s/d ${dates[dates.length - 1]}`
    : tanggalExport;

  data.push(["LAPORAN LABA / RUGI"]);
  data.push(["CV / Perusahaan — AkunPintar"]);
  data.push(["Periode: " + periode]);
  data.push([]);

  const pendapatanAkun = Object.values(ledger).filter(a => a.kategori === "Pendapatan");
  const bebanAkun = Object.values(ledger).filter(a => a.kategori === "Beban");

  // Header
  data.push(["No.", "Kode", "Nama Akun", "Jumlah (Rp)", "Keterangan"]);

  // PENDAPATAN
  data.push(["", "", "A. PENDAPATAN", "", ""]);
  const pendStart = data.length + 1;
  let noPend = 1;
  pendapatanAkun.forEach(a => {
    data.push([noPend++, a.kode, a.nama, a.saldo, ""]);
  });
  const pendEnd = data.length;
  data.push(["", "", "Total Pendapatan", { f: `SUM(D${pendStart}:D${pendEnd})` }, ""]);
  const totalPendRow = data.length;

  data.push([]);

  // BEBAN
  data.push(["", "", "B. BEBAN OPERASIONAL", "", ""]);
  const bebanStart = data.length + 1;
  let noBeban = 1;
  bebanAkun.forEach(a => {
    data.push([noBeban++, a.kode, a.nama, a.saldo, ""]);
  });
  const bebanEnd = data.length;
  data.push(["", "", "Total Beban", { f: `SUM(D${bebanStart}:D${bebanEnd})` }, ""]);
  const totalBebanRow = data.length;

  data.push([]);

  // LABA/RUGI dengan rumus IF
  data.push(["", "", "LABA / RUGI BERSIH",
    { f: `D${totalPendRow}-D${totalBebanRow}` },
    { f: `IF(D${totalPendRow}-D${totalBebanRow}>=0,"LABA","RUGI")` }
  ]);
  const labaRow = data.length;

  // Margin dengan rumus
  data.push([]);
  data.push(["--- ANALISIS KEUANGAN ---", "", "", "", ""]);
  data.push(["Net Profit Margin",
    { f: `IF(D${totalPendRow}>0,D${labaRow}/D${totalPendRow},"N/A")` },
    "", "Rumus: Laba Bersih / Total Pendapatan", ""
  ]);
  data.push(["Rasio Beban thd Pendapatan",
    { f: `IF(D${totalPendRow}>0,D${totalBebanRow}/D${totalPendRow},"N/A")` },
    "", "Rumus: Total Beban / Total Pendapatan", ""
  ]);

  const ws = XLSX.utils.aoa_to_sheet(data);

  ws["!cols"] = [
    { wch: 5 }, { wch: 10 }, { wch: 32 }, { wch: 20 }, { wch: 20 }
  ];
  ws["!merges"] = [
    { s: { r: 0, c: 0 }, e: { r: 0, c: 4 } },
    { s: { r: 1, c: 0 }, e: { r: 1, c: 4 } },
    { s: { r: 2, c: 0 }, e: { r: 2, c: 4 } },
  ];

  if (ws["A1"]) ws["A1"].s = { font: { bold: true, sz: 16, color: { rgb: "1A2744" } }, alignment: { horizontal: "center" } };
  ["A5","B5","C5","D5","E5"].forEach(c => styleHeader(ws, c));

  return ws;
}

// ============================================================
// SHEET 5 — NERACA
// ============================================================
function buildSheetNeraca(ledger, journals, tanggalExport) {
  const data = [];
  const dates = journals.map(j => j.tanggal).sort();
  const perTanggal = dates.length > 0 ? dates[dates.length - 1] : tanggalExport;

  data.push(["NERACA (BALANCE SHEET)"]);
  data.push(["CV / Perusahaan — AkunPintar"]);
  data.push(["Per Tanggal: " + perTanggal]);
  data.push([]);

  const asetLancar   = Object.values(ledger).filter(a => a.subkategori === "Aset Lancar");
  const asetTetap    = Object.values(ledger).filter(a => a.subkategori === "Aset Tetap");
  const kewLancar    = Object.values(ledger).filter(a => a.subkategori === "Kewajiban Lancar");
  const kewPanjang   = Object.values(ledger).filter(a => a.subkategori === "Kewajiban Jangka Panjang");
  const ekuitasAkun  = Object.values(ledger).filter(a => a.kategori === "Ekuitas");
  const pendapatan   = Object.values(ledger).filter(a => a.kategori === "Pendapatan");
  const beban        = Object.values(ledger).filter(a => a.kategori === "Beban");
  const labaRugi     = pendapatan.reduce((s,a) => s + a.saldo, 0) - beban.reduce((s,a) => s + a.saldo, 0);

  // Header tabel
  data.push(["No.", "Kode", "Nama Akun", "Jumlah (Rp)", "Total (Rp)", "Keterangan"]);

  // ---- AKTIVA ----
  data.push(["", "", "AKTIVA", "", "", ""]);

  // Aset Lancar
  data.push(["", "", "I. Aset Lancar", "", "", ""]);
  const alStart = data.length + 1;
  let no = 1;
  asetLancar.forEach(a => data.push([no++, a.kode, a.nama, a.saldo, "", ""]));
  const alEnd = data.length;
  data.push(["", "", "Total Aset Lancar", "", { f: `SUM(D${alStart}:D${alEnd})` }, ""]);
  const totalALRow = data.length;

  // Aset Tetap
  data.push(["", "", "II. Aset Tetap", "", "", ""]);
  const atStart = data.length + 1;
  no = 1;
  asetTetap.forEach(a => data.push([no++, a.kode, a.nama, a.saldo, "", ""]));
  const atEnd = data.length;
  data.push(["", "", "Total Aset Tetap", "", { f: `SUM(D${atStart}:D${atEnd})` }, ""]);
  const totalATRow = data.length;

  // Total Aktiva
  data.push(["", "", "TOTAL AKTIVA", "", { f: `E${totalALRow}+E${totalATRow}` }, ""]);
  const totalAktivaRow = data.length;

  data.push([]);

  // ---- PASIVA ----
  data.push(["", "", "PASIVA", "", "", ""]);

  // Kewajiban Lancar
  data.push(["", "", "I. Kewajiban Lancar", "", "", ""]);
  const klStart = data.length + 1;
  no = 1;
  kewLancar.forEach(a => data.push([no++, a.kode, a.nama, a.saldo, "", ""]));
  const klEnd = data.length;
  data.push(["", "", "Total Kewajiban Lancar", "", { f: `SUM(D${klStart}:D${klEnd})` }, ""]);
  const totalKLRow = data.length;

  // Kewajiban Jangka Panjang
  data.push(["", "", "II. Kewajiban Jangka Panjang", "", "", ""]);
  const kjpStart = data.length + 1;
  no = 1;
  kewPanjang.forEach(a => data.push([no++, a.kode, a.nama, a.saldo, "", ""]));
  const kjpEnd = data.length;
  data.push(["", "", "Total Kewajiban Jangka Panjang", "", { f: `SUM(D${kjpStart}:D${kjpEnd})` }, ""]);
  const totalKJPRow = data.length;

  // Ekuitas
  data.push(["", "", "III. Ekuitas", "", "", ""]);
  const ekStart = data.length + 1;
  no = 1;
  ekuitasAkun.forEach(a => data.push([no++, a.kode, a.nama, a.saldo, "", ""]));
  // Laba/Rugi berjalan
  data.push(["", "", "Laba/Rugi Periode Berjalan", labaRugi, "", "Dari Sheet Laba/Rugi"]);
  const ekEnd = data.length;
  data.push(["", "", "Total Ekuitas", "", { f: `SUM(D${ekStart}:D${ekEnd})` }, ""]);
  const totalEkRow = data.length;

  // Total Pasiva
  data.push(["", "", "TOTAL PASIVA", "", { f: `E${totalKLRow}+E${totalKJPRow}+E${totalEkRow}` }, ""]);
  const totalPasivaRow = data.length;

  data.push([]);

  // Cek Balance dengan IF
  data.push(["", "", "CEK NERACA",
    { f: `IF(E${totalAktivaRow}=E${totalPasivaRow},"✅ NERACA BALANCE","❌ TIDAK BALANCE — Selisih: "&TEXT(ABS(E${totalAktivaRow}-E${totalPasivaRow}),"#,##0"))` },
    "", ""
  ]);

  // Rumus-rumus analisis keuangan
  data.push([]);
  data.push(["--- RASIO KEUANGAN (HLOOKUP STYLE) ---", "", "", "", "", ""]);
  data.push(["Current Ratio",
    { f: `IF(E${totalKLRow}>0,E${totalALRow}/E${totalKLRow},"N/A")` },
    "x", "Rumus: Aset Lancar / Kewajiban Lancar", "", ""
  ]);
  data.push(["Debt to Equity Ratio",
    { f: `IF(E${totalEkRow}>0,(E${totalKLRow}+E${totalKJPRow})/E${totalEkRow},"N/A")` },
    "x", "Rumus: Total Utang / Total Ekuitas", "", ""
  ]);
  data.push(["Debt to Asset Ratio",
    { f: `IF(E${totalAktivaRow}>0,(E${totalKLRow}+E${totalKJPRow})/E${totalAktivaRow},"N/A")` },
    "x", "Rumus: Total Utang / Total Aset", "", ""
  ]);
  data.push(["Equity Ratio",
    { f: `IF(E${totalAktivaRow}>0,E${totalEkRow}/E${totalAktivaRow},"N/A")` },
    "x", "Rumus: Total Ekuitas / Total Aset", "", ""
  ]);

  const ws = XLSX.utils.aoa_to_sheet(data);

  ws["!cols"] = [
    { wch: 5 }, { wch: 10 }, { wch: 34 }, { wch: 20 }, { wch: 20 }, { wch: 28 }
  ];
  ws["!merges"] = [
    { s: { r: 0, c: 0 }, e: { r: 0, c: 5 } },
    { s: { r: 1, c: 0 }, e: { r: 1, c: 5 } },
    { s: { r: 2, c: 0 }, e: { r: 2, c: 5 } },
  ];

  if (ws["A1"]) ws["A1"].s = { font: { bold: true, sz: 16, color: { rgb: "1A2744" } }, alignment: { horizontal: "center" } };
  ["A5","B5","C5","D5","E5","F5"].forEach(c => styleHeader(ws, c));

  return ws;
}
