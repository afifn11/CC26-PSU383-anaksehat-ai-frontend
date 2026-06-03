/* eslint-disable no-unused-vars */
import {
  Brain, ShieldCheck, BarChart2, Lock,
  HeartPulse, FileCheck, Globe, Activity,
} from 'lucide-react'

// ─── Hero ────────────────────────────────────────────────────────────────────
export const HERO_PHOTOS = [
  'https://asset.mediaindonesia.com/news/2022/10/413a12d97f59eebfc9f2c15105682e27.jpg',
  'https://www.shutterstock.com/image-photo/tangerang-indonesiaapril-2024toddlers-take-part-260nw-2453802341.jpg',
  'https://sriharjo.bantulkab.go.id/assets/files/artikel/sedang_1674715059WhatsAppImage20230124at10.17.27.jpeg',
]

// ─── Navbar ───────────────────────────────────────────────────────────────────
export const NAVBAR_LINKS = [
  { href: '#tentang',    label: 'Tentang' },
  { href: '#cara-kerja', label: 'Cara Kerja' },
  { href: '#fitur',      label: 'Fitur' },
]

// ─── Stats ────────────────────────────────────────────────────────────────────
export const STATS = [
  { value: 19,  suffix: '.8%', label: 'Prevalensi stunting nasional',  src: 'SSGI Kemenkes 2024',   color: 'var(--primary)' },
  { value: 14,  suffix: '.2%', label: 'Target penurunan RPJMN 2029',   src: 'Target Nasional',       color: '#7866BC' },
  { value: 95,  suffix: '%',   label: 'Akurasi model AI',               src: 'Validasi dataset',      color: '#D85A30' },
  { value: 345, suffix: 'K',   label: 'Sampel dataset nasional',        src: 'SSGI 514 Kab/Kota',    color: '#0E7DAA' },
]

// ─── About — HAPUS PROJECT_META, TECH_STACK, TEAM_MEMBERS ────────────────────
// Ganti dengan konten yang menonjolkan nilai produk & kredibilitas medis

export const ABOUT_PILLARS = [
  {
    eyebrow: 'Epidemiologi',
    stat: '19.8%',
    label: 'balita Indonesia mengalami stunting',
    source: 'SSGI Kemenkes 2024',
    color: 'var(--primary)',
    desc: 'Lebih dari 1 dari 5 anak Indonesia terdampak stunting — krisis yang sebagian besar dapat dicegah dengan deteksi dini yang tepat waktu.',
  },
  {
    eyebrow: 'Target Nasional',
    stat: '14.2%',
    label: 'target RPJMN 2029',
    source: 'Pemerintah RI',
    color: '#7866BC',
    desc: 'Indonesia berkomitmen menurunkan 5,6 poin persentase dalam lima tahun. Setiap deteksi dini di tingkat Posyandu berkontribusi nyata pada target ini.',
  },
  {
    eyebrow: 'Keterlambatan Sistemik',
    stat: '6–12',
    label: 'bulan rata-rata keterlambatan deteksi',
    source: 'Kajian lapangan Puskesmas',
    color: '#D85A30',
    desc: 'Pencatatan manual dan keterbatasan kapasitas kader menyebabkan intervensi gizi sering datang terlambat. AnakSehat AI mengisi kesenjangan ini.',
  },
]

export const ABOUT_DATA_SOURCES = [
  { label: 'SSGI 2024 · Kemenkes RI',          note: '345K sampel, 514 Kab/Kota' },
  { label: 'Riskesdas 2018',                   note: 'Faktor sosioekonomi & sanitasi' },
  { label: 'WHO Child Growth Standards 2006',  note: 'Z-Score BB/U, TB/U, BB/TB' },
  { label: 'RPJMN 2025–2029',                  note: 'Kerangka target nasional' },
]

