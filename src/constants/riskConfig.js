// ─── Stunting (HAZ) ───────────────────────────────────────────────────────────
export const RISK_STATUS = {
  NORMAL:   'Normal',
  STUNTED:  'Stunted',
  SEVERE:   'Severely Stunted',
}

export const RISK_BADGE_CLASS = {
  [RISK_STATUS.NORMAL]:  'badge-normal',
  [RISK_STATUS.STUNTED]: 'badge-stunted',
  [RISK_STATUS.SEVERE]:  'badge-severe',
}

export const RISK_COLOR = {
  [RISK_STATUS.NORMAL]:  'var(--success)',
  [RISK_STATUS.STUNTED]: 'var(--warning)',
  [RISK_STATUS.SEVERE]:  'var(--danger)',
}

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

// Label lengkap dengan referensi WHO untuk tooltip/detail
export function getWhoStatusFullLabel(status) {
  const map = {
    'Normal':                'Normal',
    'Stunted':               'Stunted (WAZ/HAZ/BAZ -2 s.d. -3 SD)',
    'Severely Stunted':      'Severely Stunted (< -3 SD)',
    'Underweight':           'Gizi Kurang / Underweight (-2 s.d. -3 SD)',
    'Severely Underweight':  'Gizi Buruk / Severely Underweight (< -3 SD)',
    'Wasting':               'Wasting (-2 s.d. -3 SD)',
    'Severely Wasting':      'Severely Wasting (< -3 SD)',
  }
  return map[status] ?? status ?? 'Normal'
}