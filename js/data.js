// ===== CHART OF ACCOUNTS =====
const COA = [
  // ASET
  { kode: "1101", nama: "Kas di Tangan",         kategori: "Aset",       subkategori: "Aset Lancar",    saldo_normal: "debit" },
  { kode: "1102", nama: "Kas di Bank",            kategori: "Aset",       subkategori: "Aset Lancar",    saldo_normal: "debit" },
  { kode: "1103", nama: "Piutang Usaha",          kategori: "Aset",       subkategori: "Aset Lancar",    saldo_normal: "debit" },
  { kode: "1104", nama: "Persediaan Barang",      kategori: "Aset",       subkategori: "Aset Lancar",    saldo_normal: "debit" },
  { kode: "1105", nama: "Perlengkapan Kantor",    kategori: "Aset",       subkategori: "Aset Lancar",    saldo_normal: "debit" },
  { kode: "1106", nama: "Beban Dibayar Dimuka",   kategori: "Aset",       subkategori: "Aset Lancar",    saldo_normal: "debit" },
  { kode: "1201", nama: "Peralatan Kantor",       kategori: "Aset",       subkategori: "Aset Tetap",     saldo_normal: "debit" },
  { kode: "1202", nama: "Kendaraan",              kategori: "Aset",       subkategori: "Aset Tetap",     saldo_normal: "debit" },
  { kode: "1203", nama: "Gedung",                 kategori: "Aset",       subkategori: "Aset Tetap",     saldo_normal: "debit" },
  { kode: "1204", nama: "Akum. Penyusutan Peralatan", kategori: "Aset",   subkategori: "Aset Tetap",     saldo_normal: "kredit" },
  // KEWAJIBAN
  { kode: "2101", nama: "Utang Usaha",            kategori: "Kewajiban",  subkategori: "Kewajiban Lancar", saldo_normal: "kredit" },
  { kode: "2102", nama: "Utang Gaji",             kategori: "Kewajiban",  subkategori: "Kewajiban Lancar", saldo_normal: "kredit" },
  { kode: "2103", nama: "Utang Pajak",            kategori: "Kewajiban",  subkategori: "Kewajiban Lancar", saldo_normal: "kredit" },
  { kode: "2104", nama: "Pendapatan Diterima Dimuka", kategori: "Kewajiban", subkategori: "Kewajiban Lancar", saldo_normal: "kredit" },
  { kode: "2201", nama: "Utang Bank Jangka Panjang", kategori: "Kewajiban", subkategori: "Kewajiban Jangka Panjang", saldo_normal: "kredit" },
  // EKUITAS
  { kode: "3101", nama: "Modal Pemilik",          kategori: "Ekuitas",    subkategori: "Ekuitas",        saldo_normal: "kredit" },
  { kode: "3102", nama: "Prive Pemilik",          kategori: "Ekuitas",    subkategori: "Ekuitas",        saldo_normal: "debit" },
  { kode: "3103", nama: "Laba Ditahan",           kategori: "Ekuitas",    subkategori: "Ekuitas",        saldo_normal: "kredit" },
  // PENDAPATAN
  { kode: "4101", nama: "Pendapatan Jasa",        kategori: "Pendapatan", subkategori: "Pendapatan Operasional", saldo_normal: "kredit" },
  { kode: "4102", nama: "Pendapatan Penjualan",   kategori: "Pendapatan", subkategori: "Pendapatan Operasional", saldo_normal: "kredit" },
  { kode: "4103", nama: "Pendapatan Bunga",       kategori: "Pendapatan", subkategori: "Pendapatan Lain-lain",   saldo_normal: "kredit" },
  // BEBAN
  { kode: "5101", nama: "Beban Gaji",             kategori: "Beban",      subkategori: "Beban Operasional", saldo_normal: "debit" },
  { kode: "5102", nama: "Beban Sewa",             kategori: "Beban",      subkategori: "Beban Operasional", saldo_normal: "debit" },
  { kode: "5103", nama: "Beban Listrik & Air",    kategori: "Beban",      subkategori: "Beban Operasional", saldo_normal: "debit" },
  { kode: "5104", nama: "Beban Perlengkapan",     kategori: "Beban",      subkategori: "Beban Operasional", saldo_normal: "debit" },
  { kode: "5105", nama: "Beban Penyusutan",       kategori: "Beban",      subkategori: "Beban Operasional", saldo_normal: "debit" },
  { kode: "5106", nama: "Beban Iklan",            kategori: "Beban",      subkategori: "Beban Operasional", saldo_normal: "debit" },
  { kode: "5107", nama: "Beban Bunga",            kategori: "Beban",      subkategori: "Beban Lain-lain",   saldo_normal: "debit" },
  { kode: "5108", nama: "HPP (Harga Pokok Penjualan)", kategori: "Beban", subkategori: "Beban Operasional", saldo_normal: "debit" },
];

