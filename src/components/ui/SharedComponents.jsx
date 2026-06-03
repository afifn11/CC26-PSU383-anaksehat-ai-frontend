/* eslint-disable no-useless-assignment */
// src/components/ui/SharedComponents.jsx
import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronRight, X, AlertTriangle, CheckCircle, Info } from 'lucide-react'

// ── 1. SKELETON LOADING ───────────────────────────────────────────────────────
export function Skeleton({ width = '100%', height = 16, radius = 6, style = {} }) {
  return (
    <div
      className="skeleton-shimmer flex-shrink-0"
      style={{
        width,
        height,
        borderRadius: radius,
        ...style,
      }}
    />
  )
}

export function StatCardSkeleton() {
  return (
    <div className="stat-card flex flex-col gap-[10px]">
      <div className="flex justify-between items-center">
        <Skeleton width={90} height={12} />
        <Skeleton width={32} height={32} radius={9} />
      </div>
      <Skeleton width={60} height={28} radius={6} />
      <Skeleton width={110} height={11} />
    </div>
  )
}

export function TableRowSkeleton({ cols = 6 }) {
  return (
    <tr>
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="p-[14px]">
          {i === 0 ? (
            <div className="flex items-center gap-[10px]">
              <Skeleton width={32} height={32} radius={50} />
              <div className="flex flex-col gap-[5px]">
                <Skeleton width={90} height={12} />
                <Skeleton width={65} height={10} />
              </div>
            </div>
          ) : (
            <Skeleton width={i === cols - 1 ? 60 : 70} height={12} />
          )}
        </td>
      ))}
    </tr>
  )
}

export function CardSkeleton({ lines = 3 }) {
  return (
    <div className="card flex flex-col gap-3">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          width={i === 0 ? '60%' : i === lines - 1 ? '45%' : '85%'}
          height={i === 0 ? 14 : 12}
        />
      ))}
    </div>
  )
}

// ── 2. EMPTY STATE SVG ────────────────────────────────────────────────────────
function EmptySVGBalita() {
  return (
    <svg width="140" height="120" viewBox="0 0 140 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="70" cy="65" r="48" fill="var(--primary-muted)" />
      <ellipse cx="70" cy="72" rx="22" ry="18" fill="var(--bg-elevated)" stroke="var(--border-medium)" strokeWidth="1.5" />
      <circle cx="70" cy="50" r="16" fill="var(--bg-elevated)" stroke="var(--border-medium)" strokeWidth="1.5" />
      <circle cx="64" cy="49" r="2.5" fill="var(--text-muted)" />
      <circle cx="76" cy="49" r="2.5" fill="var(--text-muted)" />
      <path d="M 64 55 Q 70 60 76 55" stroke="var(--text-muted)" strokeWidth="1.8" strokeLinecap="round" fill="none" />
      <ellipse cx="48" cy="70" rx="7" ry="4" fill="var(--bg-elevated)" stroke="var(--border-medium)" strokeWidth="1.5" transform="rotate(-20 48 70)" />
      <ellipse cx="92" cy="70" rx="7" ry="4" fill="var(--bg-elevated)" stroke="var(--border-medium)" strokeWidth="1.5" transform="rotate(20 92 70)" />
      <path d="M 30 30 L 32 26 L 34 30 L 38 32 L 34 34 L 32 38 L 30 34 L 26 32 Z" fill="var(--primary)" opacity="0.6" />
      <path d="M 104 22 L 105.5 19 L 107 22 L 110 23.5 L 107 25 L 105.5 28 L 104 25 L 101 23.5 Z" fill="var(--primary-light)" opacity="0.5" />
      <circle cx="110" cy="45" r="10" fill="var(--primary)" opacity="0.15" />
      <path d="M 110 40 L 110 50 M 105 45 L 115 45" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
    </svg>
  )
}

function EmptySVGSearch() {
  return (
    <svg width="120" height="110" viewBox="0 0 120 110" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="36" fill="var(--bg-elevated)" stroke="var(--border-medium)" strokeWidth="2" />
      <circle cx="50" cy="50" r="24" fill="var(--bg-hover)" />
      <path d="M 28 28 L 72 72" stroke="var(--border-medium)" strokeWidth="2" strokeDasharray="4 4" />
      <path d="M 78 78 L 100 100" stroke="var(--text-muted)" strokeWidth="3.5" strokeLinecap="round" />
      <circle cx="100" cy="100" r="6" fill="var(--text-muted)" />
      <path d="M 42 42 L 58 58 M 58 42 L 42 58" stroke="var(--text-muted)" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  )
}

