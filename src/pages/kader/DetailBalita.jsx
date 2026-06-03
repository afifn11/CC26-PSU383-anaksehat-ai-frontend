// src/pages/kader/DetailBalita.jsx
import { Link, useNavigate } from 'react-router-dom'
import MainLayout from '@/components/layout/MainLayout'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import {
  Edit2, PlusCircle, Share2, Eye, ChevronLeft,
  User, MapPin, Brain, Activity,
} from 'lucide-react'
import { Breadcrumb, StatusBadge, EmptyState } from '@/components/ui/SharedComponents'
import { AnimatedStatCard, AnimatedProgressBar } from '@/components/ui/AnimatedCounter'
import { TrendingUp, Calendar, Scale, Ruler } from 'lucide-react'
import { ActivationModal }  from '@/components/ui/ActivationModal'
import { useDetailBalita }  from '@/hooks/useDetailBalita'
import { calcAgeMonths }    from '@/utils/helpers'
import { getWhoStatusShortLabel, getWhoStatusColor, getHazColor } from '@/constants/riskConfig'

function InfoRow({ label, value }) {
  return (
    <div className="flex justify-between items-center py-[10px] border-b border-[var(--border)] text-[13px] last:border-b-0">
      <span className="text-[var(--text-muted)] flex-shrink-0 mr-3">{label}</span>
      <span className="font-semibold text-[var(--text-primary)] text-right">{value || '—'}</span>
    </div>
  )
}

