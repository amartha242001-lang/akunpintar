// ===== MATERI PAGE =====
document.addEventListener("DOMContentLoaded", () => {
  const state = ProgressManager.get();
  const navXp = document.getElementById("nav-xp");
  if (navXp) navXp.textContent = `${state.xp} XP`;

  // Sidebar active link on scroll
  const sections = document.querySelectorAll(".content-section");
  const links = document.querySelectorAll(".sidebar-link");

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        links.forEach(l => l.classList.remove("active"));
        const id = entry.target.id;
        const active = document.querySelector(`.sidebar-link[href="#${id}"]`);
        if (active) active.classList.add("active");
      }
    });
  }, { rootMargin: "-20% 0px -70% 0px" });

  sections.forEach(s => observer.observe(s));

  // Initial PPh21 calc
  hitungPPh21();
});

// ===== PPH 21 CALCULATOR =====
function hitungPPh21() {
  const gajiBruto = parseFloat(document.getElementById("gaji-bruto")?.value) || 0;
  const ptkp = parseFloat(document.getElementById("status-ptkp")?.value) || 54000000;

  const brutTahunan = gajiBruto * 12;
  const biayaJabatan = Math.min(brutTahunan * 0.05, 6000000);
  const neto = brutTahunan - biayaJabatan;
  const pkp = Math.max(0, neto - ptkp);

  // Hitung PPh progresif
  let pph = 0;
  if (pkp <= 60000000) {
    pph = pkp * 0.05;
  } else if (pkp <= 250000000) {
    pph = 60000000 * 0.05 + (pkp - 60000000) * 0.15;
  } else if (pkp <= 500000000) {
    pph = 60000000 * 0.05 + 190000000 * 0.15 + (pkp - 250000000) * 0.25;
  } else if (pkp <= 5000000000) {
    pph = 60000000 * 0.05 + 190000000 * 0.15 + 250000000 * 0.25 + (pkp - 500000000) * 0.30;
  } else {
    pph = 60000000 * 0.05 + 190000000 * 0.15 + 250000000 * 0.25 + 4500000000 * 0.30 + (pkp - 5000000000) * 0.35;
  }

  const pphBulanan = pph / 12;

  const set = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.textContent = formatRupiah(val);
  };

  set("r-bruto-tahunan", brutTahunan);
  set("r-biaya-jabatan", biayaJabatan);
  set("r-neto", neto);
  set("r-ptkp", ptkp);
  set("r-pkp", pkp);
  set("r-pph-tahunan", pph);
  set("r-pph-bulanan", pphBulanan);
}