function EmptySVGRiwayat() {
  return (
    <svg width="130" height="115" viewBox="0 0 130 115" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="30" y="15" width="70" height="85" rx="8" fill="var(--bg-elevated)" stroke="var(--border-medium)" strokeWidth="1.5" />
      <rect x="30" y="15" width="70" height="22" rx="8" fill="var(--primary-muted)" />
      <rect x="30" y="29" width="70" height="8" fill="var(--primary-muted)" />
      <rect x="42" y="48" width="46" height="6" rx="3" fill="var(--border-medium)" />
      <rect x="42" y="60" width="36" height="6" rx="3" fill="var(--border-medium)" />
      <rect x="42" y="72" width="42" height="6" rx="3" fill="var(--border-medium)" />
      <circle cx="100" cy="20" r="15" fill="var(--bg-surface)" stroke="var(--border-medium)" strokeWidth="1.5" />
      <path d="M 100 13 L 100 20 L 106 20" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="100" cy="20" r="1.5" fill="var(--primary)" />
    </svg>
  )
}

export function EmptyState({ type = 'balita', title, desc, action }) {
  const illustrations = {
    balita: <EmptySVGBalita />,
    search: <EmptySVGSearch />,
    riwayat: <EmptySVGRiwayat />,
  }
  const defaults = {
    balita:  { title: 'Belum ada data balita', desc: 'Mulai dengan menambahkan data balita pertama di wilayah Anda.' },
    search:  { title: 'Tidak ditemukan', desc: 'Coba kata kunci lain atau hapus filter yang aktif.' },
    riwayat: { title: 'Belum ada riwayat', desc: 'Riwayat pemeriksaan akan muncul setelah data diinput.' },
  }
  const t = title ?? defaults[type]?.title ?? 'Tidak ada data'
  const d = desc  ?? defaults[type]?.desc  ?? ''
  return (
    <div className="flex flex-col items-center justify-center p-10 text-center gap-4">
      <div className="animate-[fadeIn_0.5s_ease]">
        {illustrations[type] ?? illustrations.balita}
      </div>
      <div>
        <div className="text-[15px] font-bold text-[var(--text-primary)] mb-[6px]">{t}</div>
        <div className="text-[13px] text-[var(--text-muted)] leading-[1.6] max-w-[280px]">{d}</div>
      </div>
      {action && <div className="mt-1">{action}</div>}
    </div>
  )
}

