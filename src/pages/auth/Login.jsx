// src/pages/auth/Login.jsx
import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { useThemeStore } from '@/store/themeStore'
import { authService } from '@/services/authService'
import {
  AlertTriangle, Phone,
  Sun, Moon, ShieldCheck, Database, ArrowRight,
  Stethoscope, Users,
} from 'lucide-react'
import toast from 'react-hot-toast'
import { InputWithIcon } from '@/components/shared/InputWithIcon'
import { PasswordInput } from '@/components/shared/PasswordInput'

const HERO_PHOTO = 'https://asset.mediaindonesia.com/news/2022/10/413a12d97f59eebfc9f2c15105682e27.jpg'

const ROLE_CONFIG = {
  kader: {
    icon: Stethoscope,
    label: 'Kader Posyandu',
    badge: 'Tenaga Kesehatan',
    tagline: 'Kelola & pantau balita di wilayah Anda.',
    color: 'var(--primary)',
    bgColor: 'rgba(0,136,106,0.12)',
    borderColor: 'rgba(0,136,106,0.25)',
  },
  orangtua: {
    icon: Users,
    label: 'Orang Tua',
    badge: 'Orang Tua / Wali',
    tagline: 'Pantau tumbuh kembang buah hati Anda.',
    color: '#7866BC',
    bgColor: 'rgba(120,102,188,0.12)',
    borderColor: 'rgba(120,102,188,0.28)',
  },
}

function FieldError({ msg }) {
  if (!msg) return null
  return (
    <div className="mt-[5px] flex items-center gap-[5px] text-xs text-[var(--danger)] animate-[fadeIn_0.15s_ease]">
      <AlertTriangle size={11} /> {msg}
    </div>
  )
}


function RoleToggle({ role, onChange }) {
  return (
    <div className="relative flex rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] p-[3px]">
      <div
        className="absolute top-[3px] bottom-[3px] w-[calc(50%-3px)] rounded-[10px] bg-[var(--primary)] shadow-[0_2px_8px_rgba(0,136,106,0.4)] transition-all duration-300"
        style={{ left: role === 'kader' ? '3px' : 'calc(50%)' }}
      />
      {['kader', 'orangtua'].map((r) => {
        const cfg = ROLE_CONFIG[r]
        const active = role === r
        return (
          <button
            key={r}
            type="button"
            onClick={() => onChange(r)}
            className={[
              'relative z-10 flex flex-1 items-center justify-center gap-2',
              'rounded-[10px] py-[10px] px-3 text-[13px] font-semibold',
              'border-none cursor-pointer transition-colors duration-200',
              active ? 'text-white' : 'bg-transparent text-[var(--text-secondary)]',
            ].join(' ')}
          >
            <cfg.icon size={14} />
            {cfg.label}
          </button>
        )
      })}
    </div>
  )
}

