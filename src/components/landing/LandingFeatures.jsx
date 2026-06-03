import { FEATURES } from '@/constants/landingData'
import { Reveal } from './Reveal'

function FeatureCard({ icon: Icon, color, bg, title, desc, tags, delay }) {
  return (
    <Reveal delay={delay}>
      <div className="group flex h-full flex-col gap-4 border-b border-[var(--border)] py-6 transition-all duration-200 last:border-b-0 md:border-b-0 md:border-r md:px-6 md:py-0 md:last:border-r-0 md:first:pl-0">
        {/* Icon */}
        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110"
          style={{ background: bg }}
        >
          <Icon size={19} color={color} />
        </div>

        <div className="flex flex-col gap-[6px]">
          <h3 className="font-jakarta text-[14px] font-bold leading-[1.3] text-[var(--text-primary)] md:text-[14.5px]">
            {title}
          </h3>
          <p className="text-[13px] leading-[1.75] text-[var(--text-secondary)]">
            {desc}
          </p>
        </div>

        <div className="mt-auto flex flex-wrap gap-[5px]">
          {tags.map((t) => (
            <span
              key={t}
              className="rounded border border-[var(--border)] bg-[var(--bg-elevated)] px-2 py-[2px] text-[10.5px] font-semibold text-[var(--text-muted)]"
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </Reveal>
  )
}

export function LandingFeatures() {
  const topFeatures = FEATURES.slice(0, 3)
  const bottomFeatures = FEATURES.slice(3)

  return (
    <section id="fitur" className="bg-[var(--bg-base)]">
      <div className="mx-auto max-w-[1200px] px-5 py-16 md:px-[clamp(20px,5vw,60px)] md:py-[88px]">

        {/* ── Header ─────────────────────────────────── */}
        <Reveal>
          <div className="mb-12 flex flex-col gap-5 md:mb-16 md:flex-row md:items-end md:justify-between md:gap-16">
            <div className="max-w-[440px]">
              <div className="mb-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--primary)]">
                Kapabilitas Platform
              </div>
              <h2 className="font-jakarta text-[clamp(24px,3.5vw,40px)] font-extrabold leading-[1.15] text-[var(--text-primary)]">
                Teknologi klinis,<br />kemudahan lapangan.
              </h2>
            </div>
            <p className="max-w-[380px] text-[14px] leading-[1.85] text-[var(--text-secondary)] md:text-right">
              Setiap fitur dirancang dengan satu pertanyaan: apakah ini membantu kader
              Posyandu atau orang tua mengambil tindakan yang tepat, lebih cepat?
            </p>
          </div>
        </Reveal>

        {/* ── Baris 1: 3 fitur utama ─────────────────── */}
        <div className="mb-10 rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] p-6 md:mb-12 md:grid md:grid-cols-3 md:p-8">
          {topFeatures.map((feature, i) => (
            <FeatureCard key={feature.title} {...feature} delay={i * 60} />
          ))}
        </div>

        {/* ── Baris 2: 3 fitur pendukung ─────────────── */}
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] p-6 md:grid md:grid-cols-3 md:p-8">
          {bottomFeatures.map((feature, i) => (
            <FeatureCard key={feature.title} {...feature} delay={i * 60 + 60} />
          ))}
        </div>

      </div>
    </section>
  )
}