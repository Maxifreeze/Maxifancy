/**
 * components/cabang.js
 * ----------------------
 * Semua logika TAMPILAN untuk fitur "Data Cabang":
 *   - render kartu hasil pencarian cabang (nama, kota, alamat, telepon)
 *   - tombol utama "Salin Info Cabang" (nama + alamat + telepon sekaligus
 *     dalam satu baris, format: "Cabang {Nama}: {Alamat} - {Telepon}")
 *   - tombol kecil tambahan untuk copy nomor telepon saja
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
   * Format gabungan yang di-copy saat klik "Salin Info Cabang":
   * "Cabang {Nama}: {Alamat} - {Telepon}"
   */
  function formatCombinedInfo(branch) {
    return `Cabang ${branch.nama}: ${branch.alamat} - ${branch.telepon}`;
  }

  /**
   * Render satu kartu cabang.
   * @param {object} branch - { nama, telepon, kota, alamat }
   */
  function renderBranchCard(branch) {
    const combinedText = formatCombinedInfo(branch);

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
              title="Salin nomor telepon saja"
              aria-label="Salin nomor telepon saja"
            >Copy</button>
          </span>
          <button
            class="btn btn--copy-secondary"
            data-copy-text="${escapeAttr(combinedText)}"
            data-copy-label="Info cabang"
          >Salin Info Cabang</button>
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
    formatCombinedInfo,
    escapeHtml,
  };
})();
