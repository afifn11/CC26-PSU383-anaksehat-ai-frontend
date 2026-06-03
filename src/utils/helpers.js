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

export function getInitials(nama = '') {
  return nama.split(' ').map(w => w[0]).filter(Boolean).slice(0, 2).join('').toUpperCase()
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

// Greeting dinamis berdasarkan jam
export function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 11) return 'Pagi'
  if (hour < 15) return 'Siang'
  if (hour < 18) return 'Sore'
  return 'Malam'
}

/**
 * Hitung usia dalam bulan dari tanggal lahir ke hari ini.
 * Menggunakan koreksi hari: jika hari ini belum melewati tanggal lahir
 * di bulan yang sedang berjalan, kurangi 1 bulan (versi akurat).
 */
export function calcAgeMonths(birthDate) {
  if (!birthDate) return null
  const b = new Date(birthDate)
  const t = new Date()
  let months = (t.getFullYear() - b.getFullYear()) * 12 + (t.getMonth() - b.getMonth())
  if (t.getDate() < b.getDate()) months--
  return Math.max(0, months)
}