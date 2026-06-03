// src/pages/kader/Dashboard.jsx
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { MOCK_BALITA, MOCK_DASHBOARD_STATS, CHART_DATA_KOMUNITAS } from '@/store/mockData'
import { kaderService } from '@/services/balitaService'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { Users, Activity, AlertCircle, TrendingDown, ChevronRight, PlusCircle } from 'lucide-react'
import MainLayout from '@/components/layout/MainLayout'
import { AnimatedStatCard, StatusGiziDonut } from '@/components/ui/AnimatedCounter'
import { StatCardSkeleton, TableRowSkeleton, StatusBadge } from '@/components/ui/SharedComponents'


// Bangun data chart tren dari balita_terkini yang sudah ada di response backend.
// Kelompokkan per bulan, ambil rata-rata haz_score tiap bulan (dikonversi ke 0-100).
// Jika data < 2 bulan (belum cukup untuk tren), kembalikan null → chart tetap pakai mock.
function buildChartFromBalita(balitaList) {
  const map = {}
  for (const b of balitaList) {
    if (!b.tanggal_periksa || b.haz_score == null) continue
    const bulan = b.tanggal_periksa.slice(0, 7) // "YYYY-MM"
    if (!map[bulan]) map[bulan] = { total: 0, sum: 0 }
    // Konversi HAZ ke skala 0-100 untuk chart: clamp (haz+4)/6*100
    map[bulan].sum   += Math.min(100, Math.max(0, ((b.haz_score + 4) / 6) * 100))
    map[bulan].total += 1
  }
  const entries = Object.entries(map).sort(([a], [b]) => a.localeCompare(b))
  if (entries.length < 2) return null
  return entries.map(([bulan, { sum, total }]) => ({
    bulan: new Date(bulan + '-01').toLocaleDateString('id-ID', { month: 'short' }),
    nilai: parseFloat((sum / total).toFixed(1)),
  }))
}

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true'

