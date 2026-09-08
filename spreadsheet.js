/**
 * services/spreadsheet.js
 * ------------------------
 * Bertanggung jawab HANYA untuk:
 *   1. Mengambil data mentah dari Google Spreadsheet (Published CSV)
 *   2. Mem-parsing CSV menjadi array of object
 *   3. Menyimpan/mengambil cache di sessionStorage
 *
 * Tidak ada logika UI di file ini, supaya mudah diganti sumber datanya
 * nanti (misalnya ke Google Sheets API) tanpa menyentuh app.js.
 */

const SpreadsheetService = (() => {
  /**
   * Parser CSV sederhana yang menangani:
   * - koma di dalam tanda kutip
   * - newline di dalam tanda kutip (isi template multi-baris)
   * - tanda kutip ganda ("") sebagai escape untuk kutip literal
   */
  function parseCSV(text) {
    const rows = [];
    let row = [];
    let field = "";
    let inQuotes = false;

    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      const next = text[i + 1];

      if (inQuotes) {
        if (char === '"' && next === '"') {
          field += '"';
          i++;
        } else if (char === '"') {
          inQuotes = false;
        } else {
          field += char;
        }
      } else {
        if (char === '"') {
          inQuotes = true;
        } else if (char === ",") {
          row.push(field);
          field = "";
        } else if (char === "\n") {
          row.push(field);
          rows.push(row);
          row = [];
          field = "";
        } else if (char === "\r") {
          // skip, \n akan menangani baris baru
        } else {
          field += char;
        }
      }
    }
    // Tambahkan field/baris terakhir jika ada sisa.
    if (field.length > 0 || row.length > 0) {
      row.push(field);
      rows.push(row);
    }
    return rows;
  }

  /**
   * Mengubah hasil parseCSV (array of array) menjadi array of object,
   * menggunakan baris pertama sebagai nama kolom (header).
   * Nama kolom dicocokkan tanpa memedulikan besar/kecil huruf dan spasi,
   * supaya spreadsheet tidak harus persis "Code" tapi "code" juga jalan.
   */
  function rowsToObjects(rows) {
    if (rows.length === 0) return [];
    const headers = rows[0].map((h) => h.trim().toLowerCase());
    const records = [];

    for (let i = 1; i < rows.length; i++) {
      const rawRow = rows[i];
      // Lewati baris yang benar-benar kosong.
      if (rawRow.length === 1 && rawRow[0].trim() === "") continue;

      const record = {};
      headers.forEach((header, idx) => {
        record[header] = (rawRow[idx] ?? "").trim();
      });
      records.push(record);
    }
    return records;
  }

  /**
   * Normalisasi satu baris data menjadi bentuk yang dipakai di seluruh app:
   * { code, template, popular, status }
   *
   * Struktur spreadsheet yang didukung HANYA 2 kolom wajib:
   *   Shortcut  -> kode shortcut (mis. "w1", "bpkb1")
   *   Deskripsi -> isi template lengkap yang akan di-copy
   *
   * Kolom "Status" dan "Popular" bersifat OPSIONAL:
   * - Jika kolom "Status" tidak ada di spreadsheet, semua baris yang punya
   *   kode dianggap aktif secara otomatis.
   * - Jika kolom "Popular" tidak ada, dashboard memakai fallback dari
   *   CONFIG.FALLBACK_POPULAR_SHORTCUTS.
   *
   * Nama kolom dibaca fleksibel (tidak case-sensitive), dan mendukung
   * beberapa alias umum supaya tidak gampang salah rename di spreadsheet.
   */
  function normalizeRecord(record) {
    const code = (record.shortcut || record.code || "").trim();
    const template = record.deskripsi || record.template || record.desc || "";
    const rawStatus = (record.status || "").trim().toLowerCase();

    return {
      code,
      template,
      // Tidak ada kolom Status di spreadsheet -> anggap aktif.
      status: rawStatus === "" ? "active" : rawStatus,
      popular: ["yes", "true", "1", "y"].includes(
        (record.popular || "").trim().toLowerCase()
      ),
    };
  }

  function readCache() {
    try {
      const raw = sessionStorage.getItem(CONFIG.CACHE_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (Date.now() - parsed.timestamp > CONFIG.CACHE_TTL_MS) return null;
      return parsed.data;
    } catch (err) {
      return null;
    }
  }

  function writeCache(data) {
    try {
      sessionStorage.setItem(
        CONFIG.CACHE_KEY,
        JSON.stringify({ timestamp: Date.now(), data })
      );
    } catch (err) {
      // Cache gagal (misal storage penuh/disabled) — tidak fatal, cukup lanjutkan.
      console.warn("Gagal menyimpan cache shortcut:", err);
    }
  }

  function clearCache() {
    try {
      sessionStorage.removeItem(CONFIG.CACHE_KEY);
    } catch (err) {
      /* noop */
    }
  }

  /**
   * Mengambil seluruh data shortcut dari spreadsheet.
   * @param {boolean} forceRefresh - jika true, lewati cache dan fetch ulang.
   * @returns {Promise<Array<object>>} daftar shortcut dengan status "active" saja.
   */
  async function fetchShortcuts(forceRefresh = false) {
    if (!forceRefresh) {
      const cached = readCache();
      if (cached) return cached;
    }

    const url = CONFIG.SPREADSHEET_URL;
    if (!url || url.includes("ExampleSheetId")) {
      throw new Error(
        "SPREADSHEET_URL belum dikonfigurasi. Silakan ganti CONFIG.SPREADSHEET_URL di config.js."
      );
    }

    const response = await fetch(url, { cache: "no-store" });
    if (!response.ok) {
      throw new Error(
        `Gagal mengambil data spreadsheet (status ${response.status}).`
      );
    }

    const csvText = await response.text();
    const rows = parseCSV(csvText);
    const records = rowsToObjects(rows).map(normalizeRecord);
    const activeOnly = records.filter(
      (r) => r.status === "active" && r.code !== ""
    );

    writeCache(activeOnly);
    return activeOnly;
  }

  return {
    fetchShortcuts,
    clearCache,
    _internal: { parseCSV, rowsToObjects, normalizeRecord }, // exposed for debugging/testing
  };
})();
