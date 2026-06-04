# AnakSehat AI — Frontend Client

## 1. Judul & Deskripsi Proyek

**AnakSehat AI** adalah antarmuka klien berbasis web untuk platform deteksi dini risiko stunting dan gangguan gizi pada balita. Aplikasi ini dibangun sebagai komponen frontend dari ekosistem Capstone Project Coding Camp 2026 yang diselenggarakan oleh DBS Foundation.

Antarmuka dirancang dengan pendekatan _mobile-first_ dan inklusif, mengutamakan kemudahan akses bagi dua kelompok pengguna utama: Kader Posyandu yang mengoperasikan sistem langsung di lapangan menggunakan perangkat seluler, serta Orang Tua Balita yang memantau perkembangan tumbuh kembang anak melalui portal pribadi mereka. Desain responsif memastikan fungsionalitas penuh dapat diakses bahkan dari perangkat _smartphone_ dengan keterbatasan layar dan koneksi jaringan.

Dalam ekosistem capstone, repositori ini bertanggung jawab atas seluruh lapisan presentasi (_presentation layer_): rendering antarmuka, manajemen state sisi klien, serta komunikasi dengan layanan backend via REST API.

**Frontend Tech Stack Utama:**

| Kategori | Teknologi | Versi |
|---|---|---|
| UI Library | React | 19.2.6 |
| Styling | Tailwind CSS | 4.3.0 |
| Build Tool | Vite | 8.0.12 |
| State Management | Zustand | 5.0.3 |
| Charting Library | Recharts | 2.15.3 |
| HTTP Client | Axios | 1.8.4 |
| Routing | React Router DOM | 7.5.0 |
| Form Management | React Hook Form | 7.55.0 |
| Validasi Skema | Zod | 3.24.2 |
| Notifikasi | React Hot Toast | 2.5.2 |
| Ikon | Lucide React | 0.487.0 |
| CSS Utilities | clsx, tailwind-merge | 2.1.1 / 3.2.0 |

---

## 2. Prasyarat Sistem

Pastikan perangkat lunak berikut telah terinstal sebelum menjalankan proyek ini secara lokal:

- **Node.js** versi `20.x` atau lebih baru (disarankan LTS terbaru)
- **npm** versi `10.x` atau lebih baru (disertakan bersama instalasi Node.js)

Verifikasi instalasi dengan menjalankan perintah berikut di terminal:

```bash
node --version
npm --version
```

---

## 3. Instalasi dan Penyiapan Proyek

### 3.1 Kloning atau Ekstraksi Repositori

Jika menggunakan Git:

```bash
git clone <URL_REPOSITORI>
cd anaksehat-ai-fe
```

Jika menggunakan arsip ZIP, ekstrak file tersebut dan masuk ke direktori hasil ekstraksi:

```bash
cd anaksehat-ai-fe
```

### 3.2 Instalasi Dependensi

Proyek ini menggunakan `package-lock.json` sebagai lockfile. Jalankan perintah berikut untuk menginstal seluruh dependensi secara deterministik:

```bash
npm install
```

### 3.3 Konfigurasi Environment Variables

Buat file `.env` di direktori _root_ proyek dengan menyalin template dari `.env.example`:

```bash
cp .env.example .env
```

Kemudian sesuaikan nilai variabel lingkungan berikut sesuai dengan konfigurasi lingkungan pengembangan atau produksi:

| Variabel | Contoh Nilai | Deskripsi |
|---|---|---|
| `VITE_API_URL` | `https://your-backend.up.railway.app` | Base URL layanan backend REST API. Seluruh permintaan HTTP melalui Axios akan diarahkan ke alamat ini. Jika tidak diisi, aplikasi akan melakukan _fallback_ ke `http://localhost:8000`. |
| `VITE_USE_MOCK` | `false` | Flag boolean untuk mengaktifkan mode data _mock_. Jika diisi `true`, halaman-halaman utama (Dashboard, Riwayat, Data Anak, dan lainnya) akan merender data statis dari `src/store/mockData.js` tanpa melakukan pemanggilan API ke backend. Gunakan nilai `false` untuk koneksi ke backend nyata. |

