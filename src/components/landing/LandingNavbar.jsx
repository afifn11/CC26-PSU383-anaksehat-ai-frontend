import { useState } from 'react'
import { Link } from 'react-router-dom'
import {  Sun, Moon, Menu, X } from 'lucide-react'
import { useThemeStore } from '@/store/themeStore'
import { useScrolled } from '@/hooks/useScrolled'
import { NAVBAR_LINKS } from '@/constants/landingData'

export function LandingNavbar() {
  const { theme, toggleTheme } = useThemeStore()
  const scrolled   = useScrolled(20)
  const isLight    = theme === 'light'
  const [menuOpen, setMenuOpen] = useState(false)

  const navClasses = `fixed top-0 left-0 right-0 z-[200] h-[60px] flex items-center justify-between px-4 md:px-[clamp(20px,5vw,60px)] transition-all duration-[350ms] ${
    scrolled || menuOpen
      ? isLight
        ? 'bg-[rgba(247,249,248,0.97)] backdrop-blur-[16px] border-b border-[var(--border)]'
        : 'bg-[rgba(12,14,20,0.97)] backdrop-blur-[16px] border-b border-[var(--border)]'
      : 'bg-transparent'
  }`

  const linkColor      = scrolled ? 'text-[var(--text-secondary)]'      : 'text-[rgba(255,255,255,0.8)]'
  const linkHoverBg    = scrolled ? 'var(--bg-elevated)'                 : 'rgba(255,255,255,0.1)'
  const linkHoverColor = scrolled ? 'var(--text-primary)'                : '#fff'

  return (
    <>
      <nav className={navClasses}>
        {/* Brand */}
        <div className="flex items-center gap-[10px]">
          <img src="/favicon.png" alt="AnakSehat AI" className="w-[34px] h-[34px] rounded-[9px]" />
          <div>
            <div className="text-sm font-bold font-jakarta leading-[1.1] transition-colors duration-300"
              style={{ color: scrolled || menuOpen ? 'var(--text-primary)' : '#fff' }}>
              AnakSehat AI
            </div>
          </div>
        </div>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          {NAVBAR_LINKS.map(({ href, label }) => (
            <a key={href} href={href}
              className={`text-[13px] py-[5px] px-3 rounded-[7px] no-underline transition-all duration-200 ${linkColor}`}
              onMouseEnter={e => { e.currentTarget.style.background = linkHoverBg; e.currentTarget.style.color = linkHoverColor }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = scrolled ? 'var(--text-secondary)' : 'rgba(255,255,255,0.8)' }}
            >{label}</a>
          ))}
          <div className="w-[1px] h-[14px] mx-[6px]" style={{ background: scrolled ? 'var(--border)' : 'rgba(255,255,255,0.2)' }} />
          <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
            <span className="theme-icon-enter" key={theme}>{isLight ? <Moon size={14} /> : <Sun size={14} />}</span>
          </button>
          <Link to="/login"
            className={`text-[13px] py-[7px] px-4 rounded-lg no-underline ml-1 transition-all duration-200 bg-transparent border ${scrolled ? 'text-[var(--text-primary)] border-[var(--border-medium)]' : 'text-white border-[rgba(255,255,255,0.3)]'}`}
            onMouseEnter={e => { e.currentTarget.style.background = scrolled ? 'var(--bg-elevated)' : 'rgba(255,255,255,0.1)' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
          >Masuk</Link>
          <Link to="/register" className="btn-primary text-[13px] py-[7px] px-[18px] ml-1">Daftar Kader</Link>
        </div>

        {/* Mobile right side */}
        <div className="md:hidden flex items-center gap-2">
          <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
            <span className="theme-icon-enter" key={theme}>{isLight ? <Moon size={14} /> : <Sun size={14} />}</span>
          </button>
          <button
            onClick={() => setMenuOpen(o => !o)}
            className="w-[34px] h-[34px] flex items-center justify-center rounded-[8px] border border-[var(--border-medium)] bg-transparent cursor-pointer transition-colors"
            style={{ color: scrolled || menuOpen ? 'var(--text-secondary)' : 'rgba(255,255,255,0.85)' }}
            aria-label="Menu"
          >
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </nav>

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <div
          className={`fixed top-[60px] left-0 right-0 z-[199] md:hidden border-b border-[var(--border)] py-3 px-4 flex flex-col gap-1 animate-[fadeIn_0.15s_ease] ${
            isLight ? 'bg-[rgba(247,249,248,0.97)] backdrop-blur-[16px]' : 'bg-[rgba(12,14,20,0.97)] backdrop-blur-[16px]'
          }`}
        >
          {NAVBAR_LINKS.map(({ href, label }) => (
            <a key={href} href={href}
              onClick={() => setMenuOpen(false)}
              className="block py-3 px-3 text-[14px] text-[var(--text-secondary)] rounded-[8px] no-underline hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)] transition-colors"
            >{label}</a>
          ))}
          <div className="h-[1px] bg-[var(--border)] my-1" />
          <Link to="/login" onClick={() => setMenuOpen(false)}
            className="block py-3 px-3 text-[14px] text-[var(--text-secondary)] rounded-[8px] no-underline hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)] transition-colors">
            Masuk
          </Link>
          <Link to="/register" onClick={() => setMenuOpen(false)}
            className="btn-primary w-full justify-center py-3 text-[14px] mt-1">
            Daftar Kader
          </Link>
        </div>
      )}
    </>
  )
}