// ─── How It Works ─────────────────────────────────────────────────────────────
export const HOW_IT_WORKS_STEPS = [
  {
    n: '01',
    title: 'Input data balita',
    desc: 'Kader mengisi data antropometri (BB, TB, usia, jenis kelamin) dan faktor sosioekonomi keluarga. Formulir dirancang intuitif untuk digunakan di lapangan.',
    color: 'var(--primary)',
    accent: 'rgba(0,136,106,0.15)',
  },
  {
    n: '02',
    title: 'Analisis AI real-time',
    desc: 'Model deep learning memproses data berdasarkan standar pertumbuhan WHO secara otomatis. Hasil tersedia dalam hitungan detik.',
    color: '#7866BC',
    accent: 'rgba(120,102,188,0.12)',
  },
  {
    n: '03',
    title: 'Hasil & rekomendasi',
    desc: 'Sistem menampilkan tingkat risiko (Normal, Stunted, Severe Stunted) beserta rekomendasi intervensi gizi yang dapat langsung ditindaklanjuti.',
    color: '#D85A30',
    accent: 'rgba(216,90,48,0.10)',
  },
]

// ─── Features ─────────────────────────────────────────────────────────────────
export const FEATURES = [
  {
    icon: Brain,
    color: 'var(--primary)',
    bg: 'var(--primary-muted)',
    title: 'Prediksi Multi-Output AI',
    desc: 'Mengklasifikasikan 3 kelas risiko stunting sekaligus menghasilkan estimasi nutrition score akurat — bukan sekadar label, tapi pemahaman mendalam.',
    tags: ['Deep Learning', 'Multi-Output'],
  },
  {
    icon: FileCheck,
    color: '#7866BC',
    bg: 'rgba(120,102,188,0.12)',
    title: 'Berbasis Data Resmi',
    desc: 'Dibangun dari data SSGI 2024 Kemenkes (345K sampel) dan referensi Z-Score WHO 2006 — bukan dataset generik, tapi representasi populasi Indonesia.',
    tags: ['SSGI 2024', 'WHO Standards'],
  },
  {
    icon: HeartPulse,
    color: '#D85A30',
    bg: 'rgba(216,90,48,0.10)',
    title: 'Rekomendasi Intervensi',
    desc: 'Saran praktis berbasis output model terkait kebutuhan nutrisi, sanitasi, dan layanan fasilitas — langsung bisa digunakan kader di lapangan.',
    tags: ['Gizi', 'Sanitasi', 'Prioritas'],
  },
  {
    icon: BarChart2,
    color: '#0E7DAA',
    bg: 'rgba(14,125,170,0.10)',
    title: 'Dashboard Interaktif',
    desc: 'Visualisasi distribusi risiko stunting per wilayah, analitik tren faktor determinan, dan pemantauan riwayat kesehatan balita secara komprehensif.',
    tags: ['Analitik Data', 'Visualisasi'],
  },
  {
    icon: Globe,
    color: '#10B981',
    bg: 'rgba(16,185,129,0.10)',
    title: 'Aksesibilitas Tinggi',
    desc: 'Aplikasi web responsif — tidak butuh instalasi, cukup browser smartphone. Dirancang khusus untuk kondisi lapangan Posyandu di seluruh Indonesia.',
    tags: ['Responsif', 'Mobile-first'],
  },
  {
    icon: Lock,
    color: '#F59E0B',
    bg: 'rgba(245,158,11,0.10)',
    title: 'Keamanan Data',
    desc: 'Autentikasi terstruktur dan enkripsi data melindungi privasi keluarga balita. Setiap akses tercatat dengan audit log yang ketat.',
    tags: ['Enkripsi', 'Privasi Data'],
  },
]

// ─── Footer ───────────────────────────────────────────────────────────────────
export const FOOTER_REFS = [
  'SSGI 2024 · Kemenkes RI',
  'Riskesdas 2018',
  'WHO Child Growth Standards 2006',
  'RPJMN 2025–2029',
]

export const FOOTER_PLATFORM_LINKS = [
  { href: '#tentang',    label: 'Tentang' },
  { href: '#cara-kerja', label: 'Cara Kerja' },
  { href: '#fitur',      label: 'Fitur' },
  { href: '/login',      label: 'Masuk' },
  { href: '/register',   label: 'Daftar Kader' },
]