Contoh isi file `.env` untuk lingkungan pengembangan dengan backend lokal:

```env
VITE_API_URL=http://localhost:8000
VITE_USE_MOCK=false
```

Contoh isi file `.env` untuk demonstrasi tanpa backend:

```env
VITE_API_URL=http://localhost:8000
VITE_USE_MOCK=true
```

### 3.4 Menjalankan Server Pengembangan

```bash
npm run dev
```

Aplikasi akan berjalan di `http://localhost:3000`. Server pengembangan Vite telah dikonfigurasi dengan _proxy_ yang meneruskan semua permintaan ke jalur `/api` menuju `http://localhost:8000` untuk menghindari masalah CORS saat pengembangan lokal.

### 3.5 Kompilasi Produksi dan Preview

Untuk membuat _build_ produksi yang telah dioptimalkan:

```bash
npm run build
```

Untuk menjalankan _preview_ dari hasil _build_ produksi secara lokal sebelum _deployment_:

```bash
npm run preview
```

---

## 4. Arsitektur Fitur & Alur Pengguna

### 4.1 Landing Page (`/`)

Halaman publik yang dapat diakses tanpa autentikasi. Terdiri dari beberapa seksi komponen yang dibuat secara modular:

- **LandingHero**: Seksi pembuka dengan _headline_ utama, deskripsi singkat platform, dan _call-to-action_ menuju halaman login/registrasi.
- **LandingStats**: Menampilkan statistik prevalensi stunting secara nasional menggunakan komponen `CountUp` dengan animasi angka yang muncul saat elemen masuk ke _viewport_.
- **LandingFeatures**: Paparan fitur-fitur unggulan aplikasi secara visual.
- **LandingAbout**: Penjelasan konteks masalah stunting dan posisi solusi AnakSehat AI.
- **LandingHowItWorks**: Diagram alur kerja tiga langkah penggunaan sistem.
- **LandingCTA**: Seksi ajakan bertindak terakhir sebelum _footer_.
- **LandingFooter**: Informasi atribusi dan tautan penting.

Seluruh komponen _landing_ menggunakan komponen `Reveal` untuk efek animasi _scroll-reveal_ saat pertama kali ditampilkan.

### 4.2 Portal Kader Posyandu (`/kader/*`)

Akses terbatas untuk pengguna dengan role `kader`. Seluruh rute dilindungi oleh komponen `ProtectedRoute`.

**Dashboard Analitik (`/kader/dashboard`)**

Menampilkan ringkasan kondisi gizi komunitas balita yang ditangani Kader, meliputi:
- Kartu statistik animasi (_Animated Stat Cards_) untuk total balita, jumlah kasus berisiko, dan pemeriksaan terbaru.
- Grafik area tren indeks gizi komunitas per bulan menggunakan komponen `AreaChart` dari Recharts. Grafik dibangun dari data riil backend; apabila data historis belum mencukupi dua bulan, sistem melakukan _fallback_ ke data _mock_.
- Komponen `StatusGiziDonut` berupa _donut chart_ distribusi status gizi (Normal / Stunted / Severely Stunted).
- Tabel ringkas lima balita terkini beserta status risiko masing-masing.

**Form Input Antropometri Multi-step (`/kader/input-balita`)**

Formulir bertahap empat langkah untuk memasukkan data balita baru sekaligus memicu prediksi AI:

