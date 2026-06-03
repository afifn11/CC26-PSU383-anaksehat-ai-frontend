// src/components/layout/MobileBottomNav.jsx
import { Link, useLocation } from 'react-router-dom'
import { LogOut, UserCircle } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { KADER_NAV, ORANGTUA_NAV } from '@/constants/navigation'

export function MobileBottomNav({ onLogout, profilHref, isLight }) {
  const { user }   = useAuthStore()
  const location   = useLocation()
  const navItems   = user?.role === 'kader' ? KADER_NAV : ORANGTUA_NAV

  return (
    <nav className={`
      flex md:hidden
      fixed bottom-0 left-0 right-0
      bg-[var(--bg-surface)] border-t border-[var(--border)]
      z-[200] pb-[env(safe-area-inset-bottom,6px)]
      transition-[background,border-color] duration-300
      ${isLight ? 'shadow-[0_-4px_16px_rgba(0,0,0,0.08)]' : 'shadow-[0_-4px_16px_rgba(0,0,0,0.30)]'}
    `}>
      {navItems.map(({ label, icon: Icon, href }) => {
        const active = location.pathname.startsWith(href)
        return (
          <Link
            key={href}
            to={href}
            className={`flex-1 flex flex-col items-center justify-center py-2 px-1 gap-[3px] min-w-0 no-underline relative transition-colors duration-150 ${active ? 'text-[var(--primary)]' : 'text-[var(--text-muted)]'}`}
          >
            {active && (
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-7 h-[3px] bg-[var(--primary)] rounded-b-[4px]" aria-hidden="true" />
            )}
            <div className={`w-9 h-[26px] rounded-lg flex items-center justify-center transition-colors duration-200 ${active ? 'bg-[var(--primary-muted)]' : 'bg-transparent'}`}>
              <Icon size={17} />
            </div>
            <span className={`text-[10px] leading-none ${active ? 'font-semibold' : 'font-normal'}`}>{label}</span>
          </Link>
        )
      })}
      {profilHref && (
        <Link
          to={profilHref}
          className={`flex-[0.8] flex flex-col items-center justify-center py-2 px-1 gap-[3px] min-w-0 no-underline transition-colors duration-150 ${location.pathname === profilHref ? 'text-[var(--primary)]' : 'text-[var(--text-muted)]'}`}
        >
          <div className={`w-9 h-[26px] rounded-lg flex items-center justify-center transition-colors duration-200 ${location.pathname === profilHref ? 'bg-[var(--primary-muted)]' : 'bg-transparent'}`}>
            <UserCircle size={17} />
          </div>
          <span className={`text-[10px] leading-none ${location.pathname === profilHref ? 'font-semibold' : 'font-normal'}`}>Profil</span>
        </Link>
      )}
      <button
        onClick={onLogout}
        className="flex-[0.7] flex flex-col items-center justify-center py-2 px-1 gap-[3px] bg-transparent border-none cursor-pointer text-[var(--danger)] min-w-0"
        aria-label="Keluar"
      >
        <div className="w-9 h-[26px] rounded-lg flex items-center justify-center">
          <LogOut size={17} />
        </div>
        <span className="text-[10px] leading-none">Keluar</span>
      </button>
    </nav>
  )
}