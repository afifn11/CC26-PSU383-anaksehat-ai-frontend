/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable no-unused-vars */
// src/pages/kader/KelolaBalita.jsx
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import MainLayout from '@/components/layout/MainLayout'
import { balitaService } from '@/services/balitaService'
import { MOCK_BALITA } from '@/store/mockData'
import { Search, Download, PlusCircle, Edit2, Eye, Trash2, AlertCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import { ConfirmModal, EmptyState, TableRowSkeleton, Breadcrumb, StatusBadge } from '@/components/ui/SharedComponents'
import { AnimatedStatCard } from '@/components/ui/AnimatedCounter'
import { Users, TrendingDown, CheckCircle } from 'lucide-react'

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true'

export default function KelolaBalita() {
  const [balitaList, setBalitaList]   = useState([])
  const [loading, setLoading]         = useState(true)
  const [search, setSearch]           = useState('')
  const [filterStatus, setFilterStatus] = useState('Semua')
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting]        = useState(false)

  const fetchData = async () => {
    try {
      if (USE_MOCK) {
        await new Promise(r => setTimeout(r, 600))
        setBalitaList(MOCK_BALITA)
      } else {
        const res = await balitaService.getAll()
        setBalitaList(res.data ?? res)
      }
    } catch {
      toast.error('Gagal memuat data balita.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchData() }, [])

  const filtered = balitaList.filter(b => {
    const matchSearch = b.nama.toLowerCase().includes(search.toLowerCase()) ||
      b.nama_ibu.toLowerCase().includes(search.toLowerCase())
    const matchStatus = filterStatus === 'Semua' || b.status_risiko === filterStatus
    return matchSearch && matchStatus
  })

  const total   = balitaList.length
  const stunted = balitaList.filter(b => b.status_risiko !== 'Normal').length
  const normal  = balitaList.filter(b => b.status_risiko === 'Normal').length

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      await balitaService.delete(deleteTarget.id)
      const result = await balitaService.getAll({ page: 1, limit: 20 })
      setBalitaList(result.data ?? [])
      toast.success(`Data ${deleteTarget.nama} berhasil dihapus.`)
    } catch (err) {
      toast.error(err?.response?.data?.detail?.message || 'Gagal menghapus data.')
    } finally {
      setDeleting(false)
      setDeleteTarget(null)
    }
  }

  const isEmpty = !loading && filtered.length === 0
  const isSearchEmpty = !loading && balitaList.length > 0 && filtered.length === 0

  return (
    <MainLayout>
      <div className="fade-in">

        <Breadcrumb items={[
          { label: 'Dashboard', href: '/kader/dashboard' },
          { label: 'Kelola Balita' },
        ]} />

        <div className="flex justify-between items-start mb-5 flex-wrap gap-[10px]">
          <div>
            <h1 className="page-title">Kelola Balita</h1>
            <p className="page-subtitle">Manajemen data tumbuh kembang anak di wilayah kerja Anda.</p>
          </div>
          <Link to="/kader/input-balita" className="btn-primary">
            <PlusCircle size={16} /> Tambah Data Balita
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-[repeat(auto-fit,minmax(160px,1fr))] gap-3 mb-5">
          <AnimatedStatCard label="Total Terdaftar"  value={loading ? null : total}   sub="Semua wilayah"                                            color="var(--primary)"  icon={Users}        delay={0}   />
          <AnimatedStatCard label="Perlu Pemantauan" value={loading ? null : stunted} sub={`${total ? Math.round(stunted/total*100) : 0}% dari total`} color="var(--warning)"  icon={AlertCircle}  delay={80}  />
          <AnimatedStatCard label="Status Normal"    value={loading ? null : normal}  sub={`${total ? Math.round(normal/total*100) : 0}% dari total`}  color="var(--success)"  icon={CheckCircle}  delay={160} />
        </div>

        {stunted > 0 && !loading && (
          <div className="alert alert-warning mb-4">
            <AlertCircle size={16} className="flex-shrink-0 mt-[1px]" />
            <span>
              <strong>AI Health Insight:</strong> {stunted} balita memerlukan perhatian segera (Stunted/Severely Stunted).
              Prioritaskan intervensi gizi dan kunjungan rumah.
            </span>
          </div>
        )}

        {/* Table Card */}
        <div className="card !p-0">
          {/* Toolbar */}
          <div className="p-[14px_16px] flex gap-[10px] items-center border-b border-[var(--border)] flex-wrap">
            <div className="relative flex-1 min-w-[200px]">
              <Search size={14} className="absolute left-[10px] top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
              <input
                className="input-field pl-8 h-[34px] text-[13px]"
                placeholder="Cari nama balita atau ibu..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <select
              className="input-field w-auto h-[34px] text-[13px]"
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value)}
            >
              <option>Semua</option>
              <option>Normal</option>
              <option>Stunted</option>
              <option>Severely Stunted</option>
            </select>
            <button className="btn-secondary h-[34px] text-[13px]">
              <Download size={14} /> Export CSV
            </button>
          </div>

          {/* Body */}
          <div className="table-wrapper px-0 pb-2">
            {loading ? (
              <table>
                <thead>
                  <tr>
                    <th>Balita & Orang Tua</th><th>Usia</th><th>Berat / Tinggi</th><th>HAZ Score</th><th>Tgl. Periksa</th><th>Status Gizi</th><th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.from({ length: 5 }).map((_, i) => <TableRowSkeleton key={i} cols={7} />)}
                </tbody>
              </table>
            ) : isEmpty && balitaList.length === 0 ? (
              <EmptyState
                type="balita"
                action={
                  <Link to="/kader/input-balita" className="btn-primary text-[13px]">
                    <PlusCircle size={15} /> Tambah Balita Pertama
                  </Link>
                }
              />
            ) : isSearchEmpty ? (
              <EmptyState type="search" />
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Balita & Orang Tua</th>
                    <th>Usia</th>
                    <th>Berat / Tinggi</th>
                    <th>HAZ Score</th>
                    <th>Tgl. Periksa</th>
                    <th>Status Gizi</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(b => {
                    const hazColor = b.haz_score != null
                      ? (b.haz_score >= -2 ? 'var(--success)' : b.haz_score >= -3 ? 'var(--warning)' : 'var(--danger)')
                      : 'var(--text-muted)'
                    return (
                      <tr key={b.id}>
                        <td>
                          <div className="flex items-center gap-[10px]">
                            <div className="avatar">{b.nama.split(' ').map(w => w[0]).slice(0,2).join('').toUpperCase()}</div>
                            <div>
                              <div className="font-semibold text-[13px]">{b.nama}</div>
                              <div className="text-[11.5px] text-[var(--text-muted)]">{b.nama_ibu}</div>
                            </div>
                          </div>
                        </td>
                        <td className="text-[13px]">{b.usia_bulan} Bulan</td>
                        <td className="text-[13px]">{b.berat_badan} kg / {b.tinggi_badan} cm</td>
                        <td className="text-[13px] font-semibold" style={{ color: hazColor }}>
                          {b.haz_score != null ? b.haz_score.toFixed(2) : '—'}
                        </td>
                        <td className="text-xs text-[var(--text-muted)]">{b.tanggal_periksa}</td>
                        <td><StatusBadge status={b.status_risiko} /></td>
                        <td>
                          <div className="flex gap-1">
                            <Link
                              to={`/kader/detail-balita/${b.id}`}
                              className="btn-ghost p-[5px_8px] text-xs"
                              title="Lihat Detail Balita"
                            >
                              <Eye size={14} />
                            </Link>
                            <Link
                              to={`/kader/edit-balita/${b.id}`}
                              className="btn-ghost p-[5px_8px] text-xs"
                              title="Edit Data Balita"
                            >
                              <Edit2 size={14} />
                            </Link>
                            <button
                              className="btn-ghost p-[5px_8px] text-[var(--danger)]"
                              title="Hapus"
                              onClick={() => setDeleteTarget({ id: b.id, nama: b.nama })}
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            )}
          </div>

          {!loading && balitaList.length > 0 && (
            <div className="p-[12px_16px] flex justify-between items-center border-t border-[var(--border)]">
              <span className="text-xs text-[var(--text-muted)]">
                Menampilkan {filtered.length} dari {balitaList.length} balita
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirm Modal */}
      <ConfirmModal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        title={`Hapus Data ${deleteTarget?.nama}?`}
        message="Semua riwayat pemeriksaan balita ini juga akan dihapus secara permanen. Tindakan ini tidak dapat dibatalkan."
        confirmLabel="Ya, Hapus"
        variant="danger"
        loading={deleting}
      />
    </MainLayout>
  )
}