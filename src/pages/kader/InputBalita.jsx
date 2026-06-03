import { Baby, Activity, Home, CheckCircle, ChevronLeft, ChevronRight, Send, Lightbulb } from 'lucide-react'
import MainLayout from '@/components/layout/MainLayout'
import { Breadcrumb } from '@/components/ui/SharedComponents'
import { AnimatedProgressBar } from '@/components/ui/AnimatedCounter'
import { StepIdentitas }    from '@/components/kader/BalitaForm/StepIdentitas'
import { StepAntropometri } from '@/components/kader/BalitaForm/StepAntropometri'
import { StepSosioekonomi } from '@/components/kader/BalitaForm/StepSosioekonomi'
import { StepKonfirmasi }   from '@/components/kader/BalitaForm/StepKonfirmasi'
import { useInputBalita }   from '@/hooks/useInputBalita'
import { INPUT_STEPS }      from '@/constants/formOptions'

const STEP_ICONS = [Baby, Activity, Home, CheckCircle]

const TIPS = [
  ['Gunakan nama lengkap sesuai KTP/KK', 'Pastikan nomor HP orang tua aktif', 'Usia balita maksimal 60 bulan (5 tahun)'],
  ['Timbang saat perut kosong, tanpa baju', 'Ukur tinggi posisi berbaring (usia < 2 th)', 'Ulangi 2× dan ambil rata-rata', 'Lingkar kepala & lengan bersifat opsional'],
  ['Data ini digunakan untuk menyesuaikan saran intervensi', 'Isi sesuai kondisi riil keluarga', 'Prediksi AI tetap berjalan tanpa data ini'],
  ['Periksa ulang semua data sebelum submit', 'Proses AI membutuhkan waktu ~5 detik', 'Hasil akan langsung ditampilkan'],
]

