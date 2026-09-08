/**
 * components/notification.js
 * ----------------------------
 * Menampilkan toast notification di kanan atas.
 * Mendukung tipe: "success", "error", "warning".
 * Otomatis hilang setelah CONFIG.NOTIFICATION_DURATION_MS,
 * atau bisa ditutup manual lewat tombol "×".
 */

const NotificationComponent = (() => {
  let hideTimeout = null;

  const ICONS = {
    success: `<svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="10" cy="10" r="10" fill="currentColor"/><path d="M6 10.5l2.5 2.5L14 7.5" stroke="white" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    error: `<svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="10" cy="10" r="10" fill="currentColor"/><path d="M7 7l6 6M13 7l-6 6" stroke="white" stroke-width="1.7" stroke-linecap="round"/></svg>`,
    warning: `<svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="10" cy="10" r="10" fill="currentColor"/><path d="M10 6v5" stroke="white" stroke-width="1.7" stroke-linecap="round"/><circle cx="10" cy="13.5" r="0.9" fill="white"/></svg>`,
  };

  function getContainer() {
    return document.getElementById("notification-container");
  }

  /**
   * @param {"success"|"error"|"warning"} type
   * @param {string} title
   * @param {string} message
   */
  function show(type, title, message) {
    const container = getContainer();
    if (!container) return;

    // Ganti notifikasi yang sedang tampil (satu notifikasi cukup pada satu waktu).
    clearTimeout(hideTimeout);

    container.innerHTML = `
      <div class="toast toast--${type}" role="status" aria-live="polite">
        <div class="toast__icon">${ICONS[type] || ICONS.success}</div>
        <div class="toast__body">
          <p class="toast__title">${title}</p>
          <p class="toast__message">${message}</p>
        </div>
        <button class="toast__close" aria-label="Tutup notifikasi">&times;</button>
        <div class="toast__progress"></div>
      </div>
    `;

    const toastEl = container.querySelector(".toast");
    // Trigger fade-in di frame berikutnya supaya transisi CSS jalan.
    requestAnimationFrame(() => toastEl.classList.add("toast--visible"));

    container
      .querySelector(".toast__close")
      .addEventListener("click", () => hide());

    hideTimeout = setTimeout(hide, CONFIG.NOTIFICATION_DURATION_MS);
  }

  function hide() {
    const container = getContainer();
    if (!container) return;
    const toastEl = container.querySelector(".toast");
    if (!toastEl) return;

    toastEl.classList.remove("toast--visible");
    toastEl.classList.add("toast--hiding");
    setTimeout(() => {
      container.innerHTML = "";
    }, 250); // cocokkan dengan durasi transisi fade-out di CSS
  }

  return {
    success: (title, message) => show("success", title, message),
    error: (title, message) => show("error", title, message),
    warning: (title, message) => show("warning", title, message),
    hide,
  };
})();