1. **Step Identitas** (`StepIdentitas.jsx`): Nama balita, nama orang tua, tanggal lahir, jenis kelamin, dan nomor telepon orang tua.
2. **Step Antropometri** (`StepAntropometri.jsx`): Berat badan, tinggi badan, lingkar kepala, lingkar lengan, dan tanggal pemeriksaan.
3. **Step Sosioekonomi** (`StepSosioekonomi.jsx`): Pendapatan keluarga, pendidikan ibu, sumber air, sanitasi, akses fasilitas kesehatan, status imunisasi, dan riwayat ASI eksklusif.
4. **Step Konfirmasi** (`StepKonfirmasi.jsx`): Ringkasan seluruh data sebelum pengiriman ke backend.

Logika formulir dikelola sepenuhnya oleh custom hook `useInputBalita` yang menangani validasi per-langkah, kalkulasi usia balita, dan pemanggilan `prediksiService`.

**Hasil Prediksi AI (`/kader/hasil-prediksi/:childId/:prediksiId`)**

Halaman visualisasi komprehensif hasil analisis model _deep learning_:
- Kartu ringkasan identitas balita beserta empat parameter utama (berat, tinggi, usia, jenis kelamin).
- Komponen `AnimatedProgressBar` untuk visualisasi nilai HAZ Score dalam skala persentase berwarna (hijau/kuning/merah berdasarkan ambang batas WHO).
- Tiga kartu `WhoStatusCard` menampilkan status Stunting (HAZ), Underweight (WAZ), dan Wasting (BAZ) beserta nilai Z-Score masing-masing.
- Grafik batang (`BarChart` Recharts) perbandingan tiga indeks gizi WHO.
- Narasi rekomendasi intervensi dari model AI yang ditampilkan dalam format terstruktur.
- Tombol aksi untuk mencetak laporan dan membagikan kode aktivasi kepada orang tua melalui komponen `ActivationModal`.

**Riwayat Pemeriksaan Balita (`/kader/riwayat`)**

Tabel riwayat seluruh pemeriksaan yang pernah dilakukan, dilengkapi dengan fitur filter berdasarkan status risiko dan pencarian berdasarkan nama balita.

**Kelola Data Balita (`/kader/kelola-balita`, `/kader/detail-balita/:child_id`, `/kader/edit-balita/:child_id`)**

Modul manajemen data balita mencakup daftar keseluruhan balita, halaman detail riwayat pemeriksaan individual, dan formulir penyuntingan data balita.

**Laporan AI (`/kader/laporan-ai`)**

Halaman laporan agregat berbasis AI yang menyajikan analitik tingkat komunitas menggunakan `PieChart`, `BarChart`, dan `LineChart` Recharts, mencakup distribusi risiko per wilayah, tren stunting enam bulan, dan faktor determinan.

### 4.3 Portal Orang Tua Balita (`/orangtua/*`)

Akses terbatas untuk pengguna dengan role `orangtua`.

**Alur Aktivasi Akun (`/register` — alur orangtua)**

Orang tua mengaktifkan akun melalui kode unik 6-digit yang diperoleh dari Kader Posyandu. Alur aktivasi:
1. Pemilihan peran "Orang Tua" pada halaman Register.
2. Input kode aktivasi 6-digit melalui komponen `KodeInput` (OTP-style input).
3. Sistem melakukan validasi kode secara _real-time_ ke backend via `authService.checkActivationCode()`, mengembalikan data balita terkait (nama anak, nama orang tua yang disarankan).
4. Komponen `ChildConfirmCard` menampilkan konfirmasi identitas anak yang terhubung dengan kode tersebut.
5. Orang tua melengkapi nama, nomor telepon, dan kata sandi untuk menyelesaikan aktivasi via `authService.aktivasi()`.

**Dashboard Tumbuh Kembang (`/orangtua/dashboard`)**

- Kartu ringkasan status gizi terkini anak (HAZ Score, status Stunting, Underweight, Wasting).
- Komponen `AnimatedProgressBar` untuk visualisasi HAZ Score.
- Grafik garis tumbuh kembang (`LineChart` Recharts) dengan dua mode tampilan yang dapat dialihkan: berat badan aktual vs. kurva median WHO, dan tinggi badan aktual vs. kurva median WHO. Data median WHO dihitung secara lokal menggunakan tabel referensi WHO yang telah tertanam di `balitaService`.
- Tautan cepat menuju modul Rekomendasi dan Riwayat.