export default function KaderDashboard() {
  const { user } = useAuthStore()
  const [stats, setStats]   = useState(null)
  const [balita, setBalita] = useState([])
  const [chart, setChart]   = useState(CHART_DATA_KOMUNITAS)
  const [loadingStats, setLoadingStats] = useState(true)

  const today = new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        if (USE_MOCK) {
          await new Promise(r => setTimeout(r, 800))
          setStats(MOCK_DASHBOARD_STATS)
          setBalita(MOCK_BALITA.slice(0, 5))
        } else {
          const data = await kaderService.getDashboardStats()
          setStats(data)
          const terkini = data.balita_terkini ?? []
          setBalita(terkini)
          // Bangun chart dari data riil; fallback ke mock kalau data belum cukup
          const chartRiil = buildChartFromBalita(terkini)
          if (chartRiil) setChart(chartRiil)
        }
      } catch {
        // Halaman tetap bisa digunakan meski stats gagal
      } finally {
        setLoadingStats(false)
      }
    }
    fetchDashboard()
  }, [])

  const normal  = stats?.normal ?? 0
  const stunted = stats?.stunted ?? 0
  const severe  = stats?.severely_stunted ?? 0
  const total   = stats?.total_balita ?? 0

  return (
    <MainLayout>
      <div className="fade-in space-y-5">

        {/* ── Page Header ── */}
        <div className="flex justify-between items-start flex-wrap gap-2.5">
          <div>
            <h1 className="page-title">Dashboard Kader</h1>
            <p className="page-subtitle">
              Selamat datang, <strong>{user?.nama?.split(' ')[0]}</strong>
              {user?.wilayah_posyandu ? ` · ${user.wilayah_posyandu}` : ''}
            </p>
          </div>
          <div className="text-xs text-[var(--text-muted)] bg-[var(--bg-card)] border border-[var(--border)] rounded-lg px-3 py-1.5 flex-shrink-0">
            {today}
          </div>
        </div>

        {/* ── AI Insight Banner ── */}
        <div className="bg-[linear-gradient(135deg,rgba(120,102,188,0.15)_0%,rgba(0,136,106,0.1)_100%)] border border-[rgba(120,102,188,0.25)] rounded-[var(--radius-lg)] p-[14px_18px] flex gap-3.5 items-start">
          <div className="w-9 h-9 bg-[var(--secondary-muted)] rounded-[9px] flex items-center justify-center flex-shrink-0">
            <AlertCircle size={18} className="text-[var(--secondary-light)]" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-center flex-wrap gap-1.5 mb-1">
              <span className="text-[13px] font-bold text-[var(--secondary-light)]">AI INSIGHT</span>
              {stunted > 0 && <span className="badge badge-severe">{stunted} Perlu Intervensi</span>}
            </div>
            <p className="text-[13px] text-[var(--text-secondary)] leading-[1.5]">
              {loadingStats
                ? 'Menganalisis data wilayah Anda...'
                : stunted > 0
                  ? `${stunted} balita terdeteksi berisiko stunting di wilayah Anda. Segera lakukan intervensi gizi dan kunjungan rumah.`
                  : 'Semua balita di wilayah Anda berada dalam status gizi Normal. Pertahankan program posyandu yang berjalan.'
              }
            </p>
            <Link to="/kader/kelola-balita" className="btn-ghost text-xs py-1 px-0 text-[var(--primary-light)] mt-1 inline-flex items-center gap-1">
              Lihat Semua Data Balita <ChevronRight size={13} />
            </Link>
          </div>
        </div>

        {/* ── Stat Cards — 2 cols mobile, 4 cols lg+ ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {loadingStats
            ? Array.from({ length: 4 }).map((_, i) => <StatCardSkeleton key={i} />)
            : (
              <>
                <AnimatedStatCard label="Total Balita"     value={total}   sub="Di wilayah Anda"                                          color="var(--primary)"  icon={Users}        trend={3.2}  delay={0}   />
                <AnimatedStatCard label="Status Normal"    value={normal}  sub={total ? `${Math.round(normal / total * 100)}% dari total` : '—'} color="var(--success)" icon={Activity}     trend={2.1}  delay={80}  />
                <AnimatedStatCard label="Risiko Stunted"   value={stunted} sub="Perlu intervensi"                                          color="var(--warning)" icon={AlertCircle}  trend={-1.5} delay={160} />
                <AnimatedStatCard label="Severely Stunted" value={severe}  sub="Prioritas utama"                                           color="var(--danger)"  icon={TrendingDown} trend={-0.5} delay={240} />
              </>
            )
          }
        </div>

        {/* ── Charts Row — stacked on mobile, side-by-side on lg+ ── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_260px] gap-4">
          {/* Area chart */}
          <div className="card">
            <div className="flex justify-between items-center mb-4">
              <div>
                <div className="text-sm font-semibold text-[var(--text-primary)]">Tren Kesehatan Komunitas</div>
                <div className="text-xs text-[var(--text-muted)]">Rata-rata nutrition score (7 bulan terakhir)</div>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={160}>
              <AreaChart data={chart}>
                <defs>
                  <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="var(--primary)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="bulan" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                <YAxis domain={[60, 100]} tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} width={30} />
                <Tooltip contentStyle={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 12 }} />
                <Area type="monotone" dataKey="nilai" stroke="var(--primary)" strokeWidth={2} fill="url(#grad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Donut chart */}
          <div className="card">
            <div className="text-sm font-semibold text-[var(--text-primary)] mb-1">Distribusi Status Gizi</div>
            <div className="text-xs text-[var(--text-muted)] mb-2">Keseluruhan wilayah</div>
            <StatusGiziDonut normal={normal} stunted={stunted} severe={severe} loading={loadingStats} />
          </div>
        </div>

        {/* ── Table + Quick Actions — stacked on mobile, side-by-side on lg+ ── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_220px] gap-4">

          {/* Recent table */}
          <div className="card !p-0">
            <div className="p-[14px_16px] flex justify-between items-center border-b border-[var(--border)]">
              <div className="text-sm font-semibold text-[var(--text-primary)]">Data Balita Terkini</div>
              <Link to="/kader/kelola-balita" className="btn-ghost text-xs">
                Lihat Semua <ChevronRight size={13} />
              </Link>
            </div>
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Balita &amp; Orang Tua</th>
                    <th>Usia</th>
                    <th className="hide-mobile">BB / TB</th>
                    <th>HAZ</th>
                    <th>Status Gizi</th>
                  </tr>
                </thead>
                <tbody>
                  {loadingStats
                    ? Array.from({ length: 4 }).map((_, i) => <TableRowSkeleton key={i} cols={5} />)
                    : balita.map(b => {
                        const hazColor = b.haz_score != null
                          ? (b.haz_score >= -2 ? 'var(--success)' : b.haz_score >= -3 ? 'var(--warning)' : 'var(--danger)')
                          : 'var(--text-muted)'
                        return (
                          <tr key={b.id}>
                            <td>
                              <div className="flex items-center gap-2.5">
                                <div className="avatar flex-shrink-0">
                                  {b.nama.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()}
                                </div>
                                <div>
                                  <div className="font-semibold text-[13px]">{b.nama}</div>
                                  <div className="text-[11.5px] text-[var(--text-muted)]">{b.nama_ibu}</div>
                                </div>
                              </div>
                            </td>
                            <td className="text-[13px]">{b.usia_bulan} bln</td>
                            <td className="text-[13px] hide-mobile">{b.berat_badan}kg / {b.tinggi_badan}cm</td>
                            <td className="text-[13px] font-semibold" style={{ color: hazColor }}>
                              {b.haz_score != null ? b.haz_score.toFixed(2) : '—'}
                            </td>
                            <td><StatusBadge status={b.status_risiko} /></td>
                          </tr>
                        )
                      })
                  }
                </tbody>
              </table>
            </div>
          </div>

          {/* Quick actions */}
          <div className="card flex flex-col gap-2.5">
            <div className="text-sm font-semibold text-[var(--text-primary)]">Aksi Cepat</div>
            <Link to="/kader/input-balita" className="btn-primary w-full justify-center text-[13px]">
              <PlusCircle size={15} /> Input Data Baru
            </Link>
            <Link to="/kader/kelola-balita" className="btn-secondary w-full justify-center text-[13px]">
              Semua Data Balita
            </Link>
            <Link to="/kader/riwayat" className="btn-secondary w-full justify-center text-[13px]">
              Riwayat Pemeriksaan
            </Link>
            <div className="divider" />
            <p className="text-xs text-[var(--text-muted)] leading-[1.5]">
              Model AI menggunakan standar WHO Child Growth Standards untuk menghitung HAZ z-score.
            </p>
          </div>
        </div>

      </div>
    </MainLayout>
  )
}