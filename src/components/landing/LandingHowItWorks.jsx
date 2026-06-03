import { HOW_IT_WORKS_STEPS } from '@/constants/landingData'
import { Reveal } from './Reveal'

function Step({ n, title, desc, color, accent, index, total }) {
  return (
    <Reveal delay={index * 120}>
      <div className="group relative">
        {/* Connector line between steps (desktop only) */}
        {index < total - 1 && (
          <div className="absolute right-0 top-[28px] hidden h-[1px] w-[calc(100%_-_56px)] translate-x-full border-t border-dashed border-[var(--border)] md:block" />
        )}

        {/* Step number badge */}
        <div
          className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl font-jakarta text-[15px] font-black transition-transform duration-300 group-hover:scale-110"
          style={{ background: accent, color }}
        >
          {n}
        </div>

        <h3 className="mb-3 font-jakarta text-[15px] font-bold leading-[1.3] text-[var(--text-primary)] md:text-[16px]">
          {title}
        </h3>

        <p className="text-[13px] leading-[1.8] text-[var(--text-secondary)] md:text-[13.5px]">
          {desc}
        </p>
      </div>
    </Reveal>
  )
}

export function LandingHowItWorks() {
  return (
    <section id="cara-kerja" className="border-b border-[var(--border)] bg-[var(--bg-surface)]">
      <div className="mx-auto max-w-[1200px] px-5 py-16 md:px-[clamp(20px,5vw,60px)] md:py-[88px]">

        {/* Header */}
        <Reveal>
          <div className="mb-12 flex flex-col gap-4 md:mb-16 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="mb-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--primary)]">
                Alur Penggunaan
              </div>
              <h2 className="font-jakarta text-[clamp(24px,3vw,36px)] font-extrabold leading-[1.15] text-[var(--text-primary)]">
                3 langkah, hasil dalam hitungan detik.
              </h2>
            </div>
            <p className="max-w-[360px] text-[13.5px] leading-[1.8] text-[var(--text-secondary)] md:text-right">
              Dirancang untuk kader Posyandu yang bekerja di lapangan — tanpa kurva belajar yang curam.
            </p>
          </div>
        </Reveal>

        {/* Steps */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3 md:gap-10">
          {HOW_IT_WORKS_STEPS.map((step, i) => (
            <Step
              key={step.n}
              {...step}
              index={i}
              total={HOW_IT_WORKS_STEPS.length}
            />
          ))}
        </div>

      </div>
    </section>
  )
}