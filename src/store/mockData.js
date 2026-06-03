// ─────────────────────────────────────────────────────────
// MOCK DATA — AnakSehat AI
// Digunakan hanya selama backend belum siap (mode dev).
// Semua field mencerminkan schema response API FastAPI.
// ─────────────────────────────────────────────────────────

export const MOCK_USERS = {
  kader: {
    id: 'kdr-001',
    nama: 'Dr. Sarah Pratiwi',
    email: 'sarah@posyandu.go.id',
    role: 'kader',
    wilayah_posyandu: 'Posyandu Melati III - Kec. Ciputat',
    no_hp: '081234567890',
    avatar: 'SP',
  },
  orangtua: {
    id: 'ot-001',
    nama: 'Siti Amanda',
    email: null,
    role: 'orangtua',
    no_hp: '082345678901',
    nama_anak: 'Budi Pratama',
    avatar: 'SA',
  }
}

export const MOCK_BALITA = [
  {
    id: 'b-001',
    nama: 'Arkan Yusuf',
    nama_ibu: 'Siti Rahayu',
    usia_bulan: 24,
    jenis_kelamin: 'Laki-laki',
    berat_badan: 12.5,
    tinggi_badan: 85.2,
    lingkar_kepala: 48,
    lingkar_lengan: 14.5,
    tanggal_lahir: '2024-04-15',
    tanggal_periksa: '2026-04-15',
    status_risiko: 'Normal',
    haz_score: -0.8,
    no_hp_ortu: '081111111111',
  },
  {
    id: 'b-002',
    nama: 'Bunga Melati',
    nama_ibu: 'Dewi Susanti',
    usia_bulan: 18,
    jenis_kelamin: 'Perempuan',
    berat_badan: 9.2,
    tinggi_badan: 77.4,
    lingkar_kepala: 46.5,
    lingkar_lengan: 12.8,
    tanggal_lahir: '2024-10-15',
    tanggal_periksa: '2026-04-15',
    status_risiko: 'Stunted',
    haz_score: -2.3,
    no_hp_ortu: '082222222222',
  },
  {
    id: 'b-003',
    nama: 'Dion Pramana',
    nama_ibu: 'Nur Azizah',
    usia_bulan: 36,
    jenis_kelamin: 'Laki-laki',
    berat_badan: 12.1,
    tinggi_badan: 88.0,
    lingkar_kepala: 49,
    lingkar_lengan: 13.2,
    tanggal_lahir: '2023-04-15',
    tanggal_periksa: '2026-04-15',
    status_risiko: 'Severely Stunted',
    haz_score: -3.4,
    no_hp_ortu: '083333333333',
  },
  {
    id: 'b-004',
    nama: 'Farhan Khalid',
    nama_ibu: 'Rina Wati',
    usia_bulan: 12,
    jenis_kelamin: 'Laki-laki',
    berat_badan: 9.8,
    tinggi_badan: 74.5,
    lingkar_kepala: 45,
    lingkar_lengan: 14.0,
    tanggal_lahir: '2025-04-15',
    tanggal_periksa: '2026-04-15',
    status_risiko: 'Normal',
    haz_score: -0.4,
    no_hp_ortu: '084444444444',
  },
  {
    id: 'b-005',
    nama: 'Budi Pratama',
    nama_ibu: 'Siti Amanda',
    usia_bulan: 30,
    jenis_kelamin: 'Laki-laki',
    berat_badan: 11.8,
    tinggi_badan: 88.5,
    lingkar_kepala: 48.5,
    lingkar_lengan: 14.2,
    tanggal_lahir: '2023-10-15',
    tanggal_periksa: '2026-04-15',
    status_risiko: 'Normal',
    haz_score: -1.1,
    no_hp_ortu: '082345678901',
  },
]

