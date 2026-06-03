// src/pages/orangtua/RiwayatAnak.jsx
import { useEffect, useState } from 'react'
import MainLayout from '@/components/layout/MainLayout'
import { prediksiService } from '@/services/balitaService'
import { useAuthStore } from '@/store/authStore'
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts'
import { TrendingUp } from 'lucide-react'
import toast from 'react-hot-toast'
import { Breadcrumb, CardSkeleton, EmptyState, StatusBadge } from '@/components/ui/SharedComponents'
import { getWhoStatusColor, getWhoStatusShortLabel } from '@/constants/riskConfig'
import { AnimatedStatCard } from '@/components/ui/AnimatedCounter'

// Pastikan fungsi ini tersedia secara lokal atau di helpers jika tidak ada di API
function whoMedianBerat(gender, age) {
  if (!age) return null
  const m = [3.3,4.5,5.6,6.4,7.0,7.5,7.9,8.3,8.6,8.9,9.2,9.4,9.6,9.9,10.1,10.3,10.5,10.7,10.9,11.1,11.3,11.5,11.8,12.0,12.2]
  const f = [3.2,4.2,5.1,5.8,6.4,6.9,7.3,7.6,7.9,8.2,8.5,8.7,8.9,9.2,9.4,9.6,9.8,10.0,10.2,10.4,10.6,10.9,11.1,11.3,11.5]
  const arr = gender === 'male' || gender === 'Laki-laki' ? m : f
  return arr[Math.min(Math.max(0, Math.round(age)), arr.length - 1)] ?? null
}

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true'

