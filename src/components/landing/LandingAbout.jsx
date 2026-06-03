import { Reveal } from './Reveal'
import { Activity, CheckCircle } from 'lucide-react'
import { ABOUT_PILLARS, ABOUT_DATA_SOURCES } from '@/constants/landingData'

// ─── Sub-components ───────────────────────────────────────────────────────────

function EpistemicPillar({ eyebrow, stat, label, source, color, desc, delay }) {
  return (
    <Reveal delay={delay}>
      <div className="group relative overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-7 md:p-8 transition-all duration-300 hover:border-[var(--border-medium)]">
        <div
          className="absolute left-0 top-0 h-full w-[3px] opacity-60 transition-opacity duration-300 group-hover:opacity-100"
          style={{ background: color }}
        />

        <div className="mb-1 text-[10.5px] font-bold uppercase tracking-[0.12em] text-[var(--text-muted)]">
          {eyebrow}
        </div>

        <div
          className="mb-[2px] font-jakarta text-[40px] font-black leading-none md:text-[48px]"
          style={{ color }}
        >
          {stat}
        </div>

        <div className="mb-[6px] text-[13px] font-semibold text-[var(--text-primary)]">
          {label}
        </div>

        <div className="mb-4 text-[10.5px] text-[var(--text-muted)]">
          — {source}
        </div>

        <p className="text-[13px] leading-[1.8] text-[var(--text-secondary)]">
          {desc}
        </p>
      </div>
    </Reveal>
  )
}

function DataSourceRow({ label, note }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-[var(--border)] py-[10px] last:border-b-0">
      <div className="flex items-center gap-[9px]">
        <CheckCircle size={13} className="mt-[1px] shrink-0 text-[var(--primary)]" />
        <span className="text-[13px] font-medium text-[var(--text-primary)]">{label}</span>
      </div>
      <span className="shrink-0 text-right text-[11.5px] text-[var(--text-muted)]">{note}</span>
    </div>
  )
}

function MedicalDisclaimer() {
  return (
    <Reveal>
      <div className="rounded-xl border border-[rgba(245,158,11,0.25)] bg-[rgba(245,158,11,0.06)] p-5 md:p-6">
        <div className="flex items-start gap-4">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[rgba(245,158,11,0.12)]">
            <Activity size={18} color="#F59E0B" />
          </div>
          <div>
            <h3 className="mb-[6px] font-jakarta text-[14px] font-bold text-[var(--text-primary)]">
              Peringatan Medis
            </h3>
            <p className="m-0 text-[13px] leading-[1.65] text-[var(--text-secondary)]">
              AnakSehat AI adalah alat bantu skrining — <strong className="font-semibold text-[var(--text-primary)]">bukan pengganti tenaga kesehatan</strong>. Hasil prediksi risiko wajib divalidasi langsung oleh dokter anak, ahli gizi, atau Puskesmas terkait.
            </p>
          </div>
        </div>
      </div>
    </Reveal>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function LandingAbout() {
  return (
    <section id="tentang" className="border-b border-[var(--border)] bg-[var(--bg-base)]">

      <div className="mx-auto max-w-[1200px] px-5 py-16 md:px-[clamp(20px,5vw,60px)] md:py-[88px]">

        <Reveal>
          <div className="mb-12 flex flex-col gap-4 md:mb-16 md:flex-row md:items-end md:justify-between md:gap-12">
            <div className="max-w-[480px]">
              <div className="mb-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--primary)]">
                Mengapa Ini Penting
              </div>
              <h2 className="font-jakarta text-[clamp(24px,3.5vw,40px)] font-extrabold leading-[1.15] text-[var(--text-primary)]">
                Stunting masih jadi krisis&nbsp;—<br />
                <span className="text-[var(--primary)]">deteksi dini adalah kuncinya.</span>
              </h2>
            </div>
            <p className="max-w-[400px] text-[14px] leading-[1.85] text-[var(--text-secondary)] md:text-right">
              Berdasarkan SSGI 2024 (Kemenkes RI), 19,8% balita Indonesia mengalami stunting.
              Pencatatan manual dan keterbatasan kapasitas kader menyebabkan intervensi gizi
              sering datang terlambat. AnakSehat AI hadir mengisi kesenjangan sistemik ini.
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 md:gap-5">
          {ABOUT_PILLARS.map((pillar, i) => (
            <EpistemicPillar key={pillar.eyebrow} {...pillar} delay={i * 80} />
          ))}
        </div>
      </div>

      <div className="border-y border-[var(--border)] bg-[var(--bg-surface)]">
        <div className="mx-auto max-w-[1200px] px-5 py-12 md:px-[clamp(20px,5vw,60px)] md:py-[64px]">
          <div className="grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-20 md:items-center">

            <Reveal>
              <div className="text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--text-muted)] mb-3">
                Fondasi Sistem
              </div>
              <h3 className="font-jakarta text-[clamp(20px,2.5vw,30px)] font-extrabold leading-[1.2] text-[var(--text-primary)] mb-4">
                Tervalidasi secara klinis melalui standar global WHO.
              </h3>
              <p className="text-[13.5px] leading-[1.85] text-[var(--text-secondary)]">
                Setiap pengukuran dan deteksi yang dihasilkan oleh AnakSehat AI berakar langsung pada
                standar pertumbuhan dan referensi klinis Z-Score WHO 2006 — memastikan hasil yang 
                aman, akurat, dan sesuai dengan regulasi medis resmi yang diakui di seluruh dunia.
              </p>
            </Reveal>

            <Reveal delay={100}>
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] px-6 py-5">
                <div className="mb-4 text-[11px] font-bold uppercase tracking-[0.1em] text-[var(--text-muted)]">
                  Referensi Data & Parameter
                </div>
                {ABOUT_DATA_SOURCES.map((src) => (
                  <DataSourceRow key={src.label} {...src} />
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1200px] px-5 py-10 md:px-[clamp(20px,5vw,60px)] md:py-12">
        <MedicalDisclaimer />
      </div>

    </section>
  )
}