export const MOCK_RIWAYAT_BUDI = [
  { id: 'r-1', tanggal: '2025-04-15', berat: 9.2,  tinggi: 78.0, status: 'Normal', haz_score: -1.4, kader: 'Dr. Sarah Pratiwi' },
  { id: 'r-2', tanggal: '2025-07-15', berat: 10.1, tinggi: 82.0, status: 'Normal', haz_score: -1.2, kader: 'Dr. Sarah Pratiwi' },
  { id: 'r-3', tanggal: '2025-10-15', berat: 10.8, tinggi: 85.2, status: 'Normal', haz_score: -1.1, kader: 'Dr. Sarah Pratiwi' },
  { id: 'r-4', tanggal: '2026-01-15', berat: 11.3, tinggi: 86.8, status: 'Normal', haz_score: -1.1, kader: 'Dr. Sarah Pratiwi' },
  { id: 'r-5', tanggal: '2026-04-15', berat: 11.8, tinggi: 88.5, status: 'Normal', haz_score: -1.1, kader: 'Dr. Sarah Pratiwi' },
]

// Schema ini harus SAMA PERSIS dengan response POST /predict dari backend
export const MOCK_PREDIKSI_RESULT = {
  id: 'pred-001',
  balita: MOCK_BALITA[0],
  status_risiko: 'Normal',
  haz_score: -0.8,         // Height-for-Age Z-score (WHO)
  confidence: 91,           // Confidence kelas terpilih (%)
  probabilitas: {           // Output softmax model — 3 kelas
    normal: 0.91,
    stunted: 0.07,
    severely_stunted: 0.02,
  },
  tanggal: '2026-04-15T09:45:00',
  rekomendasi: [
    {
      kategori: 'Nutrisi',
      icon: '🥗',
      judul: 'Optimasi Asupan Protein',
      detail: 'Berikan makanan tinggi protein seperti telur, ikan, tempe, dan tahu minimal 2x sehari. Variasikan dengan sayuran berwarna hijau dan oranye untuk memenuhi kebutuhan mikronutrien.',
    },
    {
      kategori: 'Jadwal Pemantauan',
      icon: '📅',
      judul: 'Jadwal Kunjungan Rutin',
      detail: 'Lakukan penimbangan dan pengukuran setiap bulan di Posyandu. Pantau pertumbuhan menggunakan KMS (Kartu Menuju Sehat) dan pastikan grafik berada di atas garis merah.',
    },
    {
      kategori: 'Stimulasi',
      icon: '🧠',
      judul: 'Stimulasi Motorik Aktif',
      detail: 'Dorong anak untuk aktif bergerak, bermain, dan berinteraksi sosial. Stimulasi perkembangan motorik kasar dan halus sangat penting di usia ini untuk mendukung pertumbuhan optimal.',
    },
  ],
}

export const MOCK_DASHBOARD_STATS = {
  total_balita: 5,
  normal: 3,
  stunted: 1,
  severely_stunted: 1,
}

export const CHART_DATA_KOMUNITAS = [
  { bulan: 'Okt', nilai: 72 },
  { bulan: 'Nov', nilai: 75 },
  { bulan: 'Des', nilai: 71 },
  { bulan: 'Jan', nilai: 78 },
  { bulan: 'Feb', nilai: 80 },
  { bulan: 'Mar', nilai: 82 },
  { bulan: 'Apr', nilai: 85 },
]

export const CHART_DATA_PERTUMBUHAN = [
  { bulan: 'Apr\'25', berat: 9.2,  tinggi: 78.0, who_median_berat: 11.5, who_median_tinggi: 82.3 },
  { bulan: 'Jul\'25', berat: 10.1, tinggi: 82.0, who_median_berat: 12.0, who_median_tinggi: 85.0 },
  { bulan: 'Okt\'25', berat: 10.8, tinggi: 85.2, who_median_berat: 12.5, who_median_tinggi: 87.8 },
  { bulan: 'Jan\'26', berat: 11.3, tinggi: 86.8, who_median_berat: 13.0, who_median_tinggi: 90.3 },
  { bulan: 'Apr\'26', berat: 11.8, tinggi: 88.5, who_median_berat: 13.5, who_median_tinggi: 92.7 },
]