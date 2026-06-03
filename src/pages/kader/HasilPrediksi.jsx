/* eslint-disable react-hooks/static-components */
import { useNavigate } from 'react-router-dom'
import { Share2, ChevronLeft, Brain, AlertCircle, Printer } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import MainLayout from '@/components/layout/MainLayout'
import { Breadcrumb, StatusBadge } from '@/components/ui/SharedComponents'
import { AnimatedProgressBar } from '@/components/ui/AnimatedCounter'
import { useHasilPrediksi } from '@/hooks/useHasilPrediksi'
import { ActivationModal } from '@/components/ui/ActivationModal'
import { getHazColor, getHazLabel, getWhoStatusColor, getWhoStatusShortLabel, getWhoStatusBadgeClass } from '@/constants/riskConfig'

function HasilPrediksiSkeleton() {
  const S = ({ w = '100%', h = 14, r = 6 }) => (
    <div className="skeleton-shimmer flex-shrink-0" style={{ width: w, height: h, borderRadius: r }} />
  )
  return (
    <div className="flex flex-col lg:grid lg:grid-cols-[290px_1fr] gap-4">
      <div className="flex flex-col gap-3">
        <div className="card flex flex-col gap-3">
          <div className="flex gap-3">
            <S w={44} h={44} r={50} />
            <div className="flex-1 flex flex-col gap-2"><S w="70%" /><S w="50%" h={12} /></div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {[0,1,2,3].map(i => (
              <div key={i} className="bg-[var(--bg-elevated)] rounded-[9px] p-3">
                <S w="60%" h={11} /><S w="80%" h={22} r={4} />
              </div>
            ))}
          </div>
        </div>
        <div className="card flex flex-col gap-[10px]">
          <S w="50%" /><S h={36} r={4} /><S h={8} r={4} />
        </div>
        <div className="card flex flex-col gap-3">
          <S w="50%" />
          {[0,1,2].map(i => <S key={i} h={44} r={8} />)}
        </div>
      </div>
      <div className="flex flex-col gap-[14px]">
        <div className="card"><S w="60%" h={14} /><div className="mt-[14px]"><S h={130} /></div></div>
        <div className="card">
          <S w="50%" />
          {[0,1,2].map(i => (
            <div key={i} className="mt-[10px] bg-[var(--bg-elevated)] rounded-[10px] p-3">
              <S w="70%" /><S w="90%" h={12} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function WhoStatusCard({ label, status, zscore, zLabel }) {
  const color      = getWhoStatusColor(status)
  const shortLabel = getWhoStatusShortLabel(status)
  const isNormal   = !status || status === 'Normal'
  return (
    <div
      className="flex items-center justify-between p-[10px_12px] rounded-[9px]"
      style={{ background: `color-mix(in srgb, ${color} 10%, var(--bg-elevated))` }}
    >
      <div>
        <div className="text-[11px] text-[var(--text-muted)]">{label}</div>
        <div className="text-[13px] font-bold mt-[2px]" style={{ color }}>
          {shortLabel}
        </div>
        {zscore != null && (
          <div className="text-[11px] text-[var(--text-muted)] mt-[1px]">
            {zLabel}: {zscore?.toFixed(2)}
          </div>
        )}
      </div>
      <div
        className="w-[10px] h-[10px] rounded-full flex-shrink-0"
        style={{ background: color }}
      />
    </div>
  )
}

export default function HasilPrediksi() {
  const navigate = useNavigate()
  const { data, loading, sharing, activation, handleShare, handlePrint, closeActivation } = useHasilPrediksi()

  if (loading) return (
    <MainLayout>
      <div className="fade-in">
        <div className="h-[22px] w-[200px] rounded-md bg-[var(--bg-elevated)] mb-[18px] skeleton-shimmer" />
        <HasilPrediksiSkeleton />
      </div>
    </MainLayout>
  )
  if (!data) return null

  const {
    balita, status_risiko,
    stunting_status, underweight_status, wasting_status,
    haz_score, waz_score, baz_score,
    confidence, probabilitas, tanggal, rekomendasi,
  } = data

  const hazColor   = getHazColor(haz_score)
  const tanggalStr = tanggal
    ? new Date(tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })
    : '-'
  const probData = probabilitas ? [
    { kelas: 'Normal',           pct: Math.round((probabilitas.normal           ?? 0) * 100), color: 'var(--success)' },
    { kelas: 'Stunted',          pct: Math.round((probabilitas.stunted          ?? 0) * 100), color: 'var(--warning)' },
    { kelas: 'Severely Stunted', pct: Math.round((probabilitas.severely_stunted ?? 0) * 100), color: 'var(--danger)'  },
  ] : []

  const hasAnyIssue = stunting_status !== 'Normal' || underweight_status !== 'Normal' || wasting_status !== 'Normal'

  return (
    <MainLayout>
      <style>{`
        @media print {
          body { background: #fff !important; color: #000 !important; }
          header, nav, aside, .no-print { display: none !important; }
          .card { border: 1px solid #ddd !important; background: #fff !important; box-shadow: none !important; }
        }
      `}</style>
      <div className="fade-in">
        <Breadcrumb items={[
          { label: 'Dashboard',   href: '/kader/dashboard' },
          { label: 'Data Balita', href: '/kader/kelola-balita' },
          { label: `Hasil — ${balita?.nama}` },
        ]} />

        <div className="flex justify-between items-start mb-5 flex-wrap gap-[10px]">
          <div>
            <h1 className="page-title">Analisis Pertumbuhan Anak</h1>
            <p className="page-subtitle">Skrining Awal Stunting · Standar WHO Child Growth Standards · {tanggalStr}</p>
          </div>
        </div>

        <div className="flex flex-col lg:grid lg:grid-cols-[290px_1fr] gap-4">

          {/* ── Left column ── */}
          <div className="flex flex-col gap-3">

            {/* Info balita */}
            <div className="card">
              <div className="flex items-start gap-3">
                <div className="avatar w-[44px] h-[44px] text-base flex-shrink-0">
                  {(balita?.nama ?? '?').split(' ').map(w => w[0]).slice(0,2).join('').toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-[15px] text-[var(--text-primary)] truncate">{balita?.nama}</div>
                  <div className="text-xs mt-[2px] text-[var(--text-muted)]">
                    {balita?.usia_bulan} Bulan · {balita?.jenis_kelamin}
                  </div>
                  <div className="mt-[6px]"><StatusBadge status={status_risiko} /></div>
                </div>
              </div>
              <div className="divider" />
              <div className="grid grid-cols-2 gap-[10px]">
                {[
                  ['Berat Badan',    balita?.berat_badan  != null ? `${balita.berat_badan} kg`  : '–'],
                  ['Tinggi Badan',   balita?.tinggi_badan != null ? `${balita.tinggi_badan} cm` : '–'],
                  ['Lingkar Kepala', balita?.lingkar_kepala ? `${balita.lingkar_kepala} cm`      : '–'],
                  ['Lingkar Lengan', balita?.lingkar_lengan ? `${balita.lingkar_lengan} cm`      : '–'],
                ].map(([l, v]) => (
                  <div key={l} className="p-[10px_12px] rounded-[9px] bg-[var(--bg-elevated)]">
                    <div className="text-[11px] text-[var(--text-muted)]">{l}</div>
                    <div className="text-base font-bold mt-[2px] font-jakarta text-[var(--text-primary)]">{v}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* HAZ Z-Score */}
            <div className="card">
              <div className="text-[13px] font-semibold text-[var(--text-primary)] mb-[10px]">HAZ Z-Score (WHO)</div>
              <div className="flex items-center gap-[14px] mb-[14px]">
                <div className="text-[36px] font-black font-jakarta leading-none" style={{ color: hazColor }}>
                  {haz_score?.toFixed(2)}
                </div>
                <div>
                  <div className="text-xs font-semibold" style={{ color: hazColor }}>{getHazLabel(haz_score)}</div>
                  <div className="text-[11px] mt-[3px] text-[var(--text-muted)]">Height-for-Age Z-score</div>
                </div>
              </div>
              <AnimatedProgressBar
                value={Math.min(100, Math.max(0, ((haz_score + 4) / 6) * 100))}
                color={hazColor} showValue={false} height={8}
              />
              <div className="flex justify-between text-[10px] mt-1 text-[var(--text-muted)]">
                <span>–4</span><span>–3</span><span>–2</span><span>0</span><span>+2</span>
              </div>
            </div>

            {/* 3 Status WHO */}
            <div className="card">
              <div className="flex items-center justify-between mb-[12px]">
                <div className="text-[13px] font-semibold text-[var(--text-primary)]">Status Gizi (WHO)</div>
                <div className="text-[10px] text-[var(--text-muted)]">Cutoff ±2 SD & ±3 SD</div>
              </div>
              <div className="flex flex-col gap-[8px]">
                <WhoStatusCard
                  label="Stunting (Tinggi/Usia)"
                  status={stunting_status}
                  zscore={haz_score}
                  zLabel="HAZ"
                />
                <WhoStatusCard
                  label="Gizi Kurang (Berat/Usia)"
                  status={underweight_status}
                  zscore={waz_score}
                  zLabel="WAZ"
                />
                <WhoStatusCard
                  label="Wasting (Berat/Tinggi)"
                  status={wasting_status}
                  zscore={baz_score}
                  zLabel="BAZ"
                />
              </div>
              <div className="text-[10px] text-[var(--text-muted)] mt-[10px] leading-[1.5]">
                Standar WHO MGRS · Normal ≥ −2 SD · Masalah &lt; −2 SD · Berat &lt; −3 SD
              </div>
              {confidence != null && (
                <div className="text-xs px-3 py-1 rounded-lg bg-[var(--bg-elevated)] text-[var(--text-muted)] mt-[8px] text-center">
                  Keyakinan Model: <strong style={{ color: hazColor }}>{confidence}%</strong>
                </div>
              )}
            </div>
          </div>

          {/* ── Right column ── */}
          <div className="flex flex-col gap-[14px]">

            {/* Probabilitas chart */}
            <div className="card">
              <div className="mb-[14px]">
                <div className="text-sm font-semibold text-[var(--text-primary)]">Probabilitas per Kelas — Output Model</div>
                <div className="text-xs mt-[2px] text-[var(--text-muted)]">Distribusi output dari model DNDF v5.0.0</div>
              </div>
              {probData.every(d => d.pct === 0) ? (
                <div className="text-[13px] py-4 text-center text-[var(--text-muted)]">Data probabilitas tidak tersedia.</div>
              ) : (
                <>
                  <div className="flex flex-col gap-[10px] mb-3">
                    {probData.map(d => (
                      <AnimatedProgressBar key={d.kelas} value={d.pct} color={d.color} label={d.kelas} height={8} />
                    ))}
                  </div>
                  <ResponsiveContainer width="100%" height={120}>
                    <BarChart data={probData} barSize={48} margin={{ top: 4, right: 0, bottom: 0, left: -20 }}>
                      <XAxis dataKey="kelas" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                      <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} width={36} tickFormatter={v => `${v}%`} />
                      <Tooltip formatter={v => [`${v}%`, 'Probabilitas']} contentStyle={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 12 }} />
                      <Bar dataKey="pct" radius={[6, 6, 0, 0]}>
                        {probData.map((d, i) => <Cell key={i} fill={d.color} fillOpacity={0.85} />)}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </>
              )}
            </div>

            {/* Rekomendasi */}
            <div className="card bg-[linear-gradient(135deg,rgba(245,176,54,0.08),rgba(245,176,54,0.03))] border-[rgba(245,176,54,0.2)]">
              <div className="flex items-start justify-between gap-2 mb-[14px]">
                <div className="flex items-center gap-2">
                  <Brain size={18} className="text-[var(--accent)]" />
                  <span className="text-sm font-bold text-[var(--accent)]">REKOMENDASI INTERVENSI</span>
                </div>
                <span className="text-[11px] text-[var(--text-muted)] text-right leading-[1.4] max-w-[160px]">
                  Saran edukasi berdasarkan hasil skrining & kondisi keluarga
                </span>
              </div>
              <div className="flex flex-col gap-[10px]">
                {(rekomendasi ?? []).map((r, i) => (
                  <div key={i} className="p-[12px_14px] rounded-[var(--app-radius-md)] bg-[var(--bg-card)] border border-[var(--border)]">
                    <div className="flex items-start gap-2 mb-[6px]">
                      <span className="text-base flex-shrink-0">{r.icon ?? '💡'}</span>
                      <span className="text-[13px] font-bold text-[var(--text-primary)] flex-1 leading-[1.4]">{r.judul}</span>
                      <span className="badge badge-secondary text-[11px] flex-shrink-0">{r.kategori}</span>
                    </div>
                    <p className="text-[12.5px] leading-[1.6] m-0 text-[var(--text-secondary)]">{r.detail}</p>
                  </div>
                ))}
              </div>
              <p className="text-[11px] text-[var(--text-muted)] mt-[12px] leading-[1.6] border-t border-[var(--border)] pt-[10px]">
                Rekomendasi ini bersifat edukatif sebagai panduan skrining awal. Bukan pengganti diagnosis atau rujukan medis profesional.
              </p>
            </div>

            {/* Alert */}
            {hasAnyIssue && (
              <div className="alert alert-warning">
                <AlertCircle size={16} className="flex-shrink-0 mt-[1px]" />
                <span>
                  <strong>Perhatian:</strong>{' '}
                  {[
                    stunting_status    !== 'Normal' && `Stunting: ${stunting_status}`,
                    underweight_status !== 'Normal' && `Gizi Kurang: ${underweight_status}`,
                    wasting_status     !== 'Normal' && `Wasting: ${wasting_status}`,
                  ].filter(Boolean).join(' · ')}.{' '}
                  Segera lakukan intervensi gizi dan jadwalkan kunjungan rumah dalam 2 minggu ke depan.
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Footer actions */}
        <div className="no-print mt-4 pt-4 border-t border-[var(--border)]">
          <div className="flex flex-col gap-2 sm:hidden">
            <div className="text-xs text-[var(--text-muted)]">Dianalisis: {tanggalStr}</div>
            <button className="btn-primary w-full justify-center" onClick={handleShare} disabled={sharing}>
              {sharing
                ? <span className="spinner w-[14px] h-[14px] border-2 border-[rgba(255,255,255,0.3)] border-t-white rounded-full inline-block" />
                : <><Share2 size={15} /> Bagikan ke Orang Tua</>}
            </button>
            <div className="flex gap-2">
              <button className="btn-ghost flex-1 justify-center" onClick={handlePrint}><Printer size={15} /> Cetak</button>
              <button className="btn-secondary flex-1 justify-center" onClick={() => navigate('/kader/kelola-balita')}>
                <ChevronLeft size={15} /> Kembali
              </button>
            </div>
          </div>
          <div className="hidden sm:flex gap-[10px] justify-end items-center flex-wrap">
            <div className="text-xs text-[var(--text-muted)] self-center flex-1">Dianalisis: {tanggalStr}</div>
            <button className="btn-ghost" onClick={handlePrint}><Printer size={15} /> Cetak</button>
            <button className="btn-secondary" onClick={() => navigate('/kader/kelola-balita')}>
              <ChevronLeft size={15} /> Kembali
            </button>
            <button className="btn-primary" onClick={handleShare} disabled={sharing}>
              {sharing
                ? <span className="spinner w-[14px] h-[14px] border-2 border-[rgba(255,255,255,0.3)] border-t-white rounded-full inline-block" />
                : <><Share2 size={15} /> Bagikan ke Orang Tua</>}
            </button>
          </div>
        </div>
      </div>

      {activation && (
        <ActivationModal
          kode={activation.kode}
          childName={activation.childName}
          expiredAt={activation.expiredAt}
          onClose={closeActivation}
        />
      )}
    </MainLayout>
  )
}