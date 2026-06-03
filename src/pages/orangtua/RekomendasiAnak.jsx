// src/pages/orangtua/RekomendasiAnak.jsx
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import MainLayout from '@/components/layout/MainLayout'
import { prediksiService } from '@/services/balitaService'
import { useAuthStore } from '@/store/authStore'
import { Brain, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react'
import toast from 'react-hot-toast'
import { Breadcrumb, CardSkeleton, EmptyState, StatusBadge } from '@/components/ui/SharedComponents'
import { getHazColor, getWhoStatusColor, getWhoStatusShortLabel } from '@/constants/riskConfig'

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true'

function RekomendasiCard({ r, index }) {
  const [open, setOpen] = useState(index === 0)
  const priorityColor = { high: 'var(--danger)', medium: 'var(--warning)', low: 'var(--success)' }[r.priority] ?? 'var(--primary)'
  
  return (
    <div className="card !p-0 overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center gap-[14px] p-[14px_16px] bg-transparent border-none cursor-pointer text-left focus:outline-none"
      >
        <div
          className="w-[44px] h-[44px] bg-[var(--bg-elevated)] rounded-xl flex items-center justify-center text-[22px] flex-shrink-0 border-2"
          style={{ borderColor: `${priorityColor}22` }}
        >
          {r.icon ?? '💡'}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-bold text-[var(--text-primary)]">{r.judul}</span>
            <span className="badge badge-secondary text-[11px]">{r.kategori}</span>
            {r.priority && (
              <span
                className="badge text-[10px]"
                style={{ background: `${priorityColor}22`, color: priorityColor }}
              >
                {r.priority === 'high' ? 'Prioritas' : r.priority === 'medium' ? 'Disarankan' : 'Opsional'}
              </span>
            )}
          </div>
          <div className="text-xs text-[var(--text-muted)] mt-[2px]">
            Klik untuk {open ? 'sembunyikan' : 'lihat'} detail
          </div>
        </div>
        <div className="flex-shrink-0 text-[var(--text-muted)]">
          {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>
      </button>
      {open && (
        <div className="px-4 pb-[14px] border-t border-[var(--border)] animate-[fadeIn_0.2s_ease]">
          <p className="text-[13px] text-[var(--text-secondary)] leading-[1.65] mt-3 mb-0">{r.detail}</p>
        </div>
      )}
    </div>
  )
}

export default function RekomendasiAnak() {
  const { prediksiId } = useParams()
  const { user } = useAuthStore() // Mengambil child_id langsung dari store
  
  const [data, setData]         = useState(null)
  const [namaAnak, setNamaAnak] = useState('')
  const [loading, setLoading]   = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (USE_MOCK) {
          const { MOCK_PREDIKSI_RESULT, MOCK_BALITA } = await import('@/store/mockData')
          await new Promise(r => setTimeout(r, 600))
          setData(MOCK_PREDIKSI_RESULT)
          setNamaAnak(MOCK_BALITA[4]?.nama ?? '')
          return
        }

        const childId = user?.child_id
        if (!childId) {
           toast.error('Data anak belum tertaut dengan akun Anda.')
           setLoading(false)
           return 
        }

        // Hanya fetch riwayat, tidak perlu memanggil getDashboard lagi.
        const riwayat = await prediksiService.getRiwayat(childId)
        
        // Ambil nama dari item riwayat pertama jika ada, atau gunakan inisial user
        const nama = riwayat[0]?.balita?.nama ?? user?.nama ?? 'Anak'
        setNamaAnak(nama)

        if (prediksiId) {
          // Cari prediksi spesifik
          setData(riwayat.find(r => r.prediction_id === prediksiId) ?? riwayat[0] ?? null)
        } else {
          // Default ke prediksi paling baru (index 0)
          setData(riwayat[0] ?? null)
        }

      } catch (err) {
        toast.error('Gagal memuat rekomendasi.')
      } finally {
        setLoading(false)
      }
    }
    
    // Pastikan fetch hanya berjalan jika user siap
    if (user) {
        fetchData()
    }
  }, [prediksiId, user])

  if (loading) return (
    <MainLayout>
      <div className="fade-in max-w-[800px] mx-auto">
        <div className="skeleton-shimmer h-4 w-[180px] rounded-[5px] mb-[18px]" />
        <CardSkeleton lines={4} />
        <div className="mt-3 flex flex-col gap-[10px]">
          <CardSkeleton lines={2} />
          <CardSkeleton lines={2} />
          <CardSkeleton lines={2} />
        </div>
      </div>
    </MainLayout>
  )

  if (!data) return (
    <MainLayout>
      <div className="max-w-[800px] mx-auto">
        <EmptyState type="riwayat" title="Belum ada rekomendasi" desc="Rekomendasi akan muncul setelah pemeriksaan pertama di Posyandu." />
      </div>
    </MainLayout>
  )

  const { status_risiko, stunting_status, underweight_status, wasting_status, haz_score, rekomendasi } = data
  const nama = namaAnak || data.balita?.nama || '—'
  const hazColor = getHazColor(haz_score)

  return (
    <MainLayout>
      <div className="fade-in max-w-[800px] mx-auto">
        <Breadcrumb items={[
          { label: 'Dashboard', href: '/orangtua/dashboard' },
          { label: 'Rekomendasi AI' },
        ]} />

        <div className="mb-5">
          <h1 className="page-title">Rekomendasi AI untuk {nama}</h1>
          <p className="page-subtitle">Panduan personal berdasarkan hasil analisis pertumbuhan terkini.</p>
        </div>

        {/* Status summary */}
        <div className="card mb-4 bg-[linear-gradient(135deg,rgba(0,136,106,0.12),rgba(0,136,106,0.04))] border-[rgba(0,136,106,0.25)]">
          <div className="flex items-center gap-[14px] flex-wrap">
            <div className="w-[52px] h-[52px] rounded-full bg-[var(--primary-muted)] flex items-center justify-center flex-shrink-0">
              <Brain size={24} className="text-[var(--primary)]" />
            </div>
            <div className="flex-1">
              <div className="text-sm font-bold text-[var(--primary-light)] mb-2">Analisis AI Terkini</div>
              <div className="flex gap-4 flex-wrap items-center">
                {status_risiko && <StatusBadge status={status_risiko} />}
                {haz_score != null && (
                  <span className="text-[13px] text-[var(--text-secondary)]">
                    HAZ: <strong style={{ color: hazColor }}>{haz_score.toFixed(2)}</strong>
                  </span>
                )}
              </div>
              {(stunting_status || underweight_status || wasting_status) && (
                <div className="mt-[10px] flex gap-2 flex-wrap">
                  {[
                    ['Stunting', stunting_status],
                    ['Gizi Kurang', underweight_status],
                    ['Wasting', wasting_status],
                  ].map(([label, status]) => status && (
                    <span key={label} className="badge text-[11px]" style={{ background: `${getWhoStatusColor(status)}22`, color: getWhoStatusColor(status) }}>
                      {label}: {getWhoStatusShortLabel(status)}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {haz_score != null && (
          <div className={`alert ${status_risiko === 'Normal' ? 'alert-success' : 'alert-warning'} mb-4`}>
            <CheckCircle2 size={16} className="flex-shrink-0 mt-[1px]" />
            <span>
              <strong>Interpretasi HAZ:</strong> Nilai HAZ {nama} adalah <strong>{haz_score.toFixed(2)}</strong>.{' '}
              {haz_score >= -2 ? 'Normal (≥ −2 SD standar WHO).' : haz_score >= -3 ? 'Stunted (−2 s.d. −3 SD). Intervensi gizi diperlukan.' : 'Severely Stunted (< −3 SD). Intervensi segera diperlukan.'}
            </span>
          </div>
        )}

        {/* Rekomendasi accordion */}
        {rekomendasi && rekomendasi.length > 0 ? (
          <div className="flex flex-col gap-[10px]">
            <div className="text-sm font-semibold text-[var(--text-primary)] mb-1">
              {rekomendasi.length} Rekomendasi Intervensi
            </div>
            {rekomendasi.map((r, i) => <RekomendasiCard key={i} r={r} index={i} />)}
          </div>
        ) : (
          <EmptyState type="riwayat" title="Tidak ada rekomendasi" desc="Belum ada data prediksi yang bisa dijadikan dasar rekomendasi." />
        )}

        <div className="mt-5 p-[12px_16px] bg-[var(--bg-card)] border border-[var(--border)] rounded-[var(--radius-md)] text-[12.5px] text-[var(--text-muted)] leading-[1.5]">
          Rekomendasi dihasilkan model AI AnakSehat berdasarkan data antropometri dan sosioekonomi.
          Selalu konsultasikan dengan tenaga kesehatan untuk penanganan lebih lanjut.
        </div>
      </div>
    </MainLayout>
  )
}