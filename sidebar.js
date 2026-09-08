/**
 * components/sidebar.js
 * -----------------------
 * Tugas kecil dan terisolasi:
 *   - mengisi nama brand & user dari CONFIG ke dalam DOM
 *   - menjalankan jam realtime + tanggal di header
 */

const SidebarComponent = (() => {
  const HARI = [
    "Minggu",
    "Senin",
    "Selasa",
    "Rabu",
    "Kamis",
    "Jumat",
    "Sabtu",
  ];
  const BULAN = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];

  function applyBranding() {
    const brandName = document.getElementById("brand-name");
    const brandSubtitle = document.getElementById("brand-subtitle");
    const userName = document.getElementById("user-name");
    const userRole = document.getElementById("user-role");
    const userInitials = document.getElementById("user-initials");
    const footerBrand = document.getElementById("footer-brand");

    if (brandName) brandName.textContent = CONFIG.BRAND.name;
    if (brandSubtitle) brandSubtitle.textContent = CONFIG.BRAND.subtitle;
    if (userName) userName.textContent = CONFIG.USER.name;
    if (userRole) userRole.textContent = CONFIG.USER.role;
    if (userInitials) userInitials.textContent = CONFIG.USER.initials;
    if (footerBrand) footerBrand.textContent = CONFIG.BRAND.footer;
  }

  function updateClock() {
    const clockEl = document.getElementById("realtime-clock");
    const dateEl = document.getElementById("realtime-date");
    if (!clockEl || !dateEl) return;

    const now = new Date();
    const hh = String(now.getHours()).padStart(2, "0");
    const mm = String(now.getMinutes()).padStart(2, "0");
    const ss = String(now.getSeconds()).padStart(2, "0");
    clockEl.textContent = `${hh}:${mm}:${ss}`;

    dateEl.textContent = `${HARI[now.getDay()]}, ${now.getDate()} ${
      BULAN[now.getMonth()]
    } ${now.getFullYear()}`;
  }

  function startClock() {
    updateClock();
    setInterval(updateClock, 1000);
  }

  function init() {
    applyBranding();
    startClock();
  }

  return { init };
})();
