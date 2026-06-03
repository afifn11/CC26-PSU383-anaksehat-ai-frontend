// ============================================================
// MOCK DATA — AnakSehat AI
// Ganti dengan API calls nyata saat backend sudah siap
// ============================================================

export const mockUsers = {
  kader: {
    id: 'USR-K001',
    nama: 'Sri Aminah',
    email: 'sriam@posyandu.id',
    role: 'kader',
    wilayah_posyandu: 'Posyandu Melati – Kel. Sukamaju',
    avatar: null,
  },
  orangtua: {
    id: 'USR-OT001',
    nama: 'Siti Rahayu',
    email: 'siti@gmail.com',
    role: 'orangtua',
    avatar: null,
  },
}

export const mockBalita = [
  {
    id: 'BAL-001',
    nama: 'Arkan Alfatino',
    tanggal_lahir: '2023-04-15',
    jenis_kelamin: 'Laki-laki',
    usia_bulan: 24,
    berat_badan: 11.2,
    tinggi_badan: 82,
    lingkar_kepala: 47,
    nama_ibu: 'Ibu Sari Melati',
    last_prediksi: {
      id: 'PRED-001',
      tanggal: '2025-04-12',
      hasil_risiko: 'Normal',
      haz_score: -0.8,
    },
  },
  {
    id: 'BAL-002',
    nama: 'Naura Azalea',
    tanggal_lahir: '2022-11-20',
    jenis_kelamin: 'Perempuan',
    usia_bulan: 29,
    berat_badan: 9.2,
    tinggi_badan: 78,
    lingkar_kepala: 45,
    nama_ibu: 'Ibu Dewi Rahayu',
    last_prediksi: {
      id: 'PRED-002',
      tanggal: '2025-04-10',
      hasil_risiko: 'Stunted',
      haz_score: -2.3,
    },
  },
  {
    id: 'BAL-003',
    nama: 'Dion Permana',
    tanggal_lahir: '2022-07-03',
    jenis_kelamin: 'Laki-laki',
    usia_bulan: 33,
    berat_badan: 10.1,
    tinggi_badan: 80,
    lingkar_kepala: 46,
    nama_ibu: 'Ibu Rini Putriani',
    last_prediksi: {
      id: 'PRED-003',
      tanggal: '2025-04-08',
      hasil_risiko: 'Severely Stunted',
      haz_score: -3.2,
    },
  },
  {
    id: 'BAL-004',
    nama: 'Farhan Khalid',
    tanggal_lahir: '2023-01-10',
    jenis_kelamin: 'Laki-laki',
    usia_bulan: 27,
    berat_badan: 11.8,
    tinggi_badan: 86,
    lingkar_kepala: 48,
    nama_ibu: 'Ibu Salma Hakim',
    last_prediksi: {
      id: 'PRED-004',
      tanggal: '2025-04-06',
      hasil_risiko: 'Normal',
      haz_score: -0.3,
    },
  },
  {
    id: 'BAL-005',
    nama: 'Zahra Putri',
    tanggal_lahir: '2023-06-22',
    jenis_kelamin: 'Perempuan',
    usia_bulan: 22,
    berat_badan: 8.5,
    tinggi_badan: 75,
    lingkar_kepala: 44,
    nama_ibu: 'Ibu Wahyu Sari',
    last_prediksi: {
      id: 'PRED-005',
      tanggal: '2025-04-05',
      hasil_risiko: 'Stunted',
      haz_score: -2.7,
    },
  },
]

export const mockRiwayatPemeriksaan = [
  {
    id: 'PRED-001',
    balita_id: 'BAL-001',
    nama_balita: 'Arkan Alfatino',
    tanggal: '2025-04-12',
    berat_badan: 11.2,
    tinggi_badan: 82,
    hasil_risiko: 'Normal',
    haz_score: -0.8,
    catatan: 'Pertumbuhan sesuai standar WHO. Lanjutkan pola makan saat ini.',
    rekomendasi: ['Lanjutkan ASI/MPASI sesuai usia', 'Posyandu rutin bulan depan'],
    nama_kader: 'Sri Aminah',
  },
  {
    id: 'PRED-002',
    balita_id: 'BAL-002',
    nama_balita: 'Naura Azalea',
    tanggal: '2025-04-10',
    berat_badan: 9.2,
    tinggi_badan: 78,
    hasil_risiko: 'Stunted',
    haz_score: -2.3,
    catatan: 'Pertumbuhan tinggi badan lebih rendah dari standar. Diperlukan intervensi nutrisi segera.',
    rekomendasi: ['Pemberian makanan tambahan (PMT)', 'Konsultasi ahli gizi', 'Suplemen vitamin A'],
    nama_kader: 'Sri Aminah',
  },
  {
    id: 'PRED-003',
    balita_id: 'BAL-003',
    nama_balita: 'Dion Permana',
    tanggal: '2025-04-08',
    berat_badan: 10.1,
    tinggi_badan: 80,
    hasil_risiko: 'Severely Stunted',
    haz_score: -3.2,
    catatan: 'Stunting berat terdeteksi. Perlu rujukan segera ke Puskesmas.',
    rekomendasi: ['Rujukan ke Puskesmas', 'PMT intensif', 'Pemeriksaan kesehatan menyeluruh'],
    nama_kader: 'Sri Aminah',
  },
]

