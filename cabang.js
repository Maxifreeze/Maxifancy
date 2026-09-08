/**
 * components/cabang.js
 * ----------------------
 * Semua logika TAMPILAN untuk fitur "Data Cabang":
 *   - render kartu hasil pencarian cabang (nama, kota, alamat, telepon)
 *   - tombol "Salin Alamat" & copy nomor telepon
 *
 * Sama seperti shortcut.js, file ini tidak melakukan pencarian maupun
 * copy ke clipboard — itu tanggung jawab app.js.
 */

const CabangComponent = (() => {
  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  // Aman dipakai di dalam atribut HTML (mis. data-copy-text="...").
  // escapeHtml saja tidak cukup karena tanda kutip ganda bisa memutus atribut.
  function escapeAttr(str) {
    return escapeHtml(str).replace(/"/g, "&quot;");
  }

  /**
   * Render satu kartu cabang.
   * @param {object} branch - { nama, telepon, kota, alamat }
   */
  function renderBranchCard(branch) {
    return `
      <div class="branch-card">
        <div class="branch-card__header">
          <span class="code-chip code-chip--lg">${escapeHtml(branch.nama)}</span>
          <span class="branch-card__kota">${escapeHtml(branch.kota)}</span>
        </div>
        <p class="branch-card__alamat">${escapeHtml(branch.alamat)}</p>
        <div class="branch-card__footer">
          <span class="branch-card__telp">
            📞 ${escapeHtml(branch.telepon)}
            <button
              class="branch-card__copy-telp"
              data-copy-text="${escapeAttr(branch.telepon)}"
              data-copy-label="Nomor telepon"
              title="Salin nomor telepon"
              aria-label="Salin nomor telepon"
            >Copy</button>
          </span>
          <button
            class="btn btn--copy-secondary"
            data-copy-text="${escapeAttr(branch.alamat)}"
            data-copy-label="Alamat"
          >Salin Alamat</button>
        </div>
      </div>
    `;
  }

  /**
   * Render daftar hasil pencarian cabang.
   * @param {Array<object>} branches
   */
  function renderResults(branches) {
    return `<div class="branch-list">${branches
      .map((b) => renderBranchCard(b))
      .join("")}</div>`;
  }

  return {
    renderResults,
    escapeHtml,
  };
})();
