// src/components/shared/ChildConfirmCard.jsx
import { Baby, Clock, CheckCircle2 } from 'lucide-react'

export function ChildConfirmCard({ childInfo, onConfirm, onReject }) {
  return (
    <div className="bg-[rgba(26,122,74,0.08)] border-[1.5px] border-[var(--success)] rounded-[var(--radius-lg)] p-[16px_18px] animate-[fadeIn_0.2s_ease]">
      <div className="flex items-center gap-[10px] mb-3">
        <div className="w-[38px] h-[38px] rounded-full flex items-center justify-center shrink-0 bg-[var(--success)]">
          <Baby size={18} color="#fff" />
        </div>
        <div>
          <div className="text-[13px] font-bold text-[var(--success)]">
            Kode valid! Ditemukan data anak:
          </div>
          <div className="text-xs text-[var(--text-muted)]">
            Pastikan ini adalah anak Anda sebelum melanjutkan.
          </div>
        </div>
      </div>

      <div className="rounded-[10px] p-[12px_14px] mb-3 bg-[var(--bg-surface)]">
        <div className="grid grid-cols-2 gap-x-4 gap-y-2">
          <div>
            <div className="text-[11px] mb-[2px] text-[var(--text-muted)]">Nama Anak</div>
            <div className="text-sm font-bold text-[var(--text-primary)]">
              {childInfo.child_name}
            </div>
          </div>
          <div>
            <div className="text-[11px] mb-[2px] text-[var(--text-muted)]">Nama Orang Tua</div>
            <div className="text-sm font-semibold text-[var(--text-primary)]">
              {childInfo.parent_name}
            </div>
          </div>
          {childInfo.expires_at && (
            <div className="col-span-2">
              <div className="text-[11px] mb-[2px] text-[var(--text-muted)]">
                Kode berlaku hingga
              </div>
              <div className="text-[13px] flex items-center gap-[5px] text-[var(--text-secondary)]">
                <Clock size={12} />
                {new Date(childInfo.expires_at).toLocaleString('id-ID', {
                  day: 'numeric', month: 'long', year: 'numeric',
                  hour: '2-digit', minute: '2-digit',
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={onReject}
          className="flex-1 py-[9px] rounded-lg text-[13px] font-semibold cursor-pointer border-[1.5px] border-[var(--border-medium)] bg-transparent text-[var(--text-secondary)]"
        >
          Bukan anak saya
        </button>
        <button
          type="button"
          onClick={onConfirm}
          className="btn-primary flex-[2] justify-center py-[9px] text-[13px]"
        >
          <CheckCircle2 size={14} /> Ya, lanjutkan aktivasi
        </button>
      </div>
    </div>
  )
}