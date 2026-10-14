/**
 * app.js
 * -------
 * Titik masuk utama. Menghubungkan:
 *   SpreadsheetService (data) + ShortcutComponent (render) + NotificationComponent (toast)
 * dengan interaksi user (search, enter, klik, keyboard shortcut, refresh).
 */

(() => {
  let allShortcuts = []; // seluruh data aktif dari spreadsheet
  let isLoading = false;

  // --- DOM references (diisi saat DOMContentLoaded) ---
  let els = {};

  function cacheDom() {
    els = {
      searchInput: document.getElementById("search-input"),
      searchButton: document.getElementById("search-button"),
      clearButton: document.getElementById("search-clear"),
      resultArea: document.getElementById("result-area"),
      popularList: document.getElementById("popular-list"),
      refreshButton: document.getElementById("refresh-button"),
      autoCopyToggle: document.getElementById("auto-copy-toggle"),

      // View switching (Shortcut <-> Data Cabang <-> Catatan)
      navLinkShortcut: document.getElementById("nav-link-shortcut"),
      navLinkCabang: document.getElementById("nav-link-cabang"),
      navLinkNotes: document.getElementById("nav-link-notes"),
      navLinkOcr: document.getElementById("nav-link-ocr"),
      viewShortcut: document.getElementById("view-shortcut"),
      viewCabang: document.getElementById("view-cabang"),
      viewNotes: document.getElementById("view-notes"),
      viewOcr: document.getElementById("view-ocr"),
      topbarTitle: document.querySelector(".topbar__title"),
      topbarSubtitle: document.querySelector(".topbar__subtitle"),

      // Data Cabang
      cabangSearchInput: document.getElementById("cabang-search-input"),
      cabangSearchButton: document.getElementById("cabang-search-button"),
      cabangClearButton: document.getElementById("cabang-search-clear"),
      cabangResultArea: document.getElementById("cabang-result-area"),

      // Catatan
      notesSearchInput: document.getElementById("notes-search-input"),

      // Modal isi variabel
      variableModalOverlay: document.getElementById("variable-modal-overlay"),
      variableModalBox: document.getElementById("variable-modal-box"),

      // Sidebar toggle (hamburger)
      sidebar: document.querySelector(".sidebar"),
      sidebarToggleBtn: document.getElementById("sidebar-toggle"),
    };
  }

  // ---------- SIDEBAR TOGGLE (HAMBURGER) ----------

  const SIDEBAR_PREF_KEY = "sinarmas_sidebar_collapsed";

  function isMobileViewport() {
    if (typeof window.matchMedia === "function") {
      return window.matchMedia("(max-width: 860px)").matches;
    }
    return window.innerWidth <= 860; // fallback kalau matchMedia tidak tersedia
  }

  function toggleSidebar() {
    if (isMobileViewport()) {
      // Mobile: sidebar jadi overlay yang slide dari kiri (posisi fixed).
      els.sidebar.classList.toggle("is-open");
    } else {
      // Desktop: sidebar collapse ke lebar 0 supaya konten utama melebar,
      // preferensinya disimpan supaya tetap ke-collapse walau reload.
      const collapsed = els.sidebar.classList.toggle("sidebar-hidden");
      try {
        localStorage.setItem(SIDEBAR_PREF_KEY, collapsed ? "1" : "0");
      } catch (err) {
        /* localStorage tidak tersedia (mis. mode private) -- tidak fatal */
      }
    }
  }

  function restoreSidebarPreference() {
    if (isMobileViewport()) return; // preferensi desktop tidak dipakai di mobile
    try {
      if (localStorage.getItem(SIDEBAR_PREF_KEY) === "1") {
        els.sidebar.classList.add("sidebar-hidden");
      }
    } catch (err) {
      /* noop */
    }
  }

  // ---------- VIEW SWITCHING (Shortcut <-> Data Cabang) ----------

  const VIEW_META = {
    shortcut: {
      title: "Shortcut",
      subtitle: "Temukan template & informasi cepat yang kamu butuhkan.",
    },
    cabang: {
      title: "Data Cabang",
      subtitle: "Cari alamat & nomor telepon cabang di seluruh Indonesia.",
    },
    notes: {
      title: "Catatan",
      subtitle: "Tulis catatan cepat, sematkan yang penting.",
    },
    ocr: {
      title: "Ekstrak Teks",
      subtitle: "Ambil teks dari gambar/screenshot langsung di browser.",
    },
  };

  const VIEWS = ["shortcut", "cabang", "notes", "ocr"];

  function switchView(view) {
    if (!VIEWS.includes(view)) view = "shortcut";

    els.viewShortcut.style.display = view === "shortcut" ? "" : "none";
    els.viewCabang.style.display = view === "cabang" ? "" : "none";
    els.viewNotes.style.display = view === "notes" ? "" : "none";
    els.viewOcr.style.display = view === "ocr" ? "" : "none";

    els.navLinkShortcut.classList.toggle("is-active", view === "shortcut");
    els.navLinkCabang.classList.toggle("is-active", view === "cabang");
    els.navLinkNotes.classList.toggle("is-active", view === "notes");
    els.navLinkOcr.classList.toggle("is-active", view === "ocr");

    const meta = VIEW_META[view];
    if (els.topbarTitle) els.topbarTitle.textContent = meta.title;
    if (els.topbarSubtitle) els.topbarSubtitle.textContent = meta.subtitle;

    if (view === "cabang") {
      if (!els.cabangResultArea.innerHTML.trim()) {
        renderCabangIdleState();
      }
      els.cabangSearchInput.focus();
    } else if (view === "notes") {
      els.notesSearchInput?.focus();
    } else if (view === "ocr") {
      OcrComponent.init(); // lazy init: baru siapkan saat pertama dibuka
    } else {
      els.searchInput.focus();
    }
  }

  // ---------- LOADING / ERROR STATES ----------

  function renderLoadingState() {
    els.resultArea.innerHTML = `
      <div class="state-panel">
        <div class="spinner" aria-hidden="true"></div>
        <p>Memuat shortcut...</p>
      </div>
    `;
  }

  function renderLoadErrorState(message) {
    els.resultArea.innerHTML = `
      <div class="state-panel state-panel--error">
        <p class="state-panel__title">Gagal memuat data</p>
        <p>${ShortcutComponent.escapeHtml(
          message ||
            "Data shortcut tidak dapat diambil dari spreadsheet. Silakan coba lagi."
        )}</p>
        <button class="btn btn--primary" id="retry-load">Coba Lagi</button>
      </div>
    `;
    document
      .getElementById("retry-load")
      ?.addEventListener("click", () => loadData(true));
  }

  function renderEmptyDataState() {
    els.resultArea.innerHTML = `
      <div class="state-panel">
        <p>Belum ada shortcut yang tersedia.</p>
      </div>
    `;
  }

  function renderIdleState() {
    els.resultArea.innerHTML = `
      <div class="state-panel state-panel--idle">
        <p>Ketik kode shortcut lalu tekan Enter, atau pilih dari shortcut populer di bawah.</p>
      </div>
    `;
  }

  // ---------- DATA LOADING ----------

  async function loadData(forceRefresh = false) {
    isLoading = true;
    renderLoadingState();
    try {
      allShortcuts = await SpreadsheetService.fetchShortcuts(forceRefresh);
      isLoading = false;

      if (allShortcuts.length === 0) {
        renderEmptyDataState();
      } else {
        renderIdleState();
      }
      renderPopular();
    } catch (err) {
      isLoading = false;
      console.error(err);
      renderLoadErrorState(err.message);
    }
  }

  // Auto-refresh diam-diam di latar belakang (tanpa spinner, tanpa mengganggu
  // hasil pencarian yang sedang ditampilkan user). Dipanggil berkala lewat
  // setInterval di init(), supaya tambahan/perubahan shortcut di spreadsheet
  // otomatis kesinkron tanpa perlu reload atau klik Refresh manual.
  async function silentRefreshData() {
    if (isLoading) return; // hindari tabrakan dengan loadData() yang sedang jalan
    try {
      const fresh = await SpreadsheetService.fetchShortcuts(true);
      allShortcuts = fresh;
      renderPopular(); // update daftar shortcut populer kalau ada perubahan
    } catch (err) {
      // Gagal diam-diam (mis. sedang tidak ada koneksi) — biarkan data lama
      // tetap dipakai, tidak perlu ganggu user dengan notifikasi error.
      console.warn("Auto-refresh data spreadsheet gagal:", err);
    }
  }

  function renderPopular() {
    let popularItems = allShortcuts.filter((s) => s.popular);

    if (popularItems.length === 0) {
      // Fallback ke daftar kode di CONFIG jika spreadsheet tidak menandai popular.
      popularItems = CONFIG.FALLBACK_POPULAR_SHORTCUTS.map((code) =>
        allShortcuts.find((s) => s.code.toLowerCase() === code.toLowerCase())
      ).filter(Boolean);
    }

    els.popularList.innerHTML = ShortcutComponent.renderPopularList(
      popularItems
    );

    els.popularList.querySelectorAll("[data-run-code]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const code = btn.getAttribute("data-run-code");
        els.searchInput.value = code;
        runSearch(code, { forceAutoCopy: true });
      });
    });
  }

  // ---------- SEARCH ----------

  function isAutoCopyEnabled() {
    return els.autoCopyToggle ? els.autoCopyToggle.checked : true;
  }

  /**
   * @param {string} rawQuery
   * @param {object} opts
   * @param {boolean} opts.forceAutoCopy - dipakai saat user klik shortcut populer,
   *   di mana kita tahu itu pasti exact code, jadi auto-copy langsung dijalankan.
   */
  function runSearch(rawQuery, opts = {}) {
    const query = (rawQuery || "").trim();
    if (!query) {
      renderIdleState();
      return;
    }

    if (isLoading) return;

    if (allShortcuts.length === 0) {
      renderEmptyDataState();
      return;
    }

    const queryLower = query.toLowerCase();

    // 1. Cek exact match berdasarkan Code.
    const exactMatch = allShortcuts.find(
      (s) => s.code.toLowerCase() === queryLower
    );

    if (exactMatch) {
      showExactResult(exactMatch, opts.forceAutoCopy !== false);
      return;
    }

    // 2. Kalau tidak exact, cari partial match di code ATAU isi template
    //    (supaya user bisa cari berdasarkan potongan kata di dalam pesan juga).
    const partialMatches = allShortcuts.filter(
      (s) =>
        s.code.toLowerCase().includes(queryLower) ||
        s.template.toLowerCase().includes(queryLower)
    );

    if (partialMatches.length > 0) {
      showPartialResults(partialMatches);
      return;
    }

    // 3. Tidak ditemukan sama sekali.
    showNotFound(query);
  }

  function showExactResult(item, allowAutoCopy) {
    const variables = ShortcutComponent.extractVariables(item.template);

    // Kalau template punya {{variable}}, jangan langsung auto-copy.
    // Tampilkan form isian dulu, copy dilakukan setelah user submit.
    if (variables.length > 0) {
      showVariableForm(item, variables);
      return;
    }

    const shouldAutoCopy = allowAutoCopy && isAutoCopyEnabled();

    els.resultArea.innerHTML = `
      <div class="result-heading">
        <h3>Hasil Shortcut</h3>
        <span class="result-heading__count">1 Hasil Ditemukan</span>
      </div>
      ${ShortcutComponent.renderResultCard(item, shouldAutoCopy)}
    `;

    wireCopyButtons();

    if (shouldAutoCopy) {
      copyToClipboard(item.template)
        .then(() => {
          NotificationComponent.success(
            "Berhasil disalin!",
            `Shortcut "${item.code}" telah disalin ke clipboard.`
          );
        })
        .catch(() => {
          showClipboardFallback(item);
        });
    }
  }

  function showPartialResults(items) {
    els.resultArea.innerHTML = `
      <div class="result-heading">
        <h3>Hasil Shortcut</h3>
        <span class="result-heading__count">${items.length} Hasil Ditemukan</span>
      </div>
      ${ShortcutComponent.renderResultList(items)}
    `;

    els.resultArea.querySelectorAll("[data-run-code]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const code = btn.getAttribute("data-run-code");
        els.searchInput.value = code;
        runSearch(code, { forceAutoCopy: true });
      });
    });
  }

  function showNotFound(query) {
    els.resultArea.innerHTML = `
      <div class="state-panel state-panel--warning">
        <p class="state-panel__title">Shortcut tidak ditemukan</p>
        <p>Tidak ada template dengan kode "${ShortcutComponent.escapeHtml(
          query
        )}".</p>
      </div>
    `;
    NotificationComponent.warning(
      "Shortcut tidak ditemukan",
      `Tidak ada template dengan kode "${query}".`
    );
  }

  function showClipboardFallback(item) {
    // Render ulang card tanpa status auto-copied, tapi dengan tombol Copy manual.
    els.resultArea.innerHTML = `
      <div class="result-heading">
        <h3>Hasil Shortcut</h3>
        <span class="result-heading__count">1 Hasil Ditemukan</span>
      </div>
      ${ShortcutComponent.renderResultCard(item, false)}
    `;
    wireCopyButtons();
    NotificationComponent.error(
      "Copy otomatis gagal",
      "Silakan gunakan tombol Copy Manual."
    );
  }

  // ---------- MODAL ISI VARIABEL ----------

  function openVariableModal() {
    els.variableModalOverlay.classList.add("is-open");
    document.body.style.overflow = "hidden"; // cegah scroll di belakang modal
  }

  function closeVariableModal() {
    els.variableModalOverlay.classList.remove("is-open");
    els.variableModalBox.innerHTML = "";
    document.body.style.overflow = "";
  }

  // Pencarian cabang untuk field "Cabang" di dalam pop-up isi variabel.
  // Ketik nama kota/cabang -> muncul daftar -> klik salah satu (atau
  // tekan Enter/Tab langsung, saran teratas otomatis "terkunci") ->
  // otomatis terisi "Cabang {Nama}: {Alamat} - {Telepon}".
  function wireBranchAutocomplete(input, formEl) {
    const listEl = formEl.querySelector(
      `[data-branch-list-for="${input.id}"]`
    );
    if (!listEl) return;

    let currentMatches = [];
    let highlightedIndex = 0;

    function hideList() {
      listEl.innerHTML = "";
      listEl.classList.remove("is-open");
      currentMatches = [];
      highlightedIndex = 0;
    }

    function applyMatch(branch) {
      input.value = CabangComponent.formatCombinedInfo(branch);
      input.classList.remove("variable-input--invalid");
    }

    // Dipanggil saat user PINDAH FIELD (Enter/Tab/klik luar) TANPA sempat
    // klik salah satu saran -- otomatis pakai saran paling atas, supaya
    // hasil akhirnya tetap lengkap (nama + alamat + telepon), bukan cuma
    // teks mentah yang diketik user.
    function commitTopMatchIfNeeded() {
      const alreadyFormatted = input.value.startsWith("Cabang ");
      if (alreadyFormatted) return;
      if (currentMatches.length > 0) {
        applyMatch(currentMatches[0]);
      }
    }

    function updateHighlight() {
      const items = listEl.querySelectorAll("[data-branch-idx]");
      items.forEach((el, i) => {
        el.classList.toggle("is-highlighted", i === highlightedIndex);
      });
      const activeItem = items[highlightedIndex];
      if (activeItem && typeof activeItem.scrollIntoView === "function") {
        activeItem.scrollIntoView({ block: "nearest" });
      }
    }

    function showResults(query) {
      const q = query.trim().toLowerCase();
      if (!q) {
        hideList();
        return;
      }

      currentMatches = CABANG_DATA.filter(
        (b) =>
          b.nama.toLowerCase().includes(q) || b.kota.toLowerCase().includes(q)
      ).slice(0, 6);
      highlightedIndex = 0;

      if (currentMatches.length === 0) {
        listEl.innerHTML = `<div class="branch-autocomplete-item branch-autocomplete-item--empty">Cabang tidak ditemukan</div>`;
        listEl.classList.add("is-open");
        return;
      }

      listEl.innerHTML = currentMatches
        .map(
          (b, i) => `
          <button type="button" class="branch-autocomplete-item" data-branch-idx="${i}">
            <span class="branch-autocomplete-item__nama">${ShortcutComponent.escapeHtml(
              b.nama
            )}</span>
            <span class="branch-autocomplete-item__alamat">${ShortcutComponent.escapeHtml(
              b.alamat
            )}</span>
          </button>
        `
        )
        .join("");
      listEl.classList.add("is-open");
      updateHighlight();

      listEl.querySelectorAll("[data-branch-idx]").forEach((btn, i) => {
        // Hover mouse ikut sinkron dengan highlight keyboard.
        btn.addEventListener("mouseenter", () => {
          highlightedIndex = i;
          updateHighlight();
        });
        btn.addEventListener("mousedown", (e) => {
          // mousedown (bukan click) supaya jalan SEBELUM input kehilangan
          // fokus (blur), jadi tidak kepotong oleh handler blur lain.
          e.preventDefault();
          applyMatch(currentMatches[i]);
          hideList();
        });
      });
    }

    // Navigasi keyboard: panah atas/bawah pindah highlight, Enter pilih
    // yang sedang di-highlight, Escape tutup dropdown. Didaftarkan SEBELUM
    // handler Enter umum (pindah field/submit) supaya bisa "mencegat"
    // penekanan Enter selagi dropdown masih terbuka.
    input.addEventListener("keydown", (e) => {
      if (!listEl.classList.contains("is-open")) return;
      if (currentMatches.length === 0) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        highlightedIndex = (highlightedIndex + 1) % currentMatches.length;
        updateHighlight();
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        highlightedIndex =
          (highlightedIndex - 1 + currentMatches.length) %
          currentMatches.length;
        updateHighlight();
      } else if (e.key === "Enter") {
        // Enter pertama: KUNCI pilihan yang sedang di-highlight saja,
        // jangan langsung lompat ke field berikutnya -- supaya user bisa
        // lihat dulu hasilnya. Enter kedua baru lanjut seperti biasa.
        e.preventDefault();
        e.stopImmediatePropagation();
        applyMatch(currentMatches[highlightedIndex]);
        hideList();
      } else if (e.key === "Escape") {
        hideList();
      }
    });

    input.addEventListener("input", () => showResults(input.value));
    input.addEventListener("focus", () => {
      if (input.value.trim() && !input.value.startsWith("Cabang ")) {
        showResults(input.value);
      }
    });
    input.addEventListener("blur", () => {
      // Delay dikit supaya klik/mousedown di daftar sempat diproses dulu.
      setTimeout(() => {
        commitTopMatchIfNeeded();
        hideList();
      }, 120);
    });

    // Ditempel ke elemen input-nya supaya bisa dipanggil dari handler Enter
    // yang letaknya di luar fungsi ini (dipakai bareng semua field lain).
    input._commitBranchMatch = commitTopMatchIfNeeded;
  }

  function showVariableForm(item, variables) {
    const classification = ShortcutComponent.classifyVariables(variables);

    els.variableModalBox.innerHTML = ShortcutComponent.renderVariableForm(
      item,
      variables
    );
    openVariableModal();

    const formEl = els.variableModalBox.querySelector("[data-fill-form]");
    if (!formEl) return;

    els.variableModalBox
      .querySelector("[data-close-modal]")
      ?.addEventListener("click", () => closeVariableModal());

    const inputs = Array.from(formEl.querySelectorAll(".variable-input"));

    function findComputedEl(varName) {
      return Array.from(formEl.querySelectorAll(".variable-computed")).find(
        (el) => el.getAttribute("data-computed-name") === varName
      );
    }

    // --- Live preview: Sisa Angsuran & Angsuran Berikutnya terhitung ulang
    // otomatis setiap kali Total Tenor / Angsuran Terbayar diketik. ---
    function recomputeTenorPreview() {
      const group = classification.tenorGroup;
      if (!group) return;

      const totalInput = inputs.find(
        (i) => i.getAttribute("data-var-name") === group.totalVar
      );
      const paidInput = inputs.find(
        (i) => i.getAttribute("data-var-name") === group.paidVar
      );
      const remainingEl = group.remainingVar
        ? findComputedEl(group.remainingVar)
        : null;
      const nextEl = group.nextVar ? findComputedEl(group.nextVar) : null;
      if (!totalInput || !paidInput) return;

      const totalRaw = totalInput.value.trim();
      const paidRaw = paidInput.value.trim();
      const isValid =
        /^\d+$/.test(totalRaw) &&
        /^\d+$/.test(paidRaw) &&
        Number(paidRaw) <= Number(totalRaw);

      if (!isValid) {
        if (remainingEl) remainingEl.value = "—";
        if (nextEl) nextEl.value = "—";
        return;
      }

      const total = Number(totalRaw);
      const paid = Number(paidRaw);
      if (remainingEl) remainingEl.value = String(total - paid);
      // Kalau sudah lunas (Angsuran Terbayar >= Total Tenor), tidak ada lagi
      // "angsuran berikutnya" -- tampilkan "-" bukan angka yang tidak masuk akal.
      if (nextEl)
        nextEl.value = paid >= total ? "Lunas" : `Tenor ke-${paid + 1}`;
    }

    if (classification.tenorGroup) {
      inputs.forEach((input) => {
        const name = input.getAttribute("data-var-name");
        if (
          name === classification.tenorGroup.totalVar ||
          name === classification.tenorGroup.paidVar
        ) {
          input.addEventListener("input", recomputeTenorPreview);
        }
      });
    }

    // --- Validasi + submit: dipanggil dari Enter di field terakhir ATAU
    // dari klik tombol "Salin ke Clipboard" (event submit form). ---
    function attemptSubmit() {
      const missing = [];
      let firstInvalidInput = null;

      inputs.forEach((input) => {
        const isEmpty = input.value.trim() === "";
        input.classList.toggle("variable-input--invalid", isEmpty);
        if (isEmpty) {
          missing.push(input.getAttribute("data-var-name"));
          if (!firstInvalidInput) firstInvalidInput = input;
        }
      });

      if (missing.length > 0) {
        const list =
          missing.length === 1
            ? missing[0]
            : `${missing.slice(0, -1).join(", ")} dan ${
                missing[missing.length - 1]
              }`;
        NotificationComponent.warning(
          "Variabel belum lengkap",
          `Silakan lengkapi variable ${list} terlebih dahulu.`
        );
        // Jangan tutup modal, jangan hapus nilai yang sudah diisi.
        firstInvalidInput?.focus();
        return;
      }

      const values = {};
      inputs.forEach((input) => {
        const varName = input.getAttribute("data-var-name");
        let val = input.value.trim();
        // Jaminan terakhir: kalau field ini "berbau nama" tapi belum sempat
        // ke-format lewat blur (mis. user langsung Enter di field terakhir
        // tanpa pindah fokus dulu), tetap rapikan Title Case di sini.
        if (ShortcutComponent.isNameLikeVariable(varName)) {
          val = ShortcutComponent.toTitleCase(val);
        }
        // Jaminan terakhir juga untuk field Cabang: kalau belum ke-commit
        // (bukan format "Cabang ..."), coba cari & pakai hasil paling
        // cocok dari CABANG_DATA berdasarkan apa yang sudah diketik user.
        if (
          ShortcutComponent.isBranchLikeVariable(varName) &&
          !val.startsWith("Cabang ")
        ) {
          const q = val.toLowerCase();
          const match = q
            ? CABANG_DATA.find(
                (b) =>
                  b.nama.toLowerCase().includes(q) ||
                  b.kota.toLowerCase().includes(q)
              )
            : null;
          if (match) val = CabangComponent.formatCombinedInfo(match);
        }
        values[varName] = val;
      });

      // --- Validasi & hitung otomatis Sisa Angsuran / Angsuran Berikutnya ---
      const group = classification.tenorGroup;
      if (group) {
        const totalInput = inputs.find(
          (i) => i.getAttribute("data-var-name") === group.totalVar
        );
        const paidInput = inputs.find(
          (i) => i.getAttribute("data-var-name") === group.paidVar
        );
        const totalRaw = values[group.totalVar];
        const paidRaw = values[group.paidVar];
        const totalIsNumber = /^\d+$/.test(totalRaw);
        const paidIsNumber = /^\d+$/.test(paidRaw);

        if (!totalIsNumber || !paidIsNumber) {
          totalInput?.classList.toggle("variable-input--invalid", !totalIsNumber);
          paidInput?.classList.toggle("variable-input--invalid", !paidIsNumber);
          NotificationComponent.warning(
            "Format angka tidak valid",
            `${group.totalVar} dan ${group.paidVar} harus diisi dengan angka bulat (contoh: 12).`
          );
          (!totalIsNumber ? totalInput : paidInput)?.focus();
          return;
        }

        const total = Number(totalRaw);
        const paid = Number(paidRaw);

        if (paid > total) {
          paidInput?.classList.add("variable-input--invalid");
          NotificationComponent.warning(
            "Angsuran terbayar melebihi total tenor",
            `${group.paidVar} (${paid}) tidak boleh lebih besar dari ${group.totalVar} (${total}).`
          );
          paidInput?.focus();
          return;
        }

        if (group.remainingVar) values[group.remainingVar] = String(total - paid);
        // Sudah lunas -> tidak ada angsuran berikutnya, tampilkan "-".
        if (group.nextVar)
          values[group.nextVar] =
            paid >= total ? "Lunas" : `Tenor ke-${paid + 1}`;
      }

      // Sumber kebenaran untuk hasil akhir adalah filledTemplate ini —
      // BUKAN mencari ulang item.template asli dari allShortcuts.
      const filledTemplate = ShortcutComponent.replaceVariables(
        item.template,
        values
      );

      closeVariableModal();
      finishVariableCopy(item, filledTemplate);
    }

    // Klik tombol submit / native form submit -> jalankan validasi + submit.
    formEl.addEventListener("submit", (e) => {
      e.preventDefault();
      attemptSubmit();
    });

    inputs.forEach((input, idx) => {
      // Hilangkan tanda "wajib diisi" begitu user mulai mengetik ulang.
      input.addEventListener("input", () => {
        if (input.value.trim() !== "") {
          input.classList.remove("variable-input--invalid");
        }
      });

      // Auto-rapikan kapitalisasi jadi Title Case KHUSUS untuk field
      // yang namanya mengandung "nama" (mis. Nama, Nama_Konsumen), supaya
      // data yang di-paste dari sistem lain (ALL CAPS / campur-campur)
      // otomatis jadi "Diri Damara Gaga", bukan "DIRI DAMARA GAGA".
      // Tidak menyentuh field lain (VA, PPK, tanggal, dst).
      const varName = input.getAttribute("data-var-name");
      if (ShortcutComponent.isNameLikeVariable(varName)) {
        const formatNow = () => {
          const formatted = ShortcutComponent.toTitleCase(input.value);
          if (formatted !== input.value) input.value = formatted;
        };
        input.addEventListener("blur", formatNow);
        input.addEventListener("paste", () => setTimeout(formatNow, 0));
      }

      // --- Field "Cabang": jadi pencarian cabang langsung di pop-up,
      // supaya tidak perlu bolak-balik buka halaman Data Cabang. ---
      if (ShortcutComponent.isBranchLikeVariable(varName)) {
        wireBranchAutocomplete(input, formEl);
      }

      input.addEventListener("keydown", (e) => {
        if (e.key !== "Enter") return;

        // Selalu cegah newline / submit native / reload halaman.
        e.preventDefault();

        // Shift+Enter = tetap di field ini (escape hatch), tidak submit,
        // tidak pindah field.
        if (e.shiftKey) return;

        // Kalau ini field "Cabang" dan user belum sempat klik salah satu
        // saran, kunci dulu saran teratas sebelum lanjut -- supaya hasil
        // akhirnya tetap lengkap (nama + alamat + telepon).
        if (typeof input._commitBranchMatch === "function") {
          input._commitBranchMatch();
        }

        const isLastField = idx === inputs.length - 1;
        if (isLastField) {
          attemptSubmit();
        } else {
          const nextInput = inputs[idx + 1];
          nextInput.focus();
          nextInput.select();
        }
      });
    });

    // Tab dibiarkan memakai perilaku browser bawaan (tidak di-override);
    // field auto-hitung pakai tabindex="-1" supaya otomatis dilewati.

    inputs[0]?.focus();
  }

  function finishVariableCopy(item, filledTemplate) {
    const filledItem = { ...item, template: filledTemplate };
    const shouldAutoCopy = isAutoCopyEnabled();

    renderFilledResultCard(filledItem, filledTemplate, shouldAutoCopy);

    if (!shouldAutoCopy) return; // Auto Copy OFF -> tombol Copy manual saja, tidak ada notifikasi.

    copyToClipboard(filledTemplate)
      .then(() => {
        NotificationComponent.success(
          "Berhasil disalin!",
          `Shortcut "${item.code}" (setelah variabel diisi) telah disalin ke clipboard.`
        );
      })
      .catch(() => {
        // Auto-copy gagal (mis. browser menolak Clipboard API) -> render ulang
        // dengan tombol Copy manual, tetap pakai filledTemplate yang sama.
        renderFilledResultCard(filledItem, filledTemplate, false);
        NotificationComponent.error(
          "Copy otomatis gagal",
          "Silakan gunakan tombol Copy Manual."
        );
      });
  }

  function renderFilledResultCard(filledItem, filledTemplate, autoCopied) {
    els.resultArea.innerHTML = `
      <div class="result-heading">
        <h3>Hasil Shortcut</h3>
        <span class="result-heading__count">1 Hasil Ditemukan</span>
      </div>
      ${ShortcutComponent.renderResultCard(filledItem, autoCopied, {
        badgeText: "✓ COPIED",
        copiedMessage:
          "Template (setelah variabel diisi) telah disalin ke clipboard. Kamu bisa langsung Paste (Ctrl + V).",
      })}
    `;

    // Tombol Copy manual selalu memakai filledTemplate (bukan mencari ulang
    // ke allShortcuts, karena template aslinya masih mengandung {{...}}).
    els.resultArea.querySelectorAll("[data-copy-code]").forEach((btn) => {
      btn.addEventListener("click", () => {
        copyToClipboard(filledTemplate)
          .then(() => {
            NotificationComponent.success(
              "Berhasil disalin!",
              `Shortcut "${filledItem.code}" (setelah variabel diisi) telah disalin ke clipboard.`
            );
          })
          .catch(() => {
            NotificationComponent.error(
              "Copy otomatis gagal",
              "Silakan gunakan tombol Copy Manual."
            );
          });
      });
    });
  }

  function wireCopyButtons() {
    els.resultArea.querySelectorAll("[data-copy-code]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const code = btn.getAttribute("data-copy-code");
        const item = allShortcuts.find((s) => s.code === code);
        if (!item) return;
        copyToClipboard(item.template)
          .then(() => {
            NotificationComponent.success(
              "Berhasil disalin!",
              `Shortcut "${item.code}" telah disalin ke clipboard.`
            );
          })
          .catch(() => {
            NotificationComponent.error(
              "Copy otomatis gagal",
              "Silakan gunakan tombol Copy Manual."
            );
          });
      });
    });
  }

  async function copyToClipboard(text) {
    if (!navigator.clipboard || !navigator.clipboard.writeText) {
      return Promise.reject(new Error("Clipboard API tidak tersedia."));
    }
    return navigator.clipboard.writeText(text);
  }

  // ---------- DATA CABANG ----------

  function renderCabangIdleState() {
    els.cabangResultArea.innerHTML = `
      <div class="state-panel state-panel--idle">
        <p>Ketik nama kota atau cabang lalu tekan Enter untuk mencari alamat & nomor telepon.</p>
      </div>
    `;
  }

  function renderCabangNotFound(query) {
    els.cabangResultArea.innerHTML = `
      <div class="state-panel state-panel--warning">
        <p class="state-panel__title">Cabang tidak ditemukan</p>
        <p>Tidak ada cabang dengan kata kunci "${CabangComponent.escapeHtml(
          query
        )}".</p>
      </div>
    `;
    NotificationComponent.warning(
      "Cabang tidak ditemukan",
      `Tidak ada cabang dengan kata kunci "${query}".`
    );
  }

  function wireCabangCopyButtons() {
    els.cabangResultArea.querySelectorAll("[data-copy-text]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const text = btn.getAttribute("data-copy-text");
        const label = btn.getAttribute("data-copy-label") || "Data";
        copyToClipboard(text)
          .then(() => {
            NotificationComponent.success(
              "Berhasil disalin!",
              `${label} telah disalin ke clipboard.`
            );
          })
          .catch(() => {
            NotificationComponent.error(
              "Copy otomatis gagal",
              "Silakan salin secara manual (select teks lalu Ctrl+C)."
            );
          });
      });
    });
  }

  function runCabangSearch(rawQuery) {
    const query = (rawQuery || "").trim();
    if (!query) {
      renderCabangIdleState();
      return;
    }

    const queryLower = query.toLowerCase();
    const matches = CABANG_DATA.filter(
      (b) =>
        b.nama.toLowerCase().includes(queryLower) ||
        b.kota.toLowerCase().includes(queryLower) ||
        b.alamat.toLowerCase().includes(queryLower)
    );

    if (matches.length === 0) {
      renderCabangNotFound(query);
      return;
    }

    els.cabangResultArea.innerHTML = `
      <div class="result-heading">
        <h3>Hasil Cabang</h3>
        <span class="result-heading__count">${matches.length} Hasil Ditemukan</span>
      </div>
      ${CabangComponent.renderResults(matches)}
    `;
    wireCabangCopyButtons();
  }

  // ---------- EVENT WIRING ----------

  function wireEvents() {
    els.searchButton.addEventListener("click", () => {
      runSearch(els.searchInput.value);
    });

    els.searchInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        runSearch(els.searchInput.value);
      }
    });

    els.searchInput.addEventListener("input", () => {
      els.clearButton.classList.toggle(
        "is-visible",
        els.searchInput.value.length > 0
      );
    });

    els.clearButton.addEventListener("click", () => {
      els.searchInput.value = "";
      els.clearButton.classList.remove("is-visible");
      renderIdleState();
      els.searchInput.focus();
    });

    els.refreshButton.addEventListener("click", () => {
      SpreadsheetService.clearCache();
      loadData(true);
    });

    // Keyboard-first: Ctrl+K fokus ke search dari mana saja.
    document.addEventListener("keydown", (e) => {
      const isCtrlK = (e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k";
      if (isCtrlK) {
        e.preventDefault();
        els.searchInput.focus();
        els.searchInput.select();
      }

      // Escape menutup modal isi variabel (kalau sedang terbuka).
      if (
        e.key === "Escape" &&
        els.variableModalOverlay.classList.contains("is-open")
      ) {
        closeVariableModal();
      }
    });

    // Klik di area gelap (backdrop) menutup modal, klik di dalam kotak tidak.
    els.variableModalOverlay.addEventListener("click", (e) => {
      if (e.target === els.variableModalOverlay) {
        closeVariableModal();
      }
    });

    // --- Hamburger: buka/tutup sidebar ---
    els.sidebarToggleBtn.addEventListener("click", () => {
      toggleSidebar();
    });

    // --- Navigasi sidebar: switch antar view tanpa reload halaman. ---
    els.navLinkShortcut.addEventListener("click", (e) => {
      e.preventDefault();
      switchView("shortcut");
    });

    els.navLinkCabang.addEventListener("click", (e) => {
      e.preventDefault();
      switchView("cabang");
    });

    els.navLinkNotes.addEventListener("click", (e) => {
      e.preventDefault();
      switchView("notes");
    });

    els.navLinkOcr.addEventListener("click", (e) => {
      e.preventDefault();
      switchView("ocr");
    });

    // --- Data Cabang: search, enter, clear ---
    els.cabangSearchButton.addEventListener("click", () => {
      runCabangSearch(els.cabangSearchInput.value);
    });

    els.cabangSearchInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        runCabangSearch(els.cabangSearchInput.value);
      }
    });

    els.cabangSearchInput.addEventListener("input", () => {
      els.cabangClearButton.classList.toggle(
        "is-visible",
        els.cabangSearchInput.value.length > 0
      );
    });

    els.cabangClearButton.addEventListener("click", () => {
      els.cabangSearchInput.value = "";
      els.cabangClearButton.classList.remove("is-visible");
      renderCabangIdleState();
      els.cabangSearchInput.focus();
    });
  }

  // ---------- INIT ----------

  document.addEventListener("DOMContentLoaded", () => {
    cacheDom();
    SidebarComponent.init();
    ThemeComponent.init();
    NotesComponent.init();
    wireEvents();
    restoreSidebarPreference();
    renderIdleState();
    loadData(false);
    els.searchInput.focus();

    // Auto-sync: fetch ulang data spreadsheet diam-diam setiap
    // CONFIG.AUTO_REFRESH_INTERVAL_MS selama tab ini tetap terbuka.
    if (CONFIG.AUTO_REFRESH_INTERVAL_MS > 0) {
      setInterval(silentRefreshData, CONFIG.AUTO_REFRESH_INTERVAL_MS);
    }
  });
})();