**Data Anak (`/orangtua/data-anak`)**

Halaman profil lengkap data antropometri dan sosioekonomi anak yang terdaftar.

**Riwayat Pemeriksaan Anak (`/orangtua/riwayat`)**

Kronologi seluruh riwayat pemeriksaan anak beserta hasil prediksi AI pada setiap pemeriksaan.

**Modul Rekomendasi Intervensi AI (`/orangtua/rekomendasi`, `/orangtua/rekomendasi/:prediksiId`)**

Halaman yang menampilkan narasi rekomendasi intervensi gizi yang dihasilkan model AI berdasarkan hasil prediksi terakhir atau prediksi spesifik berdasarkan parameter rute.

---

## 5. Struktur Direktori Proyek

```
src/
├── App.jsx                     # Titik masuk aplikasi; konfigurasi routing React Router DOM
│                               # dengan lazy loading dan ProtectedRoute
├── main.jsx                    # Bootstrap React, inisialisasi tema dari localStorage
├── index.css                   # Design tokens CSS custom properties (tema gelap/terang),
│                               # utilitas global, dan kelas komponen dasar
│
├── assets/                     # Aset statis bawaan (hero image, ikon SVG)
│
├── components/
│   ├── kader/
│   │   └── BalitaForm/         # Komponen langkah formulir multi-step input balita
│   │       ├── StepIdentitas.jsx
│   │       ├── StepAntropometri.jsx
│   │       ├── StepSosioekonomi.jsx
│   │       └── StepKonfirmasi.jsx
│   │
│   ├── landing/                # Seluruh komponen seksi halaman publik (Landing Page)
│   │   ├── LandingNavbar.jsx
│   │   ├── LandingHero.jsx
│   │   ├── LandingStats.jsx
│   │   ├── LandingFeatures.jsx
│   │   ├── LandingAbout.jsx
│   │   ├── LandingHowItWorks.jsx
│   │   ├── LandingCTA.jsx
│   │   ├── LandingFooter.jsx
│   │   ├── CountUp.jsx         # Komponen animasi angka increment
│   │   └── Reveal.jsx          # Komponen animasi scroll-reveal (IntersectionObserver)
│   │
│   ├── layout/                 # Komponen struktur tata letak aplikasi
│   │   ├── MainLayout.jsx      # Layout utama dengan Sidebar dan konten
│   │   ├── Sidebar.jsx         # Navigasi lateral untuk tampilan desktop
│   │   ├── MobileBottomNav.jsx # Navigasi bawah untuk tampilan mobile
│   │   ├── TopBar.jsx          # Bar atas dengan judul halaman dan tombol aksi
│   │   ├── ProtectedRoute.jsx  # Guard autentikasi dan otorisasi berbasis role
│   │   └── ErrorBoundary.jsx   # Penanganan error React untuk mencegah crash total
│   │
│   ├── shared/                 # Komponen form yang dapat digunakan ulang lintas halaman
│   │   ├── FieldWrapper.jsx    # Pembungkus label, input, dan pesan error
│   │   ├── InputWithIcon.jsx   # Input field dengan ikon prefix
│   │   ├── PasswordInput.jsx   # Input kata sandi dengan toggle visibilitas
│   │   ├── PasswordStrength.jsx # Indikator kekuatan kata sandi
│   │   └── ChildConfirmCard.jsx # Kartu konfirmasi identitas balita saat aktivasi
│   │
│   └── ui/                     # Komponen UI generik dan widget interaktif
│       ├── SharedComponents.jsx # Koleksi komponen bersama: Breadcrumb, StatusBadge,
│       │                        # Skeleton loaders, EmptyState, Modal dasar
│       ├── AnimatedCounter.jsx  # AnimatedStatCard, AnimatedProgressBar, StatusGiziDonut
│       ├── ActivationModal.jsx  # Modal berbagi kode aktivasi orang tua
│       └── OnboardingTooltip.jsx # Komponen tooltip panduan pengguna baru
│
├── constants/
│   ├── navigation.js           # Definisi item navigasi KADER_NAV dan ORANGTUA_NAV
│   ├── formOptions.js          # Opsi pilihan untuk dropdown formulir (sanitasi, imunisasi, dll.)
│   ├── landingData.js          # Konten statis Landing Page (statistik, fitur, langkah kerja)
│   └── riskConfig.js           # Fungsi helper warna dan label status risiko WHO
│                               # (getHazColor, getWhoStatusColor, getWhoStatusShortLabel, dll.)
│
├── data/
│   └── mockData.js             # Data mock statis untuk pengujian tampilan tanpa backend
│                               # (dipisah dari store/mockData.js yang digunakan halaman)
│
├── hooks/                      # Custom React Hooks enkapsulasi logika bisnis
│   ├── useInputBalita.js       # State dan validasi formulir multi-step input balita
│   ├── useHasilPrediksi.js     # Pengambilan dan transformasi data hasil prediksi AI
│   ├── useDetailBalita.js      # Pengambilan data detail balita individual
│   ├── useProfil.js            # Manajemen data dan pembaruan profil pengguna
│   ├── useLogout.js            # Alur logout dengan konfirmasi modal
│   ├── useIsMobile.js          # Deteksi viewport mobile (ResizeObserver)
│   ├── useReveal.js            # Logika animasi scroll-reveal (IntersectionObserver)
│   └── useScrolled.js          # Deteksi status scroll untuk efek Navbar
│
├── pages/
│   ├── Landing.jsx             # Halaman publik (merakit komponen landing)
│   ├── NotFound.jsx            # Halaman 404
│   ├── auth/
│   │   ├── Login.jsx           # Halaman login dengan toggle peran dan validasi
│   │   └── Register.jsx        # Halaman registrasi: alur Kader dan alur Aktivasi Orang Tua
│   ├── kader/
│   │   ├── Dashboard.jsx       # Dashboard analitik komunitas Kader
│   │   ├── InputBalita.jsx     # Formulir multi-step input balita baru
│   │   ├── HasilPrediksi.jsx   # Visualisasi hasil prediksi AI
│   │   ├── RiwayatPemeriksaan.jsx # Riwayat seluruh pemeriksaan
│   │   ├── KelolaBalita.jsx    # Daftar dan manajemen data balita
│   │   ├── DetailBalita.jsx    # Detail riwayat pemeriksaan balita individual
│   │   ├── EditBalita.jsx      # Formulir penyuntingan data balita
│   │   ├── LaporanAI.jsx       # Laporan analitik agregat komunitas
│   │   └── ProfilKader.jsx     # Profil dan pengaturan akun Kader
│   └── orangtua/
│       ├── Dashboard.jsx       # Dashboard tumbuh kembang anak
│       ├── DataAnak.jsx        # Data profil dan antropometri anak
│       ├── RiwayatAnak.jsx     # Kronologi riwayat pemeriksaan anak
│       ├── RekomendasiAnak.jsx # Rekomendasi intervensi gizi AI
│       └── ProfilOrangTua.jsx  # Profil dan pengaturan akun Orang Tua
│
├── services/
│   ├── api.js                  # Instansi Axios terpusat dengan interceptor request
│   │                           # (injeksi Bearer Token) dan response (penanganan 401)
│   ├── authService.js          # Layanan autentikasi: login, aktivasi, registrasi Kader
│   └── balitaService.js        # Layanan data balita dan prediksi; mencakup normalizer
│                               # respons backend, kalkulasi median WHO, dan semua endpoint
│
├── store/
│   ├── authStore.js            # Zustand store: state autentikasi (user, token, isAuthenticated)
│   │                           # dengan middleware persist ke sessionStorage
│   ├── themeStore.js           # Zustand store: preferensi tema (dark/light) dengan
│   │                           # persist ke localStorage
│   └── mockData.js             # Koleksi data mock yang digunakan halaman utama saat
│                               # VITE_USE_MOCK=true
│
└── utils/
    └── helpers.js              # Fungsi utilitas umum: cn() (clsx+twMerge), formatRupiah,
                                # formatTanggal, getInitials, getRisikoClass,
                                # getGreeting, calcAgeMonths
```

