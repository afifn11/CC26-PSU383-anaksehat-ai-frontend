/* eslint-disable no-unused-vars */
/* eslint-disable react-refresh/only-export-components */
// src/components/ui/AnimatedCounter.jsx
import { useEffect, useRef, useState } from 'react'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'

// ── 1. HOOK: Animated Number Counter ─────────────────────────────────────────
export function useAnimatedCounter(target, duration = 900, startDelay = 0) {
  const [value, setValue] = useState(0)
  const frameRef = useRef(null)

  useEffect(() => {
    if (target === null || target === undefined) return
    const numTarget = Number(target)
    if (isNaN(numTarget)) return

    const timeout = setTimeout(() => {
      let startTime = null
      const start = 0

      const step = (timestamp) => {
        if (!startTime) startTime = timestamp
        const elapsed  = timestamp - startTime
        const progress = Math.min(elapsed / duration, 1)
        const eased = 1 - Math.pow(1 - progress, 3)
        setValue(Math.round(start + (numTarget - start) * eased))
        if (progress < 1) frameRef.current = requestAnimationFrame(step)
      }
      frameRef.current = requestAnimationFrame(step)
    }, startDelay)

    return () => {
      clearTimeout(timeout)
      if (frameRef.current) cancelAnimationFrame(frameRef.current)
    }
  }, [target, duration, startDelay])

  return value
}

// ── 2. STAT CARD dengan Animated Counter ─────────────────────────────────────
export function AnimatedStatCard({ label, value, sub, color, icon: Icon, trend, delay = 0 }) {
  const animated = useAnimatedCounter(value, 900, delay)

  return (
    <div className="stat-card relative overflow-hidden fade-in">
      {/* subtle glow accent top-right */}
      <div
        className="absolute -top-5 -right-5 w-20 h-20 rounded-full pointer-events-none"
        style={{ background: color, opacity: 0.06 }}
      />

      <div className="flex justify-between items-start mb-[10px]">
        <div className="text-xs text-[var(--text-muted)] font-medium">{label}</div>
        <div
          className="w-[34px] h-[34px] rounded-[9px] flex items-center justify-center flex-shrink-0"
          style={{ background: `${color}22` }}
        >
          <Icon size={15} color={color} />
        </div>
      </div>

      <div className="text-[30px] font-extrabold text-[var(--text-primary)] font-jakarta leading-none tracking-[-0.5px] transition-colors duration-300">
        {value === null || value === undefined ? '—' : animated}
      </div>

      <div className="text-xs text-[var(--text-muted)] mt-[7px]">{sub}</div>

      {trend != null && (
        <div className="flex items-center gap-1 mt-2">
          <div
            className="w-4 h-4 rounded flex items-center justify-center"
            style={{
              background: trend > 0 ? 'var(--success-muted)' : 'var(--danger-muted)',
            }}
          >
            <span
              className="text-[9px] font-extrabold"
              style={{ color: trend > 0 ? 'var(--success)' : 'var(--danger)' }}
            >
              {trend > 0 ? '↑' : '↓'}
            </span>
          </div>
          <span
            className="text-[11.5px] font-medium"
            style={{ color: trend > 0 ? 'var(--success)' : 'var(--danger)' }}
          >
            {Math.abs(trend)}% dari bulan lalu
          </span>
        </div>
      )}
    </div>
  )
}

// ── 3. PROGRESS BAR dengan Animasi ───────────────────────────────────────────
export function AnimatedProgressBar({ value = 0, color = 'var(--primary)', label, showValue = true, height = 7 }) {
  const [width, setWidth] = useState(0)

  useEffect(() => {
    const t = setTimeout(() => setWidth(Math.min(100, Math.max(0, value))), 100)
    return () => clearTimeout(t)
  }, [value])

  return (
    <div>
      {(label || showValue) && (
        <div className="flex justify-between items-center mb-[5px]">
          {label && <span className="text-xs text-[var(--text-muted)]">{label}</span>}
          {showValue && (
            <span className="text-xs font-semibold" style={{ color }}>
              {Math.round(value)}%
            </span>
          )}
        </div>
      )}
      <div
        className="bg-[var(--bg-elevated)] rounded-[100px] overflow-hidden"
        style={{ height }}
      >
        <div
          className="h-full rounded-[100px] transition-[width] duration-[1100ms] ease-[cubic-bezier(0.4,0,0.2,1)]"
          style={{
            width: `${width}%`,
            background: color,
            boxShadow: `0 0 8px ${color}55`,
          }}
        />
      </div>
    </div>
  )
}

