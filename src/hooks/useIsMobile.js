import { useEffect, useState } from 'react'

const MOBILE_BREAKPOINT = 768

/**
 * Returns true when viewport width is below the mobile breakpoint.
 * Listens to resize events and cleans up automatically.
 */
export function useIsMobile(breakpoint = MOBILE_BREAKPOINT) {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < breakpoint)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < breakpoint)
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [breakpoint])

  return isMobile
}
