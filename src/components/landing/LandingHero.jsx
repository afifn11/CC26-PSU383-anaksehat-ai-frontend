import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ShieldCheck, Lock, ArrowRight } from 'lucide-react'
import { HERO_PHOTOS } from '@/constants/landingData'

const TRUST_BADGES = [
  { icon: ShieldCheck, label: 'Standar WHO 2006' },
  { icon: Lock,        label: 'Data terenkripsi' },
]

function HeroBackground() {
  const [current, setCurrent] = useState(0)
  const [prev, setPrev]       = useState(null)

  useEffect(() => {
    const timer = setInterval(() => {
      setPrev(current)
      setCurrent((i) => (i + 1) % HERO_PHOTOS.length)
      setTimeout(() => setPrev(null), 1400)
    }, 7000)
    return () => clearInterval(timer)
  }, [current])

  const sharedClasses = "absolute inset-0 bg-cover bg-[center_top]"

  return (
    <>
      <style>{`
        @keyframes kbZoom  { 0% { transform: scale(1.1); } 100% { transform: scale(1.0); } }
        @keyframes kbShift { 0% { transform: scale(1.0) translateY(-15px); } 100% { transform: scale(1.08) translateY(0); } }
        @keyframes fadeInSplit  { from { opacity: 0; } to { opacity: 1; } }
        @keyframes fadeOutSplit { from { opacity: 1; } to { opacity: 0; } }
      `}</style>
      {prev !== null && (
        <div className={sharedClasses} style={{ backgroundImage: `url(${HERO_PHOTOS[prev]})`, animation: 'fadeOutSplit 1.4s ease forwards' }} />
      )}
      <div className={sharedClasses} style={{ backgroundImage: `url(${HERO_PHOTOS[current]})`, animation: `${current % 2 === 0 ? 'kbZoom' : 'kbShift'} 10s ease-in-out forwards, fadeInSplit 1.4s ease` }} />
      <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.3) 60%, rgba(0,0,0,0.1) 100%), linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 40%)' }} />
      <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(0,80,60,0.35) 0%, transparent 60%)' }} />
    </>
  )
}

export function LandingHero() {
  return (
    <section className="relative flex items-center overflow-hidden min-h-[100svh] min-h-[600px]">
      <HeroBackground />

      <div className="relative z-[1] w-full mx-auto max-w-[1200px] pt-[80px] pb-16 px-5 md:px-[clamp(20px,5vw,60px)]">
        <div className="max-w-[580px]">
          <div className="inline-flex items-center gap-[6px] rounded-[5px] text-[10.5px] font-semibold tracking-[0.05em] mb-5 bg-[rgba(0,255,180,0.12)] border border-[rgba(0,255,180,0.25)] py-[5px] px-[12px] text-[#4FFFCD] animate-[fadeIn_0.5s_ease]">
            PLATFORM SKRINING AI · KADER POSYANDU &amp; ORANG TUA BALITA
          </div>

          <h1 className="font-black text-white leading-[1.08] mb-5 font-jakarta animate-[fadeIn_0.6s_ease_0.1s_both]"
            style={{ fontSize: 'clamp(32px,5vw,64px)', textShadow: '0 2px 30px rgba(0,0,0,0.4)' }}>
            Deteksi Dini<br />
            <span className="text-[#4FFFCD]">Risiko Stunting.</span><br />
            <span className="text-[rgba(255,255,255,0.85)] text-[0.6em] font-bold">Dengan Kecerdasan Buatan.</span>
          </h1>

          <p className="text-[14px] md:text-base leading-[1.8] max-w-[480px] mb-7 text-[rgba(255,255,255,0.80)] animate-[fadeIn_0.6s_ease_0.2s_both]">
            AnakSehat AI membantu kader Posyandu dan orang tua melakukan skrining awal secara cepat,
            akurat, dan real-time menggunakan TensorFlow dan standar WHO.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 mb-8 animate-[fadeIn_0.6s_ease_0.3s_both]">
            <Link to="/login" className="inline-flex items-center justify-center gap-2 no-underline text-[14px] md:text-[15px] font-bold text-white rounded-[9px] transition-all duration-200 py-[13px] px-7 bg-[var(--primary)] shadow-[0_6px_24px_rgba(0,136,106,0.45)] hover:-translate-y-[2px] hover:shadow-[0_10px_30px_rgba(0,136,106,0.55)]">
              Mulai Skrining Sekarang <ArrowRight size={16} />
            </Link>
          </div>

          <div className="flex flex-wrap gap-3 md:gap-5 animate-[fadeIn_0.6s_ease_0.4s_both]">
            {TRUST_BADGES.map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-[6px] text-[12px] text-[rgba(255,255,255,0.65)]">
                <Icon size={13} color="#4FFFCD" /> {label}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-20 z-[2]" style={{ background: 'linear-gradient(to top, var(--bg-base), transparent)' }} />
    </section>
  )
}