// src/components/shared/PasswordInput.jsx
import { useState } from 'react'
import { Eye, EyeOff, Lock } from 'lucide-react'
import { InputWithIcon } from './InputWithIcon'

export function PasswordInput({ placeholder, value, onChange, onBlur, hasError }) {
  const [show, setShow] = useState(false)

  return (
    <InputWithIcon
      icon={Lock}
      type={show ? 'text' : 'password'}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      hasError={hasError}
      suffix={
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          className="flex h-[44px] w-[40px] shrink-0 items-center justify-center border-none bg-transparent cursor-pointer text-[var(--text-muted)] transition-colors hover:text-[var(--text-secondary)]"
        >
          {show ? <EyeOff size={15} /> : <Eye size={15} />}
        </button>
      }
    />
  )
}