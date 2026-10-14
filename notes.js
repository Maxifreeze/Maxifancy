/**
 * notes.js
 * ---------
 * Fitur "Catatan" ala Google Keep: tulis catatan cepat, kasih warna,
 * sematkan (pin) yang penting, cari, edit langsung di tempat (inline),
 * hapus. Semua tersimpan di localStorage browser (per user/per browser,
 * bukan disinkron ke server manapun -- ini catatan pribadi cepat, bukan
 * data terpusat seperti shortcut/data cabang).
 */

const NotesComponent = (() => {
  const STORAGE_KEY = "sinarmas_notes_v1";

  const COLORS = [
    { key: "default", label: "Putih", bg: "#ffffff" },
    { key: "yellow", label: "Kuning", bg: "#fdf3b0" },
    { key: "green", label: "Hijau", bg: "#d3f2d1" },
    { key: "blue", label: "Biru", bg: "#d3e6f8" },
    { key: "pink", label: "Pink", bg: "#f9d9e6" },
    { key: "purple", label: "Ungu", bg: "#e6dcf8" },
    { key: "orange", label: "Oranye", bg: "#ffe3cc" },
    { key: "grey", label: "Abu-abu", bg: "#e6e6e6" },
  ];

  let notes = []; // { id, title, body, color, pinned, updatedAt }
  let editingId = null; // id catatan yang sedang di-edit inline (null = tidak ada)
  let suppressNextOutsideClose = false; // cegah klik yg BARU SAJA membuka edit ikut kebaca "klik di luar"
  let searchQuery = "";
  let els = {};

  // ---------- STORAGE ----------

  function loadNotes() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      notes = raw ? JSON.parse(raw) : [];
    } catch (err) {
      notes = [];
    }
  }

  function saveNotes() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
    } catch (err) {
      console.warn("Gagal menyimpan catatan (localStorage penuh/nonaktif):", err);
    }
  }

  function genId() {
    return `note_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  }

  // ---------- HELPERS ----------

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  function colorBg(key) {
    const found = COLORS.find((c) => c.key === key);
    return found ? found.bg : COLORS[0].bg;
  }

  function autoResize(textarea) {
    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
  }

  function renderColorSwatches(selectedColor) {
    return COLORS.map(
      (c) => `
        <button
          type="button"
          class="notes-color-dot"
          data-color="${c.key}"
          style="background:${c.bg};"
          title="${c.label}"
          ${c.key === selectedColor ? 'data-selected="true"' : ""}
        ></button>
      `
    ).join("");
  }

  // ---------- RENDER: KARTU CATATAN (VIEW MODE) ----------

  function renderViewCard(note) {
    return `
      <div class="note-card" data-id="${note.id}" style="background:${colorBg(note.color)};">
        <div class="note-card__clickzone" data-open-edit>
          ${note.title ? `<p class="note-card__title">${escapeHtml(note.title)}</p>` : ""}
          ${note.body ? `<p class="note-card__body">${escapeHtml(note.body)}</p>` : ""}
        </div>
        <div class="note-card__actions">
          <button class="note-card__action" data-action="pin" title="${note.pinned ? "Lepas sematan" : "Sematkan"}">${note.pinned ? "📍" : "📌"}</button>
          <button class="note-card__action" data-action="delete" title="Hapus">🗑️</button>
        </div>
      </div>
    `;
  }

  // ---------- RENDER: KARTU CATATAN (EDIT MODE, inline) ----------

  function renderEditCard(note) {
    return `
      <div class="note-card note-card--editing" data-id="${note.id}" style="background:${colorBg(note.color)};">
        <input type="text" class="notes-composer__title-input" data-edit-title placeholder="Judul" value="${escapeHtml(note.title || "")}" />
        <textarea class="notes-composer__body-input" data-edit-body placeholder="Tulis catatan..." rows="3">${escapeHtml(note.body || "")}</textarea>
        <div class="notes-composer__footer">
          <div class="notes-composer__colors" data-edit-colors>${renderColorSwatches(note.color)}</div>
          <div style="display:flex; gap:8px;">
            <button type="button" class="note-card__action" data-action="pin" title="${note.pinned ? "Lepas sematan" : "Sematkan"}">${note.pinned ? "📍" : "📌"}</button>
            <button type="button" class="note-card__action" data-action="delete" title="Hapus">🗑️</button>
            <button type="button" class="btn btn--primary" data-action="close-edit">Tutup</button>
          </div>
        </div>
      </div>
    `;
  }

  // ---------- MAIN RENDER ----------

  function matchesSearch(note) {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      (note.title || "").toLowerCase().includes(q) ||
      (note.body || "").toLowerCase().includes(q)
    );
  }

  function render() {
    const visible = notes.filter(matchesSearch);
    const pinned = visible.filter((n) => n.pinned).sort((a, b) => b.updatedAt - a.updatedAt);
    const others = visible.filter((n) => !n.pinned).sort((a, b) => b.updatedAt - a.updatedAt);

    els.pinnedSection.style.display = pinned.length > 0 ? "" : "none";
    els.pinnedGrid.innerHTML = pinned
      .map((n) => (n.id === editingId ? renderEditCard(n) : renderViewCard(n)))
      .join("");

    els.othersGrid.innerHTML = others
      .map((n) => (n.id === editingId ? renderEditCard(n) : renderViewCard(n)))
      .join("");

    els.othersLabel.textContent =
      pinned.length > 0 ? "Lainnya" : "Catatan";

    if (visible.length === 0) {
      els.othersGrid.innerHTML = `
        <div class="state-panel" style="grid-column:1/-1;">
          <p>${searchQuery ? "Tidak ada catatan yang cocok." : "Belum ada catatan. Tulis yang pertama di atas!"}</p>
        </div>
      `;
    }

    wireCardEvents();
  }

  // ---------- CRUD ----------

  function addNote(title, body, color) {
    if (!title.trim() && !body.trim()) return; // jangan simpan catatan kosong
    notes.unshift({
      id: genId(),
      title: title.trim(),
      body: body.trim(),
      color: color || "default",
      pinned: false,
      updatedAt: Date.now(),
    });
    saveNotes();
    render();
  }

  function updateNote(id, changes) {
    const note = notes.find((n) => n.id === id);
    if (!note) return;
    Object.assign(note, changes, { updatedAt: Date.now() });
    saveNotes();
  }

  function deleteNote(id) {
    notes = notes.filter((n) => n.id !== id);
    saveNotes();
  }

  function togglePin(id) {
    const note = notes.find((n) => n.id === id);
    if (!note) return;
    note.pinned = !note.pinned;
    saveNotes();
  }

  // ---------- WIRING: KOMPOSER (CATATAN BARU) ----------

  function expandComposer() {
    els.composerTitle.style.display = "";
    els.composerFooter.style.display = "";
  }

  function collapseAndMaybeSaveComposer() {
    const title = els.composerTitle.value;
    const body = els.composerBody.value;
    addNote(title, body, els.composer.dataset.color || "default");

    els.composerTitle.value = "";
    els.composerBody.value = "";
    els.composerBody.style.height = "auto";
    els.composer.dataset.color = "default";
    els.composer.style.background = "#ffffff";
    els.composerTitle.style.display = "none";
    els.composerFooter.style.display = "none";
  }

  function wireComposer() {
    els.composerColors.innerHTML = renderColorSwatches("default");
    els.composer.dataset.color = "default";

    els.composerBody.addEventListener("focus", expandComposer);
    els.composerBody.addEventListener("input", () => autoResize(els.composerBody));
    els.composerTitle.addEventListener("focus", expandComposer);

    els.composerColors.addEventListener("click", (e) => {
      const dot = e.target.closest("[data-color]");
      if (!dot) return;
      const color = dot.getAttribute("data-color");
      els.composer.dataset.color = color;
      els.composer.style.background = colorBg(color);
      els.composerColors.innerHTML = renderColorSwatches(color);
    });

    els.composerSaveBtn.addEventListener("click", () => {
      collapseAndMaybeSaveComposer();
    });

    // Klik di luar composer (saat sedang terbuka) -> simpan & collapse,
    // sama seperti perilaku Google Keep.
    document.addEventListener("click", (e) => {
      const isExpanded = els.composerFooter.style.display !== "none";
      if (isExpanded && !els.composer.contains(e.target)) {
        collapseAndMaybeSaveComposer();
      }
    });
  }

  // ---------- WIRING: AKSI PER KARTU (pin, delete, buka edit, tutup edit) ----------

  function wireCardEvents() {
    document.querySelectorAll(".note-card[data-id]").forEach((card) => {
      const id = card.getAttribute("data-id");

      const clickzone = card.querySelector("[data-open-edit]");
      if (clickzone) {
        clickzone.addEventListener("click", () => {
          editingId = id;
          suppressNextOutsideClose = true; // klik ini sendiri bukan "klik di luar"
          render();
          const titleInput = document.querySelector(
            `.note-card--editing[data-id="${id}"] [data-edit-title]`
          );
          titleInput?.focus();
        });
      }

      card.querySelectorAll('[data-action="pin"]').forEach((btn) => {
        btn.addEventListener("click", (e) => {
          e.stopPropagation();
          togglePin(id);
          render();
        });
      });

      card.querySelectorAll('[data-action="delete"]').forEach((btn) => {
        btn.addEventListener("click", (e) => {
          e.stopPropagation();
          if (window.confirm("Yakin ingin menghapus catatan ini?")) {
            deleteNote(id);
            if (editingId === id) editingId = null;
            render();
          }
        });
      });

      card.querySelectorAll('[data-action="close-edit"]').forEach((btn) => {
        btn.addEventListener("click", (e) => {
          e.stopPropagation();
          saveEditingCard(id);
          editingId = null;
          render();
        });
      });

      const titleInput = card.querySelector("[data-edit-title]");
      const bodyInput = card.querySelector("[data-edit-body]");
      const colorsWrap = card.querySelector("[data-edit-colors]");

      if (bodyInput) {
        autoResize(bodyInput);
        bodyInput.addEventListener("input", () => autoResize(bodyInput));
      }

      if (colorsWrap) {
        colorsWrap.addEventListener("click", (e) => {
          e.stopPropagation();
          const dot = e.target.closest("[data-color]");
          if (!dot) return;
          const color = dot.getAttribute("data-color");
          card.style.background = colorBg(color);
          card.dataset.pendingColor = color;
          colorsWrap.innerHTML = renderColorSwatches(color);
        });
      }

      // Klik di dalam kartu yang sedang diedit (mis. area kosong kartu itu
      // sendiri) tidak boleh ikut kebaca sebagai "klik di luar".
      card.addEventListener("click", (e) => {
        if (card.classList.contains("note-card--editing")) {
          e.stopPropagation();
        }
      });

      if (titleInput) {
        titleInput.dataset.wired = "1";
      }
    });
  }

  // Listener "klik di luar kartu yang sedang diedit -> simpan & tutup".
  // Didaftarkan SEKALI SAJA (bukan tiap render), dan hanya baca `editingId`
  // terkini saat klik terjadi supaya selalu up-to-date.
  function wireOutsideClickClosesEdit() {
    document.addEventListener("click", (e) => {
      if (suppressNextOutsideClose) {
        suppressNextOutsideClose = false;
        return;
      }
      if (!editingId) return;
      const editingCardEl = document.querySelector(
        `.note-card--editing[data-id="${editingId}"]`
      );
      if (editingCardEl && !editingCardEl.contains(e.target)) {
        saveEditingCard(editingId);
        editingId = null;
        render();
      }
    });
  }

  function saveEditingCard(id) {
    const cardEl = document.querySelector(`.note-card--editing[data-id="${id}"]`);
    if (!cardEl) return;
    const title = cardEl.querySelector("[data-edit-title]")?.value || "";
    const body = cardEl.querySelector("[data-edit-body]")?.value || "";
    const color = cardEl.dataset.pendingColor || notes.find((n) => n.id === id)?.color || "default";

    if (!title.trim() && !body.trim()) {
      // Catatan dikosongkan total saat edit -> hapus otomatis (perilaku Keep).
      deleteNote(id);
      return;
    }
    updateNote(id, { title, body, color });
  }

  // ---------- SEARCH ----------

  function wireSearch() {
    els.searchInput.addEventListener("input", () => {
      searchQuery = els.searchInput.value.trim();
      render();
    });
  }

  // ---------- INIT ----------

  function cacheDom() {
    els = {
      composer: document.getElementById("notes-composer"),
      composerTitle: document.getElementById("notes-composer-title"),
      composerBody: document.getElementById("notes-composer-body"),
      composerFooter: document.getElementById("notes-composer-footer"),
      composerColors: document.getElementById("notes-composer-colors"),
      composerSaveBtn: document.getElementById("notes-composer-save"),
      searchInput: document.getElementById("notes-search-input"),
      pinnedSection: document.getElementById("notes-pinned-section"),
      pinnedGrid: document.getElementById("notes-pinned-grid"),
      othersSection: document.getElementById("notes-others-section"),
      othersGrid: document.getElementById("notes-others-grid"),
      othersLabel: document.getElementById("notes-others-label"),
    };
  }

  let initialized = false;

  function init() {
    if (initialized) return; // hindari wiring dobel kalau init() dipanggil ulang
    initialized = true;
    cacheDom();
    loadNotes();
    wireComposer();
    wireOutsideClickClosesEdit();
    wireSearch();
    render();
  }

  return { init };
})();
