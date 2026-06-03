// ─── Stunting (HAZ) ───────────────────────────────────────────────────────────
export function getHazColor(haz) {
  if (haz == null)   return 'var(--text-muted)'
  if (haz >= -2)     return 'var(--success)'
  if (haz >= -3)     return 'var(--warning)'
  return 'var(--danger)'
}

export function getHazLabel(haz) {
  if (haz == null)   return '—'
  if (haz >= -2)     return 'Normal'
  if (haz >= -3)     return 'Stunted (HAZ -2 s.d. -3)'
  return 'Severely Stunted (HAZ < -3)'
}

// ─── 3 Status WHO ─────────────────────────────────────────────────────────────
// Warna dan label untuk stunting_status, underweight_status, wasting_status

export function getWhoStatusColor(status) {
  if (!status || status === 'Normal') return 'var(--success)'
  if (status.startsWith('Severely'))  return 'var(--danger)'
  return 'var(--warning)'
}

export function getWhoStatusBadgeClass(status) {
  if (!status || status === 'Normal') return 'badge-normal'
  if (status.startsWith('Severely'))  return 'badge-severe'
  return 'badge-stunted'
}

// Label ringkas untuk ditampilkan di card/badge
export function getWhoStatusShortLabel(status) {
  const map = {
    'Normal':                'Normal',
    'Stunted':               'Stunted',
    'Severely Stunted':      'Severely Stunted',
    'Underweight':           'Gizi Kurang',
    'Severely Underweight':  'Gizi Buruk',
    'Wasting':               'Wasting',
    'Severely Wasting':      'Severely Wasting',
  }
  return map[status] ?? status ?? 'Normal'
}