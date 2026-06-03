import { AlertTriangle } from 'lucide-react'

export function FieldWrapper({ label, icon: Icon, error, touched, required = false, half = false, children }) {
  const showError = touched && !!error

  return (
    <div className={half ? 'flex-[1_1_calc(50%-6px)]' : 'flex-[1_1_100%]'}>
      <label className="label">
        {label}
        {required && <span className="text-[var(--danger)] ml-[3px]">*</span>}
      </label>
      {children}
      {showError && (
        <div className="flex items-center gap-[5px] mt-[5px] text-xs text-[var(--danger)] animate-[fadeIn_0.15s_ease]">
          <AlertTriangle size={11} /> {error}
        </div>
      )}
    </div>
  )
}