export default function RiwayatAnak() {
  const { user } = useAuthStore() // Gunakan child_id dari authStore

  const [riwayat, setRiwayat]   = useState([])
  const [chart, setChart]       = useState([])
  const [namaAnak, setNamaAnak] = useState('')
  const [loading, setLoading]   = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (USE_MOCK) {
          const { MOCK_RIWAYAT, MOCK_BALITA, CHART_DATA_PERTUMBUHAN } = await import('@/store/mockData')
          await new Promise(r => setTimeout(r, 700))
          setRiwayat(MOCK_RIWAYAT ?? [])
          setChart(CHART_DATA_PERTUMBUHAN ?? [])
          setNamaAnak(MOCK_BALITA[4]?.nama ?? '')
          return
        }
        
        const childId = user?.child_id
        if (!childId) {
            toast.error('Data anak belum tertaut dengan akun Anda.')
            setLoading(false)
            return
        }

        // Fetch langsung riwayat anak, tidak lewat getDashboard()
        const data = await prediksiService.getRiwayat(childId)
        const sortedData = data ?? []
        setRiwayat(sortedData)

        // Bangun data chart secara mandiri (mencegah fetching 2x)
        if (sortedData.length > 0) {
            const nama = sortedData[0]?.balita?.nama ?? user?.nama ?? 'Anak'
            const gender = sortedData[0]?.balita?.jenis_kelamin ?? 'Perempuan'
            setNamaAnak(nama)

            const chartData = [...sortedData].reverse().slice(0, 6).map(h => ({
                bulan: new Date(h.tanggal ?? h.created_at).toLocaleDateString('id-ID', { month: 'short', year: '2-digit' }),
                berat: h.balita?.berat_badan ?? h.weight_kg,
                who_median_berat: whoMedianBerat(gender, h.balita?.usia_bulan ?? h.age_months),
            }))
            setChart(chartData)
        }

      } catch (err) {
        toast.error('Gagal memuat riwayat pemeriksaan.')
      } finally {
        setLoading(false)
      }
    }

    if(user) fetchData()
  }, [user])

  const beratAwal   = riwayat.length ? riwayat[riwayat.length - 1]?.balita?.berat_badan ?? riwayat[riwayat.length - 1]?.weight_kg ?? 0 : 0
  const beratAkhir  = riwayat.length ? riwayat[0]?.balita?.berat_badan ?? riwayat[0]?.weight_kg ?? 0 : 0
  const tinggiAwal  = riwayat.length ? riwayat[riwayat.length - 1]?.balita?.tinggi_badan ?? riwayat[riwayat.length - 1]?.height_cm ?? 0 : 0
  const tinggiAkhir = riwayat.length ? riwayat[0]?.balita?.tinggi_badan ?? riwayat[0]?.height_cm ?? 0 : 0
  const normalCount = riwayat.filter(r => (r.stunting_status ?? r.status_risiko) === 'Normal').length

  if (loading) return (
    <MainLayout>
      <div className="fade-in max-w-[1000px] mx-auto">
        <div className="skeleton-shimmer h-4 w-[200px] rounded-[5px] mb-[18px]" />
        {/* Responsif grid skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
          {[0,1,2].map(i => <CardSkeleton key={i} lines={3} />)}
        </div>
        <CardSkeleton lines={6} />
      </div>
    </MainLayout>
  )

  return (
    <MainLayout>
      <div className="fade-in max-w-[1000px] mx-auto">
        <Breadcrumb items={[
          { label: 'Dashboard', href: '/orangtua/dashboard' },
          { label: 'Riwayat Pemeriksaan' },
        ]} />

        <div className="mb-5">
          <h1 className="page-title">Riwayat Pemeriksaan</h1>
          <p className="page-subtitle">Rekam jejak tumbuh kembang {namaAnak} dari waktu ke waktu.</p>
        </div>

        {riwayat.length > 0 && (
          // UI Fix: Tailwind responsif grid (1 col mobile, 3 col desktop)
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
            <AnimatedStatCard label="Pertumbuhan Berat"  value={Math.round((beratAkhir  - beratAwal)  * 10) / 10} sub={`${beratAwal} → ${beratAkhir} kg`}    color="var(--success)"        icon={TrendingUp} delay={0}   />
            <AnimatedStatCard label="Pertumbuhan Tinggi" value={Math.round((tinggiAkhir - tinggiAwal) * 10) / 10} sub={`${tinggiAwal} → ${tinggiAkhir} cm`}   color="var(--primary)"        icon={TrendingUp} delay={80}  />
            <AnimatedStatCard label="Status Normal" value={normalCount} sub="dari total pemeriksaan" color="var(--success)" icon={TrendingUp} delay={160} />
          </div>
        )}

        {/* Grafik */}
        {chart.length > 0 && (
          <div className="card mb-4 overflow-hidden">
            <div className="text-sm font-semibold text-[var(--text-primary)] mb-1">Grafik Berat Badan vs Median WHO</div>
            <div className="flex gap-[14px] mb-[10px] text-xs">
              <div className="flex items-center gap-[5px]">
                <div className="w-[14px] h-[3px] bg-[var(--primary)] rounded-[2px]" />
                <span className="text-[var(--text-muted)]">Anak</span>
              </div>
              <div className="flex items-center gap-[5px]">
                <div className="w-[14px] h-0 border-[1.5px] border-dashed border-[var(--secondary-light)]" />
                <span className="text-[var(--text-muted)]">Median WHO</span>
              </div>
            </div>
            
            {/* Scroll wrapper mobile */}
            <div className="overflow-x-auto w-full pb-2 no-scrollbar">
              <div className="min-w-[400px]">
                <ResponsiveContainer width="100%" height={220}>
                  <LineChart data={chart}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="bulan" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                    <YAxis domain={['auto','auto']} tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} width={28} />
                    <Tooltip contentStyle={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 12 }}
                      formatter={(v, name) => [`${v} kg`, name === 'berat' ? 'Anak' : 'Median WHO']} />
                    <Line type="monotone" dataKey="berat" stroke="var(--primary)" strokeWidth={2.5} dot={{ fill: 'var(--primary)', r: 4 }} activeDot={{ r: 6 }} />
                    <Line type="monotone" dataKey="who_median_berat" stroke="var(--secondary-light)" strokeWidth={1.5} strokeDasharray="5 5" dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* Timeline */}
        <div className="card">
          <div className="text-sm font-semibold text-[var(--text-primary)] mb-4">
            Timeline Pemeriksaan ({riwayat.length} rekam)
          </div>
          {riwayat.length === 0 ? (
            <EmptyState type="riwayat" />
          ) : (
            riwayat.map((r, i) => {
              const hazColor  = r.haz_score != null ? (r.haz_score >= -2 ? 'var(--success)' : r.haz_score >= -3 ? 'var(--warning)' : 'var(--danger)') : 'var(--text-muted)'
              const tanggal   = r.tanggal_str || r.tanggal?.slice(0, 10) || '—'
              const isLatest  = i === 0
              return (
                <div
                  key={r.prediction_id ?? i}
                  className="flex gap-[14px]"
                  style={{
                    marginBottom: i < riwayat.length - 1 ? 20 : 0,
                    paddingBottom: i < riwayat.length - 1 ? 20 : 0,
                    borderBottom: i < riwayat.length - 1 ? '1px solid var(--border)' : 'none',
                  }}
                >
                  <div className="flex flex-col items-center flex-shrink-0">
                    <div
                      className="w-3 h-3 rounded-full mt-[3px]"
                      style={{
                        background: isLatest ? 'var(--primary)' : 'var(--border-medium)',
                        border: `2px solid ${isLatest ? 'var(--primary)' : 'var(--border)'}`,
                        boxShadow: isLatest ? '0 0 0 4px var(--primary-muted)' : 'none',
                      }}
                    />
                    {i < riwayat.length - 1 && (
                      <div className="w-[1px] flex-1 bg-[var(--border)] mt-1" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start flex-col sm:flex-row gap-2">
                      <div>
                        <div className="text-xs text-[var(--text-muted)] mb-2 flex items-center flex-wrap gap-1">
                          {tanggal}
                          {isLatest && (
                            <span className="bg-[var(--primary-muted)] text-[var(--primary-light)] text-[10px] font-semibold px-[7px] py-[1px] rounded-[100px] sm:ml-[6px]">
                              Terbaru
                            </span>
                          )}
                        </div>
                        <div className="flex gap-[18px] flex-wrap">
                          {[
                            ['Berat',  r.balita?.berat_badan != null ? `${r.balita.berat_badan} kg` : r.weight_kg != null ? `${r.weight_kg} kg` : '—'],
                            ['Tinggi', r.balita?.tinggi_badan != null ? `${r.balita.tinggi_badan} cm` : r.height_cm != null ? `${r.height_cm} cm` : '—'],
                          ].map(([l, v]) => (
                            <div key={l}>
                              <div className="text-[11px] text-[var(--text-muted)]">{l}</div>
                              <div className="text-base font-bold text-[var(--text-primary)] font-jakarta">{v}</div>
                            </div>
                          ))}
                          <div>
                            <div className="text-[11px] text-[var(--text-muted)]">Gizi Kurang</div>
                            <div className="text-[13px] font-bold font-jakarta" style={{ color: getWhoStatusColor(r.underweight_status) }}>
                              {getWhoStatusShortLabel(r.underweight_status ?? 'Normal')}
                            </div>
                          </div>
                          {r.haz_score != null && (
                            <div>
                              <div className="text-[11px] text-[var(--text-muted)]">HAZ</div>
                              <div className="text-base font-bold font-jakarta" style={{ color: hazColor }}>
                                {r.haz_score.toFixed(2)}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="mt-2 sm:mt-0 flex-shrink-0">
                        {(r.status_risiko ?? r.status) && <StatusBadge status={r.status_risiko ?? r.status} />}
                      </div>
                    </div>
                    {isLatest && (
                      <div
                        className="mt-[10px] p-[8px_12px] rounded-lg text-xs"
                        style={{
                          background: (r.status_risiko ?? r.status) === 'Normal' ? 'var(--success-muted)' : 'var(--warning-muted)',
                          color: (r.status_risiko ?? r.status) === 'Normal' ? 'var(--success)' : 'var(--warning)',
                        }}
                      >
                        {(r.status_risiko ?? r.status) === 'Normal'
                          ? '✓ Pertumbuhan sesuai standar WHO.'
                          : '⚠ Perlu perhatian. Konsultasikan dengan kader Posyandu.'}
                      </div>
                    )}
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>
    </MainLayout>
  )
}