// src/pages/orangtua/Dashboard.jsx
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import MainLayout from '@/components/layout/MainLayout'
import { useAuthStore } from '@/store/authStore'
import { orangtuaService } from '@/services/balitaService'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { Brain, ChevronRight, BookOpen, Video, Users, TrendingUp } from 'lucide-react'
import toast from 'react-hot-toast'
import { CardSkeleton, StatusBadge, EmptyState } from '@/components/ui/SharedComponents'
import { getHazColor, getWhoStatusColor, getWhoStatusShortLabel } from '@/constants/riskConfig'
import { AnimatedStatCard, AnimatedProgressBar } from '@/components/ui/AnimatedCounter'

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true'

export default function OrangTuaDashboard() {
  const { user }  = useAuthStore()
  const [anak, setAnak]     = useState(null)
  const [chart, setChart]   = useState([])
  const [loading, setLoading] = useState(true)
  const [chartMode, setChartMode] = useState('berat')

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (USE_MOCK) {
          const { MOCK_BALITA, CHART_DATA_PERTUMBUHAN } = await import('@/store/mockData')
          await new Promise(r => setTimeout(r, 700))
          setAnak(MOCK_BALITA.find(b => b.no_hp_ortu === user?.no_hp) || MOCK_BALITA[4])
          setChart(CHART_DATA_PERTUMBUHAN)
        } else {
          // Lewatkan child_id secara eksplisit — service tidak boleh mengimpor store
          const data = await orangtuaService.getDashboard(user?.child_id)
          if (!data) { toast.error('Data anak tidak ditemukan.'); return }
          setAnak(data.anak)
          if (data.chart_pertumbuhan?.length > 0) setChart(data.chart_pertumbuhan)
        }
      } catch {
        toast.error('Gagal memuat data dashboard.')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  // Gunakan child_id sebagai dependency — ini yang benar-benar dipakai service
  // untuk fetch data, bukan no_hp yang tidak relevan.
  }, [user?.child_id])

  if (loading) return (
    <MainLayout>
      <div className="fade-in">
        {/* Skeleton — stacked mobile, 2-col lg+ */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-4">
          <div className="flex flex-col gap-3.5">
            <CardSkeleton lines={5} />
            <CardSkeleton lines={3} />
          </div>
          <div className="flex flex-col gap-3.5">
            <CardSkeleton lines={4} />
            <CardSkeleton lines={3} />
          </div>
        </div>
      </div>
    </MainLayout>
  )

  if (!anak) return (
    <MainLayout>
      <EmptyState
        type="balita"
        title="Data anak belum tersedia"
        desc="Hubungi kader Posyandu untuk mendaftarkan anak Anda dan mendapatkan kode aktivasi."
      />
    </MainLayout>
  )

  const hazColor = getHazColor(anak.haz_score)

  // Mapping label edukasi ke route navigasi
  const EDUKASI_ITEMS = [
    {
      icon: BookOpen,
      label: 'Artikel',
      title: 'Strategi MPASI & Nutrisi Optimal',
      color: 'var(--primary)',
      href: '/orangtua/rekomendasi',
    },
    {
      icon: Video,
      label: 'Video',
      title: 'Pijat Bayi untuk Tumbuh Optimal',
      color: 'var(--secondary-light)',
      href: '/orangtua/rekomendasi',
    },
    {
      icon: Users,
      label: 'Komunitas',
      title: 'Forum Diskusi Orang Tua Balita',
      color: 'var(--accent)',
      href: '/orangtua/rekomendasi',
    },
  ]

  return (
    <MainLayout>
      <div className="fade-in space-y-5 max-w-[1400px]">

        {/* ── Page Header ── */}
        <div className="flex justify-between items-start flex-wrap gap-2.5">
          <div>
            <h1 className="page-title">Dashboard Orang Tua</h1>
            <p className="page-subtitle">
              Pantau tumbuh kembang <strong>{anak.nama}</strong> secara berkala.
            </p>
          </div>
        </div>

        {/* ── Quick Stats — 2 cols mobile, 4 cols lg+ ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <AnimatedStatCard label="Berat Badan"     value={anak.berat_badan    ? Math.round(anak.berat_badan * 10) / 10 : null}    sub="kilogram"    color="var(--primary)"        icon={TrendingUp} delay={0}   />
          <AnimatedStatCard label="Tinggi Badan"    value={anak.tinggi_badan   ? Math.round(anak.tinggi_badan * 10) / 10 : null}   sub="sentimeter"  color="var(--secondary-light)" icon={TrendingUp} delay={80}  />
          <AnimatedStatCard label="Usia"            value={anak.usia_bulan}                                                          sub="bulan"       color="var(--accent)"         icon={TrendingUp} delay={160} />
          <AnimatedStatCard label="Status Gizi" value={anak.stunting_status ? getWhoStatusShortLabel(anak.stunting_status) : '—'} sub="stunting" color={getWhoStatusColor(anak.stunting_status)} icon={Brain} delay={240} isText />
        </div>

        {/* ── Main Content — stacked mobile, 2-col lg+ ── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-4">

          {/* Left column */}
          <div className="flex flex-col gap-3.5">

            {/* Status card */}
            <div className="card">
              <div className="flex items-start gap-3.5">
                <div className="avatar w-[52px] h-[52px] text-xl flex-shrink-0">
                  {(anak.nama ?? '?').split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2.5 flex-wrap mb-1">
                    <div className="text-lg font-bold text-[var(--text-primary)] font-jakarta">{anak.nama}</div>
                    {anak.status_risiko && <StatusBadge status={anak.status_risiko} />}
                  </div>
                  <div className="text-[12.5px] text-[var(--text-muted)] mb-3.5">
                    {anak.usia_bulan} Bulan · {anak.jenis_kelamin}
                    {anak.tanggal_periksa ? ` · Terakhir periksa: ${anak.tanggal_periksa}` : ''}
                  </div>
                  {anak.haz_score != null && (
                    <div>
                      <div className="text-xs text-[var(--text-muted)] mb-1.5">
                        HAZ Z-Score:{' '}
                        <strong style={{ color: hazColor }}>{anak.haz_score.toFixed(2)}</strong>
                        <span className="ml-2 text-[11px]">(standar WHO: ≥ −2 = Normal)</span>
                      </div>
                      <AnimatedProgressBar
                        value={Math.min(100, Math.max(0, ((anak.haz_score + 4) / 6) * 100))}
                        color={hazColor}
                        showValue={false}
                        height={6}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Growth chart */}
            {chart.length > 0 && (
              <div className="card">
                <div className="flex justify-between items-center mb-3 flex-wrap gap-2">
                  <div>
                    <div className="text-sm font-semibold text-[var(--text-primary)]">
                      Grafik Pertumbuhan — {chartMode === 'berat' ? 'Berat Badan' : 'Tinggi Badan'}
                    </div>
                    <div className="text-xs text-[var(--text-muted)] mt-[2px]">vs Median WHO</div>
                  </div>
                  <div className="flex gap-1">
                    {[['berat', 'Berat (kg)'], ['tinggi', 'Tinggi (cm)']].map(([mode, label]) => (
                      <button
                        key={mode}
                        onClick={() => setChartMode(mode)}
                        className={`btn-ghost text-xs px-2.5 py-1 rounded-[20px] transition-colors ${
                          chartMode === mode
                            ? 'bg-[var(--primary-muted)] text-[var(--primary-light)]'
                            : 'text-[var(--text-muted)]'
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex gap-3.5 mb-2.5 text-xs">
                  <div className="flex items-center gap-[5px]">
                    <div className="w-[14px] h-[3px] bg-[var(--primary)] rounded-[2px]" />
                    <span className="text-[var(--text-muted)]">{anak.nama?.split(' ')[0]}</span>
                  </div>
                  <div className="flex items-center gap-[5px]">
                    <div className="w-[14px] h-0 border-[1.5px] border-dashed border-[var(--secondary-light)]" />
                    <span className="text-[var(--text-muted)]">Median WHO</span>
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={180}>
                  <LineChart data={chart}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="bulan" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                    <YAxis domain={['auto', 'auto']} tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} width={30} />
                    <Tooltip
                      contentStyle={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 12 }}
                      formatter={(v, name) => [`${v} ${chartMode === 'berat' ? 'kg' : 'cm'}`, name === chartMode ? 'Anak' : 'Median WHO']}
                    />
                    <Line type="monotone" dataKey={chartMode} stroke="var(--primary)" strokeWidth={2.5} dot={{ fill: 'var(--primary)', r: 4 }} activeDot={{ r: 6 }} />
                    <Line type="monotone" dataKey={chartMode === 'berat' ? 'who_median_berat' : 'who_median_tinggi'} stroke="var(--secondary-light)" strokeWidth={1.5} strokeDasharray="5 5" dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Education cards — 1 col mobile, 3 cols md+ */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {EDUKASI_ITEMS.map(({ icon: Icon, label, title, color, href }) => (
                <div key={label} className="card flex flex-col gap-2">
                  <div className="w-[34px] h-[34px] rounded-[9px] flex items-center justify-center flex-shrink-0" style={{ background: `${color}22` }}>
                    <Icon size={17} color={color} />
                  </div>
                  <div className="text-[10px] text-[var(--text-muted)] font-semibold uppercase tracking-[0.5px]">{label}</div>
                  <div className="text-[12.5px] font-semibold text-[var(--text-primary)] leading-[1.4]">{title}</div>
                  <Link
                    to={href}
                    className="btn-ghost text-xs py-[3px] px-0 mt-auto no-underline inline-flex items-center gap-[3px]"
                    style={{ color }}
                  >
                    Buka <ChevronRight size={12} />
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Right sidebar */}
          <div className="flex flex-col gap-3.5">
            {/* AI Insight */}
            <div className="card bg-[linear-gradient(135deg,rgba(0,136,106,0.12),rgba(0,136,106,0.04))] border-[rgba(0,136,106,0.25)]">
              <div className="flex items-center gap-2 mb-2.5">
                <Brain size={16} className="text-[var(--primary-light)]" />
                <span className="text-[13px] font-bold text-[var(--primary-light)]">AI Insight Terkini</span>
              </div>
              <p className="text-[13px] text-[var(--text-secondary)] leading-[1.55] mb-3">
                {anak.status_risiko === 'Normal'
                  ? `${anak.nama} berada dalam status gizi Normal (HAZ: ${anak.haz_score?.toFixed(2) ?? '—'}). Pertahankan pola makan dan kunjungan Posyandu rutin.`
                  : `${anak.nama} memerlukan perhatian khusus (${anak.status_risiko ?? '—'}). Segera konsultasikan dengan kader Posyandu.`
                }
              </p>
              <Link to="/orangtua/rekomendasi" className="btn-ghost text-[var(--primary-light)] text-xs py-1 px-0 inline-flex items-center gap-1">
                Lihat Rekomendasi Lengkap <ChevronRight size={13} />
              </Link>
            </div>

            {/* Quick access */}
            <div className="card">
              <div className="text-[13px] font-semibold text-[var(--text-primary)] mb-3">Akses Cepat</div>
              <div className="flex flex-col gap-2">
                <Link to="/orangtua/data-anak"   className="btn-secondary w-full justify-center text-[13px]">Data Lengkap Anak</Link>
                <Link to="/orangtua/riwayat"     className="btn-secondary w-full justify-center text-[13px]">Riwayat Pemeriksaan</Link>
                <Link to="/orangtua/rekomendasi" className="btn-secondary w-full justify-center text-[13px]">Rekomendasi AI</Link>
              </div>
            </div>

            {/* Jadwal */}
            <div className="card bg-[var(--accent-muted)] border-[rgba(245,176,54,0.2)]">
              <div className="text-[13px] font-semibold text-[var(--accent)] mb-1.5">⏰ Jadwal Posyandu</div>
              <p className="text-[12.5px] text-[var(--text-secondary)] leading-[1.5]">
                Timbang dan ukur {anak.nama?.split(' ')[0]} setiap bulan untuk memantau pertumbuhan secara akurat.
              </p>
            </div>
          </div>
        </div>

      </div>
    </MainLayout>
  )
}