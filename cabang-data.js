/**
 * cabang-data.js
 * ---------------
 * Data alamat & kontak seluruh cabang Sinarmas Multifinance.
 * Sumber: https://www.simasfinance.co.id/cabang-kami
 *
 * Ini data STATIS (bukan hasil fetch live ke website tsb), supaya:
 *   1. Pencarian tetap cepat & tidak tergantung situs itu online/offline.
 *   2. Tidak terblokir CORS (server publik biasanya tidak mengizinkan
 *      fetch lintas-domain dari browser pihak lain).
 *
 * Kalau ada cabang baru / alamat berubah, cukup edit array di bawah ini
 * (atau minta bantuan update ulang dari halaman resminya).
 */

const CABANG_DATA = [
  {
    "nama": "Ambon",
    "telepon": "0911-343472",
    "kota": "Ambon",
    "alamat": "Gedung Bank Sinarmas Lt. 4, Jln. Ahmad Yani RT/RW 001/006 Kelurahan Batu Meja Kecamatan Sirimau"
  },
  {
    "nama": "Asahan",
    "telepon": "0623-347776",
    "kota": "Asahan",
    "alamat": "Gedung Bank Sinarmas Lt. 4, Jl. HOS Cokroaminoto No. 72 C Kisaran, Kel. Kisaran Kota, Kec. Kota Kisaran Barat"
  },
  {
    "nama": "Balik Papan",
    "telepon": "0542-733931",
    "kota": "Balikpapan",
    "alamat": "Jl. Jend Sudirman No. 1B - 1C Pasar Baru"
  },
  {
    "nama": "Banda Aceh",
    "telepon": "0651-7559123",
    "kota": "Banda Aceh",
    "alamat": "Jl. DR. Mr. H. T. Mohd Hasan No. 330 Biang Cut, Kec. Lueng Bata Kode Pos 23245"
  },
  {
    "nama": "Bandung",
    "telepon": "022-4266660",
    "kota": "Bandung",
    "alamat": "Jln. Abdul Rivai No. 2 Bandung"
  },
  {
    "nama": "Banjar",
    "telepon": "0265-2732505",
    "kota": "Banjar",
    "alamat": "Gedung Bank Sinarmas Lt. 3, Jln. Letjen Soewarto No. 97 Lingkungan Gudang RT 05 RW 04, Kel. Hegarsari, Kec. Pataruman, Kota Banjar 46322"
  },
  {
    "nama": "Banjarmasin",
    "telepon": "0511-3364642",
    "kota": "Banjarmasin",
    "alamat": "Gedung Bank Sinarmas Lt.3 Jl. Haryono MT No.40 Rt.06 Kel. Kertak Baru Ilir Banjarmasin 70111"
  },
  {
    "nama": "Banyuwangi",
    "telepon": "0333-419766",
    "kota": "Banyuwangi",
    "alamat": "Jl. Basuki Rahmat No 61, Gedung Bank Sinarmas Lt. 3"
  },
  {
    "nama": "Batam",
    "telepon": "0778-7481212",
    "kota": "Batam",
    "alamat": "Komplek Ruko Reflesia Business Centre Blok F No. 01 Batam Centre"
  },
  {
    "nama": "Bekasi",
    "telepon": "021-50588888 ext. 5111",
    "kota": "Bekasi",
    "alamat": "Grand Galaxy City, Jl. Rukan Sentra Niaga 7 No. 026, Jaka Setia, Kec. Bekasi Selatan, Jawa Barat - 17147"
  },
  {
    "nama": "Bekasi (Cikarang)",
    "telepon": "021-29082834",
    "kota": "Bekasi (Cikarang)",
    "alamat": "Jl Niaga Raya Ruko Metro Boulevard Kav A 11 Jababeka II Cikarang Bekasi"
  },
  {
    "nama": "Bengkulu",
    "telepon": "0736-25025",
    "kota": "Bengkulu",
    "alamat": "Gedung Bank Sinarmas Lt3 Jl Jati No.16 Kel sawah Lebar Kec Ratu Agung (Kp:38222)"
  },
  {
    "nama": "Bima",
    "telepon": "0374-42942",
    "kota": "Bima",
    "alamat": "JL.Gajah Mada No.6 Karara, Monggonao Mpunda, Bima-NTB"
  },
  {
    "nama": "Bitung",
    "telepon": "0438-35486",
    "kota": "Bitung",
    "alamat": "Jl. Wolter Monginsidi No. 13D, Gedung Bank Sinarmas Lt. 2, Kel. Wangurer Timur, Kec. Madidir, Kota Bitung 95541"
  },
  {
    "nama": "Bogor",
    "telepon": "0251-8354291",
    "kota": "Bogor",
    "alamat": "Jl.Pandu Raya No.77 / Achmad Adnawijaya No.77 Kp.Ceger Rt.001/Rw.11, Kel.Tegal Gundil Kec.Bogor Utara - Bogor"
  },
  {
    "nama": "Bojonegoro",
    "telepon": "0353-5254856",
    "kota": "Bojonegoro",
    "alamat": "Jalan Untung Suropati Nomor 53, Sumbang, Bojonegoro, Jawa Timur"
  },
  {
    "nama": "Bukit Tinggi",
    "telepon": "0752-31744",
    "kota": "Bukit Tinggi",
    "alamat": "Ged Bank Sinarmas Lt.3 jalan ahmad karim no 18C"
  },
  {
    "nama": "Bumiayu",
    "telepon": "0289-432007",
    "kota": "Bumiayu",
    "alamat": "Jl. Raya Utara No.77 Dukuhturi Bumiayu"
  },
  {
    "nama": "Ciamis",
    "telepon": "0265-774949",
    "kota": "Ciamis",
    "alamat": "Gedung Bank Sinarmas Lantai 2, Jl. Jenderal Sudirman No.163 RT.04/RW.02, Kelurahan Ciamis, Kecamatan Ciamis, Kabupaten Ciamis, Provinsi Jawa Barat."
  },
  {
    "nama": "Cianjur",
    "telepon": "0263-2292920",
    "kota": "Cianjur",
    "alamat": "Gedung Bank Sinarmas Lt.3, Jl. Dr. Muwardi No. 173"
  },
  {
    "nama": "Cilacap",
    "telepon": "0282-533118",
    "kota": "Cilacap",
    "alamat": "Jl Gatot Subroto No. 42/44 RT 01/RW 10 Kel Sidanegara Kec Cilacap Tengah"
  },
  {
    "nama": "Cirebon",
    "telepon": "0231-246678",
    "kota": "Cirebon",
    "alamat": "Gedung Bank Sinarmas Lt.3 Jl Dr Wahidin Sudiro Husodo No.29"
  },
  {
    "nama": "Denpasar",
    "telepon": "0361-233332",
    "kota": "Denpasar",
    "alamat": "Jl. Tantular No. 8 Renon, Graha Sinarmas Lantai 3, Denpasar-Bali"
  },
  {
    "nama": "Depok",
    "telepon": "021-77215068",
    "kota": "Depok",
    "alamat": "JL. Margonda Raya No 56 Ruko ITC Depok No 18"
  },
  {
    "nama": "Dumai",
    "telepon": "0765-37770",
    "kota": "Dumai",
    "alamat": "Jl. Jendral Sudirman No. 248 RT. 002 Kel. Teluk Binjai Kec. Dumai Timur Kota Dumai"
  },
  {
    "nama": "Ende",
    "telepon": "0381-2627543",
    "kota": "Ende",
    "alamat": "Jalan Kelimutu no.58, Keluruhan Kelimutu, Kecamatan Ende Tengah, Kabupaten Ende, NTT"
  },
  {
    "nama": "Garut",
    "telepon": "0262-442211",
    "kota": "Garut",
    "alamat": "Gedung Bank Sinarmas lt.3 Jl. Ciledug No 180 Garut"
  },
  {
    "nama": "Gianyar",
    "telepon": "0361-943345",
    "kota": "Gianyar",
    "alamat": "Jl. Patih jelantik No. 92 Gianyar"
  },
  {
    "nama": "Gorontalo",
    "telepon": "0435-826122",
    "kota": "Gorontalo",
    "alamat": "Jl. Prof Dr HB Jassin No. 11 Kel. Limba Kec. Kota Selatan, Gorontalo - 96115"
  },
  {
    "nama": "Gresik",
    "telepon": "031-21000519",
    "kota": "Gresik",
    "alamat": "Kartini Building Lantai 3, Jl. RA kartini 236 Kav. 7, Kabupaten Gresik, Provinsi Jawa Timur"
  },
  {
    "nama": "Indramayu",
    "telepon": "021-50588888 ext. 5291",
    "kota": "Indramayu",
    "alamat": "Gedung bank sinarmas lt 3, Jln. Jendral Sudirman no 93 Indramayu"
  },
  {
    "nama": "Jakarta (BSD)",
    "telepon": "021-53161273",
    "kota": "Jakarta (BSD)",
    "alamat": "Jl. Pahlawan Seribu BSD City Ruko Golden Boulevard Blok GI No.6-7"
  },
  {
    "nama": "Jakarta (Cempaka Mas)",
    "telepon": "021-50588888 ext. 5191",
    "kota": "Jakarta (Cempaka Mas)",
    "alamat": "Ruko Mega Grosir Cempaka Mas Blok L5, Jl. LetJend Suprapto Cempaka Putih"
  },
  {
    "nama": "Jakarta (Fatmawati)",
    "telepon": "021-40042828",
    "kota": "Jakarta (Fatmawati)",
    "alamat": "Jl. R.S. Fatmawati No 15 Blok B No 22"
  },
  {
    "nama": "Jambi",
    "telepon": "0741-7551499",
    "kota": "Jambi",
    "alamat": "Gedung Bank Sinarmas, Lantai 4 Jl. Hayam Wuruk No.147, Kel.Talang Jauh, Kec. Jelutung, Jambi"
  },
  {
    "nama": "Jember",
    "telepon": "0331-421755",
    "kota": "Jember",
    "alamat": "Jl. PB Sudirman No 22, Gedung Bank Sinarmas Lt. 3, Sinarmas Multifinance"
  },
  {
    "nama": "Jombang",
    "telepon": "00321-8490226",
    "kota": "Jombang",
    "alamat": "Jalan Gatot Subroto Nomor 126 RT 001/001, Desa Mojongapit, Jombang, Jombang, Jawa Timur"
  },
  {
    "nama": "Karawang",
    "telepon": "0267-8454484",
    "kota": "Karawang",
    "alamat": "Gedung Bank Sinarmas Syariah Lt. 3, Jl. Tuparev No.409 Kelurahan Karawang Wetan Kec. Karawang Timur 41314"
  },
  {
    "nama": "Kebumen",
    "telepon": "0287-382017",
    "kota": "Kebumen",
    "alamat": "Jl. Mayjend Sutoyo No. 41 RT006/RW006 Kel. Kebumen Kec. Kebumen"
  },
  {
    "nama": "Kediri",
    "telepon": "0354-699285",
    "kota": "Kediri",
    "alamat": "Jl. Erlangga No 34-36, Gedung Bank Sinarmas Lt. 3, Sinarmas Multinance"
  },
  {
    "nama": "Kendari",
    "telepon": "021-50588888 ext. 5371",
    "kota": "Kendari",
    "alamat": "Jl. MT Haryono No. 88A, Kel. Wowowanggu Kec. Kadia, Gedung Bank sinarmas Lt.4 Kendari"
  },
  {
    "nama": "Klaten",
    "telepon": "0272-3359457",
    "kota": "Klaten",
    "alamat": "Jalan Rajawali No.113 RT 008/001 Kelurahan Kabupaten Kecamatan Klaten Tengah, Kabupaten Klaten, Jawa Tengah"
  },
  {
    "nama": "Kota Baru",
    "telepon": "0518-74242",
    "kota": "Kota Baru",
    "alamat": "Jl. Raya Batulicin Rt 01 Rw 07 Kec. Simpang Empat Batulicin Kab. Tanah Bumbu Kalsel 72171"
  },
  {
    "nama": "Kota Waringin Barat",
    "telepon": "0532-24189",
    "kota": "Kota Waringin Barat",
    "alamat": "Jl. Udan Said No.01 Gedung Bank Sinarmas Lantai 3 Kota Waringin Barat Pangkalan Bun 74111"
  },
  {
    "nama": "Kudus",
    "telepon": "0291-446284",
    "kota": "Kudus",
    "alamat": "Ruko Ahmad Yani Kav. 16 Kudus"
  },
  {
    "nama": "Kuningan",
    "telepon": "0232-872413",
    "kota": "Kuningan",
    "alamat": "Jln. Siliwangi No. 273 B Lt. 2 Kuningan"
  },
  {
    "nama": "Kupang",
    "telepon": "0380-830003",
    "kota": "Kupang",
    "alamat": "Gedung Bank Sinar Mas Lt 3 Jl. Flores No. 08, Oeba - Kupang - NTT"
  },
  {
    "nama": "Lahat",
    "telepon": "0731-322788",
    "kota": "Lahat",
    "alamat": "Jl. Mayor Ruslan III No. 92 Rt. 04 Rw. 02 Kel. Pasar Lama Kec. Lahat"
  },
  {
    "nama": "Lampung",
    "telepon": "0721 473768",
    "kota": "Lampung",
    "alamat": "Gedung Bank Sinarmas Lantai 3 Jalan Ikan Hiu No.03, Teluk Betung Bandar Lampung Lampung"
  },
  {
    "nama": "Lombok Tengah",
    "telepon": "0370-655880",
    "kota": "Lombok Tengah",
    "alamat": "Jl. Soekarno Hatta Kel. Kauman Praya-Lombok Tengah"
  },
  {
    "nama": "Lubuk Linggau",
    "telepon": "0733-452124",
    "kota": "Lubuk Linggau",
    "alamat": "Jln.Yos Sudarso No.12 Kel.Marga Rahayu Kec. Lubuk linggau Selatan II Lubuk Linggau Sumatera Selatan"
  },
  {
    "nama": "Madiun",
    "telepon": "0351-499756",
    "kota": "Madiun",
    "alamat": "Jl. Sumatera No 25-26, Gedung Bank Sinarmas Lt. 3, Sinarmas Multifinance"
  },
  {
    "nama": "Magelang",
    "telepon": "0293-366999",
    "kota": "Magelang",
    "alamat": "Gedung Bank Sinarmas Lt. 3 Jl. A.Yani No.77 Kedungsari Kramat Selatan, Magelang Utara"
  },
  {
    "nama": "Majalengka",
    "telepon": "0233-8890055",
    "kota": "Majalengka",
    "alamat": "Jln. K.H. Abdul Halim No. 149 Majalengka"
  },
  {
    "nama": "Makassar",
    "telepon": "0411-4662510",
    "kota": "Makassar",
    "alamat": "Jl. Pengayoman No. 182, Gedung Bank Sinarmas lt.4, Makassar"
  },
  {
    "nama": "Malang",
    "telepon": "0341-359990",
    "kota": "Malang",
    "alamat": "Jl. Basuki Rachmat No 58, Gedung Bank Sinarmas Lt.3, Sinarmas Multifinance"
  },
  {
    "nama": "Mamuju",
    "telepon": "0426-2323281",
    "kota": "Mamuju",
    "alamat": "Jl. KS. Tubun Lingk. Rimuku Kec. Rimuku Kab. Mamuju Gd. Bank Sinarmas lt. 03"
  },
  {
    "nama": "Manado",
    "telepon": "0431-844414",
    "kota": "Manado",
    "alamat": "Jl. Sam Ratulangi No. 18 Gedung Bank Sinarmas lt. 4 Manado"
  },
  {
    "nama": "Mataram",
    "telepon": "0370-620152",
    "kota": "Mataram",
    "alamat": "Gedung Bank Sinarmas Lantai 3, Jl. Pejanggik No. 24 Mataram-Lombok"
  },
  {
    "nama": "Medan",
    "telepon": "061-4523562",
    "kota": "Medan",
    "alamat": "PT Sinarmas Multifinance, Gedung Wisma Simas, Jl Mangkubumi No 18 Lantai 6, Kel Aur, Kec Medan Maimun, KODE POS 20151"
  },
  {
    "nama": "Mojokerto",
    "telepon": "0321-325558",
    "kota": "Mojokerto",
    "alamat": "Jl. Empunala No 85, Balongsari Magersari, Gedung Bank Sinarmas Lt. 2, Sinarmas Multifinance"
  },
  {
    "nama": "Muaro Bungo",
    "telepon": "0747-323666",
    "kota": "Muaro Bungo",
    "alamat": "Jl. Rangkayo Hitam RT.021 RW.004 Kel. Bungo Timur Kec. Pasar Muara Bungo Kab. Muara Bungo - Jambi 37212"
  },
  {
    "nama": "Ogan Komering Ulu (Baturaja)",
    "telepon": "021-50588888 ext. 5101",
    "kota": "Ogan Komering Ulu (Baturaja)",
    "alamat": "Jl. Jend A. Yani RT 034 Kel. Baturaja Lama, Kec. Baturaja Timur, Kab. Ogan Komering Ulu Sumsel"
  },
  {
    "nama": "Padang",
    "telepon": "0751-37444",
    "kota": "Padang",
    "alamat": "Jl.Bagindo Aziz Chan No.13 Lt 2 Rt/Rw 02/01 Kel.Kampung Jao Kec.Padang Barat"
  },
  {
    "nama": "Padang Sidempuan",
    "telepon": "0634-26330",
    "kota": "Padang Sidempuan",
    "alamat": "Jl. Sudirman Eks Merdeka, Komplek City Walk Blok C NO. 10 Lat 3 Padansidimpuan Utara"
  },
  {
    "nama": "Palangkaraya",
    "telepon": "0536-3228883",
    "kota": "Palangkaraya",
    "alamat": "Jl. Imam Bonjol No.19 F RT.02 RW.07 Kel. Langkai, Kec. Pahandut Palangka Raya"
  },
  {
    "nama": "Palembang",
    "telepon": "0711-350929",
    "kota": "Palembang",
    "alamat": "Jln Basuki Rahmat No 1675 RT 025 RW 10, Kel. Pahlawan, Kec. Kemuning 30128"
  },
  {
    "nama": "Palopo",
    "telepon": "021-50588888 ext. 5631",
    "kota": "Palopo",
    "alamat": "Jalan Kelapa, Kelurahan Lagaligo, Kecamatan Wara, Kota Palopo. Sulawesi Selatan"
  },
  {
    "nama": "Palu",
    "telepon": "0451-457989",
    "kota": "Palu",
    "alamat": "Jl. Mesjid Raya No. 10, Gedung Bank Sinarmas Lt. 4 Palu Sul Teng 94121"
  },
  {
    "nama": "Pangkal Pinang",
    "telepon": "071-74256828",
    "kota": "Pangkal Pinang",
    "alamat": "Gedung Bank Sinarmas Lt 3, JL. Raya Koba Km. 5 Rt.14/05 Kel.Dul Kec.Pangkalan Baru Kab.Bangka Tangah, Bangka Belitung"
  },
  {
    "nama": "Pare-pare",
    "telepon": "0421-243466",
    "kota": "Pare-pare",
    "alamat": "Jl. Veteran No.40 Gedung Bank Sinarmas Lt. 03 Pare - Pare"
  },
  {
    "nama": "Pekalongan",
    "telepon": "021-50588888 ext. 5681",
    "kota": "Pekalongan",
    "alamat": "Gedung Bank Sinarmas Lantai 3, Jl. Dr Cipto No 39 Keputran"
  },
  {
    "nama": "Pekanbaru",
    "telepon": "0761-7892161",
    "kota": "Pekanbaru",
    "alamat": "Gedung Bank Sinarmas Lt.3, Jl. Riau No.105, Kel.Padang Terubuk, Kec.Senapelan, Pekanbaru 28155"
  },
  {
    "nama": "Pontianak",
    "telepon": "0561-581052",
    "kota": "Pontianak",
    "alamat": "Jl Adi Sucipto No.10 Km.04 Gedung Bank Sinarmas Lantai 3 Pontianak 78124 Kalimantan Barat"
  },
  {
    "nama": "Prabumulih",
    "telepon": "0713-320355",
    "kota": "Prabumulih",
    "alamat": "Jl. Jend Sudirman No.70-71 Gedung Bank Sinarmas Lt.2, Kel Muara Dua, Kec.Prabumulih Timur 31114"
  },
  {
    "nama": "Purwakarta",
    "telepon": "0264-8225993",
    "kota": "Purwakarta",
    "alamat": "JL.Veteran No.98 RT.46/05 Nagrikaler Purwakarta"
  },
  {
    "nama": "Purwokerto",
    "telepon": "021-50588888 ext. 5871",
    "kota": "Purwokerto",
    "alamat": "Jl RA Wiryaatmaja No 28"
  },
  {
    "nama": "Rantau Prapat",
    "telepon": "0624-351337",
    "kota": "Rantau Prapat",
    "alamat": "Jl. Sisingamangaraja, Kel. Aek Tapa, Rantauprapat"
  },
  {
    "nama": "Salatiga",
    "telepon": "0298-327799",
    "kota": "Salatiga",
    "alamat": "Gedung Bank Sinarmas Lantai 3, Ruko Diponegoro Bisnis Square, Jl. Diponegoro No. 77 J-K"
  },
  {
    "nama": "Samarinda",
    "telepon": "0541-7776957",
    "kota": "Samarinda",
    "alamat": "Jl.P.Antasari No. 9, RT 062, Kel.Teluk Lerong Ulu, Kec.Sungai Kunjang, Kal-Tim"
  },
  {
    "nama": "Sarolangun",
    "telepon": "0745-91321",
    "kota": "Sarolangun",
    "alamat": "Jl.Lintas Sumatera Km 1 Kel.Aur Gading, Sarolangun"
  },
  {
    "nama": "Selong",
    "telepon": "021-50588888 ext. 5811",
    "kota": "Selong",
    "alamat": "Jl TGKH Zaenudin Abdul Majid No 67 Pancor"
  },
  {
    "nama": "Semarang",
    "telepon": "024-8502933",
    "kota": "Semarang",
    "alamat": "Gedung Bank Sinarmas Lantai.3, Jl. Dr. Wahidin No. 62B"
  },
  {
    "nama": "Siantar",
    "telepon": "0622-434968",
    "kota": "Siantar",
    "alamat": "PT.Sinarmas Multifinance LT.3 Jl.Hos Cokroaminto No.54 P.Siantar"
  },
  {
    "nama": "Sidoarjo",
    "telepon": "031-8075088",
    "kota": "Sidoarjo",
    "alamat": "Jl. A. Yani No. 24 Kel. Sidokumpul Kec. Sidoarjo Kota Sidoarjo"
  },
  {
    "nama": "Sikka",
    "telepon": "021-50588888 ext. 5531",
    "kota": "Sikka",
    "alamat": "Gedung Sinarmas Lt II, Jalan Jendral Sudirman, Waioti, Maumere, Flores, Nusa Tenggara Timur"
  },
  {
    "nama": "Singaraja",
    "telepon": "0362-23329",
    "kota": "Singaraja",
    "alamat": "Jl. Ngurah Rai No. 8A, Gedung Sinarmas Lantai 3 Singaraja-Bali"
  },
  {
    "nama": "Solo",
    "telepon": "0271 630222",
    "kota": "Solo",
    "alamat": "Gedung Bank Sinarmas Lt.3 Jl. Urip Sumoharjo No.163, Kec. Jebres, Kel. Kepatihan Wetan"
  },
  {
    "nama": "Sragen",
    "telepon": "0271-88233367",
    "kota": "Sragen",
    "alamat": "Jalan Raya Sukowati Nomor 60, Beloran RT 03/12, Sragen Kulon, Sragen, Jawa Tengah"
  },
  {
    "nama": "Subang",
    "telepon": "0260-414448",
    "kota": "Subang",
    "alamat": "Gedung Sinarmas Jln. Otista No. 252 Lt. 3 Subang"
  },
  {
    "nama": "Sukabumi",
    "telepon": "0266-246544",
    "kota": "Sukabumi",
    "alamat": "Jl R.A Kosasih No 118 Gedung Bank Sinarmas Lt 3 Ciaul Sukabumi"
  },
  {
    "nama": "Sumedang",
    "telepon": "0261-205345",
    "kota": "Sumedang",
    "alamat": "Jln. Mayor Abdurahman No. 199 Sumedang"
  },
  {
    "nama": "Sungai Liat",
    "telepon": "0717-92877",
    "kota": "Sungai Liat",
    "alamat": "Ruko Sutos Town Square No. 3c, Jalan Muhidin Air Hanyut Kecamatan Sungai Liat, Kabupaten Bangka Induk, Provinsi Kepulauan Bangka Belitung"
  },
  {
    "nama": "Surabaya",
    "telepon": "031-5610588",
    "kota": "Surabaya",
    "alamat": "Jl. Diponegoro 64, Gedung Bank Sinarmas Lt. 4, Sinarmas Multifinance"
  },
  {
    "nama": "Tabanan",
    "telepon": "0361-8941882",
    "kota": "Tabanan",
    "alamat": "Jl. Ahmad Yani No. 2 Lt. III, Kediri, Tabanan - Bali"
  },
  {
    "nama": "Tanjung Pandan",
    "telepon": "0719-22910",
    "kota": "Tanjung Pandan",
    "alamat": "Jl. Jend. Sudirman No. 21 Rt.008/004 Kel. Pangkallalang Kec. Tanjungpandan 33412"
  },
  {
    "nama": "Tanjung Pinang",
    "telepon": "0771-314036",
    "kota": "Tanjung Pinang",
    "alamat": "Gedung Sinarmas Lt. 3 Jl. Engku Putri no. 41, Tanjungpinang Kepulauan riau 29123"
  },
  {
    "nama": "Tasikmalaya",
    "telepon": "0265-344945",
    "kota": "Tasikmalaya",
    "alamat": "Jln. Sutisna Sanjaya No. 65 Gd. Bank Sinarmas Lt. 3 Tasikmalaya"
  },
  {
    "nama": "Tegal",
    "telepon": "0283-322478",
    "kota": "Tegal",
    "alamat": "Ruko Nirmala Estate Jl.Yos Sudarso No.20 Kav 7-8 A Kode Pos 52181"
  },
  {
    "nama": "Ternate",
    "telepon": "0921-3122133",
    "kota": "Ternate",
    "alamat": "Jln. Kamboja No 55 A, Kel. Tokoma - Gedung Bank Sinarmas Lt. 4 Ternate Tengah"
  },
  {
    "nama": "Tomohon",
    "telepon": "0853-98138102",
    "kota": "Tomohon",
    "alamat": "Gedung Bank Sinar Mas Lantai 2, Jalan Babe Palar, Kelurahan Matani, Kecamatan Tomohon Tengah, Kota Tomohon, Sulawesi Utara"
  },
  {
    "nama": "Tuban",
    "telepon": "0356-333060",
    "kota": "Tuban",
    "alamat": "Jl. Basuki Rachmat No 42, Gedung Bank Sinarmas Lt. 3, Sinarmas Multifinance"
  },
  {
    "nama": "Tulungagung",
    "telepon": "0355-324651",
    "kota": "Tulungagung",
    "alamat": "Jl. I Gusti Ngurah Rai No 63, Gedung Bank Sinarmas Lt. 2, Sinarmas Multifinance"
  },
  {
    "nama": "Wonogiri",
    "telepon": "0273-3201056",
    "kota": "Wonogiri",
    "alamat": "Jalan Jend. Sudirman Nomor 221 RT.004/001, Bauresan, Giritirto, Wonogiri, Jawa Tengah"
  },
  {
    "nama": "Yogyakarta",
    "telepon": "0274-557222",
    "kota": "Yogyakarta",
    "alamat": "Jl. Ring Road Utara Rt.28 Rw.16 Condongcatur Sleman Yogyakarta"
  },
  {
    "nama": "Jayapura",
    "telepon": "0967-5165257",
    "kota": "Jayapura",
    "alamat": "Jalan Bhayangkara Komplek ruko pasifik permai Blok F 7-8, Jayapura 99112"
  },
  {
    "nama": "Nabire",
    "telepon": "0984-2721119",
    "kota": "Nabire",
    "alamat": "Gedung Bank Sinarmas Lt.3 Jl Merdeka Ruko JDF No.1, Nabire 98815"
  },
  {
    "nama": "Merauke",
    "telepon": "0971-3335113",
    "kota": "Merauke",
    "alamat": "Gedung Bank Sinar Mas Lantai 3 Jl. Mandala Raya No.428 Rt.004/RW.001 Mandala, Merauke 99616"
  },
  {
    "nama": "Sorong",
    "telepon": "0951-3171870",
    "kota": "Sorong",
    "alamat": "Gedung Bank Sinarmas KC Sorong, Jl. A. Yani Klademak I No. 3, RT 04 RW 06, Kel. Klakubik, Distrik Sorong Kota, Kota Sorong 98414"
  }
];
