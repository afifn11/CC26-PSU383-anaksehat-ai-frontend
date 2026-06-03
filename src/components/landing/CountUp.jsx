import { useEffect, useState } from 'react'
import { useReveal } from '@/hooks/useReveal'

/**
 * Animated number counter that starts when the element enters the viewport.
 */
export function CountUp({ target, suffix = '', duration = 1300 }) {
  const [value, setValue] = useState(0)
  const [ref, visible]    = useReveal(0.3)

  useEffect(() => {
    if (!visible) return
    let start = null


    const tick = (timestamp) => {
      if (!start) start = timestamp
      const progress = Math.min((timestamp - start) / duration, 1)
      setValue(Math.round(target * (1 - Math.pow(1 - progress, 3))))
      if (progress < 1) requestAnimationFrame(tick)
    }

    requestAnimationFrame(tick)
  }, [visible, target, duration])

  return (
    <span ref={ref}>
      {value}
      {suffix}
    </span>
  )
}
