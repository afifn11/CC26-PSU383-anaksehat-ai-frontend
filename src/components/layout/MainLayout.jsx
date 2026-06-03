/* eslint-disable no-unused-vars */
// src/components/layout/MainLayout.jsx
import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { useThemeStore } from '@/store/themeStore'
import { OnboardingGuide } from '@/components/ui/OnboardingTooltip'
import { ConfirmModal } from '@/components/ui/SharedComponents'
import { useLogout } from '@/hooks/useLogout'
import { Sidebar } from './Sidebar'
import { TopBar } from './TopBar'
import { MobileBottomNav } from './MobileBottomNav'

export default function MainLayout({ children }) {
  const { user }  = useAuthStore()
  const { theme } = useThemeStore()
  const location  = useLocation()
  const isLight   = theme === 'light'
  const { logoutModal, loggingOut, openLogoutModal, closeLogoutModal, handleLogout } = useLogout()

  const hour     = new Date().getHours()
  const greeting = hour < 11 ? 'Pagi' : hour < 15 ? 'Siang' : hour < 18 ? 'Sore' : 'Malam'
  const initials = user?.nama
    ? user.nama.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase()
    : '?'
  const profilHref = user?.role === 'kader' ? '/kader/profil' : '/orangtua/profil'

  return (
    <div className="flex min-h-screen bg-[var(--bg-base)] transition-[background] duration-300">

      {/* Desktop Sidebar — hidden on mobile */}
      <aside className={`
        hidden md:flex flex-col flex-shrink-0
        sticky top-0 h-screen w-[220px] z-20
        bg-[var(--bg-surface)] border-r border-[var(--border)]
        transition-[background,border-color] duration-300
        ${isLight ? 'shadow-[2px_0_12px_rgba(0,0,0,0.05)]' : ''}
      `}>
        <Sidebar
          isMobile={false}
          onLogout={openLogoutModal}
          initials={initials}
          profilHref={profilHref}
        />
      </aside>

      {/* Main Column */}
      <div className="flex flex-col flex-1 min-w-0 w-0">
        <TopBar
          isLight={isLight}
          initials={initials}
          greeting={greeting}
          profilHref={profilHref}
        />
        {/* pb-[72px] on mobile clears the fixed bottom nav */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 pb-[72px] md:p-6 md:pb-6">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Nav */}
      <MobileBottomNav onLogout={openLogoutModal} profilHref={profilHref} isLight={isLight} />

      {user?.role === 'kader' && <OnboardingGuide userId={user?.id} />}

      <ConfirmModal
        open={logoutModal}
        onClose={closeLogoutModal}
        onConfirm={handleLogout}
        title="Keluar dari AnakSehat AI?"
        message="Anda akan logout dari platform. Sesi dan preferensi Anda akan tetap tersimpan."
        confirmLabel="Ya, Keluar"
        variant="danger"
        loading={loggingOut}
      />
    </div>
  )
}
