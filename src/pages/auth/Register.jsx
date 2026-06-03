/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable react-hooks/immutability */
// src/pages/auth/Register.jsx
import { useState, useMemo, useEffect, useCallback } from 'react'
import { useNavigate, Link, useSearchParams } from 'react-router-dom'
import { useAuthStore }     from '@/store/authStore'
import { useThemeStore }    from '@/store/themeStore'
import { authService }      from '@/services/authService'
import { FieldWrapper }     from '@/components/shared/FieldWrapper'
import { PasswordInput }    from '@/components/shared/PasswordInput'
import { InputWithIcon }    from '@/components/shared/InputWithIcon'
import { PasswordStrength } from '@/components/shared/PasswordStrength'
import { ChildConfirmCard } from '@/components/shared/ChildConfirmCard'
import {
  AlertTriangle, Phone, User, ShieldCheck,
  Sun, Moon, CheckCircle2, RefreshCw, ArrowLeft,
  ArrowRight, Stethoscope, Users, KeyRound,
} from 'lucide-react'
import toast from 'react-hot-toast'

const HERO_PHOTO = 'https://sriharjo.bantulkab.go.id/assets/files/artikel/sedang_1674715059WhatsAppImage20230124at10.17.27.jpeg'

// ─── Ambient background layers ────────────────────────────────────────────────
function AmbientBg() {
  return (
    <>
      <div className="absolute inset-0 bg-cover bg-[center_30%]" style={{ backgroundImage: `url(${HERO_PHOTO})` }} />
      <div className="absolute inset-0 bg-[linear-gradient(155deg,rgba(0,28,20,0.97)_0%,rgba(0,55,42,0.91)_45%,rgba(10,80,65,0.80)_100%)]" />
      <div className="absolute inset-0 opacity-[0.045] bg-[radial-gradient(circle,#fff_1px,transparent_1px)] bg-[length:26px_26px]" />
      <div className="absolute -top-20 right-0 h-72 w-72 rounded-full bg-[rgba(0,179,137,0.16)] blur-[64px]" />
      <div className="absolute bottom-0 -left-10 h-52 w-52 rounded-full bg-[rgba(120,102,188,0.10)] blur-[56px]" />
    </>
  )
}

// ─── Role toggle (same pill style as Login) ───────────────────────────────────
function RoleToggle({ role, onChange }) {
  return (
    <div className="relative flex rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] p-[3px]">
      <div
        className="absolute top-[3px] bottom-[3px] w-[calc(50%-3px)] rounded-[10px] bg-[var(--primary)] shadow-[0_2px_8px_rgba(0,136,106,0.4)] transition-all duration-300"
        style={{ left: role === 'kader' ? '3px' : 'calc(50%)' }}
      />
      {['kader', 'orangtua'].map((r) => {
        const Icon = r === 'kader' ? Stethoscope : Users
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
            <Icon size={14} />
            {r === 'kader' ? 'Kader Posyandu' : 'Orang Tua'}
          </button>
        )
      })}
    </div>
  )
}

// ─── OTP kode boxes ───────────────────────────────────────────────────────────
function KodeInput({ value, onChange, onBlur, isChecking, isValid, hasError }) {
  const digits = value.padEnd(6, ' ').split('').slice(0, 6)
  const handleChange = (e) => onChange(e.target.value.replace(/\D/g, '').slice(0, 6))

  return (
    <div className="relative">
      <input
        type="text"
        inputMode="numeric"
        maxLength={6}
        value={value}
        onChange={handleChange}
        onBlur={onBlur}
        className="absolute inset-0 z-[2] cursor-text opacity-0"
        autoComplete="one-time-code"
      />
      <div className="flex gap-2">
        {digits.map((d, i) => {
          const filled = i < value.length
          const active = i === value.length
          const color  = hasError ? 'var(--danger)'
            : isValid  ? 'var(--success)'
            : active   ? 'var(--primary)'
            : filled   ? 'var(--border-medium)'
            : 'var(--border)'
          return (
            <div
              key={i}
              className="flex h-[54px] flex-1 items-center justify-center rounded-[10px] text-[22px] font-extrabold font-jakarta transition-all duration-150"
              style={{
                border: `2px solid ${color}`,
                background: filled ? 'var(--bg-elevated)' : 'var(--bg-base)',
                color: isValid ? 'var(--success)' : 'var(--text-primary)',
                boxShadow: active ? `0 0 0 3px ${color}22` : 'none',
              }}
            >
              {d !== ' ' ? d : ''}
            </div>
          )
        })}
      </div>
      {isChecking && (
        <div className="absolute -right-7 top-1/2 -translate-y-1/2 pointer-events-none">
          <RefreshCw size={15} className="animate-spin text-[var(--text-muted)]" />
        </div>
      )}
    </div>
  )
}