// ===== SOAL LATIHAN =====
const soalLatihan = [
  {
    id: 1,
    kategori: "Akuntansi Dasar",
    kategori_icon: "📝",
    kategori_color: "tag-teal",
    pertanyaan: "Tanggal 1 Januari, Budi mendirikan usaha jasa konsultansi dan menyetorkan modal awal berupa uang tunai sebesar Rp 50.000.000.",
    hint: "Ingat: Uang tunai masuk → Kas bertambah (Debit). Modal pemilik bertambah (Kredit).",
    jawaban_benar: [
      { akun: "1101", posisi: "debit",  nominal: 50000000 },
      { akun: "3101", posisi: "kredit", nominal: 50000000 }
    ],
    penjelasan_error: "Saat pemilik menyetor modal tunai, Kas (Aset) bertambah dicatat di DEBIT, dan Modal Pemilik (Ekuitas) bertambah dicatat di KREDIT. Keduanya harus sama-sama Rp 50.000.000.",
    xp: 20
  },
  {
    id: 2,
    kategori: "Akuntansi Dasar",
    kategori_icon: "📝",
    kategori_color: "tag-teal",
    pertanyaan: "Tanggal 5 Januari, dibeli perlengkapan kantor (kertas, pulpen, dll) senilai Rp 3.500.000 secara tunai.",
    hint: "Perlengkapan yang baru dibeli dan BELUM dipakai adalah Aset, bukan Beban!",
    jawaban_benar: [
      { akun: "1105", posisi: "debit",  nominal: 3500000 },
      { akun: "1101", posisi: "kredit", nominal: 3500000 }
    ],
    penjelasan_error: "Perlengkapan yang baru dibeli dicatat sebagai ASET (Perlengkapan Kantor) di Debit karena belum digunakan. Kas berkurang dicatat di Kredit. Jangan langsung mencatat sebagai Beban Perlengkapan!",
    xp: 25
  },
  {
    id: 3,
    kategori: "Akuntansi Dasar",
    kategori_icon: "📝",
    kategori_color: "tag-teal",
    pertanyaan: "Tanggal 10 Januari, diterima pendapatan jasa konsultansi dari klien sebesar Rp 15.000.000 secara tunai.",
    hint: "Uang masuk dari jasa = Kas bertambah. Pendapatan Jasa bertambah.",
    jawaban_benar: [
      { akun: "1101", posisi: "debit",  nominal: 15000000 },
      { akun: "4101", posisi: "kredit", nominal: 15000000 }
    ],
    penjelasan_error: "Saat menerima pembayaran jasa tunai: Kas (Aset) bertambah → Debit. Pendapatan Jasa (Pendapatan) bertambah → Kredit.",
    xp: 20
  },
  {
    id: 4,
    kategori: "Akuntansi Dasar",
    kategori_icon: "📝",
    kategori_color: "tag-teal",
    pertanyaan: "Tanggal 15 Januari, dibayar gaji karyawan bulan Januari sebesar Rp 8.000.000 secara tunai.",
    hint: "Gaji yang dibayar adalah beban perusahaan. Kas berkurang.",
    jawaban_benar: [
      { akun: "5101", posisi: "debit",  nominal: 8000000 },
      { akun: "1101", posisi: "kredit", nominal: 8000000 }
    ],
    penjelasan_error: "Pembayaran gaji adalah Beban Gaji (Beban) → Debit karena beban bertambah. Kas (Aset) berkurang → Kredit.",
    xp: 20
  },
  {
    id: 5,
    kategori: "Akuntansi Dasar",
    kategori_icon: "📝",
    kategori_color: "tag-teal",
    pertanyaan: "Tanggal 20 Januari, diberikan jasa konsultansi kepada PT Maju senilai Rp 20.000.000 namun pembayaran akan dilakukan bulan depan (kredit).",
    hint: "Jasa sudah diberikan tapi belum dibayar = Piutang Usaha!",
    jawaban_benar: [
      { akun: "1103", posisi: "debit",  nominal: 20000000 },
      { akun: "4101", posisi: "kredit", nominal: 20000000 }
    ],
    penjelasan_error: "Jasa sudah diberikan tapi belum dibayar → Piutang Usaha (Aset) bertambah di Debit. Pendapatan Jasa tetap diakui di Kredit (prinsip akrual).",
    xp: 30
  },
  {
    id: 6,
    kategori: "Perpajakan",
    kategori_icon: "🏛️",
    kategori_color: "tag-navy",
    pertanyaan: "Perusahaan membayar PPh Pasal 21 atas gaji karyawan sebesar Rp 500.000 yang sebelumnya sudah dicatat sebagai Utang Pajak.",
    hint: "Utang Pajak berkurang (Debit), Kas berkurang (Kredit).",
    jawaban_benar: [
      { akun: "2103", posisi: "debit",  nominal: 500000 },
      { akun: "1101", posisi: "kredit", nominal: 500000 }
    ],
    penjelasan_error: "Saat membayar utang pajak: Utang Pajak (Kewajiban) berkurang → Debit. Kas (Aset) berkurang → Kredit.",
    xp: 35
  },
  {
    id: 7,
    kategori: "Akuntansi Dasar",
    kategori_icon: "📝",
    kategori_color: "tag-teal",
    pertanyaan: "Tanggal 25 Januari, dibeli peralatan kantor (komputer) seharga Rp 12.000.000. Dibayar tunai Rp 5.000.000 dan sisanya kredit (utang).",
    hint: "Transaksi ini melibatkan 3 akun: Peralatan, Kas, dan Utang Usaha.",
    jawaban_benar: [
      { akun: "1201", posisi: "debit",  nominal: 12000000 },
      { akun: "1101", posisi: "kredit", nominal: 5000000  },
      { akun: "2101", posisi: "kredit", nominal: 7000000  }
    ],
    penjelasan_error: "Peralatan Kantor (Aset) bertambah Rp 12.000.000 → Debit. Kas berkurang Rp 5.000.000 → Kredit. Utang Usaha bertambah Rp 7.000.000 → Kredit. Total Debit = Total Kredit = Rp 12.000.000.",
    xp: 40
  },
  {
    id: 8,
    kategori: "Keuangan",
    kategori_icon: "💰",
    kategori_color: "tag-emerald",
    pertanyaan: "Pemilik mengambil uang dari kas perusahaan sebesar Rp 2.000.000 untuk keperluan pribadi (prive).",
    hint: "Pengambilan pribadi pemilik dicatat sebagai Prive, bukan Beban!",
    jawaban_benar: [
      { akun: "3102", posisi: "debit",  nominal: 2000000 },
      { akun: "1101", posisi: "kredit", nominal: 2000000 }
    ],
    penjelasan_error: "Pengambilan uang oleh pemilik untuk pribadi dicatat sebagai Prive Pemilik (Ekuitas) → Debit (mengurangi ekuitas). Kas (Aset) berkurang → Kredit. Ini BUKAN beban perusahaan!",
    xp: 30
  }
];

