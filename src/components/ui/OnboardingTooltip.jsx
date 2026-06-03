/* eslint-disable react-refresh/only-export-components */
// src/components/ui/OnboardingTooltip.jsx
import { useEffect, useState } from 'react'
import { X, ChevronRight, ChevronLeft, Sparkles } from 'lucide-react'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Store: menyimpan apakah onboarding sudah selesai
export const useOnboardingStore = create(
  persist(
    (set, get) => ({
      completedFor: {},
      isCompleted: (userId) => !!get().completedFor[userId],
      markCompleted: (userId) =>
        set((s) => ({ completedFor: { ...s.completedFor, [userId]: true } })),
      resetFor: (userId) =>
        set((s) => {
          const c = { ...s.completedFor }
          delete c[userId]
          return { completedFor: c }
        }),
    }),
    { name: 'anaksehat-onboarding' }
  )
)

const STEPS = [
  {
    title: 'Selamat datang di AnakSehat AI! 👋',
    desc: 'Platform deteksi stunting berbasis Deep Learning untuk membantu kader Posyandu memantau tumbuh kembang balita di wilayah Anda.',
    emoji: '🧠',
    color: 'var(--primary)',
  },
  {
    title: 'Dashboard — Pantau Wilayah Anda',
    desc: 'Di sini Anda bisa melihat ringkasan jumlah balita, distribusi status gizi, dan tren kesehatan komunitas secara real-time.',
    emoji: '📊',
    color: 'var(--secondary-light)',
  },
  {
    title: 'Input Data Balita',
    desc: 'Gunakan tombol "Tambah Data Baru" di sidebar untuk menginput data balita baru. Sistem AI akan otomatis menghitung HAZ Z-Score dan risiko stunting.',
    emoji: '📝',
    color: 'var(--accent)',
  },
  {
    title: 'Bagikan ke Orang Tua',
    desc: 'Setelah analisis selesai, bagikan hasilnya ke orang tua dengan kode aktivasi otomatis. Orang tua bisa pantau perkembangan anak dari aplikasi mereka.',
    emoji: '🔗',
    color: 'var(--success)',
  },
  {
    title: 'Siap Memulai! 🎉',
    desc: 'Anda sudah siap menggunakan AnakSehat AI. Mulai dengan menambahkan data balita pertama di wilayah Anda.',
    emoji: '🚀',
    color: 'var(--primary)',
  },
]

export function OnboardingGuide({ userId }) {
  const { isCompleted, markCompleted } = useOnboardingStore()
  const [step, setStep] = useState(0)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (userId && !isCompleted(userId)) {
      const t = setTimeout(() => setVisible(true), 600)
      return () => clearTimeout(t)
    }
  }, [isCompleted, userId])

  const handleClose = () => {
    setVisible(false)
    markCompleted(userId)
  }

  const handleNext = () => {
    if (step < STEPS.length - 1) setStep(s => s + 1)
    else handleClose()
  }

  const handlePrev = () => {
    if (step > 0) setStep(s => s - 1)
  }

  if (!visible) return null

  const current = STEPS[step]
  const isLast  = step === STEPS.length - 1

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={handleClose}
        className="fixed inset-0 bg-[rgba(0,0,0,0.45)] backdrop-blur-[2px] z-[3000] animate-[fadeIn_0.2s_ease]"
      />

      {/* Card */}
      <div className="fixed bottom-8 right-8 w-[360px] bg-[var(--bg-surface)] border border-[var(--border-medium)] rounded-[var(--radius-xl)] shadow-[var(--shadow-lg)] z-[3001] overflow-hidden animate-[modalEnter_0.3s_cubic-bezier(0.34,1.56,0.64,1)]">
        {/* Top accent bar */}
        <div
          className="h-1 transition-colors duration-400"
          style={{ background: `linear-gradient(90deg, ${current.color}, var(--primary-light))` }}
        />

        {/* Content */}
        <div className="px-6 pt-5 pb-4">
          <div className="flex items-start justify-between mb-[14px]">
            <div
              className="w-12 h-12 rounded-[14px] flex items-center justify-center text-[22px] flex-shrink-0 transition-colors duration-400"
              style={{ background: `${current.color}22` }}
            >
              {current.emoji}
            </div>
            <button
              onClick={handleClose}
              className="bg-transparent border-none cursor-pointer text-[var(--text-muted)] rounded-md p-1 flex items-center justify-center"
              title="Lewati panduan"
            >
              <X size={16} />
            </button>
          </div>

          <h3 className="text-[15px] font-bold text-[var(--text-primary)] mb-2 font-jakarta leading-[1.3]">
            {current.title}
          </h3>
          <p className="text-[13px] text-[var(--text-secondary)] leading-[1.6] mb-[18px]">
            {current.desc}
          </p>

          {/* Progress dots */}
          <div className="flex gap-[6px] mb-4">
            {STEPS.map((_, i) => (
              <button
                key={i}
                onClick={() => setStep(i)}
                className="border-none cursor-pointer p-0 transition-all duration-300 rounded-[3px]"
                style={{
                  width: i === step ? 20 : 6,
                  height: 6,
                  background: i === step ? current.color : 'var(--border-medium)',
                }}
              />
            ))}
          </div>

          {/* Navigation */}
          <div className="flex gap-2 items-center">
            <button
              onClick={handleClose}
              className="text-xs text-[var(--text-muted)] bg-transparent border-none cursor-pointer py-[6px] mr-auto"
            >
              Lewati
            </button>
            {step > 0 && (
              <button className="btn-ghost py-[7px] px-3 text-[13px]" onClick={handlePrev}>
                <ChevronLeft size={14} /> Kembali
              </button>
            )}
            <button
              onClick={handleNext}
              className="inline-flex items-center gap-[6px] rounded-[var(--radius-md)] px-[18px] py-2 text-[13px] font-semibold cursor-pointer border-none text-white font-dm transition-colors duration-300"
              style={{ background: current.color }}
            >
              {isLast ? (
                <><Sparkles size={13} /> Mulai!</>
              ) : (
                <>Lanjut <ChevronRight size={14} /></>
              )}
            </button>
          </div>
        </div>

        {/* Step counter */}
        <div className="px-6 py-2 bg-[var(--bg-elevated)] border-t border-[var(--border)] text-[11.5px] text-[var(--text-muted)] flex items-center gap-[5px]">
          <Sparkles size={11} style={{ color: current.color }} />
          Langkah {step + 1} dari {STEPS.length}
        </div>
      </div>
    </>
  )
}