import { STATS } from '@/constants/landingData'
import { Reveal } from './Reveal'
import { CountUp } from './CountUp'

function StatItem({ value, suffix, label, src, color, index }) {
  // border logic: right border on all except last in each row
  const isLastInRow2Col = index % 2 !== 0
  const isLastInRow4Col = index === STATS.length - 1

  return (
    <Reveal delay={index * 70}>
      <div
        className={[
          'relative flex flex-col justify-between px-5 py-[22px] md:px-7 md:py-[28px]',
          // Mobile (2 col): border-right on even items, border-bottom on first row
          !isLastInRow2Col ? 'border-r border-[var(--border)]' : '',
          index < 2 ? 'border-b border-[var(--border)]' : '',
          // Desktop (4 col): override — always right except last
          !isLastInRow4Col ? 'md:border-r' : 'md:border-r-0',
          'md:border-b-0',
        ].join(' ')}
      >
        {/* Colored accent line on top */}
        <div
          className="absolute left-0 top-0 h-[2px] w-full opacity-0 transition-opacity duration-300 hover:opacity-100 md:w-[2px] md:h-full md:left-auto md:top-0"
          style={{ background: color }}
        />

        <div className="mb-[6px] text-[10px] font-semibold uppercase tracking-[0.09em] text-[var(--text-muted)] md:text-[10.5px]">
          {src}
        </div>

        <div
          className="mb-[5px] font-jakarta text-[28px] font-black leading-none md:text-[38px]"
          style={{ color }}
        >
          <CountUp target={value} suffix={suffix} />
        </div>

        <div className="text-[12.5px] font-medium text-[var(--text-primary)] md:text-[13px]">
          {label}
        </div>
      </div>
    </Reveal>
  )
}

export function LandingStats() {
  return (
    <section className="border-b border-[var(--border)] bg-[var(--bg-surface)]">
      <div className="mx-auto grid max-w-[1200px] grid-cols-2 md:grid-cols-4">
        {STATS.map((stat, i) => (
          <StatItem key={stat.label} {...stat} index={i} />
        ))}
      </div>
    </section>
  )
}