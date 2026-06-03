import { useEffect, useState } from 'react'

/**
 * Returns true once the user has scrolled past the given offset (px).
 */
export function useScrolled(offset = 20) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handle = () => setScrolled(window.scrollY > offset)
    window.addEventListener('scroll', handle, { passive: true })
    return () => window.removeEventListener('scroll', handle)
  }, [offset])

  return scrolled
}