---

## 6. Informasi Penting Lainnya

### 6.1 Manajemen State & Integrasi API

**Manajemen State Global (Zustand)**

Aplikasi menggunakan Zustand versi 5 untuk mengelola dua store global:

- `authStore` (`src/store/authStore.js`): Menyimpan objek `user`, `token`, dan status `isAuthenticated`. Store ini dikonfigurasi dengan middleware `persist` yang menggunakan `sessionStorage` sebagai medium penyimpanan. Keputusan penggunaan `sessionStorage` (bukan `localStorage`) adalah mitigasi keamanan: token sesi otomatis terhapus ketika tab atau jendela browser ditutup, sehingga mengurangi risiko pencurian token via XSS. Token JWT secara sengaja tidak dipersistensikan; token hanya hidup di memori Zustand selama sesi tab aktif dan dibaca oleh interceptor Axios dari `getState()`.

- `themeStore` (`src/store/themeStore.js`): Menyimpan preferensi tema (`dark` atau `light`) dengan persist ke `localStorage`, sehingga pilihan tema pengguna bertahan lintas sesi.

**Integrasi API via Axios**

Seluruh komunikasi HTTP terpusat melalui instansi Axios yang dikonfigurasi di `src/services/api.js`:

- Base URL dikonfigurasi via `VITE_API_URL` dengan _fallback_ ke `http://localhost:8000`.
- _Request interceptor_ otomatis menyisipkan header `Authorization: Bearer <token>` pada setiap permintaan keluar dengan membaca token dari `useAuthStore.getState()`.
- _Response interceptor_ menangani kode HTTP `401` secara global: memanggil `logout()` dan mengarahkan pengguna ke halaman `/login`.
- Timeout permintaan ditetapkan pada 30 detik.