export default function Login() {
  const [role, setRole]         = useState('kader')
  const [phone, setPhone]       = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading]   = useState(false)
  const [touched, setTouched]   = useState({})
  const [serverError, setServerError] = useState('')

  const { setAuth }            = useAuthStore()
  const { theme, toggleTheme } = useThemeStore()
  const navigate               = useNavigate()
  const isLight                = theme === 'light'
  const cfg                    = ROLE_CONFIG[role]

  const errors = {
    phone:    !phone.trim() ? 'Nomor HP wajib diisi.'
      : !/^08\d{8,11}$/.test(phone.replace(/\s/g, '')) ? 'Format: 08xxxxxxxxxx' : '',
    password: !password ? 'Kata sandi wajib diisi.'
      : password.length < 6 ? 'Minimal 6 karakter.' : '',
  }
  const isValid = !errors.phone && !errors.password
  const blur = (f) => setTouched((t) => ({ ...t, [f]: true }))

  const handleRoleChange = (r) => {
    setRole(r); setServerError(''); setPhone(''); setTouched({})
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setTouched({ phone: true, password: true })
    if (!isValid) return
    setServerError('')
    setLoading(true)
    try {
      const data = await authService.login(phone, password)
      setAuth(data.user, data.access_token)
      toast.success(`Selamat datang, ${data.user.nama}!`)
      navigate(data.user.role === 'kader' ? '/kader/dashboard' : '/orangtua/dashboard')
    } catch (err) {
      const detail = err.response?.data?.detail
      const msg = detail?.message || (typeof detail === 'string' ? detail : null) || 'Nomor HP atau kata sandi salah.'
      setServerError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <style>{`
        @keyframes authSlideUp {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .auth-in { animation: authSlideUp 0.35s cubic-bezier(0.4,0,0.2,1) both; }
      `}</style>

      {/* Root: full viewport, NO gap at bottom */}
      <div className="flex min-h-screen flex-col bg-[var(--bg-base)] md:flex-row">

        {/* ── DESKTOP LEFT PANEL ──────────────────────────────── */}
        <div className="relative hidden flex-1 flex-col justify-between overflow-hidden p-[44px_52px] md:flex">
          {/* Background layers */}
          <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${HERO_PHOTO})` }} />
          <div className="absolute inset-0 bg-[linear-gradient(145deg,rgba(0,30,22,0.97)_0%,rgba(0,61,46,0.93)_40%,rgba(0,107,84,0.82)_100%)]" />
          <div className="absolute inset-0 opacity-[0.05] bg-[radial-gradient(circle,#fff_1px,transparent_1px)] bg-[length:28px_28px]" />
          <div className="absolute -top-24 -right-24 h-80 w-80 rounded-full bg-[rgba(0,179,137,0.18)] blur-[72px]" />
          <div className="absolute -bottom-16 -left-16 h-60 w-60 rounded-full bg-[rgba(120,102,188,0.12)] blur-[60px]" />

          <div className="relative z-10 flex items-center gap-3">
            <img src="/favicon.png" alt="AnakSehat AI" className="h-9 w-9 rounded-[10px]" />
            <span className="font-jakarta text-[15px] font-bold text-white">AnakSehat AI</span>
          </div>

          <div className="relative z-10">
            <div className="mb-5 inline-block rounded-full border border-white/20 bg-white/10 px-4 py-1 text-[11px] font-semibold tracking-widest text-white/90 backdrop-blur-sm">
              PLATFORM SKRINING AI
            </div>
            <h1 className="mb-4 font-jakarta text-[38px] font-extrabold leading-[1.18] text-white">
              Mendampingi<br />Pertumbuhan Si Kecil<br />
              <span className="text-[#4FFFCD]">dengan Presisi.</span>
            </h1>
            <p className="mb-10 max-w-[340px] text-[14px] leading-[1.7] text-white/65">
              Deteksi dini risiko stunting berbasis Deep Learning — akurasi tinggi, standar WHO, untuk kader Posyandu dan orang tua balita.
            </p>
            <div className="flex flex-wrap gap-10">
              {[['19.8%','Prevalensi Stunting'],['95%','Akurasi Model AI'],['WHO','Standar z-score']].map(([val, label]) => (
                <div key={label}>
                  <div className="font-jakarta text-[22px] font-extrabold text-white">{val}</div>
                  <div className="mt-[2px] text-[11.5px] text-white/50">{label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative z-10 flex items-center gap-2 text-[11.5px] text-white/35">
            <ShieldCheck size={13} /> Data dilindungi enkripsi end-to-end
          </div>
        </div>

        {/* ── RIGHT PANEL ─────────────────────────────────────── */}
        {/* Key: flex-1 on mobile so it fills remaining space after hero, bg fills fully */}
        <div className="flex flex-1 flex-col bg-[var(--bg-surface)] md:w-[480px] md:flex-none md:border-l md:border-[var(--border)]">

          {/* ═══ MOBILE HERO HEADER ═══ */}
          <div className="relative overflow-hidden md:hidden">
            {/* Photo */}
            <div className="absolute inset-0 bg-cover bg-[center_25%]" style={{ backgroundImage: `url(${HERO_PHOTO})` }} />
            {/* Overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(160deg,rgba(0,28,20,0.96)_0%,rgba(0,55,42,0.90)_50%,rgba(0,96,72,0.75)_100%)]" />
            {/* Dot grid */}
            <div className="absolute inset-0 opacity-[0.045] bg-[radial-gradient(circle,#fff_1px,transparent_1px)] bg-[length:26px_26px]" />
            {/* Glow */}
            <div className="absolute -top-16 -right-16 h-56 w-56 rounded-full bg-[rgba(0,200,155,0.18)] blur-[60px]" />
            {/* Bottom fade — menyatu ke bg-surface */}
            <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[var(--bg-surface)] to-transparent" />

            {/* Content */}
            <div className="relative z-10 px-5 pt-[52px] pb-12">
              {/* Top bar */}
              <div className="mb-8 flex items-center justify-between">
                <div className="flex items-center gap-[10px]">
                  <img src="/favicon.png" alt="AnakSehat AI" className="h-[30px] w-[30px] rounded-[8px]" />
                  <span className="font-jakarta text-[14.5px] font-bold text-white">AnakSehat AI</span>
                </div>
                <button
                  onClick={toggleTheme}
                  className="flex h-[34px] w-[34px] items-center justify-center rounded-[10px] border border-white/20 bg-white/10 text-white backdrop-blur-sm transition-colors hover:bg-white/18"
                >
                  {isLight ? <Moon size={14} /> : <Sun size={14} />}
                </button>
              </div>

              {/* Hero text */}
              <h1 className="mb-[6px] font-jakarta text-[28px] font-extrabold leading-[1.18] text-white">
                Selamat Datang
              </h1>
              <p className="text-[13.5px] leading-[1.6] text-white/62">
                Masuk untuk mulai memantau tumbuh kembang balita.
              </p>

              {/* Trust pills */}
              <div className="mt-4 flex flex-wrap gap-[8px]">
                {[{icon: ShieldCheck, label:'WHO 2006'}, {icon: Database, label:'SSGI 2024'}].map(({ icon: Icon, label }) => (
                  <div key={label} className="flex items-center gap-[6px] rounded-full border border-white/15 bg-white/10 px-3 py-[5px] text-[11.5px] font-medium text-white/70 backdrop-blur-sm">
                    <Icon size={11} className="text-[#4FFFCD]" /> {label}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ═══ DESKTOP THEME TOGGLE ═══ */}
          <div className="hidden items-center justify-end px-5 py-4 md:flex">
            <button className="theme-toggle" onClick={toggleTheme}>
              <span className="theme-icon-enter" key={theme}>
                {isLight ? <Moon size={15} /> : <Sun size={15} />}
              </span>
            </button>
          </div>

          {/* ═══ FORM CONTENT ═══ */}
          <div className="flex flex-col px-5 pb-8 pt-2 md:flex-1 md:justify-center md:px-10 md:py-8">

            {/* Desktop heading */}
            <div className="mb-6 hidden md:block">
              <h2 className="font-jakarta text-[26px] font-bold text-[var(--text-primary)]">Selamat Datang</h2>
              <p className="text-[13.5px] text-[var(--text-secondary)]">Masuk ke akun Anda untuk melanjutkan.</p>
            </div>

            {/* Role toggle */}
            <div className="auth-in mb-5" style={{ animationDelay: '0ms' }}>
              <RoleToggle role={role} onChange={handleRoleChange} />
            </div>

            {/* Role context card */}
            <div
              key={role}
              className="auth-in mb-5 flex items-center gap-3 rounded-xl border p-3"
              style={{ borderColor: cfg.borderColor, background: cfg.bgColor, animationDelay: '50ms' }}
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg" style={{ background: `${cfg.color}20` }}>
                <cfg.icon size={16} style={{ color: cfg.color }} />
              </div>
              <div>
                <div className="text-[12px] font-bold" style={{ color: cfg.color }}>{cfg.badge}</div>
                <div className="text-[12px] text-[var(--text-muted)]">{cfg.tagline}</div>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-[14px]" noValidate>
              {serverError && (
                <div className="flex items-center gap-2 rounded-xl border border-[rgba(224,82,82,0.25)] bg-[var(--danger-muted)] px-4 py-[10px] text-[13px] text-[var(--danger)] animate-[fadeIn_0.15s_ease]">
                  <AlertTriangle size={14} className="shrink-0" /> {serverError}
                </div>
              )}

              {/* Phone field */}
              <div className="auth-in" style={{ animationDelay: '90ms' }}>
                <label className="label mb-[7px]">Nomor HP</label>
                <InputWithIcon
                  icon={Phone}
                  type="tel"
                  placeholder="08xxxxxxxxxx"
                  value={phone}
                  onChange={(e) => { setPhone(e.target.value); setServerError('') }}
                  onBlur={() => blur('phone')}
                  hasError={!!(touched.phone && errors.phone)}
                />
                {touched.phone && <FieldError msg={errors.phone} />}
              </div>

              {/* Password field */}
              <div className="auth-in" style={{ animationDelay: '130ms' }}>
                <label className="label mb-[7px]">Kata Sandi</label>
                <PasswordInput
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setServerError('') }}
                  onBlur={() => blur('password')}
                  hasError={!!(touched.password && errors.password)}
                />
                {touched.password && <FieldError msg={errors.password} />}
              </div>

              {/* Submit */}
              <div className="auth-in" style={{ animationDelay: '170ms' }}>
                <button
                  className="btn-primary mt-1 flex w-full items-center justify-center gap-2 py-[14px] text-[14px]"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? (
                    <><span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />Memverifikasi...</>
                  ) : (
                    <>Masuk ke Platform <ArrowRight size={15} /></>
                  )}
                </button>
              </div>

              <p className="auth-in text-center text-[13px] text-[var(--text-secondary)]" style={{ animationDelay: '210ms' }}>
                {role === 'kader' ? (
                  <>Belum punya akun?{' '}
                    <Link to="/register" className="font-semibold text-[var(--primary-light)] no-underline hover:underline">Daftar sebagai Kader</Link>
                  </>
                ) : (
                  <>Punya kode aktivasi?{' '}
                    <Link to="/register?role=orangtua" className="font-semibold text-[var(--primary-light)] no-underline hover:underline">Aktivasi Akun</Link>
                  </>
                )}
              </p>
            </form>

            {/* Disclaimer */}
            <div className="auth-in mt-5 flex gap-3 rounded-xl border border-[rgba(245,176,54,0.2)] bg-[var(--accent-muted)] px-4 py-3" style={{ animationDelay: '250ms' }}>
              <AlertTriangle size={14} className="mt-[1px] shrink-0 text-[var(--accent)]" />
              <p className="text-[12px] leading-[1.55] text-[var(--text-secondary)]">
                Platform hanya untuk tenaga kesehatan berwenang dan orang tua terdaftar.
              </p>
            </div>
          </div>

          {/* ═══ MOBILE BOTTOM SAFE AREA — eliminasi gap hitam ═══ */}
          <div className="h-safe-area-inset-bottom bg-[var(--bg-surface)] md:hidden" />
        </div>
      </div>
    </>
  )
}