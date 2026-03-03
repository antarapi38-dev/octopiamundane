// ASET (18 item):
export const mockAssets = [
  { id:1,  nama:"Rumah Jl. Merdeka No.12",  kategori:"properti",   nilai:2100000000, status:"verified" },
  { id:2,  nama:"Rekening BCA",              kategori:"perbankan",  nilai:540000000,  status:"verified" },
  { id:3,  nama:"Rekening Mandiri",          kategori:"perbankan",  nilai:300000000,  status:"verified" },
  { id:4,  nama:"Portofolio Saham IDX",      kategori:"investasi",  nilai:420000000,  status:"pending"  },
  { id:5,  nama:"Reksa Dana Schroders",      kategori:"investasi",  nilai:200000000,  status:"verified" },
  { id:6,  nama:"Toyota Fortuner 2022",      kategori:"kendaraan",  nilai:480000000,  status:"verified" },
  { id:7,  nama:"Honda Jazz 2019",           kategori:"kendaraan",  nilai:160000000,  status:"verified" },
  { id:8,  nama:"Bitcoin (0.8 BTC)",         kategori:"kripto",     nilai:120000000,  status:"draft"    },
  { id:9,  nama:"Ethereum (5 ETH)",          kategori:"kripto",     nilai:60000000,   status:"draft"    },
  { id:10, nama:"Ruko Blok M",               kategori:"properti",   nilai:1800000000, status:"pending"  },
  { id:11, nama:"Tanah Depok 200m²",         kategori:"properti",   nilai:800000000,  status:"verified" },
  { id:12, nama:"Deposito BRI",              kategori:"perbankan",  nilai:200000000,  status:"verified" },
  { id:13, nama:"Obligasi Negara FR",        kategori:"investasi",  nilai:150000000,  status:"verified" },
  { id:14, nama:"Logam Mulia 100gr",         kategori:"lainnya",    nilai:95000000,   status:"verified" },
  { id:15, nama:"Piutang Usaha",             kategori:"lainnya",    nilai:75000000,   status:"draft"    },
  { id:16, nama:"Motor Yamaha NMAX",         kategori:"kendaraan",  nilai:28000000,   status:"verified" },
  { id:17, nama:"Asuransi Jiwa BNI Life",    kategori:"lainnya",    nilai:500000000,  status:"pending"  },
  { id:18, nama:"BPJS Ketenagakerjaan",      kategori:"lainnya",    nilai:45000000,   status:"verified" },
]

// AHLI WARIS (5 orang):
export const mockHeirs = [
  { id:1, nama:"Sri Kartono",   hubungan:"Istri",           gender:"perempuan", status:"verified", bagian:"1/8",        nominal:702375000  },
  { id:2, nama:"Rizky Kartono", hubungan:"Anak Laki-laki",  gender:"laki",      status:"verified", bagian:"2× Asabah",  nominal:2458500000 },
  { id:3, nama:"Ahmad Kartono", hubungan:"Anak Laki-laki",  gender:"laki",      status:"pending",  bagian:"2× Asabah",  nominal:2458500000 },
  { id:4, nama:"Dewi Kartono",  hubungan:"Anak Perempuan",  gender:"perempuan", status:"verified", bagian:"1× Asabah",  nominal:1229250000 },
  { id:5, nama:"Ibu Sari",      hubungan:"Ibu Kandung",     gender:"perempuan", status:"verified", bagian:"1/6",        nominal:1229250000 },
]

// DOKUMEN (8 item):
export const mockDocuments = [
  { id:1, nama:"SHM Rumah Merdeka",      tipe:"SHM",    ukuran:"2.4 MB", status:"valid",    exp:null         },
  { id:2, nama:"BPKB Toyota Fortuner",   tipe:"BPKB",   ukuran:"1.1 MB", status:"valid",    exp:null         },
  { id:3, nama:"KTP Budi Kartono",       tipe:"KTP",    ukuran:"890 KB", status:"valid",    exp:"2028-03-10" },
  { id:4, nama:"Kartu Keluarga",         tipe:"KK",     ukuran:"1.2 MB", status:"valid",    exp:null         },
  { id:5, nama:"Polis Asuransi BNI",     tipe:"Polis",  ukuran:"3.1 MB", status:"expired",  exp:"2026-02-01" },
  { id:6, nama:"Bukti Kepemilikan BTC",  tipe:"Kripto", ukuran:"450 KB", status:"draft",    exp:null         },
  { id:7, nama:"SHM Ruko Blok M",        tipe:"SHM",    ukuran:"2.8 MB", status:"valid",    exp:null         },
  { id:8, nama:"STNK Fortuner",          tipe:"STNK",   ukuran:"600 KB", status:"expiring", exp:"2026-04-15" },
]

// NOTIFIKASI (5 item):
export const mockNotifications = [
  { id:1, tipe:"danger",  judul:"Polis Asuransi Kedaluwarsa",        pesan:"Perbarui sebelum 5 Mar 2026",              dibaca:false },
  { id:2, tipe:"warning", judul:"Konfirmasi Ahli Waris: Ahmad",       pesan:"Verifikasi KTP masih menunggu",            dibaca:false },
  { id:3, tipe:"info",    judul:"Saran AI: Lengkapi Dokumen Kripto",  pesan:"BTC & ETH Rp 180jt belum terdokumentasi", dibaca:false },
  { id:4, tipe:"success", judul:"Pembayaran Berhasil",                pesan:"Premium aktif hingga 31 Mar 2026",         dibaca:true  },
  { id:5, tipe:"warning", judul:"STNK Fortuner Segera Habis",         pesan:"Berlaku hingga 15 Apr 2026",               dibaca:true  },
]

// TRANSAKSI PEMBAYARAN (4 item):
export const mockTransactions = [
  { id:"INV-001", layanan:"Premium Plan",       jumlah:99000,     status:"paid",    tanggal:"1 Feb 2026"  },
  { id:"INV-002", layanan:"Konsultasi Notaris", jumlah:350000,    status:"paid",    tanggal:"20 Jan 2026" },
  { id:"INV-003", layanan:"Premium Plan",       jumlah:99000,     status:"paid",    tanggal:"1 Jan 2026"  },
  { id:"INV-004", layanan:"Transfer Waris",     jumlah:700000000, status:"pending", tanggal:"28 Feb 2026" },
]
