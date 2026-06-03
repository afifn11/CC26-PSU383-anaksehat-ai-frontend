// src/components/layout/TopBar.jsx
import { Link } from 'react-router-dom'
import {  Bell, Sun, Moon } from 'lucide-react'
import { useThemeStore } from '@/store/themeStore'
import { useAuthStore } from '@/store/authStore'

export function TopBar({ isLight, initials, greeting, profilHref }) {
  const { theme, toggleTheme } = useThemeStore()
  const { user } = useAuthStore()

  return (
    <header className={`
      flex items-center gap-2.5 px-4 md:px-5 h-[54px] flex-shrink-0
      bg-[var(--bg-surface)] border-b border-[var(--border)]
      sticky top-0 z-10 w-full
      transition-[background,border-color] duration-[250ms]
      ${isLight ? 'shadow-[0_1px_8px_rgba(0,0,0,0.06)]' : ''}
    `}>
      {/* Brand — mobile only (no sidebar on mobile) */}
      <div className="md:hidden flex items-center gap-[7px]">
        <img src="/favicon.png" alt="AnakSehat AI" className="w-[34px] h-[34px] rounded-[9px]" />
        <span className="text-[13px] font-bold text-[var(--text-primary)] font-jakarta">
          AnakSehat AI
        </span>
      </div>

      {/* Greeting — desktop only */}
      <div className="hidden md:block text-[13px] text-[var(--text-secondary)] font-medium">
        Selamat {greeting},{' '}
        <span className="text-[var(--text-primary)] font-semibold">
          {user?.nama?.split(' ')[0]}
        </span>
      </div>

      <div className="flex-1" />

      {/* Theme toggle */}
      <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle tema">
        <span className="theme-icon-enter" key={theme}>
          {isLight ? <Moon size={15} /> : <Sun size={15} />}
        </span>
      </button>

      {/* Notifications */}
      <button className="btn-ghost px-2 py-[5px]" title="Notifikasi" aria-label="Notifikasi">
        <Bell size={16} />
      </button>

      {/* User pill — desktop only */}
      {profilHref ? (
        <Link
          to={profilHref}
          className="hidden md:flex items-center gap-2 no-underline px-2 py-1 rounded-[var(--app-radius-md)] transition-colors duration-150 hover:bg-[var(--bg-elevated)]"
          title="Lihat Profil"
        >
          <div className="avatar w-[30px] h-[30px] text-[11px]">{initials}</div>
          <span className="text-[13px] text-[var(--text-secondary)] max-w-[120px] truncate">
            {user?.nama}
          </span>
        </Link>
      ) : (
        <div className="hidden md:flex items-center gap-2">
          <div className="avatar w-[30px] h-[30px] text-[11px]">{initials}</div>
          <span className="text-[13px] text-[var(--text-secondary)] max-w-[120px] truncate">
            {user?.nama}
          </span>
        </div>
      )}
    </header>
  )
}