// ── 4. DONUT CHART distribusi status gizi ────────────────────────────────────
const RADIAN = Math.PI / 180

function CustomLabel({ cx, cy, midAngle, innerRadius, outerRadius, pct }) {
  if (pct < 8) return null
  const radius = innerRadius + (outerRadius - innerRadius) * 0.55
  const x = cx + radius * Math.cos(-midAngle * RADIAN)
  const y = cy + radius * Math.sin(-midAngle * RADIAN)
  return (
    <text x={x} y={y} fill="#fff" textAnchor="middle" dominantBaseline="central" fontSize={11} fontWeight={700}>
      {`${pct}%`}
    </text>
  )
}

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null
  const d = payload[0].payload
  return (
    <div className="bg-[var(--bg-elevated)] border border-[var(--border-medium)] rounded-[10px] px-[14px] py-2 text-[12.5px] shadow-[var(--shadow-md)]">
      <div className="font-bold mb-[3px]" style={{ color: d.color }}>{d.name}</div>
      <div className="text-[var(--text-secondary)]">
        {d.value} balita{' '}
        <span className="text-[var(--text-muted)]">({d.pct}%)</span>
      </div>
    </div>
  )
}

export function StatusGiziDonut({ normal = 0, stunted = 0, severe = 0, loading = false }) {
  const total = normal + stunted + severe
  if (loading) {
    return (
      <div className="h-[200px] flex items-center justify-center">
        <div className="w-[150px] h-[150px] rounded-full bg-[var(--bg-elevated)] skeleton-shimmer" />
      </div>
    )
  }

  const data = [
    { name: 'Normal',           value: normal,  pct: total ? Math.round(normal  / total * 100) : 0, color: 'var(--success)' },
    { name: 'Stunted',          value: stunted, pct: total ? Math.round(stunted / total * 100) : 0, color: 'var(--warning)' },
    { name: 'Severely Stunted', value: severe,  pct: total ? Math.round(severe  / total * 100) : 0, color: 'var(--danger)'  },
  ].filter(d => d.value > 0)

  if (total === 0) {
    return (
      <div className="h-[180px] flex items-center justify-center text-[var(--text-muted)] text-[13px]">
        Belum ada data untuk ditampilkan
      </div>
    )
  }

  return (
    <div>
      <ResponsiveContainer width="100%" height={190}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={52}
            outerRadius={82}
            paddingAngle={3}
            dataKey="value"
            labelLine={false}
            label={CustomLabel}
            animationBegin={0}
            animationDuration={900}
          >
            {data.map((entry, i) => (
              <Cell key={i} fill={entry.color} stroke="transparent" />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>

      {/* Legend manual */}
      <div className="flex flex-col gap-2 mt-1">
        {data.map(d => (
          <div key={d.name} className="flex items-center gap-2">
            <div
              className="w-[10px] h-[10px] rounded-[2px] flex-shrink-0"
              style={{ background: d.color }}
            />
            <span className="text-[12.5px] text-[var(--text-secondary)] flex-1">{d.name}</span>
            <span className="text-[12.5px] font-bold" style={{ color: d.color }}>{d.value}</span>
            <span className="text-[11px] text-[var(--text-muted)] w-[34px] text-right">{d.pct}%</span>
          </div>
        ))}
        <div className="divider my-1" />
        <div className="flex justify-between text-xs text-[var(--text-muted)]">
          <span>Total balita</span>
          <span className="font-bold text-[var(--text-primary)]">{total}</span>
        </div>
      </div>
    </div>
  )
}