# AkunPintar — Platform Belajar Akuntansi, Pajak & Keuangan

Web interaktif untuk belajar akuntansi, perpajakan, dan keuangan dengan pendekatan gamifikasi.

## Fitur

- **Dashboard Bento Box** — Tampilan modern dengan progress, level, XP, dan badges
- **Materi Interaktif** — Akuntansi dasar, PPh 21 (dengan kalkulator), PPN, PPh 23, rasio keuangan
- **Simulator Jurnal** — Input jurnal dengan auto-balance check real-time
- **Latihan Soal** — 8 studi kasus dengan validasi jawaban dan feedback detail
- **Laporan Otomatis** — Jurnal Umum → Buku Besar → Neraca Saldo → Laba/Rugi → Neraca
- **Sistem XP & Level** — 10 level dengan badges pencapaian

## Struktur

```
├── index.html       # Dashboard utama
├── materi.html      # Materi pembelajaran
├── latihan.html     # Simulator jurnal & latihan soal
├── laporan.html     # Laporan keuangan otomatis
├── css/
│   ├── style.css    # Global styles
│   ├── dashboard.css
│   ├── materi.css
│   ├── latihan.css
│   └── laporan.css
└── js/
    ├── data.js      # COA, soal latihan, badges, level system
    ├── progress.js  # LocalStorage progress manager
    ├── dashboard.js
    ├── materi.js    # Kalkulator PPh 21
    ├── latihan.js   # Simulator jurnal & validasi jawaban
    └── laporan.js   # Rendering laporan keuangan
```

## Deploy ke GitHub Pages

1. Push semua file ke repository GitHub
2. Buka Settings → Pages → Source: Deploy from branch → main / root
3. Akses di `https://username.github.io/nama-repo`

## Tech Stack

- HTML5, CSS3, Vanilla JavaScript (tanpa framework)
- LocalStorage untuk menyimpan progres
- Google Fonts (Inter)
