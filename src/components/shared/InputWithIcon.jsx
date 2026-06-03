// src/components/shared/InputWithIcon.jsx
export function InputWithIcon({
  icon: Icon,
  type = 'text',
  placeholder,
  value,
  onChange,
  onBlur,
  hasError,
  suffix,
}) {
  return (
    <div
      className={[
        'flex items-center rounded-[var(--app-radius-md)] border bg-[var(--bg-elevated)] transition-all duration-150',
        'focus-within:border-[var(--primary)] focus-within:shadow-[0_0_0_3px_var(--primary-muted)]',
        hasError
          ? 'border-[var(--danger)] shadow-[0_0_0_3px_rgba(224,82,82,0.12)]'
          : 'border-[var(--border-medium)]',
      ].join(' ')}
    >
      {/* Icon prefix */}
      <div className="flex h-[44px] w-[42px] shrink-0 items-center justify-center text-[var(--text-muted)]">
        <Icon size={15} />
      </div>
      {/* Divider */}
      <div className="h-5 w-px bg-[var(--border-medium)]" />
      {/* Input */}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        className="h-[44px] flex-1 bg-transparent px-3 text-[14px] text-[var(--text-primary)] outline-none placeholder:text-[var(--text-muted)]"
      />
      {/* Suffix (misal: eye toggle) */}
      {suffix}
    </div>
  )
}