// ─── Step dots (mobile, hanya untuk orangtua) ─────────────────────────────────
function StepDots({ total, current }) {
  return (
    <div className="flex items-center gap-[6px]">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className="h-[5px] rounded-full transition-all duration-300"
          style={{
            width: i === current ? '20px' : '5px',
            background: i === current ? '#4FFFCD' : 'rgba(255,255,255,0.25)',
          }}
        />
      ))}
    </div>
  )
}

// ─── Desktop Left Panel ───────────────────────────────────────────────────────
function LeftPanel({ role }) {
  const isKader = role === 'kader'
  const steps   = isKader
    ? ['Isi data diri Anda', 'Buat kata sandi aman', 'Mulai pantau balita']
    : ['Masukkan kode dari kader', 'Konfirmasi data anak', 'Buat akun & pantau']

  return (
    <div className="relative hidden flex-1 flex-col justify-between overflow-hidden p-[44px_52px] md:flex">
      <AmbientBg />

      <div className="relative z-10 flex items-center gap-3">
        <img src="/icon.png" alt="AnakSehat AI" className="h-9 w-9 rounded-[10px]" />
        <span className="font-jakarta text-[15px] font-bold text-white">AnakSehat AI</span>
      </div>

      <div
        className="relative z-10"
        key={role}
        style={{ animation: 'authSlideUp 0.4s cubic-bezier(0.4,0,0.2,1) both' }}
      >
        <div className="mb-5 inline-block rounded-full border border-white/20 bg-white/10 px-4 py-1 text-[11px] font-semibold tracking-widest text-white/90 backdrop-blur-sm">
          {isKader ? 'KADER POSYANDU' : 'ORANG TUA / WALI'}
        </div>
        <h1 className="mb-4 font-jakarta text-[32px] font-extrabold leading-[1.22] text-white" style={{ whiteSpace: 'pre-line' }}>
          {isKader ? 'Bergabung sebagai\nKader Posyandu' : 'Aktifkan Akun\nOrang Tua'}
        </h1>
        <p className="mb-9 max-w-[320px] text-[14px] leading-[1.65] text-white/65">
          {isKader
            ? 'Daftarkan diri untuk mulai memantau dan menganalisis tumbuh kembang balita di wilayah Anda.'
            : 'Masukkan kode aktivasi 6 digit dari kader Posyandu untuk mulai memantau perkembangan anak Anda.'}
        </p>
        <div className="flex flex-col gap-3">
          {steps.map((step, i) => (
            <div
              key={i}
              className="flex items-center gap-3"
              style={{ animation: `authSlideUp 0.4s cubic-bezier(0.4,0,0.2,1) ${60 + i * 55}ms both` }}
            >
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-white/25 bg-white/12 text-[11px] font-bold text-white">
                {i + 1}
              </div>
              <span className="text-[13px] text-white/72">{step}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="relative z-10 flex items-center gap-2 text-[11.5px] text-white/35">
        <ShieldCheck size={13} /> Data dilindungi enkripsi end-to-end
      </div>
    </div>
  )
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function Register() {
  const [searchParams] = useSearchParams()
  const defaultRole    = searchParams.get('role') === 'orangtua' ? 'orangtua' : 'kader'
  const codeFromUrl    = searchParams.get('code') ?? ''

  const [role, setRole] = useState(defaultRole)
  const [form, setForm] = useState({ nama: '', phone: '', password: '', confirm: '', kode: codeFromUrl })

  const [loading, setLoading]             = useState(false)
  const [touched, setTouched]             = useState({})
  const [serverError, setServerError]     = useState('')
  const [checkingCode, setCheckingCode]   = useState(false)
  const [childInfo, setChildInfo]         = useState(null)
  const [codeConfirmed, setCodeConfirmed] = useState(false)

  const { setAuth }            = useAuthStore()
  const { theme, toggleTheme } = useThemeStore()
  const navigate               = useNavigate()
  const isLight                = theme === 'light'

  const set  = (f) => (e) => { setForm((p) => ({ ...p, [f]: e.target.value })); setServerError('') }
  const blur = (f) => setTouched((t) => ({ ...t, [f]: true }))

  useEffect(() => {
    if (codeFromUrl.length === 6 && role === 'orangtua') handleCheckCode(codeFromUrl)
  }, []) // eslint-disable-line

  useEffect(() => {
    if (role !== 'orangtua') return
    if (form.kode.length !== 6) { setChildInfo(null); setCodeConfirmed(false); return }
    const t = setTimeout(() => handleCheckCode(form.kode), 300)
    return () => clearTimeout(t)
  }, [form.kode, role]) // eslint-disable-line

  const handleCheckCode = useCallback(async (code) => {
    setCheckingCode(true); setChildInfo(null); setCodeConfirmed(false); setServerError('')
    try {
      const info = await authService.checkActivationCode(code)
      setChildInfo(info)
      if (info.suggested_phone) setForm((p) => ({ ...p, phone: p.phone || info.suggested_phone }))
    } catch (err) {
      const detail = err.response?.data?.detail
      const msg = detail?.message || (typeof detail === 'string' ? detail : null)
      if (msg) setServerError(msg)
    } finally {
      setCheckingCode(false)
    }
  }, [])

  const errors = useMemo(() => ({
    kode:     role === 'orangtua' && form.kode.length !== 6 ? 'Kode harus tepat 6 digit.' : '',
    nama:     !form.nama.trim() ? 'Nama lengkap wajib diisi.' : form.nama.trim().length < 3 ? 'Minimal 3 karakter.' : '',
    phone:    !form.phone.trim() ? 'Nomor HP wajib diisi.' : !/^08\d{8,11}$/.test(form.phone.replace(/\s/g, '')) ? 'Format: 08xxxxxxxxxx.' : '',
    password: !form.password ? 'Kata sandi wajib diisi.' : form.password.length < 8 ? 'Minimal 8 karakter.' : '',
    confirm:  !form.confirm ? 'Konfirmasi wajib diisi.' : form.confirm !== form.password ? 'Kata sandi tidak cocok.' : '',
  }), [form, role])

  const isValid = Object.values(errors).every((e) => !e)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setTouched({ kode: true, nama: true, phone: true, password: true, confirm: true })
    if (!isValid) return
    if (role === 'orangtua' && !codeConfirmed) { setServerError('Harap konfirmasi data anak terlebih dahulu.'); return }
    setServerError('')
    setLoading(true)
    try {
      let data
      if (role === 'kader') {
        data = await authService.registerKader(form.nama, form.phone, form.password)
      } else {
        data = await authService.aktivasi(form.kode, form.password, form.nama, form.phone)
      }
      setAuth(data.user, data.access_token)
      toast.success(role === 'kader' ? '🎉 Akun kader berhasil dibuat!' : '✅ Akun berhasil diaktivasi!')
      navigate(role === 'kader' ? '/kader/dashboard' : '/orangtua/dashboard')
    } catch (err) {
      const detail = err.response?.data?.detail
      const msg = detail?.message || (typeof detail === 'string' ? detail : null) || 'Pendaftaran gagal. Coba lagi.'
      setServerError(msg)
    } finally {
      setLoading(false)
    }
  }

  const switchRole = (r) => {
    setRole(r); setServerError(''); setTouched({})
    setChildInfo(null); setCodeConfirmed(false)
    setForm((p) => ({ ...p, kode: '', phone: '' }))
  }

  const showForm    = role === 'kader' || codeConfirmed
  const mobileStep  = role === 'orangtua' && !codeConfirmed ? 0 : 1
  const mobileTotal = 2

  return (
    <>
      <style>{`
        @keyframes authSlideUp {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes authSlideIn {
          from { opacity: 0; transform: translateX(-12px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        .auth-in  { animation: authSlideUp 0.32s cubic-bezier(0.4,0,0.2,1) both; }
        .auth-in-r { animation: authSlideIn 0.32s cubic-bezier(0.4,0,0.2,1) both; }
      `}</style>

      <div className="flex min-h-screen flex-col bg-[var(--bg-base)] md:flex-row">

        {/* ── DESKTOP LEFT ──────────────────────────────────── */}
        <LeftPanel role={role} />

        {/* ── RIGHT PANEL ───────────────────────────────────── */}
        <div className="flex flex-1 flex-col bg-[var(--bg-surface)] md:w-[520px] md:flex-none md:border-l md:border-[var(--border)]">

          {/* ═══ MOBILE HERO HEADER ═══ */}
          <div className="relative overflow-hidden md:hidden">
            <AmbientBg />
            {/* Fade bottom into bg-surface */}
            <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-[var(--bg-surface)] to-transparent" />

            <div className="relative z-10 px-5 pt-[50px] pb-11">
              {/* Top bar */}
              <div className="mb-7 flex items-center justify-between">
                <Link
                  to="/login"
                  className="flex items-center gap-[6px] rounded-lg border border-white/20 bg-white/10 px-3 py-[6px] text-[12.5px] text-white/85 no-underline backdrop-blur-sm"
                >
                  <ArrowLeft size={13} /> Masuk
                </Link>
                <div className="flex items-center gap-[10px]">
                  <div className="flex items-center gap-[7px]">
                    <img src="/icon.png" alt="AnakSehat AI" className="h-[28px] w-[28px] rounded-[7px]" />
                    <span className="font-jakarta text-[13.5px] font-bold text-white">AnakSehat AI</span>
                  </div>
                  <button
                    onClick={toggleTheme}
                    className="flex h-[32px] w-[32px] items-center justify-center rounded-[9px] border border-white/20 bg-white/10 text-white backdrop-blur-sm"
                  >
                    {isLight ? <Moon size={13} /> : <Sun size={13} />}
                  </button>
                </div>
              </div>

              {/* Dynamic heading */}
              <div key={role} style={{ animation: 'authSlideUp 0.38s cubic-bezier(0.4,0,0.2,1) both' }}>
                <h1 className="mb-[5px] font-jakarta text-[25px] font-extrabold leading-[1.2] text-white">
                  {role === 'kader' ? 'Daftar sebagai Kader' : 'Aktivasi Akun Orang Tua'}
                </h1>
                <p className="text-[13px] leading-[1.55] text-white/60">
                  {role === 'kader'
                    ? 'Lengkapi data untuk membuat akun kader Posyandu.'
                    : codeConfirmed
                      ? `Lengkapi data untuk memantau ${childInfo?.child_name}.`
                      : 'Masukkan kode aktivasi 6 digit dari kader.'}
                </p>
              </div>

              {/* Step dots — hanya untuk orangtua */}
              {role === 'orangtua' && (
                <div className="mt-4">
                  <StepDots total={mobileTotal} current={mobileStep} />
                </div>
              )}
            </div>
          </div>

          {/* ═══ DESKTOP TOP BAR ═══ */}
          <div className="hidden items-center justify-between border-b border-[var(--border)] px-8 py-4 md:flex">
            <Link to="/login" className="flex items-center gap-[6px] text-[13px] text-[var(--text-muted)] no-underline transition-colors hover:text-[var(--text-primary)]">
              <ArrowLeft size={14} /> Kembali ke Login
            </Link>
            <button className="theme-toggle" onClick={toggleTheme}>
              <span key={theme} className="theme-icon-enter">
                {isLight ? <Moon size={15} /> : <Sun size={15} />}
              </span>
            </button>
          </div>

          {/* ═══ FORM AREA ═══ */}
          <div className="flex flex-col px-5 pb-8 pt-5 md:px-10 md:py-8">

            {/* Desktop heading */}
            <div
              className="mb-6 hidden md:block"
              key={role}
              style={{ animation: 'authSlideUp 0.35s cubic-bezier(0.4,0,0.2,1) both' }}
            >
              <h2 className="font-jakarta text-[24px] font-bold text-[var(--text-primary)]">
                {role === 'kader' ? 'Daftar sebagai Kader' : 'Aktivasi Akun Orang Tua'}
              </h2>
              <p className="text-[13px] text-[var(--text-secondary)]">
                {role === 'kader' ? 'Lengkapi data untuk membuat akun.'
                  : codeConfirmed ? `Lengkapi data untuk memantau ${childInfo?.child_name}.`
                  : 'Masukkan kode aktivasi dari kader Posyandu.'}
              </p>
            </div>

            {/* Role toggle */}
            <div className="auth-in mb-5" style={{ animationDelay: '0ms' }}>
              <RoleToggle role={role} onChange={switchRole} />
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>

              {/* Server error */}
              {serverError && (
                <div className="flex items-start gap-2 rounded-xl border border-[rgba(224,82,82,0.25)] bg-[var(--danger-muted)] px-4 py-[10px] text-[13px] text-[var(--danger)] animate-[fadeIn_0.15s_ease]">
                  <AlertTriangle size={14} className="mt-[1px] shrink-0" /> {serverError}
                </div>
              )}

              {/* ── Orang tua: kode input ── */}
              {role === 'orangtua' && !codeConfirmed && (
                <div className="auth-in-r flex flex-col gap-3" key="kode-section" style={{ animationDelay: '40ms' }}>
                  {/* Info hint */}
                  <div className="flex items-start gap-3 rounded-xl border border-[rgba(120,102,188,0.25)] bg-[rgba(120,102,188,0.07)] p-3">
                    <KeyRound size={15} className="mt-[2px] shrink-0 text-[#9580D4]" />
                    <p className="text-[12.5px] leading-[1.55] text-[var(--text-secondary)]">
                      Minta <strong className="font-semibold text-[var(--text-primary)]">kode aktivasi 6 digit</strong> dari kader Posyandu yang mendaftarkan balita Anda.
                    </p>
                  </div>

                  <label className="text-[13px] font-semibold text-[var(--text-primary)]">
                    Kode Aktivasi <span className="text-[var(--danger)]">*</span>
                  </label>
                  <KodeInput
                    value={form.kode}
                    onChange={(v) => { setForm((p) => ({ ...p, kode: v })); setServerError(''); if (v.length < 6) { setChildInfo(null); setCodeConfirmed(false) } }}
                    onBlur={() => blur('kode')}
                    isChecking={checkingCode}
                    isValid={!!childInfo && !serverError}
                    hasError={!!(touched.kode && errors.kode) || (!!serverError && form.kode.length === 6)}
                  />
                  {touched.kode && errors.kode && (
                    <div className="flex items-center gap-1 text-xs text-[var(--danger)]">
                      <AlertTriangle size={11} /> {errors.kode}
                    </div>
                  )}
                  {childInfo && !serverError && (
                    <ChildConfirmCard
                      childInfo={childInfo}
                      onConfirm={() => setCodeConfirmed(true)}
                      onReject={() => {
                        setChildInfo(null)
                        setForm((p) => ({ ...p, kode: '', phone: '' }))
                        setCodeConfirmed(false)
                        toast('Masukkan kode aktivasi yang benar dari kader.', { icon: 'ℹ️' })
                      }}
                    />
                  )}
                </div>
              )}

              {/* Confirmed code badge */}
              {role === 'orangtua' && codeConfirmed && childInfo && (
                <div className="auth-in flex items-center gap-3 rounded-xl border border-[var(--success)] bg-[rgba(16,185,129,0.08)] px-4 py-3">
                  <CheckCircle2 size={16} className="shrink-0 text-[var(--success)]" />
                  <div className="flex-1">
                    <div className="text-[13px] font-semibold text-[var(--success)]">
                      Aktivasi untuk: {childInfo.child_name}
                    </div>
                    <div className="text-xs text-[var(--text-muted)]">Kode: {form.kode}</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => { setCodeConfirmed(false); setChildInfo(null) }}
                    className="cursor-pointer border-none bg-transparent text-[11px] text-[var(--text-muted)] underline"
                  >
                    Ganti
                  </button>
                </div>
              )}

              {/* Main form fields */}
              {showForm && (
                <>
                  {/* Nama Lengkap */}
                  <div className="auth-in" style={{ animationDelay: '60ms' }}>
                    <FieldWrapper label="Nama Lengkap" error={errors.nama} touched={touched.nama} required>
                      <InputWithIcon
                        icon={User}
                        type="text"
                        placeholder={role === 'kader' ? 'Nama kader Posyandu' : 'Nama orang tua / wali'}
                        value={form.nama}
                        onChange={set('nama')}
                        onBlur={() => blur('nama')}
                        hasError={!!(touched.nama && errors.nama)}
                      />
                    </FieldWrapper>
                  </div>

                  {/* Nomor HP */}
                  <div className="auth-in" style={{ animationDelay: '100ms' }}>
                    <FieldWrapper
                      label={role === 'orangtua' && childInfo?.suggested_phone ? 'Nomor HP (dari catatan kader — boleh diubah)' : 'Nomor HP'}
                      error={errors.phone}
                      touched={touched.phone}
                      required
                    >
                      <InputWithIcon
                        icon={Phone}
                        type="tel"
                        placeholder="08xxxxxxxxxx"
                        value={form.phone}
                        onChange={set('phone')}
                        onBlur={() => blur('phone')}
                        hasError={!!(touched.phone && errors.phone)}
                      />
                      {role === 'orangtua' && childInfo?.suggested_phone && form.phone !== childInfo.suggested_phone && form.phone && !errors.phone && (
                        <div className="mt-[5px] text-xs text-[var(--text-muted)]">
                          ℹ️ Berbeda dari catatan kader ({childInfo.suggested_phone}) — tidak masalah.
                        </div>
                      )}
                    </FieldWrapper>
                  </div>

                  {/* Kata Sandi */}
                  <div className="auth-in" style={{ animationDelay: '140ms' }}>
                    <FieldWrapper label="Kata Sandi" error={errors.password} touched={touched.password} required>
                      <PasswordInput
                        placeholder="Min. 8 karakter"
                        value={form.password}
                        onChange={set('password')}
                        onBlur={() => blur('password')}
                        hasError={!!(touched.password && errors.password)}
                      />
                      <PasswordStrength password={form.password} />
                    </FieldWrapper>
                  </div>

                  {/* Konfirmasi Kata Sandi */}
                  <div className="auth-in" style={{ animationDelay: '180ms' }}>
                    <FieldWrapper label="Konfirmasi Kata Sandi" error={errors.confirm} touched={touched.confirm} required>
                      <PasswordInput
                        placeholder="Ulangi kata sandi"
                        value={form.confirm}
                        onChange={set('confirm')}
                        onBlur={() => blur('confirm')}
                        hasError={!!(touched.confirm && errors.confirm)}
                      />
                      {form.confirm && form.confirm === form.password && !errors.confirm && (
                        <div className="mt-[5px] flex items-center gap-1 text-xs text-[var(--success)]">
                          <ShieldCheck size={12} /> Kata sandi cocok
                        </div>
                      )}
                    </FieldWrapper>
                  </div>

                  <div className="auth-in" style={{ animationDelay: '220ms' }}>
                    <button
                      className="btn-primary mt-1 flex w-full items-center justify-center gap-2 py-[14px] text-[14px]"
                      type="submit"
                      disabled={loading}
                    >
                      {loading ? (
                        <><span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" /> Memproses...</>
                      ) : (
                        <>{role === 'kader' ? 'Buat Akun Kader' : 'Aktivasi & Masuk'} <ArrowRight size={15} /></>
                      )}
                    </button>
                  </div>
                </>
              )}
            </form>

            {/* Link ke login */}
            <p className="mt-5 text-center text-[13px] text-[var(--text-secondary)]">
              Sudah punya akun?{' '}
              <Link to="/login" className="font-semibold text-[var(--primary-light)] no-underline hover:underline">
                Masuk di sini
              </Link>
            </p>
          </div>

          {/* Safe area bottom — pastikan bg-surface mengisi penuh, tidak ada gap hitam */}
          <div className="flex-1 bg-[var(--bg-surface)] md:hidden" style={{ minHeight: '1px' }} />
        </div>
      </div>
    </>
  )
}