export const mockPrediksiDetail = {
  'PRED-001': {
    id: 'PRED-001',
    balita: {
      id: 'BAL-001',
      nama: 'Arkan Alfatino',
      usia_bulan: 24,
      jenis_kelamin: 'Laki-laki',
    },
    tanggal: '2025-04-12',
    berat_badan: 11.2,
    tinggi_badan: 82,
    hasil_risiko: 'Normal',
    haz_score: -0.8,
    confidence: 94,
    visualisasi_risiko_6_bulan: [
      { bulan: 'Jan', risiko: 10 },
      { bulan: 'Feb', risiko: 12 },
      { bulan: 'Mar', risiko: 9 },
      { bulan: 'Apr', risiko: 8 },
      { bulan: 'Mei', risiko: 7 },
      { bulan: 'Jun', risiko: 6 },
    ],
    rekomendasi_ai: [
      {
        kategori: 'Optimasi Nutrisi Mikro',
        deskripsi: 'Tambahkan asupan protein hewani seperti ikan, telur, dan daging minimal 3x per minggu untuk mendukung pertumbuhan optimal.',
        prioritas: 'tinggi',
      },
      {
        kategori: 'Jadwal Pemantauan Rutin',
        deskripsi: 'Lakukan kunjungan posyandu setiap bulan untuk memantau pertumbuhan dan mendeteksi perubahan status gizi lebih dini.',
        prioritas: 'sedang',
      },
      {
        kategori: 'Edukasi Stimulasi Motorik',
        deskripsi: 'Berikan permainan edukatif dan stimulasi motorik sesuai usia untuk mendukung perkembangan kognitif dan fisik.',
        prioritas: 'rendah',
      },
    ],
    catatan_kader: 'Pemantauan rutin dilakukan sesuai jadwal.',
  },
  'PRED-003': {
    id: 'PRED-003',
    balita: {
      id: 'BAL-003',
      nama: 'Dion Permana',
      usia_bulan: 33,
      jenis_kelamin: 'Laki-laki',
    },
    tanggal: '2025-04-08',
    berat_badan: 10.1,
    tinggi_badan: 80,
    hasil_risiko: 'Severely Stunted',
    haz_score: -3.2,
    confidence: 97,
    visualisasi_risiko_6_bulan: [
      { bulan: 'Jan', risiko: 72 },
      { bulan: 'Feb', risiko: 74 },
      { bulan: 'Mar', risiko: 78 },
      { bulan: 'Apr', risiko: 80 },
      { bulan: 'Mei', risiko: 82 },
      { bulan: 'Jun', risiko: 75 },
    ],
    rekomendasi_ai: [
      {
        kategori: 'Rujukan Segera ke Puskesmas',
        deskripsi: 'Kondisi ini memerlukan penanganan medis segera. Bawa ke Puskesmas terdekat untuk evaluasi klinis menyeluruh.',
        prioritas: 'kritis',
      },
      {
        kategori: 'Pemberian Makanan Tambahan (PMT)',
        deskripsi: 'Berikan PMT intensif sesuai panduan Kemenkes. Tingkatkan frekuensi makan 5-6x sehari dengan porsi kecil namun padat gizi.',
        prioritas: 'tinggi',
      },
      {
        kategori: 'Pemantauan Harian',
        deskripsi: 'Pantau berat badan setiap minggu dan catat perkembangan secara detail untuk evaluasi intervensi.',
        prioritas: 'tinggi',
      },
    ],
    catatan_kader: 'Perlu perhatian khusus dan koordinasi dengan Puskesmas.',
  },
}

