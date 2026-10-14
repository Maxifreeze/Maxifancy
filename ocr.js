/**
 * ocr.js
 * -------
 * Fitur "Ekstrak Teks": ambil teks dari gambar/screenshot langsung di
 * browser, tanpa server, pakai Tesseract.js (OCR berbasis WebAssembly).
 *
 * Alur: user pilih/paste/drag gambar -> preview -> klik "Ekstrak Teks" ->
 * Tesseract.js jalan di browser -> hasil teks ditampilkan (bisa diedit
 * kalau ada salah baca) -> tombol Salin.
 *
 * Catatan: saat pertama kali dipakai, Tesseract.js perlu download model
 * bahasa (~beberapa MB) dari CDN -- agak lambat di awal, tapi setelah itu
 * ke-cache browser jadi lebih cepat di pemakaian berikutnya.
 */

const OcrComponent = (() => {
  let els = {};
  let currentFile = null;
  let worker = null; // Tesseract worker, dibuat sekali & dipakai ulang
  let isProcessing = false;
  let lastExtractedText = ""; // sumber kebenaran untuk tombol Salin (bukan baca ulang dari textarea)

  function cacheDom() {
    els = {
      dropzone: document.getElementById("ocr-dropzone"),
      dropzoneEmpty: document.getElementById("ocr-dropzone-empty"),
      dropzonePreview: document.getElementById("ocr-dropzone-preview"),
      previewImg: document.getElementById("ocr-preview-img"),
      pickBtn: document.getElementById("ocr-pick-btn"),
      fileInput: document.getElementById("ocr-file-input"),
      actions: document.getElementById("ocr-actions"),
      extractBtn: document.getElementById("ocr-extract-btn"),
      resetBtn: document.getElementById("ocr-reset-btn"),
      progress: document.getElementById("ocr-progress"),
      progressFill: document.getElementById("ocr-progress-fill"),
      progressLabel: document.getElementById("ocr-progress-label"),
      resultText: document.getElementById("ocr-result-text"),
      copyBtn: document.getElementById("ocr-copy-btn"),
    };
  }

  // ---------- GAMBAR: pilih / drag-drop / paste ----------

  function isImageFile(file) {
    return !!(file && file.type && file.type.startsWith("image/"));
  }

  function setImage(file) {
    if (!isImageFile(file)) {
      NotificationComponent.warning(
        "Bukan file gambar",
        "Silakan pilih atau paste file gambar (PNG/JPG/dll)."
      );
      return;
    }
    currentFile = file;

    const reader = new FileReader();
    reader.onload = (e) => {
      els.previewImg.src = e.target.result;
      els.dropzoneEmpty.style.display = "none";
      els.dropzonePreview.style.display = "";
      els.actions.style.display = "flex";
      setResultText("");
      els.copyBtn.style.display = "none";
    };
    reader.readAsDataURL(file);
  }

  function resetImage() {
    currentFile = null;
    els.previewImg.src = "";
    els.dropzoneEmpty.style.display = "";
    els.dropzonePreview.style.display = "none";
    els.actions.style.display = "none";
    els.progress.style.display = "none";
    setResultText("");
    els.copyBtn.style.display = "none";
    els.fileInput.value = "";
  }

  function wireImageInput() {
    els.pickBtn.addEventListener("click", () => els.fileInput.click());

    els.fileInput.addEventListener("change", () => {
      if (els.fileInput.files[0]) setImage(els.fileInput.files[0]);
    });

    els.resetBtn.addEventListener("click", resetImage);

    // Drag & drop
    ["dragover", "dragenter"].forEach((evt) => {
      els.dropzone.addEventListener(evt, (e) => {
        e.preventDefault();
        els.dropzone.classList.add("is-dragover");
      });
    });
    ["dragleave", "dragend"].forEach((evt) => {
      els.dropzone.addEventListener(evt, () => {
        els.dropzone.classList.remove("is-dragover");
      });
    });
    els.dropzone.addEventListener("drop", (e) => {
      e.preventDefault();
      els.dropzone.classList.remove("is-dragover");
      const file = e.dataTransfer?.files?.[0];
      if (file) setImage(file);
    });

    // Klik area kosong dropzone (bukan tombol) juga buka file picker.
    els.dropzoneEmpty.addEventListener("click", (e) => {
      if (e.target === els.pickBtn) return;
      els.fileInput.click();
    });

    // Paste screenshot langsung (Ctrl+V), HANYA kalau halaman "Ekstrak
    // Teks" sedang aktif -- supaya tidak mengganggu paste di halaman lain.
    document.addEventListener("paste", (e) => {
      const viewEl = document.getElementById("view-ocr");
      if (!viewEl || viewEl.style.display === "none") return;

      const items = e.clipboardData?.items;
      if (!items) return;
      for (const item of items) {
        if (item.type && item.type.startsWith("image/")) {
          const file = item.getAsFile();
          if (file) {
            setImage(file);
            e.preventDefault();
          }
          break;
        }
      }
    });
  }

  // ---------- HASIL TEKS ----------

  function setResultText(text) {
    lastExtractedText = text;
    els.resultText.value = text;
  }

  // ---------- EKSTRAKSI TEKS (Tesseract.js) ----------

  async function getWorker() {
    if (worker) return worker;
    if (typeof Tesseract === "undefined") {
      throw new Error(
        "Library OCR (Tesseract.js) gagal dimuat. Cek koneksi internet lalu coba lagi."
      );
    }
    worker = await Tesseract.createWorker("ind+eng", 1, {
      logger: (m) => updateProgress(m),
    });
    return worker;
  }

  function updateProgress(m) {
    if (!m || typeof m.progress !== "number") return;
    const pct = Math.round(m.progress * 100);
    els.progressFill.style.width = `${pct}%`;

    const statusLabel =
      {
        "loading tesseract core": "Memuat mesin OCR...",
        "initializing tesseract": "Menyiapkan OCR...",
        "loading language traineddata": "Mengunduh model bahasa (sekali saja)...",
        "initializing api": "Menyiapkan...",
        "recognizing text": "Membaca teks dari gambar...",
      }[m.status] || "Memproses...";

    els.progressLabel.textContent = `${statusLabel} ${pct}%`;
  }

  async function extractText() {
    if (!currentFile || isProcessing) return;
    isProcessing = true;

    els.extractBtn.disabled = true;
    els.progress.style.display = "block";
    els.progressFill.style.width = "0%";
    els.progressLabel.textContent = "Menyiapkan...";
    setResultText("");
    els.copyBtn.style.display = "none";

    let resultTextValue = "";
    let errorMessage = "";

    try {
      const w = await getWorker();
      const { data } = await w.recognize(currentFile);
      resultTextValue = (data?.text || "").trim();
    } catch (err) {
      console.error(err);
      errorMessage = err?.message || "Terjadi kesalahan saat memproses gambar.";
    }

    // Semua update DOM dilakukan di SATU titik ini (bukan tersebar di
    // beberapa cabang try/catch), supaya urutan eksekusinya jelas & mudah
    // dites.
    isProcessing = false;
    els.extractBtn.disabled = false;
    els.progress.style.display = "none";

    if (errorMessage) {
      setResultText("");
      NotificationComponent.error("Gagal mengekstrak teks", errorMessage);
      return;
    }

    if (resultTextValue) {
      setResultText(resultTextValue);
      els.copyBtn.style.display = "";
      NotificationComponent.success(
        "Berhasil diekstrak!",
        "Teks dari gambar sudah siap disalin (bisa diedit dulu kalau perlu)."
      );
    } else {
      setResultText("(Tidak ada teks yang terdeteksi pada gambar ini.)");
      NotificationComponent.warning(
        "Tidak ada teks terdeteksi",
        "Coba gambar yang lebih jelas/tidak buram."
      );
    }
  }

  function wireExtract() {
    els.extractBtn.addEventListener("click", extractText);

    // Kalau user edit manual hasilnya, tombol Salin ikut pakai versi
    // terbaru (bukan versi asli hasil OCR).
    els.resultText.addEventListener("input", () => {
      lastExtractedText = els.resultText.value;
    });

    els.copyBtn.addEventListener("click", () => {
      const textToCopy = lastExtractedText;
      if (!navigator.clipboard || !navigator.clipboard.writeText) {
        NotificationComponent.error(
          "Copy otomatis gagal",
          "Silakan select teks lalu Ctrl+C secara manual."
        );
        return;
      }
      navigator.clipboard
        .writeText(textToCopy)
        .then(() => {
          NotificationComponent.success(
            "Berhasil disalin!",
            "Teks hasil ekstraksi telah disalin ke clipboard."
          );
        })
        .catch(() => {
          NotificationComponent.error(
            "Copy otomatis gagal",
            "Silakan select teks lalu Ctrl+C secara manual."
          );
        });
    });
  }

  // ---------- INIT ----------

  let initialized = false;

  function init() {
    if (initialized) return;
    initialized = true;
    cacheDom();
    wireImageInput();
    wireExtract();
  }

  return { init };
})();
