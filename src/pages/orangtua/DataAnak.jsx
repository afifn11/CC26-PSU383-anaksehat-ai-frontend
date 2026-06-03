/* eslint-disable no-unused-vars */
// src/pages/orangtua/DataAnak.jsx
import { useEffect, useState } from 'react'
import MainLayout from '@/components/layout/MainLayout'
import { orangtuaService } from '@/services/balitaService'
import { Activity, User, Brain, Calendar, Scale, Ruler } from 'lucide-react'
import { getHazColor, getWhoStatusColor, getWhoStatusShortLabel } from '@/constants/riskConfig'
import toast from 'react-hot-toast'
import { Breadcrumb, CardSkeleton, EmptyState, StatusBadge } from '@/components/ui/SharedComponents'
import { AnimatedProgressBar, AnimatedStatCard } from '@/components/ui/AnimatedCounter'
import { TrendingUp } from 'lucide-react'

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true'

function InfoTable({ icon: Icon, title, rows }) {
  return (
    <div className="card !p-0 overflow-hidden">
      <div className="p-[13px_18px] border-b border-[var(--border)] text-[13px] font-semibold text-[var(--text-primary)] flex items-center gap-[7px] bg-[var(--bg-elevated)] transition-colors duration-[250ms]">
        <Icon size={15} className="text-[var(--primary)]" /> {title}
      </div>
      <table className="w-full">
        <tbody>
          {rows.map(([label, value, extra], i) => (
            <tr key={label}>
              <td
                className="p-[12px_18px] text-[13px] text-[var(--text-muted)] w-[42%] align-middle"
                style={{ borderBottom: i < rows.length - 1 ? '1px solid var(--border)' : 'none' }}
              >
                {label}
              </td>
              <td
                className="p-[12px_18px] text-[13px] font-semibold text-[var(--text-primary)] align-middle"
                style={{ borderBottom: i < rows.length - 1 ? '1px solid var(--border)' : 'none' }}
              >
                {extra ?? value}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default function DataAnak() {
  const [anak, setAnak]       = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (USE_MOCK) {
          const { MOCK_BALITA } = await import('@/store/mockData')
          await new Promise(r => setTimeout(r, 650))
          setAnak(MOCK_BALITA[4])
        } else {
          const data = await orangtuaService.getDashboard()
          setAnak(data?.anak ?? null)
        }
      } catch (err) {
        toast.error('Gagal memuat data anak.')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) return (
    <MainLayout>
      <div className="fade-in">
        <div className="skeleton-shimmer h-[14px] w-[180px] rounded-[5px] mb-[18px]" />
        <CardSkeleton lines={4} />
        <div className="grid grid-cols-3 gap-3 my-4">
          <CardSkeleton lines={3} />
          <CardSkeleton lines={3} />
          <CardSkeleton lines={3} />
        </div>
        <CardSkeleton lines={4} />
        <div className="mt-3"><CardSkeleton lines={3} /></div>
        <div className="mt-3"><CardSkeleton lines={3} /></div>
      </div>
    </MainLayout>
  )

  if (!anak) return (
    <MainLayout>
      <div className="fade-in">
        <Breadcrumb items={[{ label: 'Dashboard', href: '/orangtua/dashboard' }, { label: 'Data Anak' }]} />
        <EmptyState
          type="balita"
          title="Data anak belum tersedia"
          desc="Hubungi kader Posyandu untuk mendaftarkan anak Anda dan mendapatkan kode aktivasi."
        />
      </div>
    </MainLayout>
  )

  const hazColor = getHazColor(anak.haz_score)
  const hazPct   = anak.haz_score != null ? Math.min(100, Math.max(0, ((anak.haz_score + 4) / 6) * 100)) : 0

  return (
    <MainLayout>
      <div className="fade-in">
        <Breadcrumb items={[
          { label: 'Dashboard', href: '/orangtua/dashboard' },
          { label: 'Data Anak' },
        ]} />

        <div className="mb-5">
          <h1 className="page-title">Data Anak</h1>
          <p className="page-subtitle">Informasi terkini tumbuh kembang {anak.nama} dari sistem AnakSehat AI.</p>
        </div>

        {/* Profile hero card */}
        <div className="card mb-4 bg-[linear-gradient(135deg,rgba(0,136,106,0.08),rgba(0,136,106,0.02))] border-[rgba(0,136,106,0.2)]">
          <div className="flex items-start gap-[18px]">
            <div className="avatar w-16 h-16 text-2xl flex-shrink-0 shadow-[0_0_0_4px_var(--primary-muted)]">
              {anak.nama.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[21px] font-extrabold text-[var(--text-primary)] font-jakarta mb-[3px]">{anak.nama}</div>
              <div className="text-[13px] text-[var(--text-muted)] mb-[10px]">
                {anak.usia_bulan} Bulan · {anak.jenis_kelamin}
                {anak.tanggal_periksa ? ` · Terakhir diperiksa: ${anak.tanggal_periksa}` : ''}
              </div>
              <div className="flex gap-2 flex-wrap items-center">
                {anak.status_risiko && <StatusBadge status={anak.status_risiko} />}
                {anak.underweight_status && anak.underweight_status !== 'Normal' && (
                  <span className="badge" style={{ background: `${getWhoStatusColor(anak.underweight_status)}20`, color: getWhoStatusColor(anak.underweight_status) }}>
                    Gizi: {getWhoStatusShortLabel(anak.underweight_status)}
                  </span>
                )}
                {anak.haz_score != null && (
                  <span
                    className="badge"
                    style={{ background: `${hazColor}20`, color: hazColor }}
                  >
                    HAZ: {anak.haz_score.toFixed(2)}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Quick stat cards */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <AnimatedStatCard label="Berat Badan"     value={anak.berat_badan   != null ? Math.round(anak.berat_badan * 10) / 10 : null} sub="kg" color="var(--primary)"        icon={Scale}      delay={0}   />
          <AnimatedStatCard label="Tinggi Badan"    value={anak.tinggi_badan  != null ? Math.round(anak.tinggi_badan * 10) / 10 : null} sub="cm" color="var(--secondary-light)" icon={Ruler}      delay={80}  />
          <AnimatedStatCard label="Usia"            value={anak.usia_bulan}    sub="bulan"                                                       color="var(--accent)"         icon={Calendar}   delay={160} />
        </div>

        {/* HAZ + 3 Status WHO */}
        {anak.haz_score != null && (
          <div className="card mb-4">
            <div className="text-[13px] font-semibold text-[var(--text-primary)] mb-[14px] flex items-center gap-[6px]">
              <Brain size={14} className="text-[var(--primary)]" /> Indikator Klinis (Standar WHO)
            </div>
            <div className="flex flex-col gap-[14px]">
              <div>
                <div className="flex justify-between items-center mb-[6px]">
                  <span className="text-[13px] text-[var(--text-secondary)]">HAZ Z-Score (WHO)</span>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-extrabold font-jakarta" style={{ color: hazColor }}>
                      {anak.haz_score.toFixed(2)}
                    </span>
                    <span className="text-[11px] text-[var(--text-muted)]">SD</span>
                  </div>
                </div>
                <AnimatedProgressBar value={hazPct} color={hazColor} showValue={false} height={8} />
                <div className="flex justify-between text-[10px] text-[var(--text-muted)] mt-[3px]">
                  <span>−4 SD (Severe)</span><span>−2 SD</span><span>0 (Normal)</span><span>+2 SD</span>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[
                  ['Stunting', anak.stunting_status],
                  ['Gizi Kurang', anak.underweight_status],
                  ['Wasting', anak.wasting_status],
                ].map(([label, status]) => (
                  <div key={label} className="p-[10px] rounded-[9px] text-center" style={{ background: `color-mix(in srgb, ${getWhoStatusColor(status)} 10%, var(--bg-elevated))` }}>
                    <div className="text-[11px] text-[var(--text-muted)] mb-[3px]">{label}</div>
                    <div className="text-[12px] font-bold" style={{ color: getWhoStatusColor(status) }}>
                      {getWhoStatusShortLabel(status ?? 'Normal')}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Info tables */}
        <div className="flex flex-col gap-3">
          <InfoTable icon={User} title="Identitas Anak" rows={[
            ['Nama Lengkap',  anak.nama],
            ['Tanggal Lahir', anak.tanggal_lahir || '–'],
            ['Usia',          `${anak.usia_bulan} Bulan`],
            ['Jenis Kelamin', anak.jenis_kelamin || '–'],
          ]} />

          <InfoTable icon={Activity} title="Data Antropometri (Pemeriksaan Terakhir)" rows={[
            ['Berat Badan',    anak.berat_badan  != null ? `${anak.berat_badan} kg`  : '–'],
            ['Tinggi Badan',   anak.tinggi_badan != null ? `${anak.tinggi_badan} cm` : '–'],
            ['Lingkar Kepala', anak.lingkar_kepala ? `${anak.lingkar_kepala} cm` : '–'],
            ['Lingkar Lengan', anak.lingkar_lengan ? `${anak.lingkar_lengan} cm` : '–'],
            ['Tanggal Periksa', anak.tanggal_periksa || 'Belum ada data'],
          ]} />

          <InfoTable icon={Brain} title="Hasil Analisis AI" rows={[
            ['Stunting', '', null,
              <span className="font-bold" style={{ color: getWhoStatusColor(anak.stunting_status) }}>{getWhoStatusShortLabel(anak.stunting_status ?? 'Normal')}</span>
            ],
            ['Gizi Kurang', '', null,
              <span className="font-bold" style={{ color: getWhoStatusColor(anak.underweight_status) }}>{getWhoStatusShortLabel(anak.underweight_status ?? 'Normal')}</span>
            ],
            ['Wasting', '', null,
              <span className="font-bold" style={{ color: getWhoStatusColor(anak.wasting_status) }}>{getWhoStatusShortLabel(anak.wasting_status ?? 'Normal')}</span>
            ],
            ['HAZ Z-Score', anak.haz_score != null ? anak.haz_score.toFixed(2) : '–', null,
              anak.haz_score != null ? <span className="font-bold" style={{ color: hazColor }}>{anak.haz_score.toFixed(2)} SD</span> : <span className="text-[var(--text-muted)]">–</span>
            ],
          ]} />
        </div>

        <div className="mt-4 p-[12px_16px] bg-[var(--primary-muted)] rounded-[var(--radius-md)] text-[12.5px] text-[var(--text-secondary)] leading-[1.6] border border-[rgba(0,136,106,0.15)]">
          <strong className="text-[var(--primary-light)]">Catatan:</strong> Data diperbarui setiap kali kader Posyandu melakukan pemeriksaan. Untuk pertanyaan, hubungi kader Posyandu wilayah Anda.
        </div>
      </div>
    </MainLayout>
  )
}