import { Link } from 'react-router-dom'
import { ShieldCheck, CheckCircle } from 'lucide-react'
import { FOOTER_REFS, FOOTER_PLATFORM_LINKS } from '@/constants/landingData'

function FooterLink({ href, label }) {
  const cls = 'block text-[13px] text-[var(--text-muted)] mb-[9px] no-underline transition-colors duration-150 hover:text-[var(--text-primary)]'
  return href.startsWith('/')
    ? <Link to={href} className={cls}>{label}</Link>
    : <a href={href} className={cls}>{label}</a>
}

export function LandingFooter() {
  return (
    <footer className="border-t border-[var(--border)] bg-[var(--bg-surface)]">
      <div className="mx-auto max-w-[1200px] px-5 py-10 md:px-[clamp(20px,5vw,60px)] md:py-[52px]">

        {/* Grid utama */}
        <div className="grid grid-cols-2 gap-8 md:grid-cols-[2fr_1fr_1fr] md:gap-10 mb-8">

          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="mb-3 flex items-center gap-[10px]">
              <img src="/favicon.png" alt="AnakSehat AI" className="h-[34px] w-[34px] rounded-[9px]" />
              <span className="font-jakarta text-[14px] font-bold text-[var(--text-primary)]">AnakSehat AI</span>
            </div>
            <p className="mb-4 max-w-[280px] text-[13px] leading-[1.75] text-[var(--text-muted)]">
              Platform deteksi dini risiko stunting berbasis deep learning untuk kader Posyandu dan orang tua balita di seluruh Indonesia.
            </p>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-[6px] text-[12px] text-[var(--text-muted)]">
                <ShieldCheck size={13} className="text-[var(--primary)]" /> Data terenkripsi
              </div>
              <div className="flex items-center gap-[6px] text-[12px] text-[var(--text-muted)]">
                <CheckCircle size={13} className="text-[var(--primary)]" /> Standar WHO 2006
              </div>
            </div>
          </div>

          {/* Platform links */}
          <div>
            <div className="mb-4 text-[11px] font-bold uppercase tracking-[0.08em] text-[var(--text-primary)]">
              Platform
            </div>
            {FOOTER_PLATFORM_LINKS.map(({ href, label }) => (
              <FooterLink key={label} href={href} label={label} />
            ))}
          </div>

          {/* Referensi data */}
          <div>
            <div className="mb-4 text-[11px] font-bold uppercase tracking-[0.08em] text-[var(--text-primary)]">
              Referensi Data
            </div>
            {FOOTER_REFS.map((ref) => (
              <div key={ref} className="mb-[8px] text-[12.5px] leading-[1.5] text-[var(--text-muted)]">
                {ref}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col gap-2 border-t border-[var(--border)] pt-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[12px] text-[var(--text-muted)]">
            © 2026 AnakSehat AI. Semua hak cipta dilindungi.
          </p>
          <p className="text-[12px] text-[var(--text-muted)]">
            Alat bantu skrining — bukan pengganti tenaga kesehatan.
          </p>
        </div>
      </div>
    </footer>
  )
}