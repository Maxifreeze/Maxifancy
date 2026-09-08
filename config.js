/**
 * CONFIG.js
 * ----------
 * Satu tempat untuk semua pengaturan yang mungkin sering diubah:
 * URL spreadsheet, identitas user di sidebar, dan daftar shortcut populer
 * (dipakai sebagai fallback jika kolom "Popular" tidak ada di spreadsheet).
 */

const CONFIG = {
  // Published CSV dari Google Spreadsheet (sheet "Shortcut").
  // Cara mendapatkannya: File > Share > Publish to web > pilih sheet > CSV.
  // Lihat README.md untuk panduan lengkap langkah demi langkah.
  SPREADSHEET_URL:
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vTVF5i3KN_MbeIUjGJsUmrfrhvoy8DPOGJ3h8pEoUGye07ZHEFRUcdOX4FXqathrQ0vaWfgB-_MLw90/pub?gid=1950973508&single=true&output=csv",

  // Nama & role yang tampil di bagian bawah sidebar.
  USER: {
    name: "Aditya Pratama",
    role: "Customer Care",
    initials: "AP",
  },

  // Nama perusahaan untuk branding sidebar & footer.
  BRAND: {
    name: "Sinarmas",
    subtitle: "multifinance",
    footer: "Sinarmas Multifinance",
  },

  // Dipakai hanya jika spreadsheet tidak memiliki kolom "Popular".
  // Isi dengan kode shortcut (kolom "Shortcut") yang ingin ditampilkan sebagai populer.
  FALLBACK_POPULAR_SHORTCUTS: ["w1", "v1", "t1", "cc", "c1"],

  // Berapa lama notifikasi tampil sebelum otomatis hilang (ms).
  NOTIFICATION_DURATION_MS: 3000,

  // Berapa lama data spreadsheet disimpan di cache browser sebelum dianggap basi (ms).
  // 0 berarti selalu fetch ulang setiap reload halaman.
  CACHE_TTL_MS: 60 * 1000, // 1 menit

  // Selain cache di atas, dashboard juga fetch ulang data secara berkala DI
  // LATAR BELAKANG selama tab tetap terbuka (tanpa reload, tanpa klik apapun),
  // supaya perubahan/tambahan shortcut di spreadsheet otomatis kesinkron.
  AUTO_REFRESH_INTERVAL_MS: 60 * 1000, // 1 menit

  // Key yang dipakai untuk menyimpan cache di sessionStorage.
  CACHE_KEY: "sinarmas_shortcut_cache_v2",
};
