export function PasswordStrength({ password }) {
  if (!password) return null

  const checks = [
    password.length >= 8,
    /[A-Z]/.test(password),
    /[0-9]/.test(password),
    /[^A-Za-z0-9]/.test(password),
  ]
  const score  = checks.filter(Boolean).length
  const colors = ['var(--danger)', 'var(--danger)', 'var(--warning)', 'var(--accent)', 'var(--success)']
  const labels = ['', 'Lemah', 'Lemah', 'Cukup', 'Kuat']

  return (
    <div className="mt-2">
      <div className="flex gap-1 mb-[5px]">
        {[0, 1, 2, 3].map(i => (
          <div
            key={i}
            className="flex-1 h-1 rounded-full transition-colors duration-300"
            style={{ background: i < score ? colors[score] : 'var(--border)' }}
          />
        ))}
      </div>
      {score > 0 && (
        <div className="text-[11px] font-semibold" style={{ color: colors[score] }}>
          {labels[score]}
        </div>
      )}
    </div>
  )
}