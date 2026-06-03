import { Link } from 'react-router-dom'
import { ArrowRight, ShieldCheck } from 'lucide-react'
import { useThemeStore } from '@/store/themeStore'
import { Reveal } from './Reveal'
import { HERO_PHOTOS } from '@/constants/landingData'

export function LandingCTA() {
  const { theme } = useThemeStore()
  const isLight = theme === 'light'

  // Dua overlay CSS vars tidak tersedia sebagai Tailwind class karena bergantung pada state runtime
  const overlayGradient = isLight
    ? 'linear-gradient(135deg, rgba(0,61,46,0.93) 0%, rgba(0,107,84,0.85) 50%, rgba(0,136,106,0.72) 100%)'
    : 'linear-gradient(135deg, rgba(0,26,20,0.96) 0%, rgba(0,61,46,0.92) 50%, rgba(0,96,74,0.80) 100%)'

  return (
    <section className="bg-[var(--bg-base)] px-5 pb-16 md:px-[clamp(20px,5vw,60px)] md:pb-24">
      <Reveal>
        <div className="relative overflow-hidden rounded-2xl">

          {/* Layer 1 — foto */}
          <div
            className="absolute inset-0 bg-cover bg-[center_30%]"
            style={{ backgroundImage: `url(${HERO_PHOTOS[2]})` }}
          />

          {/* Layer 2 — overlay teal (state-driven, inline diizinkan) */}
          <div className="absolute inset-0" style={{ background: overlayGradient }} />

          {/* Layer 3 — fade kanan */}
          <div className="absolute inset-0 bg-gradient-to-l from-black/20 to-transparent" />

          {/* Layer 4 — grid pattern dekoratif */}
          <svg className="absolute inset-0 h-full w-full opacity-[0.04]" aria-hidden="true">
            <defs>
              <pattern id="ctaGrid" width="36" height="36" patternUnits="userSpaceOnUse">
                <path d="M 36 0 L 0 0 0 36" fill="none" stroke="white" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#ctaGrid)" />
          </svg>

          {/* Konten */}
          <div className="relative z-10 flex flex-col gap-7 p-8 md:flex-row md:items-center md:justify-between md:gap-12 md:p-[clamp(36px,5vw,56px)]">

            {/* Teks */}
            <div className="max-w-[500px]">
              <div className="mb-2 text-[10.5px] font-semibold uppercase tracking-[0.12em] text-white/55">
                Mulai Sekarang
              </div>
              <h2 className="mb-3 font-jakarta text-[clamp(20px,3vw,32px)] font-extrabold leading-[1.15] text-white">
                Skrining balita menjadi lebih cepat, akurat, dan terdokumentasi.
              </h2>
              <p className="text-[13.5px] leading-[1.8] text-white/70">
                Tersedia untuk kader Posyandu dan orang tua. Tidak perlu instalasi — akses langsung dari browser Anda.
              </p>

              <div className="mt-4 flex items-center gap-[6px] text-[12px] text-white/50">
                <ShieldCheck size={13} className="text-emerald-400" />
                Standar WHO 2006 · Data SSGI 2024 · 95% akurasi model
              </div>
            </div>

            {/* CTA buttons */}
            <div className="flex shrink-0 flex-col gap-3 md:min-w-[220px]">
              <Link
                to="/login"
                className="flex items-center justify-center gap-2 rounded-xl bg-white px-7 py-[14px] text-[14px] font-bold text-[#004D3B] no-underline transition-all duration-200 hover:-translate-y-[2px] hover:shadow-[0_10px_30px_rgba(0,0,0,0.25)]"
              >
                Mulai Skrining <ArrowRight size={15} />
              </Link>
              <Link
                to="/register"
                className="flex items-center justify-center gap-2 rounded-xl border border-white/25 bg-white/10 px-7 py-[14px] text-[14px] font-semibold text-white no-underline transition-all duration-200 hover:bg-white/18"
              >
                Daftar sebagai Kader
              </Link>
            </div>
          </div>

        </div>
      </Reveal>
    </section>
  )
}