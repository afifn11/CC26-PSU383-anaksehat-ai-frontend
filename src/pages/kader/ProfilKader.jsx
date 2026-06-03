import { User, Phone, Mail, Shield, Edit2, Save, X, Lock, Calendar, Baby, Activity, AlertTriangle, CheckCircle } from 'lucide-react'
import MainLayout from '@/components/layout/MainLayout'
import { Breadcrumb } from '@/components/ui/SharedComponents'
import { AnimatedProgressBar, AnimatedStatCard } from '@/components/ui/AnimatedCounter'
import { FieldWrapper }     from '@/components/shared/FieldWrapper'
import { PasswordInput }    from '@/components/shared/PasswordInput'
import { PasswordStrength } from '@/components/shared/PasswordStrength'
import { useProfil }        from '@/hooks/useProfil'

export default function ProfilKader() {
  const p = useProfil()

  if (p.loading) return (
    <MainLayout>
      <div className="fade-in max-w-[900px] mx-auto">
        {[120, 200, 280].map((h, i) => (
          <div key={i} className="card skeleton-shimmer mb-[14px]" style={{ height: h }} />
        ))}
      </div>
    </MainLayout>
  )

  const initials     = (p.profile?.name ?? '').split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase() || '?'
  const joinedDate   = p.profile?.created_at ? new Date(p.profile.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '—'
  const stuntingRate = p.profile?.stats?.total_predictions > 0 ? Math.round(p.profile.stats.total_stunted / p.profile.stats.total_predictions * 100) : 0
  const rateColor    = stuntingRate > 30 ? 'var(--danger)' : stuntingRate > 15 ? 'var(--warning)' : 'var(--success)'

  return (
    <MainLayout>
      <div className="fade-in max-w-[900px] mx-auto">
        <Breadcrumb items={[{ label: 'Dashboard', href: '/kader/dashboard' }, { label: 'Profil Saya' }]} />

        <div className="mb-5">
          <h1 className="page-title">Profil Saya</h1>
          <p className="page-subtitle">Kelola informasi akun dan keamanan login kamu.</p>
        </div>

        {/* Hero card */}
        <div className="card mb-4 bg-[linear-gradient(135deg,rgba(0,136,106,0.08),rgba(0,136,106,0.02))]">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="w-[64px] h-[64px] rounded-[18px] bg-[var(--primary)] flex items-center justify-center text-[22px] font-extrabold text-white font-jakarta flex-shrink-0 shadow-[0_4px_16px_rgba(0,136,106,0.35)]">
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[20px] font-extrabold text-[var(--text-primary)] font-jakarta leading-[1.2] truncate">
                {p.profile?.name}
              </div>
              <div className="text-[12.5px] text-[var(--text-muted)] mt-1 flex items-center gap-3 flex-wrap">
                <span className="flex items-center gap-[5px]">
                  <Shield size={12} className="text-[var(--primary)]" />
                  <span className="capitalize font-semibold text-[var(--primary)]">{p.profile?.role}</span>
                </span>
                <span className="flex items-center gap-[5px]"><Phone size={12} /> {p.profile?.phone}</span>
                <span className="flex items-center gap-[5px]"><Calendar size={12} /> Bergabung {joinedDate}</span>
              </div>
            </div>
          </div>

          {p.profile?.stats && (
            <div className="grid grid-cols-3 gap-[10px] mt-4 pt-4 border-t border-[var(--border)]">
              <AnimatedStatCard label="Total Balita"    value={p.profile.stats.total_children}   sub="terdaftar"      color="var(--primary)"  icon={Baby}          delay={0}   />
              <AnimatedStatCard label="Pemeriksaan"     value={p.profile.stats.total_predictions} sub="dilakukan"     color="var(--accent)"   icon={Activity}      delay={80}  />
              <AnimatedStatCard label="Perlu Perhatian" value={p.profile.stats.total_stunted}     sub="kasus stunted" color="var(--warning)"  icon={AlertTriangle} delay={160} />
            </div>
          )}
          {p.profile?.stats && p.profile.stats.total_predictions > 0 && (
            <div className="mt-[14px]">
              <div className="flex justify-between text-xs text-[var(--text-muted)] mb-[6px]">
                <span>Tingkat Stunting di Wilayah Kamu</span>
                <span className="font-semibold" style={{ color: rateColor }}>{stuntingRate}%</span>
              </div>
              <AnimatedProgressBar value={stuntingRate} color={rateColor} height={8} showValue={false} />
            </div>
          )}
        </div>

        {/* Two-column on desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-4">

          {/* Edit info card */}
          <div className="card">
            <div className="flex justify-between items-center mb-4">
              <div className="text-sm font-bold text-[var(--text-primary)] flex items-center gap-2">
                <User size={15} className="text-[var(--primary)]" /> Informasi Akun
              </div>
              {!p.editMode ? (
                <button className="btn-secondary text-[13px]" onClick={() => p.setEditMode(true)}>
                  <Edit2 size={13} /> Edit
                </button>
              ) : (
                <div className="flex gap-2">
                  <button className="btn-secondary text-[13px]" onClick={p.cancelEdit} disabled={p.saving}>
                    <X size={13} /> Batal
                  </button>
                  <button className="btn-primary text-[13px]" onClick={p.handleSaveInfo} disabled={p.saving}>
                    {p.saving
                      ? <><span className="spinner w-[13px] h-[13px] border-2 border-[rgba(255,255,255,0.3)] border-t-white rounded-full inline-block" /> Menyimpan...</>
                      : <><Save size={13} /> Simpan</>}
                  </button>
                </div>
              )}
            </div>

            {!p.editMode ? (
              <div>
                {[
                  { icon: User,   label: 'Nama Lengkap', value: p.profile?.name },
                  { icon: Phone,  label: 'Nomor HP',      value: p.profile?.phone },
                  { icon: Mail,   label: 'Email',         value: p.profile?.email || '—' },
                  { icon: Shield, label: 'Role',          value: p.profile?.role, cap: true },
                ].map(({ icon: Icon, label, value, cap }) => (
                  <div key={label} className="py-3 border-b border-[var(--border)] flex gap-3 items-start last:border-b-0">
                    <Icon size={15} className="text-[var(--text-muted)] mt-[1px] flex-shrink-0" />
                    <div>
                      <div className="text-[11px] text-[var(--text-muted)] mb-[3px]">{label}</div>
                      <div className="text-[13.5px] font-semibold text-[var(--text-primary)]" style={{ textTransform: cap ? 'capitalize' : undefined }}>
                        {value}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col gap-[14px]">
                <FieldWrapper label="Nama Lengkap" icon={User} error={p.infoErrors.name} touched={p.infoTouched.name}>
                  <input
                    className={`input-field ${p.infoTouched.name && p.infoErrors.name ? '!border-[var(--danger)]' : ''}`}
                    placeholder="Nama lengkap kamu"
                    value={p.infoForm.name}
                    onChange={e => p.setInfoForm(f => ({ ...f, name: e.target.value }))}
                    onBlur={() => p.setInfoTouched(t => ({ ...t, name: true }))}
                  />
                </FieldWrapper>
                <FieldWrapper label="Email (Opsional)" icon={Mail} error={p.infoErrors.email} touched={p.infoTouched.email}>
                  <input
                    className={`input-field ${p.infoTouched.email && p.infoErrors.email ? '!border-[var(--danger)]' : ''}`}
                    type="email"
                    placeholder="email@contoh.com"
                    value={p.infoForm.email}
                    onChange={e => p.setInfoForm(f => ({ ...f, email: e.target.value }))}
                    onBlur={() => p.setInfoTouched(t => ({ ...t, email: true }))}
                  />
                </FieldWrapper>
                <div className="bg-[var(--bg-elevated)] rounded-[var(--app-radius-md)] p-[10px_14px] text-[12.5px] text-[var(--text-muted)] flex gap-2 items-start">
                  <Lock size={13} className="mt-[1px] flex-shrink-0 text-[var(--text-muted)]" />
                  Nomor HP tidak dapat diubah karena digunakan sebagai identitas login.
                </div>
              </div>
            )}
          </div>

          {/* Change password card */}
          <div className="card">
            <div className="text-sm font-bold text-[var(--text-primary)] flex items-center gap-2 mb-4">
              <Lock size={15} className="text-[var(--primary)]" /> Ubah Password
            </div>
            {p.pwSuccess && (
              <div className="bg-[rgba(0,180,120,0.1)] border border-[rgba(0,180,120,0.25)] rounded-[var(--app-radius-md)] p-[11px_16px] mb-4 flex gap-[10px] items-center text-[13px] text-[var(--success)] animate-[fadeIn_0.2s_ease]">
                <CheckCircle size={15} /> Password berhasil diperbarui!
              </div>
            )}
            <form onSubmit={p.handleChangePassword} noValidate className="flex flex-col gap-[14px]">
              <FieldWrapper label="Password Saat Ini" icon={Lock} error={p.pwErrors.current_password} touched={p.pwTouched.current_password}>
                <PasswordInput
                  placeholder="Masukkan password saat ini"
                  value={p.pwForm.current_password}
                  onChange={e => p.setPwForm(f => ({ ...f, current_password: e.target.value }))}
                  onBlur={() => p.setPwTouched(t => ({ ...t, current_password: true }))}
                  hasError={p.pwTouched.current_password && !!p.pwErrors.current_password}
                />
              </FieldWrapper>
              <FieldWrapper label="Password Baru" icon={Lock} error={p.pwErrors.new_password} touched={p.pwTouched.new_password}>
                <PasswordInput
                  placeholder="Minimal 8 karakter"
                  value={p.pwForm.new_password}
                  onChange={e => p.setPwForm(f => ({ ...f, new_password: e.target.value }))}
                  onBlur={() => p.setPwTouched(t => ({ ...t, new_password: true }))}
                  hasError={p.pwTouched.new_password && !!p.pwErrors.new_password}
                />
                <PasswordStrength password={p.pwForm.new_password} />
              </FieldWrapper>
              <FieldWrapper label="Konfirmasi Password Baru" icon={Lock} error={p.pwErrors.confirm_password} touched={p.pwTouched.confirm_password}>
                <PasswordInput
                  placeholder="Ulangi password baru"
                  value={p.pwForm.confirm_password}
                  onChange={e => p.setPwForm(f => ({ ...f, confirm_password: e.target.value }))}
                  onBlur={() => p.setPwTouched(t => ({ ...t, confirm_password: true }))}
                  hasError={p.pwTouched.confirm_password && !!p.pwErrors.confirm_password}
                />
              </FieldWrapper>
              <div className="flex justify-end pt-1">
                <button type="submit" className="btn-primary text-[13px]" disabled={p.pwSaving}>
                  {p.pwSaving
                    ? <><span className="spinner w-[13px] h-[13px] border-2 border-[rgba(255,255,255,0.3)] border-t-white rounded-full inline-block" /> Menyimpan...</>
                    : <><Lock size={13} /> Perbarui Password</>}
                </button>
              </div>
            </form>
          </div>

        </div>
      </div>
    </MainLayout>
  )
}
