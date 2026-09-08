/**
 * components/shortcut.js
 * ------------------------
 * Semua logika yang berhubungan dengan TAMPILAN shortcut:
 *   - render satu hasil (exact match, auto-copied)
 *   - render banyak hasil (partial match, list, tanpa auto-copy)
 *   - deteksi generic {{variable}} di dalam template
 *   - render kartu kategori (dihitung dinamis dari data)
 *   - render daftar shortcut populer
 *
 * File ini tidak melakukan fetch data maupun copy ke clipboard —
 * itu tanggung jawab app.js. Supaya tetap modular & mudah dites.
 */

const ShortcutComponent = (() => {
  // Regex generic untuk mendeteksi {{apapun}}, termasuk variable yang belum
  // pernah kita definisikan sebelumnya (mis. {{nomor_tiket}}).
  const VARIABLE_REGEX = /\{\{\s*([^}]+)\s*\}\}/g;

  function extractVariables(template) {
    const found = new Set();
    let match;
    // Reset lastIndex karena regex global dipakai berulang kali.
    VARIABLE_REGEX.lastIndex = 0;
    while ((match = VARIABLE_REGEX.exec(template)) !== null) {
      found.add(match[1].trim());
    }
    return Array.from(found);
  }

  /**
   * Deteksi otomatis pola "angsuran": kalau template punya variable
   * Total Tenor DAN Angsuran Terbayar, maka Sisa Angsuran & Angsuran
   * Berikutnya (kalau ada) TIDAK perlu diisi manual — dihitung otomatis:
   *   Sisa Angsuran     = Total Tenor - Angsuran Terbayar
   *   Angsuran Berikutnya = Angsuran Terbayar + 1
   *
   * Supaya terdeteksi, di spreadsheet cukup pakai salah satu nama berikut
   * (tidak case-sensitive, spasi/underscore diabaikan):
   *   {{Total Tenor}}
   *   {{Angsuran Terbayar}} atau {{Angsuran yang Telah Dibayarkan}}
   *   {{Sisa Angsuran}}
   *   {{Angsuran Berikutnya}} atau {{Angsuran Selanjutnya}}
   */
  function normalizeVarName(name) {
    return name.toLowerCase().replace(/[^a-z0-9]/g, "");
  }

  const TOTAL_ALIASES = ["totaltenor", "tenortotal"];
  const PAID_ALIASES = [
    "angsuranterbayar",
    "angsuranyangtelahdibayarkan",
    "angsurandibayarkan",
    "tenorterbayar",
    "cicilanterbayar",
  ];
  const REMAINING_ALIASES = ["sisaangsuran", "sisatenor", "sisacicilan"];
  const NEXT_ALIASES = [
    "angsuranberikutnya",
    "angsuranselanjutnya",
    "tenorberikutnya",
    "cicilanberikutnya",
  ];

  function classifyVariables(variables) {
    let totalVar = null;
    let paidVar = null;
    let remainingVar = null;
    let nextVar = null;

    variables.forEach((v) => {
      const n = normalizeVarName(v);
      if (!totalVar && TOTAL_ALIASES.includes(n)) totalVar = v;
      else if (!paidVar && PAID_ALIASES.includes(n)) paidVar = v;
      else if (!remainingVar && REMAINING_ALIASES.includes(n)) remainingVar = v;
      else if (!nextVar && NEXT_ALIASES.includes(n)) nextVar = v;
    });

    // Auto-hitung hanya aktif kalau KEDUA variable dasar (Total Tenor &
    // Angsuran Terbayar) sama-sama ketemu di template.
    const tenorGroup =
      totalVar && paidVar && (remainingVar || nextVar)
        ? { totalVar, paidVar, remainingVar, nextVar }
        : null;

    const computed = tenorGroup
      ? [tenorGroup.remainingVar, tenorGroup.nextVar].filter(Boolean)
      : [];

    const manual = variables.filter((v) => !computed.includes(v));

    return { manual, computed, tenorGroup };
  }

  function escapeHtml(str) {
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  /**
   * Mengubah template mentah menjadi HTML aman, sambil menyorot {{variable}}
   * secara visual TANPA merusak karakter asli "{{" / "}}" (tetap dipertahankan
   * apa adanya di dalam teks, hanya dibungkus <span> untuk styling).
   */
  function renderTemplateHtml(template) {
    const escaped = escapeHtml(template);
    const highlighted = escaped.replace(
      /\{\{\s*([^}]+)\s*\}\}/g,
      (whole) => `<span class="template-var">${whole}</span>`
    );
    return highlighted.replace(/\n/g, "<br>");
  }

  /**
   * Mengganti setiap {{variable}} di template dengan nilai dari `values`
   * (object: { "Nama Variabel": "isi" }). Variabel yang tidak diisi
   * (kosong / tidak ada di `values`) dibiarkan apa adanya sebagai placeholder,
   * supaya CS tetap sadar ada bagian yang belum terisi.
   */
  function replaceVariables(template, values) {
    VARIABLE_REGEX.lastIndex = 0;
    return template.replace(VARIABLE_REGEX, (whole, rawName) => {
      const name = rawName.trim();
      const val = (values[name] ?? "").trim();
      return val === "" ? whole : val;
    });
  }

  /**
   * Render form isian untuk setiap {{variable}} yang terdeteksi di template,
   * ditampilkan SEBELUM template di-copy. User isi nilai → submit →
   * app.js akan replace variabel lalu copy hasil akhirnya ke clipboard.
   */
  function renderVariableForm(item, variables) {
    const { manual, computed, tenorGroup } = classifyVariables(variables);

    const manualFields = manual
      .map(
        (v, idx) => `
        <div class="variable-field">
          <label for="var-input-${idx}">${escapeHtml(
          v
        )} <span class="variable-required" title="Wajib diisi">*</span></label>
          <input
            type="text"
            id="var-input-${idx}"
            class="variable-input"
            data-var-name="${escapeHtml(v)}"
            placeholder="Masukkan ${escapeHtml(v)}..."
            autocomplete="off"
          />
        </div>
      `
      )
      .join("");

    const computedFields = computed
      .map(
        (v) => `
        <div class="variable-field">
          <label>${escapeHtml(v)} <span class="variable-auto-badge">⚡ Otomatis</span></label>
          <input
            type="text"
            class="variable-computed"
            data-computed-name="${escapeHtml(v)}"
            value="—"
            readonly
            tabindex="-1"
          />
        </div>
      `
      )
      .join("");

    return `
      <div class="result-card" data-code="${escapeHtml(item.code)}">
        <div class="result-card__header">
          <div>
            <span class="code-chip code-chip--lg">${escapeHtml(
              item.code
            )}</span>
          </div>
          <div style="display:flex; align-items:center; gap:10px;">
            <span class="status-pill status-pill--pending">ISI VARIABEL</span>
            <button type="button" class="modal-close-btn" data-close-modal aria-label="Tutup">&times;</button>
          </div>
        </div>
        <div class="result-card__body">
          <pre class="template-preview">${renderTemplateHtml(
            item.template
          )}</pre>
        </div>
        <form class="variable-form" data-fill-form>
          <p class="result-card__vars-note" style="margin:12px 0 10px;">
            Lengkapi semua variabel di bawah, lalu tekan <kbd>Enter</kbd> pada
            kolom terakhir atau klik "Salin ke Clipboard".
          </p>
          <div class="variable-form__fields">${manualFields}${computedFields}</div>
          ${
            tenorGroup
              ? `<p class="result-card__vars-note" style="margin-top:8px;">⚡ ${escapeHtml(
                  tenorGroup.remainingVar || ""
                )}${
                  tenorGroup.remainingVar && tenorGroup.nextVar ? " & " : ""
                }${escapeHtml(
                  tenorGroup.nextVar || ""
                )} dihitung otomatis dari ${escapeHtml(
                  tenorGroup.totalVar
                )} & ${escapeHtml(tenorGroup.paidVar)} — tidak perlu diisi manual.</p>`
              : ""
          }
          <div class="result-card__footer">
            <p><kbd>Tab</kbd> / <kbd>Enter</kbd> pindah ke kolom berikutnya secara otomatis.</p>
            <button type="submit" class="btn btn--primary">Salin ke Clipboard</button>
          </div>
        </form>
      </div>
    `;
  }

  /**
   * Render satu kartu hasil (dipakai untuk exact match / auto-copy, dan juga
   * untuk hasil akhir setelah variabel diisi — lewat parameter `options`).
   * @param {object} item - shortcut record ternormalisasi { code, template }
   * @param {boolean} autoCopied
   * @param {object} [options]
   * @param {string} [options.badgeText] - default "✓ AUTO COPIED"
   * @param {string} [options.copiedMessage] - pesan di bawah preview saat autoCopied=true
   */
  function renderResultCard(item, autoCopied, options = {}) {
    const badgeText = options.badgeText || "✓ AUTO COPIED";
    const copiedMessage =
      options.copiedMessage ||
      "Template telah otomatis disalin. Kamu bisa langsung Paste (Ctrl + V).";

    const variables = extractVariables(item.template);
    const variablesNote =
      variables.length > 0
        ? `<p class="result-card__vars-note">Variabel terdeteksi: ${variables
            .map((v) => `<code>{{${v}}}</code>`)
            .join(", ")}</p>`
        : "";

    return `
      <div class="result-card" data-code="${escapeHtml(item.code)}">
        <div class="result-card__header">
          <div>
            <span class="code-chip code-chip--lg">${escapeHtml(
              item.code
            )}</span>
          </div>
          ${
            autoCopied
              ? `<span class="status-pill status-pill--copied">${badgeText}</span>`
              : `<button class="btn btn--copy" data-copy-code="${escapeHtml(
                  item.code
                )}">Copy</button>`
          }
        </div>
        <div class="result-card__body">
          <pre class="template-preview">${renderTemplateHtml(
            item.template
          )}</pre>
        </div>
        ${variablesNote}
        <div class="result-card__footer">
          <p>
            ${
              autoCopied
                ? copiedMessage
                : "Klik tombol Copy untuk menyalin template ini secara manual."
            }
          </p>
          ${
            !autoCopied
              ? `<button class="btn btn--copy-secondary" data-copy-code="${escapeHtml(
                  item.code
                )}">Copy</button>`
              : ""
          }
        </div>
      </div>
    `;
  }

  /**
   * Render daftar hasil (untuk partial match, beberapa kandidat).
   * Setiap item bisa diklik untuk menjalankan pencarian exact + auto-copy.
   */
  function renderResultList(items) {
    const rows = items
      .map((item) => {
        const preview = item.template
          .replace(/\n/g, " ")
          .trim()
          .slice(0, 70);
        return `
        <button class="result-list__item" data-run-code="${escapeHtml(
          item.code
        )}">
          <span class="code-chip code-chip--muted">${escapeHtml(
            item.code
          )}</span>
          <span class="result-list__title">${escapeHtml(preview)}${
          item.template.length > 70 ? "…" : ""
        }</span>
        </button>
      `;
      })
      .join("");

    return `<div class="result-list">${rows}</div>`;
  }

  /**
   * Render daftar shortcut populer. Jika ada item dengan popular=true di
   * spreadsheet, pakai itu. Kalau tidak ada sama sekali, panggilan ini
   * dilakukan dengan daftar hasil filter dari CONFIG.FALLBACK_POPULAR_SHORTCUTS
   * yang sudah disiapkan di app.js.
   */
  function renderPopularList(items) {
    if (items.length === 0) return "";
    return items
      .map(
        (item) => `
        <button class="popular-chip" data-run-code="${escapeHtml(item.code)}">
          ${escapeHtml(item.code)}
        </button>
      `
      )
      .join("");
  }

  return {
    extractVariables,
    classifyVariables,
    replaceVariables,
    renderVariableForm,
    renderResultCard,
    renderResultList,
    renderPopularList,
    escapeHtml,
  };
})();
