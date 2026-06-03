export function SectionTitle({ eyebrow, heading, className = '' }) {
  return (
    <div className={className}>
      {eyebrow && (
        <p className="text-[11px] font-semibold text-[var(--primary)] tracking-[0.1em] uppercase mb-[10px]">
          {eyebrow}
        </p>
      )}
      <h2 className="text-[clamp(22px,3vw,34px)] font-extrabold text-[var(--text-primary)] font-jakarta">
        {heading}
      </h2>
    </div>
  )
}