export default function DetailBalita() {
  const {
    child_id, child, history, loading,
    sharing, activation, handleShare, closeActivation,
  } = useDetailBalita()
  const navigate = useNavigate()

  if (loading) return (
    <MainLayout>
      <div className="fade-in">
        <div className="h-4 w-[240px] rounded-md bg-[var(--bg-elevated)] mb-5 skeleton-shimmer" />
        <div className="flex flex-col lg:grid lg:grid-cols-[300px_1fr] gap-4">
          {[1,2,3].map(i => <div key={i} className="card h-[160px] skeleton-shimmer" />)}
        </div>
      </div>
    </MainLayout>
  )

  if (!child) return null

  const latest     = history[0] ?? null
  const ageMonths  = calcAgeMonths(child.birth_date)
  const hazColor = latest?.haz_score != null
    ? (latest.haz_score >= -2 ? 'var(--success)' : latest.haz_score >= -3 ? 'var(--warning)' : 'var(--danger)')
    : 'var(--text-muted)'

  const chartData = [...history].reverse().slice(-6).map(h => ({
    bulan: new Date(h.created_at).toLocaleDateString('id-ID', { month: 'short' }),
    berat: h.weight_kg,
    tinggi: h.height_cm,
  }))

  return (
    <MainLayout>
      <div className="fade-in">
        <Breadcrumb items={[
          { label: 'Dashboard',     href: '/kader/dashboard' },
          { label: 'Kelola Balita', href: '/kader/kelola-balita' },
          { label: child.name },
        ]} />

        {/* Header */}
        <div className="flex justify-between items-start mb-5 flex-wrap gap-[10px]">
          <div>
            <h1 className="page-title">Detail Balita</h1>
            <p className="page-subtitle">Informasi lengkap dan riwayat pemeriksaan {child.name}.</p>
          </div>
          {/* Action buttons — 2x2 grid on mobile */}
          <div className="grid grid-cols-2 sm:flex sm:flex-row gap-2 w-full sm:w-auto">
            <button className="btn-secondary text-[13px] justify-center" onClick={() => navigate('/kader/kelola-balita')}>
              <ChevronLeft size={14} /> Kembali
            </button>
            <button className="btn-secondary text-[13px] justify-center" onClick={handleShare} disabled={sharing}>
              {sharing
                ? <span className="spinner w-[14px] h-[14px] border-2 border-[rgba(0,0,0,0.15)] border-t-[var(--primary)] rounded-full inline-block" />
                : <><Share2 size={14} /> Kode Aktivasi</>}
            </button>
            <Link to={`/kader/edit-balita/${child_id}`} className="btn-secondary text-[13px] justify-center">
              <Edit2 size={14} /> Edit Data
            </Link>
            <Link to="/kader/input-balita" className="btn-primary text-[13px] justify-center">
              <PlusCircle size={14} /> Periksa Ulang
            </Link>
          </div>
        </div>

        {/* Stat cards — 2 col mobile, auto on md */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 mb-4">
          <AnimatedStatCard label="Berat Badan"     value={latest?.weight_kg       ?? null} sub="kilogram"      color="var(--primary)"        icon={Scale}      delay={0}   />
          <AnimatedStatCard label="Tinggi Badan"    value={latest?.height_cm       ?? null} sub="sentimeter"    color="var(--secondary-light)" icon={Ruler}      delay={80}  />
          <AnimatedStatCard label="Usia"            value={ageMonths}                       sub="bulan"         color="var(--accent)"          icon={Calendar}   delay={160} />
          <AnimatedStatCard label="Status Gizi"     value={latest?.stunting_status ? getWhoStatusShortLabel(latest.stunting_status) : '—'} sub="stunting" color={getWhoStatusColor(latest?.stunting_status)} icon={Brain} delay={240} isText />
          <AnimatedStatCard label="Total Periksa"   value={history.length}                  sub="pemeriksaan"   color="var(--success)"         icon={TrendingUp} delay={320} />
        </div>

        {/* ── Main grid: stack on mobile, side-by-side on lg ── */}
        <div className="flex flex-col lg:grid lg:grid-cols-[300px_1fr] gap-4">

          {/* ── Left column ── */}
          <div className="flex flex-col gap-[14px]">

            {/* Profil card */}
            <div className="card">
              <div className="flex items-center gap-[14px] mb-4">
                <div className="avatar w-[52px] h-[52px] text-xl flex-shrink-0">
                  {child.name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()}
                </div>
                <div className="min-w-0">
                  <div className="text-[17px] font-bold text-[var(--text-primary)] font-jakarta truncate">{child.name}</div>
                  <div className="text-xs text-[var(--text-muted)] mt-[2px]">
                    {child.gender === 'male' ? 'Laki-laki' : 'Perempuan'} · {ageMonths} Bulan
                  </div>
                  {latest?.risk_class && (
                    <div className="mt-2"><StatusBadge status={latest.risk_class} /></div>
                  )}
                </div>
              </div>
              <div className="divider" />
              <div className="text-[13px] font-semibold text-[var(--text-primary)] mb-[10px] flex items-center gap-[6px]">
                <User size={13} className="text-[var(--primary)]" /> Identitas
              </div>
              <InfoRow label="Tanggal Lahir"   value={child.birth_date ? new Date(child.birth_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '—'} />
              <InfoRow label="Orang Tua / Wali" value={child.parent_name} />
              <div className="divider mt-[2px]" />
              <div className="text-[13px] font-semibold text-[var(--text-primary)] mb-[10px] flex items-center gap-[6px]">
                <MapPin size={13} className="text-[var(--primary)]" /> Wilayah
              </div>
              <InfoRow label="Alamat"    value={child.address  || '—'} />
              <InfoRow label="Kelurahan" value={child.village  || '—'} />
              <InfoRow label="Kecamatan" value={child.district || '—'} />
              <InfoRow label="Provinsi"  value={child.province || '—'} />
            </div>

            {/* HAZ score */}
            {latest?.haz_score != null && (
              <div className="card">
                <div className="text-[13px] font-semibold text-[var(--text-primary)] mb-3 flex items-center gap-[6px]">
                  <Activity size={13} className="text-[var(--primary)]" /> HAZ Z-Score (WHO)
                </div>
                <div className="flex items-center gap-[14px] mb-[14px]">
                  <div className="text-[38px] font-extrabold font-jakarta leading-none" style={{ color: hazColor }}>
                    {latest.haz_score.toFixed(2)}
                  </div>
                  <div>
                    <div className="text-xs font-semibold" style={{ color: hazColor }}>
                      {latest.haz_score >= -2 ? 'Normal' : latest.haz_score >= -3 ? 'Stunted' : 'Severely Stunted'}
                    </div>
                    <div className="text-[11px] text-[var(--text-muted)] mt-[3px]">Height-for-Age Z-score</div>
                  </div>
                </div>
                <AnimatedProgressBar
                  value={Math.min(100, Math.max(0, ((latest.haz_score + 4) / 6) * 100))}
                  color={hazColor} showValue={false} height={8}
                />
                <div className="flex justify-between text-[10px] text-[var(--text-muted)] mt-1">
                  <span>−4</span><span>−3</span><span>−2</span><span>0</span><span>+2</span>
                </div>
              </div>
            )}
          </div>

          {/* ── Right column ── */}
          <div className="flex flex-col gap-[14px]">

            {/* Tren berat badan */}
            {chartData.length >= 2 && (
              <div className="card">
                <div className="text-sm font-semibold text-[var(--text-primary)] mb-1">Tren Berat Badan</div>
                <div className="text-xs text-[var(--text-muted)] mb-[14px]">{chartData.length} pemeriksaan terakhir</div>
                <ResponsiveContainer width="100%" height={140}>
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="beratGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%"  stopColor="var(--primary)" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="bulan" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                    <YAxis domain={['auto', 'auto']} tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} width={28} />
                    <Tooltip
                      contentStyle={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 12 }}
                      formatter={v => [`${v} kg`, 'Berat']}
                    />
                    <Area type="monotone" dataKey="berat" stroke="var(--primary)" strokeWidth={2} fill="url(#beratGrad)" dot={{ fill: 'var(--primary)', r: 3 }} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Riwayat pemeriksaan */}
            <div className="card !p-0">
              <div className="p-[14px_16px] flex justify-between items-center border-b border-[var(--border)]">
                <div className="text-sm font-semibold text-[var(--text-primary)]">Riwayat Pemeriksaan</div>
                <span className="text-xs text-[var(--text-muted)]">{history.length} rekam</span>
              </div>

              {history.length === 0 ? (
                <div className="p-4">
                  <EmptyState
                    type="riwayat"
                    title="Belum ada pemeriksaan"
                    desc="Lakukan pemeriksaan pertama untuk melihat riwayat di sini."
                  />
                  <div className="text-center mt-[10px]">
                    <Link to="/kader/input-balita" className="btn-primary text-[13px]">
                      <PlusCircle size={14} /> Mulai Pemeriksaan
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="table-wrapper">
                  <table>
                    <thead>
                      <tr>
                        <th>Tanggal</th>
                        <th>BB / TB</th>
                        <th>HAZ</th>
                        <th>Gizi Kurang</th>
                        <th>Status</th>
                        <th>Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {history.map((h, i) => {
                        const hColor = h.haz_score != null
                          ? (h.haz_score >= -2 ? 'var(--success)' : h.haz_score >= -3 ? 'var(--warning)' : 'var(--danger)')
                          : 'var(--text-muted)'
                        const tgl = h.created_at
                          ? new Date(h.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
                          : '—'
                        return (
                          <tr key={h.prediction_id}>
                            <td className="text-xs">
                              {tgl}
                              {i === 0 && (
                                <span className="ml-[6px] bg-[var(--primary-muted)] text-[var(--primary-light)] text-[10px] font-semibold px-[6px] py-[1px] rounded-[100px]">
                                  Terbaru
                                </span>
                              )}
                            </td>
                            <td className="text-xs whitespace-nowrap">{h.weight_kg} kg / {h.height_cm} cm</td>
                            <td className="text-[13px] font-semibold" style={{ color: hColor }}>
                              {h.haz_score != null ? h.haz_score.toFixed(2) : '—'}
                            </td>
                            <td className="text-[13px]" style={{ color: getWhoStatusColor(h.underweight_status) }}>
                              {getWhoStatusShortLabel(h.underweight_status ?? 'Normal')}
                            </td>
                            <td><StatusBadge status={h.risk_class} /></td>
                            <td>
                              <Link
                                to={`/kader/hasil-prediksi/${child_id}/${h.prediction_id}`}
                                className="btn-ghost p-[5px_8px] text-xs"
                                title="Lihat Hasil AI"
                              >
                                <Eye size={14} />
                              </Link>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Rekomendasi terakhir */}
            {latest?.recommendations?.length > 0 && (
              <div className="card bg-[linear-gradient(135deg,rgba(245,176,54,0.08),rgba(245,176,54,0.03))] border-[rgba(245,176,54,0.2)]">
                <div className="flex items-center gap-2 mb-3">
                  <Brain size={16} className="text-[var(--accent)]" />
                  <span className="text-[13px] font-bold text-[var(--accent)]">Rekomendasi Terakhir (AI)</span>
                </div>
                <div className="flex flex-col gap-2">
                  {latest.recommendations.slice(0, 3).map((r, i) => (
                    <div key={i} className="bg-[var(--bg-card)] border border-[var(--border)] rounded-[var(--app-radius-md)] p-[10px_12px] text-[12.5px] text-[var(--text-secondary)] leading-[1.55]">
                      <span className="text-sm mr-2">
                        {{ nutrisi: '🥗', sanitasi: '🚰', kesehatan: '🏥' }[(r.category ?? '').toLowerCase()] ?? '💡'}
                      </span>
                      {r.message}
                    </div>
                  ))}
                </div>
                {latest.prediction_id && (
                  <Link
                    to={`/kader/hasil-prediksi/${child_id}/${latest.prediction_id}`}
                    className="btn-ghost text-xs mt-[10px] text-[var(--accent)] py-1 px-0 inline-flex items-center"
                  >
                    Lihat Analisis Lengkap →
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {activation && (
        <ActivationModal
          kode={activation.kode}
          childName={activation.childName}
          expiredAt={activation.expiredAt}
          onClose={() => closeActivation()}
        />
      )}
    </MainLayout>
  )
}