export const mockRiwayatBalita = {
  'BAL-001': [
    {
      id: 'PRED-H-001',
      tanggal: '2025-04-12',
      label: 'Pemeriksaan Rutin',
      berat_badan: 11.2,
      tinggi_badan: 82,
      hasil_risiko: 'Normal',
      haz_score: -0.8,
      catatan: 'Pertumbuhan sesuai standar WHO.',
    },
    {
      id: 'PRED-H-002',
      tanggal: '2025-01-15',
      label: 'Pemeriksaan Bulanan',
      berat_badan: 10.8,
      tinggi_badan: 79,
      hasil_risiko: 'Normal',
      haz_score: -1.0,
      catatan: 'Tren pertumbuhan baik, lanjutkan intervensi.',
    },
    {
      id: 'PRED-H-003',
      tanggal: '2024-10-05',
      label: 'Pemeriksaan Awal',
      berat_badan: 9.5,
      tinggi_badan: 74,
      hasil_risiko: 'Normal',
      haz_score: -1.4,
      catatan: 'Kondisi awal tercatat normal.',
    },
  ],
}

export const mockGrafikPertumbuhan = [
  { bulan: 'Sep', berat: 9.0, tinggi: 72, who_berat: 9.5, who_tinggi: 73 },
  { bulan: 'Okt', berat: 9.5, tinggi: 74, who_berat: 9.7, who_tinggi: 74.5 },
  { bulan: 'Nov', berat: 9.8, tinggi: 75, who_berat: 9.9, who_tinggi: 76 },
  { bulan: 'Des', berat: 10.2, tinggi: 77, who_berat: 10.1, who_tinggi: 77.5 },
  { bulan: 'Jan', berat: 10.5, tinggi: 78, who_berat: 10.3, who_tinggi: 79 },
  { bulan: 'Feb', berat: 10.8, tinggi: 79, who_berat: 10.5, who_tinggi: 80.5 },
  { bulan: 'Mar', berat: 11.0, tinggi: 81, who_berat: 10.7, who_tinggi: 82 },
  { bulan: 'Apr', berat: 11.2, tinggi: 82, who_berat: 10.9, who_tinggi: 83 },
]

export const mockTrendKesehatan = [
  { bulan: 'Jan', normal: 58, stunted: 28, severe: 14 },
  { bulan: 'Feb', normal: 62, stunted: 26, severe: 12 },
  { bulan: 'Mar', normal: 64, stunted: 24, severe: 12 },
  { bulan: 'Apr', normal: 66, stunted: 24, severe: 10 },
  { bulan: 'Mei', normal: 69, stunted: 22, severe: 9 },
  { bulan: 'Jun', normal: 72, stunted: 20, severe: 8 },
]

export const mockJadwalKunjungan = [
  {
    id: 'JDW-001',
    tanggal: '2025-04-25',
    nama: 'Posyandu MPS-56',
    alamat: 'Jl. Melati No. 12, Sukamaju',
    jenis: 'Pemeriksaan Rutin',
  },
  {
    id: 'JDW-002',
    tanggal: '2025-04-28',
    nama: 'Balai Warga Rt. 3',
    alamat: 'Jl. Anggrek, Blok C',
    jenis: 'Imunisasi',
  },
  {
    id: 'JDW-003',
    tanggal: '2025-05-02',
    nama: 'Posyandu MPS-31',
    alamat: 'Gang Kenanga No. 5',
    jenis: 'PMT',
  },
]

// ============================================================
// Untuk orang tua — data anak mereka
// ============================================================
export const mockDataAnakOrangTua = {
  balita: {
    id: 'BAL-001',
    nama: 'Budi Pratama',
    tanggal_lahir: '2023-04-15',
    usia_bulan: 24,
    jenis_kelamin: 'Laki-laki',
    berat_badan: 11.2,
    tinggi_badan: 82,
    status_terkini: 'Normal',
    pemeriksaan_terakhir: '2025-04-12',
  },
  grafik: mockGrafikPertumbuhan,
  riwayat: mockRiwayatBalita['BAL-001'],
  jadwal_mendatang: [
    { tanggal: '2025-04-25', kegiatan: 'Vaksin DPT-Hib 5', lokasi: 'Puskesmas Sukamaju' },
    { tanggal: '2025-05-12', kegiatan: 'Screening Rutin AI', lokasi: 'Posyandu Melati' },
  ],
  rekomendasi: mockPrediksiDetail['PRED-001'],
}