// ===== BADGES =====
const allBadges = [
  { id: "first_journal",   emoji: "📝", nama: "Jurnalis Pertama",    deskripsi: "Buat jurnal pertamamu",          syarat: (s) => s.totalJurnal >= 1 },
  { id: "first_correct",   emoji: "✅", nama: "Jawaban Pertama",     deskripsi: "Jawab soal pertama dengan benar", syarat: (s) => s.totalBenar >= 1 },
  { id: "five_correct",    emoji: "🌟", nama: "Bintang Lima",        deskripsi: "Jawab 5 soal dengan benar",       syarat: (s) => s.totalBenar >= 5 },
  { id: "all_correct",     emoji: "🏆", nama: "Master Jurnal",       deskripsi: "Jawab semua soal dengan benar",   syarat: (s) => s.totalBenar >= soalLatihan.length },
  { id: "level_5",         emoji: "🚀", nama: "Level 5",             deskripsi: "Capai level 5",                   syarat: (s) => s.level >= 5 },
  { id: "balance_maker",   emoji: "⚖️", nama: "Balance Maker",      deskripsi: "Buat 3 jurnal yang balance",      syarat: (s) => s.totalJurnal >= 3 },
  { id: "tax_learner",     emoji: "🏛️", nama: "Pelajar Pajak",      deskripsi: "Jawab soal perpajakan dengan benar", syarat: (s) => s.soalPajak >= 1 },
  { id: "xp_500",          emoji: "⚡", nama: "XP Hunter",           deskripsi: "Kumpulkan 500 XP",                syarat: (s) => s.xp >= 500 },
];

// ===== LEVEL SYSTEM =====
const levelSystem = [
  { level: 1,  minXP: 0,    maxXP: 100,  title: "Pemula Akuntansi" },
  { level: 2,  minXP: 100,  maxXP: 250,  title: "Pencatat Muda" },
  { level: 3,  minXP: 250,  maxXP: 450,  title: "Jurnalis Handal" },
  { level: 4,  minXP: 450,  maxXP: 700,  title: "Analis Keuangan" },
  { level: 5,  minXP: 700,  maxXP: 1000, title: "Akuntan Profesional" },
  { level: 6,  minXP: 1000, maxXP: 1400, title: "Master Akuntansi" },
  { level: 7,  minXP: 1400, maxXP: 1900, title: "Pakar Keuangan" },
  { level: 8,  minXP: 1900, maxXP: 2500, title: "Guru Akuntansi" },
  { level: 9,  minXP: 2500, maxXP: 3200, title: "Legenda Keuangan" },
  { level: 10, minXP: 3200, maxXP: 9999, title: "Grand Master" },
];

function getLevelInfo(xp) {
  for (let i = levelSystem.length - 1; i >= 0; i--) {
    if (xp >= levelSystem[i].minXP) return levelSystem[i];
  }
  return levelSystem[0];
}

// ===== UTILITY =====
function formatRupiah(angka) {
  if (!angka && angka !== 0) return "Rp 0";
  return "Rp " + Math.abs(angka).toLocaleString("id-ID");
}

function parseRupiah(str) {
  return parseInt(str.replace(/[^0-9]/g, "")) || 0;
}
