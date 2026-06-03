import { LandingNavbar }     from '@/components/landing/LandingNavbar'
import { LandingHero }       from '@/components/landing/LandingHero'
import { LandingStats }      from '@/components/landing/LandingStats'
import { LandingAbout }      from '@/components/landing/LandingAbout'
import { LandingHowItWorks } from '@/components/landing/LandingHowItWorks'
import { LandingFeatures }   from '@/components/landing/LandingFeatures'
import { LandingCTA }        from '@/components/landing/LandingCTA'
import { LandingFooter }     from '@/components/landing/LandingFooter'

export default function Landing() {
  return (
    <div className="bg-[var(--bg-base)] min-h-screen">
      <LandingNavbar />
      <LandingHero />
      <LandingStats />
      <LandingAbout />
      <LandingHowItWorks />
      <LandingFeatures />
      <LandingCTA />
      <LandingFooter />
    </div>
  )
}