export default function InputBalita() {
  const hook = useInputBalita()

  return (
    <MainLayout>
      <div className="fade-in max-w-[900px] mx-auto">
        <Breadcrumb items={[{ label: 'Dashboard', href: '/kader/dashboard' }, { label: 'Input Data Balita' }]} />

        <div className="mb-5">
          <h1 className="page-title">Input Data Balita</h1>
          <p className="page-subtitle">Lengkapi formulir untuk mendapatkan analisis pertumbuhan berbasis AI.</p>
        </div>

        {/* Progress & Stepper */}
        <div className="card mb-5 overflow-hidden">
          <div className="mb-[14px]">
            <AnimatedProgressBar value={hook.progressPct} color="var(--primary)" showValue={false} height={5} />
          </div>
          
          {/* UI Fix: Ditambahkan overflow-x-auto & no-scrollbar untuk perlindungan layar ultra-kecil */}
          <div className="flex items-start justify-between overflow-x-auto pb-2 md:pb-0 md:overflow-visible no-scrollbar">
            {INPUT_STEPS.map((st, i) => {
              const Icon = STEP_ICONS[i]
              const done = i < hook.step
              const active = i === hook.step
              
              return (
                <div
                  key={i}
                  className="flex items-start min-w-[75px] sm:min-w-0"
                  style={{ flex: i < INPUT_STEPS.length - 1 ? 1 : 'none' }}
                >
                  <div className="flex flex-col items-center gap-[6px] w-full">
                    {/* UI Fix: Ukuran lingkaran responsif w-8 h-8 di mobile */}
                    <div
                      className="w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300"
                      style={{
                        background: done ? 'var(--primary)' : active ? 'var(--primary-muted)' : 'var(--bg-elevated)',
                        border: `2px solid ${done || active ? 'var(--primary)' : 'var(--border)'}`,
                        boxShadow: active ? '0 0 0 4px var(--primary-muted)' : 'none',
                      }}
                    >
                      {done ? (
                        <CheckCircle size={14} color="#fff" />
                      ) : (
                        <Icon size={14} color={active ? 'var(--primary)' : 'var(--text-muted)'} />
                      )}
                    </div>
                    
                    <div className="text-center px-1">
                      {/* UI Fix: Mengganti whitespace-nowrap dengan line-clamp agar muat 4 kolom di mobile */}
                      <div
                        className="text-[10px] sm:text-xs font-semibold line-clamp-1 sm:line-clamp-none sm:whitespace-nowrap"
                        style={{
                          color: active ? 'var(--text-primary)' : done ? 'var(--primary-light)' : 'var(--text-muted)',
                        }}
                      >
                        {st.label}
                      </div>
                      {/* UI Fix: Menyembunyikan deskripsi sekunder yang terlalu panjang di mobile */}
                      <div className="text-[11px] text-[var(--text-muted)] mt-[1px] hidden sm:block">
                        {st.desc}
                      </div>
                    </div>
                  </div>
                  
                  {i < INPUT_STEPS.length - 1 && (
                    <div
                      className="flex-1 h-[2px] mx-1 sm:mx-2 mt-[15px] sm:mt-[17px] rounded-[1px] transition-colors duration-400"
                      style={{
                        background: i < hook.step ? 'var(--primary)' : 'var(--border)',
                      }}
                    />
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Layout: 1 kolom di mobile, 2 kolom (form + sidebar) di layar besar */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-4">
          {/* Form card */}
          <div className="card animate-[fadeIn_0.2s_ease]" key={hook.step}>
            {hook.step === 0 && (
              <StepIdentitas
                identitas={hook.identitas}
                errors={hook.errors0}
                touched={hook.touched0}
                ageMonths={hook.ageMonths}
                onChange={hook.setIdentitasField}
                onBlur={hook.touchIdentitas}
              />
            )}
            {hook.step === 1 && (
              <StepAntropometri
                antro={hook.antro}
                errors={hook.errors1}
                touched={hook.touched1}
                onChange={hook.setAntroField}
                onBlur={hook.touchAntro}
              />
            )}
            {hook.step === 2 && (
              <StepSosioekonomi sosio={hook.sosio} onChange={hook.setSosioField} />
            )}
            {hook.step === 3 && (
              <StepKonfirmasi
                identitas={hook.identitas}
                antro={hook.antro}
                sosio={hook.sosio}
                ageMonths={hook.ageMonths}
              />
            )}

            {/* Navigation buttons */}
            <div className="flex gap-[10px] justify-between mt-5 pt-4 border-t border-[var(--border)]">
              {hook.step > 0 ? (
                <button className="btn-secondary" onClick={hook.goBack} disabled={hook.loading}>
                  <ChevronLeft size={15} /> Kembali
                </button>
              ) : (
                <div />
              )}
              {hook.step < 3 ? (
                <button className="btn-primary" onClick={hook.goNext}>
                  {INPUT_STEPS[hook.step + 1].label} <ChevronRight size={15} />
                </button>
              ) : (
                <button className="btn-primary px-6 py-[10px]" onClick={hook.handleSubmit} disabled={hook.loading}>
                  {hook.loading ? (
                    <>
                      <span className="spinner w-[15px] h-[15px] border-2 border-[rgba(255,255,255,0.3)] border-t-white rounded-full inline-block" />{' '}
                      Memproses AI...
                    </>
                  ) : (
                    <><Send size={15} /> Proses Analisis AI</>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Sidebar tips — muncul di bawah form pada mobile, di samping kanan pada desktop */}
          <div className="flex flex-col gap-3">
            <div className="card bg-[linear-gradient(135deg,rgba(0,136,106,0.1),rgba(0,136,106,0.04))] border-[rgba(0,136,106,0.2)]">
              <div className="flex gap-2 mb-[10px] items-center">
                <Lightbulb size={16} className="text-[var(--primary)]" />
                <span className="text-[13px] font-bold text-[var(--primary-light)]">Tips Pengukuran</span>
              </div>
              <ul className="text-[12.5px] leading-[1.7] pl-[14px] m-0 text-[var(--text-secondary)]">
                {TIPS[hook.step].map(t => <li key={t}>{t}</li>)}
              </ul>
            </div>
            <div className="card">
              <div className="text-xs font-semibold mb-[10px] text-[var(--text-secondary)]">Model AI</div>
              {[
                ['Algoritma',   'Deep Neural Decision Forest'],
                ['Versi Model','v5.0.0 · Akurasi 95.04%'],
                ['Standar',    'WHO Child Growth Standards'],
                ['Output',     '3 kelas: Normal, Stunted, Severely Stunted'],
                ['Status',     'Stunting · Gizi Kurang · Wasting'],
              ].map(([l, v]) => (
                <div
                  key={l}
                  className="flex justify-between text-xs py-[5px] border-b border-[var(--border)]"
                >
                  <span className="text-[var(--text-muted)]">{l}</span>
                  <span className="font-medium text-right text-[var(--text-primary)] max-w-[60%]">{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}