Logika bisnis API dienkapsulasi dalam modul layanan terpisah di `src/services/`: `authService.js` untuk autentikasi dan `balitaService.js` untuk seluruh operasi data balita dan prediksi.

### 6.2 Kompatibilitas Desain

Aplikasi diimplementasikan dengan pendekatan _mobile-first_ menggunakan Tailwind CSS v4. Layout utama menggunakan grid dua kolom pada layar lebar (sidebar + konten) yang secara otomatis beralih ke layout satu kolom penuh pada layar berukuran kecil. Navigasi lateral (Sidebar) disembunyikan pada perangkat mobile dan digantikan oleh komponen `MobileBottomNav` yang menempatkan navigasi di bagian bawah layar sesuai pola interaksi ibu jari (_thumb-friendly_).

Desain ini secara khusus mempertimbangkan kondisi Kader Posyandu di lapangan yang umumnya mengakses sistem menggunakan _smartphone_ Android kelas menengah dengan ukuran layar 5 hingga 6,5 inci. Komponen-komponen interaktif (tombol, _input field_, kartu) memiliki area sentuh yang memenuhi panduan aksesibilitas minimal 44x44 piksel.

### 6.3 Catatan Penutup

Proyek ini dikembangkan sebagai Capstone Project dalam program **Coding Camp 2026** yang diselenggarakan oleh **DBS Foundation**. Seluruh kode, desain, dan arsitektur sistem merupakan karya tim peserta sebagai bagian dari pemenuhan persyaratan akhir program.