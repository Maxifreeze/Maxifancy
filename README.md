# Dashboard Shortcut — Sinarmas Multifinance

Web dashboard internal untuk Customer Care: ketik kode shortcut → Enter →
template otomatis tersalin ke clipboard. Semua data shortcut diambil dari
Google Spreadsheet, tidak ada yang di-hardcode di source code.

## Struktur File

```
/index.html
/style.css
/app.js
/config.js
/services/spreadsheet.js
/components/notification.js
/components/shortcut.js
/components/sidebar.js
```

## 1. Cara Membuat Google Spreadsheet

1. Buka [sheets.google.com](https://sheets.google.com) → buat spreadsheet baru.
2. Beri nama sheet (tab) `Shortcut`.
3. Isi baris pertama (header) persis seperti ini — **hanya 2 kolom wajib**:

   | A: Shortcut | B: Deskripsi |
   |-------------|--------------|

   - **Kolom A (Shortcut)** = kode yang diketik user, contoh: `w1`, `v1`, `c1`.
   - **Kolom B (Deskripsi)** = isi template lengkap yang otomatis ter-copy.

   Opsional: kolom `Popular` (isi `Yes`/`No`) untuk menandai shortcut yang
   tampil di "Shortcut Populer". Kalau tidak ada, dashboard otomatis memakai
   daftar fallback di `config.js`.

## 2. Cara Mengisi Data Shortcut

Contoh isi baris (persis seperti sheet yang sudah Anda buat):

| Shortcut | Deskripsi |
|----------|-----------|
| w1 | Selamat Pagi/Siang/Sore, Dengan layanan Whatsapp Customer Care Sinarmas Multifinance, Ada yang bisa kami bantu? |
| a1 | Baik Bapak/Ibu {{Nama_Konsumen}}, kami bantu lakukan pengecekan pada sistem terkait status angsuran Bapak/Ibu... |

Catatan:
- Kolom `Deskripsi` boleh berisi banyak baris (tekan `Alt+Enter` di Google
  Sheets untuk baris baru di dalam satu sel) — sistem sudah menangani ini.
- Gunakan `{{nama_variabel}}` untuk bagian yang perlu diisi manual nanti,
  misalnya `{{Nama}}`, `{{PPK}}`, `{{NIK}}`, `{{Tanggal}}`, dsb. Sistem
  mendeteksi pola ini secara generic — nama variabel bebas, tidak dibatasi
  daftar tertentu, dan tetap ikut ter-copy apa adanya.
- Tidak ada kolom Status — semua baris yang punya kode di kolom `Shortcut`
  otomatis dianggap aktif dan langsung tampil di dashboard.

## 3. Cara Mendapatkan Published CSV URL

1. Di Google Sheets: **File → Share → Publish to web**.
2. Pada dropdown pertama, pilih sheet yang berisi data shortcut (mis. `Shortcut`).
3. Pada dropdown kedua, pilih **Comma-separated values (.csv)**.
4. Klik **Publish**, konfirmasi.
5. Salin URL yang muncul (formatnya seperti):
   ```
   https://docs.google.com/spreadsheets/d/e/2PACX-xxxxxxxxxxxxx/pub?output=csv
   ```

Penting: URL ini bersifat publik (siapa saja yang punya link bisa membaca datanya
dalam mode read-only). Jangan menaruh data sensitif/rahasia di spreadsheet ini.

## 4. Tempat Memasukkan URL Spreadsheet di Source Code

Buka `config.js`, ganti nilai `SPREADSHEET_URL`:

```js
const CONFIG = {
  SPREADSHEET_URL: "TEMPEL_URL_CSV_ANDA_DI_SINI",
  ...
};
```

## 5. Cara Menjalankan Website

Karena browser modern membatasi `fetch()` dari file lokal (`file://`), jalankan
lewat local server sederhana:

**Opsi A — Python (sudah terpasang di kebanyakan komputer):**
```bash
cd sinarmas-dashboard
python3 -m http.server 8000
```
Lalu buka `http://localhost:8000` di browser.

**Opsi B — VS Code:** install ekstensi "Live Server", klik kanan `index.html` →
"Open with Live Server".

## 6. Cara Deploy ke GitHub Pages

1. Buat repository baru di GitHub, upload semua file (pertahankan struktur folder).
2. Buka tab **Settings → Pages**.
3. Pada **Source**, pilih branch `main` dan folder `/ (root)`.
4. Simpan. Setelah beberapa menit, situs akan tersedia di:
   `https://<username>.github.io/<nama-repo>/`

## 7. Cara Mengganti Branding / Nama User

Semua ada di `config.js`:

```js
USER: {
  name: "Aditya Pratama",
  role: "Customer Care",
  initials: "AP",
},
BRAND: {
  name: "Sinarmas",
  subtitle: "multifinance",
  footer: "Sinarmas Multifinance",
},
```

## 8. Cara Kerja Sistem `{{variable}}`

- `shortcut.js` memakai regex generic `/\{\{\s*([^}]+)\s*\}\}/g` untuk
  mendeteksi semua pola `{{...}}` di dalam template — apapun nama
  variabelnya, termasuk yang belum pernah ada sebelumnya (mendukung nama
  dengan spasi, mis. `{{Nomor Kontrak}}`).
- Kalau template **tidak** punya `{{variable}}` sama sekali → hasil langsung
  auto-copy seperti biasa (kalau toggle Auto Copy aktif).
- Kalau template **punya** `{{variable}}` → muncul **pop-up (modal)** berisi
  form isian, satu kotak per nama variabel unik (variabel yang sama muncul
  berkali-kali cukup 1 kotak, semua kemunculan ikut terganti).
  - **Enter** di kolom manapun (kecuali kolom terakhir) → pindah fokus ke
    kolom berikutnya. **Tab** juga bisa dipakai.
  - **Enter** di kolom terakhir, atau klik **"Salin ke Clipboard"** → validasi
    semua kolom wajib terisi, lalu placeholder diganti dengan nilai yang
    diisi, pop-up tertutup, hasil ter-copy otomatis ke clipboard.
  - **Shift+Enter** → tetap di kolom yang sama (tidak pindah/submit).
  - Kolom yang masih kosong saat submit akan ditandai merah dan pop-up
    **tidak** tertutup, supaya tidak ada bagian yang lupa diisi.
  - Pop-up bisa ditutup manual lewat tombol ✕, klik area gelap di sekitarnya,
    atau tombol Escape.

### 8a. Variabel yang Dihitung Otomatis (Total Tenor / Sisa Angsuran)

Khusus untuk shortcut yang berhubungan dengan status angsuran (mis. `a1`),
sistem bisa menghitung **Sisa Angsuran** dan **Angsuran Berikutnya** secara
otomatis dari **Total Tenor** dan **Angsuran Terbayar** yang diisi CS — jadi
CS tidak perlu menghitung manual atau isi 2 kolom itu sendiri.

Supaya terdeteksi otomatis, pakai persis nama variabel berikut di
spreadsheet (tidak case-sensitive, spasi boleh berbeda):

| Variabel | Sifat | Keterangan |
|---|---|---|
| `{{Total Tenor}}` | Manual (wajib diisi) | Total tenor kontrak, angka bulat |
| `{{Angsuran Terbayar}}` | Manual (wajib diisi) | Boleh juga ditulis `{{Angsuran yang Telah Dibayarkan}}` |
| `{{Sisa Angsuran}}` | **Otomatis** | = Total Tenor − Angsuran Terbayar |
| `{{Angsuran Berikutnya}}` | **Otomatis** | = Angsuran Terbayar + 1 |

Contoh template `a1` yang benar (pastikan isi di Google Sheets memakai nama
variabel yang **berbeda-beda** seperti ini, bukan `{{angka}}` diulang-ulang —
karena nama yang sama dianggap 1 variabel yang sama oleh sistem):

```
Baik Bapak/Ibu {{Nama_Konsumen}}, kami bantu lakukan pengecekan pada sistem terkait status angsuran Bapak/Ibu, dengan informasi sebagai berikut:

▪️ Atas Nama: {{Nama}}
▪️ Nomor Virtual Account: {{VA}}
▪️ Nomor PPK: {{PPK}}
▪️ Total Tenor: {{Total Tenor}} Tenor
▪️ Angsuran yang Telah Dibayarkan: {{Angsuran Terbayar}} Tenor
▪️ Sisa Angsuran: {{Sisa Angsuran}} Tenor
▪️ Angsuran Berikutnya: Tenor ke-{{Angsuran Berikutnya}}
▪️ Tanggal Jatuh Tempo: {{Tanggal}} {{Bulan}} 2026

Kami mengingatkan kembali agar pembayaran angsuran dilakukan sebelum tanggal jatuh tempo untuk menghindari timbulnya denda keterlambatan.

Terima kasih telah menghubungi Customer Care Sinar Mas Multifinance. 🙏🏻
```

Perilaku di pop-up:
- Kolom **Total Tenor** & **Angsuran Terbayar** muncul sebagai input biasa
  (wajib diisi angka).
- Kolom **Sisa Angsuran** & **Angsuran Berikutnya** muncul dengan badge
  **"⚡ Otomatis"**, tampil read-only, dan **langsung ter-update setiap kali**
  Total Tenor / Angsuran Terbayar diketik (live preview) — tidak perlu
  di-submit dulu untuk melihat hasilnya.
- Kalau Angsuran Terbayar diisi lebih besar dari Total Tenor, atau salah
  satunya bukan angka, sistem menolak submit dan menandai kolom yang salah.
- Logic ini ada di `ShortcutComponent.classifyVariables()` (`shortcut.js`)
  dan dipakai oleh `app.js` saat merender & memvalidasi pop-up.

## 9. Data Cabang

- Menu **"Data Cabang"** di sidebar menampilkan halaman pencarian alamat &
  nomor telepon seluruh cabang Sinarmas Multifinance.
- Datanya **di-bundel statis** di `cabang-data.js` (bukan fetch live ke
  website resmi), supaya pencarian tetap cepat dan tidak terganggu CORS /
  situs sedang down. Sumber data: `https://www.simasfinance.co.id/cabang-kami`.
- Ketik nama kota atau cabang → Enter/klik Cari → muncul kartu hasil dengan
  tombol **"Salin Alamat"** dan tombol kecil untuk salin nomor telepon.
- Kalau ada cabang baru / alamat berubah, edit langsung array di
  `cabang-data.js` (format: `{ nama, telepon, kota, alamat }`).

## 10. Fitur Lain yang Perlu Diketahui

- **Auto Copy**: exact match kode shortcut langsung ter-copy ke clipboard.
  Bisa dimatikan sementara lewat toggle "Auto Copy" di atas hasil pencarian.
- **Pencarian sebagian**: mengetik `bpkb` (bukan kode exact) akan menampilkan
  daftar kandidat tanpa auto-copy, supaya tidak salah menyalin.
- **Cache**: data spreadsheet disimpan di `sessionStorage` selama 5 menit
  (bisa diubah lewat `CONFIG.CACHE_TTL_MS`) supaya pencarian berikutnya lebih
  cepat. Tombol **Refresh Data** di sidebar kanan akan memaksa ambil data
  terbaru dari spreadsheet.
- **Keyboard-first**: `Ctrl+K` (atau `Cmd+K` di Mac) langsung fokus ke kolom
  pencarian dari mana saja di halaman.
- **Fallback manual copy**: jika browser menolak Clipboard API, notifikasi
  error muncul dan tombol "Copy" manual tetap tersedia di kartu hasil.
