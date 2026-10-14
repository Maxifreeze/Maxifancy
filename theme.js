/**
 * theme.js
 * ---------
 * Sistem tema visual: mengganti background halaman (bukan cuma warna
 * gelap/terang, tapi ilustrasi suasana penuh — hujan/gunung, gurun, kota
 * Jakarta, pantai, sawah). Sidebar & kartu-kartu konten tetap sama supaya
 * teks tetap mudah dibaca di atas background apapun.
 *
 * Preferensi tema disimpan di localStorage supaya tetap dipakai walau
 * halaman di-reload.
 */

const ThemeComponent = (() => {
  const STORAGE_KEY = "sinarmas_theme_v1";
  const VALID_THEMES = ["default", "hujan", "gurun", "jakarta", "pantai", "sawah"];

  let popoverEl = null;
  let toggleBtnEl = null;
  let swatchEls = [];

  function applyTheme(theme) {
    const safeTheme = VALID_THEMES.includes(theme) ? theme : "default";

    VALID_THEMES.forEach((t) => {
      document.body.classList.remove(`theme-${t}`);
    });
    if (safeTheme !== "default") {
      document.body.classList.add(`theme-${safeTheme}`);
    }

    swatchEls.forEach((el) => {
      el.classList.toggle("is-selected", el.getAttribute("data-theme") === safeTheme);
    });

    try {
      localStorage.setItem(STORAGE_KEY, safeTheme);
    } catch (err) {
      /* localStorage tidak tersedia -- tidak fatal, cuma tidak tersimpan */
    }
  }

  function loadSavedTheme() {
    let saved = "default";
    try {
      saved = localStorage.getItem(STORAGE_KEY) || "default";
    } catch (err) {
      /* noop */
    }
    applyTheme(saved);
  }

  function openPopover() {
    popoverEl.classList.add("is-open");
  }

  function closePopover() {
    popoverEl.classList.remove("is-open");
  }

  function togglePopover() {
    popoverEl.classList.toggle("is-open");
  }

  function init() {
    toggleBtnEl = document.getElementById("theme-toggle");
    popoverEl = document.getElementById("theme-popover");
    swatchEls = Array.from(document.querySelectorAll(".theme-swatch"));

    if (!toggleBtnEl || !popoverEl) return;

    loadSavedTheme();

    toggleBtnEl.addEventListener("click", (e) => {
      e.stopPropagation();
      togglePopover();
    });

    swatchEls.forEach((el) => {
      el.addEventListener("click", () => {
        applyTheme(el.getAttribute("data-theme"));
        closePopover();
      });
    });

    // Klik di luar popover menutupnya.
    document.addEventListener("click", (e) => {
      if (
        popoverEl.classList.contains("is-open") &&
        !popoverEl.contains(e.target) &&
        e.target !== toggleBtnEl
      ) {
        closePopover();
      }
    });

    // Escape menutup popover.
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && popoverEl.classList.contains("is-open")) {
        closePopover();
      }
    });
  }

  return { init };
})();
