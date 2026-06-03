import { LayoutDashboard, Baby, History, Brain } from 'lucide-react'

export const KADER_NAV = [
  { label: 'Dashboard',   icon: LayoutDashboard, href: '/kader/dashboard' },
  { label: 'Data Balita', icon: Baby,            href: '/kader/kelola-balita' },
  { label: 'Riwayat',     icon: History,         href: '/kader/riwayat' },
]

export const ORANGTUA_NAV = [
  { label: 'Dashboard',   icon: LayoutDashboard, href: '/orangtua/dashboard' },
  { label: 'Data Anak',   icon: Baby,            href: '/orangtua/data-anak' },
  { label: 'Rekomendasi', icon: Brain,           href: '/orangtua/rekomendasi' },
  { label: 'Riwayat',     icon: History,         href: '/orangtua/riwayat' },
]
