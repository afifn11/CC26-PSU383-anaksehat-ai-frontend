import { Component } from 'react'
import { Brain, RefreshCw, ChevronLeft } from 'lucide-react'

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught:', error, info)
  }

  render() {
    if (!this.state.hasError) return this.props.children

    return (
      <div className="min-h-screen bg-[var(--bg-base)] flex flex-col items-center justify-center p-6 text-center">
        {/* Animated glitch icon */}
        <div className="w-[72px] h-[72px] rounded-[20px] bg-[var(--danger-muted)] border border-[rgba(224,82,82,0.25)] flex items-center justify-center mb-6 animate-[fadeIn_0.4s_ease]">
          <Brain size={32} className="text-[var(--danger)]" />
        </div>

        <h1 className="text-[22px] font-extrabold text-[var(--text-primary)] font-jakarta mb-2">
          Oops, terjadi kesalahan
        </h1>
        <p className="text-[14px] text-[var(--text-secondary)] leading-relaxed max-w-[380px] mb-2">
          Komponen mengalami error tak terduga. Ini bukan kesalahan Anda — coba muat ulang halaman.
        </p>

        {this.state.error && (
          <div className="bg-[var(--bg-elevated)] border border-[var(--border)] rounded-[var(--radius-md)] px-4 py-[10px] text-xs text-[var(--text-muted)] font-mono max-w-[420px] mb-6 text-left break-all">
            {this.state.error.message}
          </div>
        )}

        <div className="flex gap-[10px]">
          <button
            className="btn-secondary"
            onClick={() => window.history.back()}
          >
            <ChevronLeft size={15} /> Kembali
          </button>
          <button
            className="btn-primary"
            onClick={() => { this.setState({ hasError: false, error: null }); window.location.reload() }}
          >
            <RefreshCw size={15} /> Muat Ulang
          </button>
        </div>
      </div>
    )
  }
}