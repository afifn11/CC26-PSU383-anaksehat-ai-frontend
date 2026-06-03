import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export function formatRupiah(amount) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount)
}

export function formatTanggal(dateStr) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export function formatTanggalWaktu(dateStr) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function hitungUsiaBulan(tanggalLahir) {
  const lahir   = new Date(tanggalLahir)
  const sekarang = new Date()
  return (
    (sekarang.getFullYear() - lahir.getFullYear()) * 12 +
    (sekarang.getMonth() - lahir.getMonth())
  )
}

export function getInitials(nama = '') {
  return nama.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()
}

// Warna badge berdasarkan status risiko
export function getRisikoClass(risiko) {
  switch (risiko) {
    case 'Normal':           return 'badge-normal'
    case 'Stunted':          return 'badge-stunted'
    case 'Severely Stunted': return 'badge-severe'
    default:                 return 'badge-secondary'
  }
}

// Warna teks berdasarkan HAZ z-score (WHO cut-off)
export function getHazColor(haz) {
  if (haz == null) return 'var(--text-muted)'
  if (haz >= -2)   return 'var(--success)'
  if (haz >= -3)   return 'var(--warning)'
  return 'var(--danger)'
}

// Label status berdasarkan HAZ z-score
export function getHazLabel(haz) {
  if (haz == null) return '—'
  if (haz >= -2)   return 'Normal'
  if (haz >= -3)   return 'Stunted'
  return 'Severely Stunted'
}

// Greeting dinamis berdasarkan jam
export function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 11) return 'Pagi'
  if (hour < 15) return 'Siang'
  if (hour < 18) return 'Sore'
  return 'Malam'
}

/** Alias exported for cross-module use; avoids duplicating logic */
export function calcAgeMonths(birthDate) {
  if (!birthDate) return null
  const b = new Date(birthDate)
  const t = new Date()
  return Math.max(0, (t.getFullYear() - b.getFullYear()) * 12 + (t.getMonth() - b.getMonth()))
}
