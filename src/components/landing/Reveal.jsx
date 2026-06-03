import { useReveal } from '@/hooks/useReveal'

export function Reveal({ children, delay = 0, style = {}, className = '' }) {
  const [ref, visible] = useReveal()

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity:    visible ? 1 : 0,
        transform:  visible ? 'translateY(0)' : 'translateY(18px)',
        transition: `opacity 0.55s ease ${delay}ms, transform 0.55s cubic-bezier(0.4,0,0.2,1) ${delay}ms`,
        ...style,
      }}
    >
      {children}
    </div>
  )
}