import { Link } from 'react-router-dom'
import { Brain } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'

export default function NotFound() {
  const { isAuthenticated, user } = useAuthStore()
  const homeHref = isAuthenticated
    ? (user?.role === 'kader' ? '/kader/dashboard' : '/orangtua/dashboard')
    : '/'

  return (
    <div className="min-h-screen bg-[var(--bg-base)] flex flex-col items-center justify-center p-6 text-center">
      <svg width="160" height="120" viewBox="0 0 160 120" fill="none" className="mb-6">
        <circle cx="80" cy="70" r="50" fill="var(--primary-muted)" />
        <text x="80" y="82" textAnchor="middle" fontSize="38" fontWeight="800"
          fill="var(--primary)" fontFamily="Plus Jakarta Sans, sans-serif" opacity="0.8">
          404
        </text>
        <circle cx="28" cy="28" r="4" fill="var(--primary)" opacity="0.4" />
        <circle cx="140" cy="24" r="3" fill="var(--primary-light)" opacity="0.35" />
        <circle cx="18" cy="70" r="2.5" fill="var(--primary)" opacity="0.3" />
        <circle cx="148" cy="68" r="2" fill="var(--primary-light)" opacity="0.3" />
        <path d="M 38 36 Q 80 8 122 36" stroke="var(--primary)" strokeWidth="1.5"
          strokeDasharray="4 4" fill="none" opacity="0.4" />
        <circle cx="122" cy="36" r="8" fill="var(--bg-elevated)" stroke="var(--border-medium)" strokeWidth="1.5" />
        <circle cx="122" cy="36" r="3" fill="var(--primary)" opacity="0.5" />
      </svg>

      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 bg-[var(--primary)] rounded-[9px] flex items-center justify-center">
          <Brain size={17} color="#fff" />
        </div>
        <span className="text-sm font-bold text-[var(--text-primary)] font-jakarta">AnakSehat AI</span>
      </div>

      <h1 className="text-2xl font-extrabold text-[var(--text-primary)] font-jakarta mb-2">
        Halaman tidak ditemukan
      </h1>
      <p className="text-sm text-[var(--text-secondary)] leading-[1.6] max-w-[320px] mb-7">
        URL yang Anda kunjungi tidak ada atau telah dipindahkan. Kembali ke halaman utama.
      </p>

      <Link to={homeHref} className="btn-primary text-sm px-7 py-[11px]">
        Kembali ke Dashboard
      </Link>
    </div>
  )
}