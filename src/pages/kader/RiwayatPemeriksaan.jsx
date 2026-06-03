// src/pages/kader/RiwayatPemeriksaan.jsx
import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import MainLayout from '@/components/layout/MainLayout'
import api from '@/services/api'
import { prediksiService } from '@/services/balitaService'
import { MOCK_BALITA } from '@/store/mockData'
import { Search, Eye, Download, AlertCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import { Breadcrumb, EmptyState, StatusBadge } from '@/components/ui/SharedComponents'
import { getWhoStatusColor, getWhoStatusShortLabel } from '@/constants/riskConfig'
import { AnimatedStatCard } from '@/components/ui/AnimatedCounter'
import { Users, CheckCircle } from 'lucide-react'

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true'

function buildBalitaList(rawBalita) {
  return rawBalita.map(b => {
    // FIX: Sesuaikan pembacaan dengan respons API riil (menggunakan last_prediction atau history)
    const latest  = b.last_prediction ?? b.history?.[0] ?? b.riwayat?.[0] ?? null
    return {
      id:                 b.child_id ?? b.id,
      nama:               b.name ?? b.nama ?? '—',
      nama_ibu:           b.parent_name ?? b.mother_name ?? b.nama_ibu ?? '—',
      usia_bulan:         b.age_months ?? b.usia_bulan,
      status:             latest?.risk_class         ?? b.status_risiko ?? b.status ?? '—',
      haz_score:          latest?.haz_score          ?? b.haz_score    ?? null,
      stunting_status:    latest?.stunting_status    ?? null,
      underweight_status: latest?.underweight_status ?? null,
      wasting_status:     latest?.wasting_status     ?? null,
      tanggal:            latest?.created_at?.slice(0, 10) ?? b.tanggal_periksa ?? '—',
      prediksiId:         latest?.prediction_id ?? null,
    }
  })
}

export default function RiwayatPemeriksaan() {
  const [balitaList, setBalitaList] = useState([])
  const [selected, setSelected]     = useState(null)
  const [riwayat, setRiwayat]       = useState([])
  const [loading, setLoading]       = useState(true)
  const [loadingRiwayat, setLoadingRiwayat] = useState(false)
  const [search, setSearch]         = useState('')
  const [filterStatus, setFilterStatus] = useState('Semua')

  useEffect(() => {
    const fetchAll = async () => {
      try {
        if (USE_MOCK) {
          await new Promise(r => setTimeout(r, 700))
          setBalitaList(MOCK_BALITA)
        } else {
          const res  = await api.get('/api/v1/children?limit=100')
          const raw  = res.data.data ?? []
          const list = buildBalitaList(raw)
          setBalitaList(list)
          if (list.length) setSelected(list[0])
        }
      } catch {
        toast.error('Gagal memuat data pemeriksaan.')
      } finally {
        setLoading(false)
      }
    }
    fetchAll()
  }, [])

  const fetchRiwayat = async (balita) => {
    setSelected(balita)
    setRiwayat([])
    setLoadingRiwayat(true)
    try {
      if (USE_MOCK) {
        const mockRiwayat = [{
          id: 'r-001', tanggal: '2025-06-01', berat: balita.berat_badan ?? 9.5, tinggi: balita.tinggi_badan ?? 74,
          stunting_status: balita.stunting_status ?? 'Normal',
          underweight_status: balita.underweight_status ?? 'Normal',
          wasting_status: balita.wasting_status ?? 'Normal',
          status: balita.status_risiko ?? 'Normal',
          haz_score: balita.haz_score ?? -1.2, kader: 'Dr. Sarah Pratiwi',
        }]
        await new Promise(r => setTimeout(r, 500))
        setRiwayat(mockRiwayat)
        return
      }
      const data = await prediksiService.getRiwayat(balita.id)
      setRiwayat(data ?? [])
    } catch {
      toast.error('Gagal memuat riwayat.')
    } finally {
      setLoadingRiwayat(false)
    }
  }

  const filtered = useMemo(() =>
    balitaList.filter(b => {
      const matchSearch  = (b.nama ?? '').toLowerCase().includes(search.toLowerCase()) ||
        (b.nama_ibu ?? '').toLowerCase().includes(search.toLowerCase())
      const matchStatus  = filterStatus === 'Semua' || (b.status_risiko ?? b.status) === filterStatus
      return matchSearch && matchStatus
    }),
    [balitaList, search, filterStatus]
  )

  const total   = balitaList.length
  const normal  = balitaList.filter(b => (b.status_risiko ?? b.status) === 'Normal').length
  const atRisk  = balitaList.filter(b => (b.status_risiko ?? b.status) !== 'Normal' && (b.status_risiko ?? b.status) !== '—').length

  return (
    <MainLayout>
      <div className="fade-in max-w-[1200px]">
        <Breadcrumb items={[
          { label: 'Dashboard', href: '/kader/dashboard' },
          { label: 'Riwayat Pemeriksaan' },
        ]} />

        <div className="mb-5">
          <h1 className="page-title">Riwayat Pemeriksaan</h1>
          <p className="page-subtitle">Pilih balita untuk melihat riwayat dan timeline pemeriksaan.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
          <AnimatedStatCard label="Total Balita"    value={loading ? null : total}  sub="Terdaftar"       color="var(--primary)"  icon={Users}        delay={0}   />
          <AnimatedStatCard label="Status Normal"   value={loading ? null : normal} sub="Pertumbuhan baik" color="var(--success)"  icon={CheckCircle}  delay={80}  />
          <AnimatedStatCard label="Perlu Perhatian" value={loading ? null : atRisk} sub="Perlu intervensi" color="var(--warning)"  icon={AlertCircle}  delay={160} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-4">
          {/* Left: Daftar balita */}
          <div className="card !p-0">
            <div className="p-[12px_14px] border-b border-[var(--border)]">
              <div className="relative mb-2">
                <Search size={13} className="absolute left-[9px] top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                <input
                  className="input-field pl-7 h-8 text-xs"
                  placeholder="Cari nama..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>
              <select
                className="input-field h-8 text-xs pl-[10px]"
                value={filterStatus}
                onChange={e => setFilterStatus(e.target.value)}
              >
                <option>Semua</option><option>Normal</option><option>Stunted</option><option>Severely Stunted</option>
              </select>
            </div>

            <div className="max-h-[500px] overflow-y-auto">
              {loading ? (
                <div className="p-3 flex flex-col gap-2">
                  {[0,1,2,3].map(i => (
                    <div key={i} className="flex gap-[10px] p-[10px] rounded-lg bg-[var(--bg-elevated)] items-center">
                      <div className="w-8 h-8 rounded-full bg-[var(--bg-hover)] skeleton-shimmer flex-shrink-0" />
                      <div className="flex-1 flex flex-col gap-[6px]">
                        <div className="h-3 rounded w-[70%] bg-[var(--bg-hover)] skeleton-shimmer" />
                        <div className="h-[10px] rounded w-[50%] bg-[var(--bg-hover)] skeleton-shimmer" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : filtered.length === 0 ? (
                <EmptyState type="search" />
              ) : (
                filtered.map(b => {
                  const status   = b.status_risiko ?? b.status ?? '—'
                  const isActive = selected?.id === b.id
                  const hazColor = b.haz_score != null
                    ? (b.haz_score >= -2 ? 'var(--success)' : b.haz_score >= -3 ? 'var(--warning)' : 'var(--danger)')
                    : 'var(--text-muted)'
                  return (
                    <button
                      key={b.id}
                      onClick={() => fetchRiwayat(b)}
                      className="w-full flex items-center gap-[10px] p-[11px_14px] border-b border-[var(--border)] cursor-pointer text-left transition-colors duration-150 hover:bg-[var(--bg-hover)]"
                      style={{
                        background: isActive ? 'var(--primary-muted)' : 'none',
                      }}
                    >
                      <div
                        className="avatar w-8 h-8 text-xs shrink-0"
                        style={{
                          border: isActive ? '2px solid var(--primary)' : '2px solid transparent',
                        }}
                      >
                        {(b.nama ?? '?').split(' ').map(w => w[0]).slice(0,2).join('').toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div
                          className="text-[13px] font-semibold overflow-hidden text-ellipsis whitespace-nowrap"
                          style={{ color: isActive ? 'var(--primary-light)' : 'var(--text-primary)' }}
                        >
                          {b.nama}
                        </div>
                        <div className="text-[11px] text-[var(--text-muted)]">
                          {b.usia_bulan} bln · HAZ:{' '}
                          <span className="font-semibold" style={{ color: hazColor }}>
                            {b.haz_score != null ? Number(b.haz_score).toFixed(2) : '—'}
                          </span>
                        </div>
                      </div>
                      <div className="flex-shrink-0 hidden sm:block">
                        <StatusBadge status={status} />
                      </div>
                    </button>
                  )
                })
              )}
            </div>
          </div>

          {/* Right: Detail riwayat */}
          <div>
            {!selected ? (
              <div className="card">
                <EmptyState type="riwayat" title="Pilih balita" desc="Klik nama balita di sebelah kiri untuk melihat riwayat pemeriksaan." />
              </div>
            ) : (
              <>
                {/* Header balita selected */}
                <div className="card mb-[14px]">
                  <div className="flex justify-between items-start flex-wrap gap-3">
                    <div className="flex gap-3 items-start">
                      <div className="avatar w-[44px] h-[44px] text-[17px] shrink-0">
                        {(selected.nama ?? '?').split(' ').map(w => w[0]).slice(0,2).join('').toUpperCase()}
                      </div>
                      <div>
                        <div className="text-base font-bold text-[var(--text-primary)] font-jakarta">{selected.nama}</div>
                        <div className="text-[12.5px] text-[var(--text-muted)] mt-[2px]">
                          {selected.nama_ibu && `Ibu: ${selected.nama_ibu} · `}{selected.usia_bulan} bulan
                        </div>
                        <div className="mt-2 flex gap-2 flex-wrap">
                          <StatusBadge status={selected.status_risiko ?? selected.status ?? '—'} />
                          {selected.haz_score != null && (
                            <span className="text-xs text-[var(--text-muted)] flex items-center">
                              HAZ:{' '}
                              <strong className="ml-1" style={{
                                color: selected.haz_score >= -2 ? 'var(--success)' : selected.haz_score >= -3 ? 'var(--warning)' : 'var(--danger)',
                              }}>
                                {Number(selected.haz_score).toFixed(2)}
                              </strong>
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        className="btn-secondary text-xs opacity-50 cursor-not-allowed" 
                        title="Fitur segera hadir" 
                        disabled
                      >
                        <Download size={14} /> Unduh
                      </button>
                      {selected.prediksiId && (
                        <Link to={`/kader/hasil-prediksi/${selected.id}/${selected.prediksiId}`} className="btn-primary text-xs">
                          <Eye size={14} /> Lihat Hasil AI
                        </Link>
                      )}
                    </div>
                  </div>
                </div>

                {/* Timeline */}
                <div className="card">
                  <div className="text-sm font-semibold text-[var(--text-primary)] mb-4">Timeline Pemeriksaan</div>
                  {loadingRiwayat ? (
                    <div className="flex flex-col gap-[14px]">
                      {[0,1].map(i => (
                        <div key={i} className="flex gap-[14px]">
                          <div className="w-[10px] h-[10px] rounded-full bg-[var(--bg-elevated)] flex-shrink-0 mt-1 skeleton-shimmer" />
                          <div className="flex-1 bg-[var(--bg-elevated)] rounded-[10px] p-[14px] h-20 skeleton-shimmer" />
                        </div>
                      ))}
                    </div>
                  ) : riwayat.length === 0 ? (
                    <EmptyState type="riwayat" />
                  ) : (
                    <div>
                      {[...riwayat].reverse().map((r, i) => {
                        const isLatest = i === 0
                        const hazColor = r.haz_score != null
                          ? (r.haz_score >= -2 ? 'var(--success)' : r.haz_score >= -3 ? 'var(--warning)' : 'var(--danger)')
                          : 'var(--text-muted)'
                        return (
                          <div
                            key={r.id ?? i}
                            className="flex gap-[14px]"
                            style={{ marginBottom: i < riwayat.length - 1 ? 20 : 0 }}
                          >
                            <div className="flex flex-col items-center flex-shrink-0">
                              <div
                                className="w-3 h-3 rounded-full mt-1"
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
                            <div className="flex-1 bg-[var(--bg-elevated)] border border-[var(--border)] rounded-[var(--radius-md)] p-[12px_14px] mb-1">
                              <div className="flex justify-between items-start flex-wrap gap-2">
                                <div>
                                  <div className="text-xs text-[var(--text-muted)] mb-2">
                                    {r.tanggal} · {isLatest ? 'Pemeriksaan Terbaru' : `Pemeriksaan ke-${riwayat.length - i}`}
                                    {r.kader && <span className="ml-[6px]">· oleh {r.kader}</span>}
                                  </div>
                                  <div className="flex gap-[18px] flex-wrap">
                                    {[
                                      ['Berat', `${r.berat ?? r.weight_kg ?? r.balita?.berat_badan ?? '–'} kg`],
                                      ['Tinggi', `${r.tinggi ?? r.height_cm ?? r.balita?.tinggi_badan ?? '–'} cm`],
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
                                    <div>
                                      <div className="text-[11px] text-[var(--text-muted)]">Wasting</div>
                                      <div className="text-[13px] font-bold font-jakarta" style={{ color: getWhoStatusColor(r.wasting_status) }}>
                                        {getWhoStatusShortLabel(r.wasting_status ?? 'Normal')}
                                      </div>
                                    </div>
                                    {r.haz_score != null && (
                                      <div>
                                        <div className="text-[11px] text-[var(--text-muted)]">HAZ</div>
                                        <div className="text-base font-bold font-jakarta" style={{ color: hazColor }}>
                                          {Number(r.haz_score).toFixed(2)}
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </div>
                                <div className="flex gap-2 items-center mt-2 sm:mt-0">
                                  {(r.status_risiko ?? r.status) && <StatusBadge status={r.status_risiko ?? r.status} />}
                                  {r.prediction_id && (
                                    <Link
                                      to={`/kader/hasil-prediksi/${r.child_id}/${r.prediction_id}`}
                                      className="btn-ghost text-xs p-[4px_10px]"
                                    >
                                      <Eye size={13} /> Detail
                                    </Link>
                                  )}
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
                                    : '⚠ Perlu intervensi gizi dan kunjungan rumah.'}
                                </div>
                              )}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  )
}