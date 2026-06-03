import { useEffect } from 'react'
import { Copy, X, MessageCircle, Link2, CheckCircle2 } from 'lucide-react'
import toast from 'react-hot-toast'

export function ActivationModal({ kode, childName, expiredAt, onClose }) {
  const expiredStr = expiredAt
    ? new Date(expiredAt).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })
    : '72 jam ke depan'

  const activationUrl = `${window.location.origin}/register?role=orangtua&code=${kode}`

  const waMessage = encodeURIComponent(
    `Halo, ini kode aktivasi AnakSehat AI untuk memantau perkembangan ${childName} 👶\n\n` +
    `🔑 Kode: *${kode}*\n\n` +
    `Atau langsung klik link ini (kode otomatis terisi):\n${activationUrl}\n\n` +
    `Berlaku hingga: ${expiredStr}`
  )
  const waUrl = `https://wa.me/?text=${waMessage}`

  useEffect(() => {
    const h = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [onClose])

  const copyCode = () => { navigator.clipboard.writeText(kode); toast.success('Kode disalin!') }
  const copyLink = () => { navigator.clipboard.writeText(activationUrl); toast.success('Link aktivasi disalin!') }

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-[2000] bg-[rgba(0,0,0,0.55)] backdrop-blur-[4px] animate-[fadeIn_0.15s_ease]"
      onClick={onClose}
    >
      <div
        className="relative w-[90%] max-w-[420px] bg-[var(--bg-surface)] border border-[var(--border-medium)] rounded-[var(--radius-xl)] p-7 shadow-[var(--shadow-lg)] animate-[modalEnter_0.22s_cubic-bezier(0.34,1.56,0.64,1)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={onClose}
          aria-label="Tutup"
          className="absolute top-[14px] right-[14px] bg-transparent border-0 cursor-pointer flex p-1 rounded-md text-[var(--text-muted)]"
        >
          <X size={16} />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-[44px] h-[44px] rounded-xl flex items-center justify-center text-[22px] shrink-0 bg-[var(--primary-muted)]">
            🔑
          </div>
          <div>
            <h3 className="text-base font-bold m-0 font-jakarta text-[var(--text-primary)]">
              Kode Aktivasi Orang Tua
            </h3>
            <p className="text-xs m-0 mt-[3px] text-[var(--text-secondary)]">
              Untuk akun <strong>{childName}</strong>
            </p>
          </div>
        </div>

        {/* Kode */}
        <div className="text-center py-4 px-5 mb-[6px] rounded-[var(--radius-lg)] bg-[var(--bg-elevated)] border-2 border-dashed border-[var(--primary)]">
          <div className="text-[10px] mb-[6px] uppercase tracking-[0.1em] text-[var(--text-muted)]">
            Kode 6 Digit
          </div>
          <div className="text-[40px] font-black tracking-[0.35em] font-jakarta text-[var(--primary)]">
            {kode}
          </div>
        </div>
        <p className="text-[11.5px] text-center mb-4 text-[var(--text-muted)]">
          Berlaku hingga: <strong>{expiredStr}</strong>
        </p>

        {/* Deep link info */}
        <div className="flex items-start gap-2 rounded-[10px] p-[10px_12px] mb-4 bg-[var(--bg-elevated)] border border-[var(--border)]">
          <Link2 size={14} className="text-[var(--accent)] shrink-0 mt-[2px]" />
          <div>
            <div className="text-xs font-semibold mb-[3px] text-[var(--text-primary)]">
              Link Aktivasi Otomatis
            </div>
            <div className="text-[11px] break-all leading-relaxed text-[var(--text-muted)]">
              {activationUrl}
            </div>
            <div className="text-[11px] mt-1 text-[var(--text-secondary)]">
              Orang tua klik link ini → kode sudah terisi otomatis.
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2">
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 py-[11px] rounded-[10px] text-[13px] font-bold no-underline bg-[#25D366] text-white"
          >
            <MessageCircle size={16} /> Kirim via WhatsApp
          </a>
          <div className="flex gap-2">
            <button className="btn-secondary flex-1 justify-center text-xs" onClick={copyLink}>
              <Link2 size={13} /> Salin Link
            </button>
            <button className="btn-secondary flex-1 justify-center text-xs" onClick={copyCode}>
              <Copy size={13} /> Salin Kode
            </button>
          </div>
          <button
            className="btn-ghost justify-center text-xs text-[var(--text-muted)]"
            onClick={onClose}
          >
            Tutup
          </button>
        </div>

        {/* Footer note */}
        <p className="text-[11.5px] leading-relaxed mt-[14px] pt-3 text-[var(--text-muted)] border-t border-[var(--border)]">
          <CheckCircle2 size={11} className="inline-block align-middle mr-1" />
          Orang tua buka <strong>Register → Orang Tua</strong> → masukkan kode, atau klik link di atas.
          Kode & link hanya bisa dipakai <strong>sekali</strong>.
        </p>
      </div>
    </div>
  )
}