// ── 3. CONFIRM MODAL ──────────────────────────────────────────────────────────
export function ConfirmModal({
  open,
  onClose,
  onConfirm,
  title = 'Konfirmasi Aksi',
  message,
  confirmLabel = 'Ya, Lanjutkan',
  cancelLabel = 'Batal',
  variant = 'danger',
  loading = false,
}) {
  const iconMap = {
    danger:  { icon: <AlertTriangle size={22} />, color: 'var(--danger)',  bg: 'var(--danger-muted)' },
    warning: { icon: <AlertTriangle size={22} />, color: 'var(--warning)', bg: 'var(--warning-muted)' },
    success: { icon: <CheckCircle  size={22} />, color: 'var(--success)',  bg: 'var(--success-muted)' },
  }
  const { icon, color, bg } = iconMap[variant] ?? iconMap.danger

  useEffect(() => {
    if (!open) return
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open, onClose])

  if (!open) return null
  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-[rgba(0,0,0,0.55)] backdrop-blur-[3px] flex items-center justify-center z-[2000] animate-[fadeIn_0.15s_ease]"
    >
      <div
        onClick={e => e.stopPropagation()}
        className="relative bg-[var(--bg-surface)] border border-[var(--border-medium)] rounded-[var(--radius-xl)] p-7 max-w-[380px] w-[90%] shadow-[var(--shadow-lg)] animate-[modalEnter_0.2s_cubic-bezier(0.34,1.56,0.64,1)]"
      >
        <button
          onClick={onClose}
          className="absolute top-[14px] right-[14px] bg-transparent border-none cursor-pointer text-[var(--text-muted)] rounded-md p-1 flex items-center justify-center"
          title="Tutup"
        >
          <X size={16} />
        </button>

        {/* Icon */}
        <div
          className="w-[50px] h-[50px] rounded-[14px] flex items-center justify-center mb-4"
          style={{ background: bg, color }}
        >
          {icon}
        </div>

        <h3 className="text-[17px] font-bold text-[var(--text-primary)] mb-2 font-jakarta">{title}</h3>
        {message && (
          <p className="text-[13.5px] text-[var(--text-secondary)] leading-[1.6] mb-6">{message}</p>
        )}

        <div className="flex gap-[10px]">
          <button
            className="btn-secondary flex-1 justify-center"
            onClick={onClose}
            disabled={loading}
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 py-[10px] px-5 rounded-[var(--radius-md)] border-none text-white font-semibold text-sm inline-flex items-center justify-center gap-2 font-dm transition-opacity duration-200"
            style={{
              background: color,
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? (
              <span className="spinner w-[14px] h-[14px] border-2 border-[rgba(255,255,255,0.3)] border-t-white rounded-full inline-block" />
            ) : (
              confirmLabel
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── 4. BREADCRUMB ─────────────────────────────────────────────────────────────
export function Breadcrumb({ items = [] }) {
  return (
    <nav
      aria-label="breadcrumb"
      className="flex items-center gap-1 text-[13px] text-[var(--text-muted)] mb-[18px] flex-wrap"
    >
      {items.map((item, i) => {
        const isLast = i === items.length - 1
        return (
          <span key={i} className="flex items-center gap-1">
            {i > 0 && <ChevronRight size={13} className="flex-shrink-0 opacity-50" />}
            {item.href && !isLast ? (
              <Link
                to={item.href}
                className="text-[var(--text-muted)] no-underline px-[6px] py-[2px] rounded-[5px] transition-colors duration-150 hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)]"
              >
                {item.label}
              </Link>
            ) : (
              <span
                className={isLast ? 'text-[var(--text-primary)] font-semibold' : 'text-[var(--text-muted)]'}
              >
                {item.label}
              </span>
            )}
          </span>
        )
      })}
    </nav>
  )
}

// ── 5. TOOLTIP ─────────────────────────────────────────────────────────────────
export function Tooltip({ children, content, position = 'top' }) {
  const [visible, setVisible] = useState(false)
  const [coords, setCoords]   = useState({ x: 0, y: 0 })
  const triggerRef = useRef(null)

  const show = () => {
    if (!triggerRef.current) return
    const rect = triggerRef.current.getBoundingClientRect()
    const scrollY = window.scrollY
    const scrollX = window.scrollX
    let x = rect.left + scrollX + rect.width / 2
    let y = rect.top  + scrollY
    if (position === 'bottom') y = rect.bottom + scrollY + 8
    else y = rect.top + scrollY - 8
    setCoords({ x, y })
    setVisible(true)
  }
  const hide = () => setVisible(false)

  return (
    <>
      <span
        ref={triggerRef}
        onMouseEnter={show}
        onMouseLeave={hide}
        className="inline-flex items-center"
      >
        {children}
      </span>
      {visible && (
        <div
          className="absolute z-[9999] bg-[var(--bg-elevated)] border border-[var(--border-medium)] rounded-lg px-[11px] py-[7px] text-xs text-[var(--text-primary)] max-w-[260px] leading-[1.5] pointer-events-none shadow-[var(--shadow-md)] animate-[tooltipEnter_0.12s_ease] text-center"
          style={{
            left: coords.x,
            top: coords.y,
            transform: position === 'bottom'
              ? 'translateX(-50%)'
              : 'translateX(-50%) translateY(-100%)',
          }}
        >
          {content}
        </div>
      )}
    </>
  )
}

// ── 6. BADGE WITH TOOLTIP ─────────────────────────────────────────────────────
const BADGE_INFO = {
  Normal: {
    className: 'badge-normal',
    tooltip: 'HAZ ≥ -2 SD: Tumbuh kembang anak sesuai standar WHO. Pertahankan pola makan dan kunjungan rutin.',
  },
  Stunted: {
    className: 'badge-stunted',
    tooltip: 'HAZ -3 s.d. -2 SD: Tinggi badan di bawah normal untuk usianya. Perlu intervensi gizi dan pemantauan intensif.',
  },
  'Severely Stunted': {
    className: 'badge-severe',
    tooltip: 'HAZ < -3 SD: Stunting berat, prioritas intervensi segera. Segera rujuk ke fasilitas kesehatan terdekat.',
  },
}

export function StatusBadge({ status }) {
  const info = BADGE_INFO[status] ?? { className: 'badge-secondary', tooltip: status }
  return (
    <Tooltip content={info.tooltip} position="top">
      <span className={`badge ${info.className} cursor-help`}>
        {status}
        <Info size={10} className="ml-[3px] opacity-70" />
      </span>
    </Tooltip>
  )
}