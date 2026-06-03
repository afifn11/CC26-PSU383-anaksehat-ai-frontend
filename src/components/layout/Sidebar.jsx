// src/components/layout/Sidebar.jsx
import { Link, useLocation } from 'react-router-dom'
import {  PlusCircle, LogOut, X, UserCircle } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { KADER_NAV, ORANGTUA_NAV } from '@/constants/navigation'

export function Sidebar({ isMobile, onClose, onLogout, initials, profilHref }) {
  const { user }    = useAuthStore()
  const location    = useLocation()
  const navItems    = user?.role === 'kader' ? KADER_NAV : ORANGTUA_NAV
  const portalLabel = user?.role === 'kader' ? 'Kader Portal' : 'Orang Tua Portal'

  return (
    <>
      {/* Logo */}
      <div className="px-4 pt-[18px] pb-[14px] border-b border-[var(--border)] flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-2.5">
          <img src="/favicon.png" alt="AnakSehat AI" className="w-[34px] h-[34px] rounded-[9px]" />
          <div>
            <div className="text-[13.5px] font-bold text-[var(--text-primary)] font-jakarta leading-tight">
              AnakSehat AI
            </div>
            <div className="text-[11px] text-[var(--text-muted)]">{portalLabel}</div>
          </div>
        </div>
        {isMobile && (
          <button
            onClick={onClose}
            className="bg-transparent border-none cursor-pointer text-[var(--text-muted)] p-1 flex items-center hover:text-[var(--text-primary)] transition-colors"
            aria-label="Tutup sidebar"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* User Card */}
      <div className="px-2.5 pt-2.5 pb-1.5 flex-shrink-0">
        <Link to={profilHref} className="no-underline block" title="Lihat Profil">
          <div className={`
            rounded-[var(--radius-md)] px-[11px] py-[9px] flex items-center gap-[9px]
            transition-colors duration-200 cursor-pointer border
            ${location.pathname === profilHref
              ? 'bg-[var(--primary-muted)] border-[rgba(0,136,106,0.2)]'
              : 'bg-[var(--bg-elevated)] border-transparent hover:bg-[var(--bg-hover)]'
            }
          `}>
            <div className="avatar w-[30px] h-[30px] text-[11px] flex-shrink-0">{initials}</div>
            <div className="flex-1 min-w-0">
              <div className="text-[12.5px] font-semibold text-[var(--text-primary)] truncate">{user?.nama}</div>
              <div className="text-[11px] text-[var(--text-muted)] capitalize">{user?.role}</div>
            </div>
            <UserCircle size={14} className="text-[var(--text-muted)] flex-shrink-0" />
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-2 py-1.5 flex flex-col gap-px">
        {navItems.map(({ label, icon: Icon, href }) => (
          <Link
            key={href}
            to={href}
            className={`sidebar-link ${location.pathname.startsWith(href) ? 'active' : ''}`}
          >
            <Icon size={15} />
            <span>{label}</span>
          </Link>
        ))}
      </nav>

      {/* Kader CTA */}
      {user?.role === 'kader' && (
        <div className="px-2.5 pb-2.5 flex-shrink-0">
          <Link to="/kader/input-balita" className="btn-primary w-full justify-center text-[13px]">
            <PlusCircle size={15} /> Tambah Data Baru
          </Link>
        </div>
      )}

      {/* Logout */}
      <div className="p-2 border-t border-[var(--border)] flex-shrink-0">
        <button
          className="sidebar-link text-[var(--danger)] hover:bg-[var(--danger-muted)] w-full"
          onClick={onLogout}
        >
          <LogOut size={15} />
          <span>Keluar</span>
        </button>
      </div>
    </>
  )
}