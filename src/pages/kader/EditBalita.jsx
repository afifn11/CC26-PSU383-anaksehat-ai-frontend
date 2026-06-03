// src/pages/kader/EditBalita.jsx
import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import MainLayout from '@/components/layout/MainLayout'
import api from '@/services/api'
import { Save, CheckCircle, User, MapPin, ChevronLeft } from 'lucide-react'
import toast from 'react-hot-toast'
import { Breadcrumb } from '@/components/ui/SharedComponents'
import { FieldWrapper } from '@/components/shared/FieldWrapper'

export default function EditBalita() {
  const { child_id } = useParams()
  const navigate     = useNavigate()

  const [loading, setLoading]   = useState(true)
  const [saving, setSaving]     = useState(false)
  const [touched, setTouched]   = useState({})
  const [original, setOriginal] = useState(null)

  const [form, setForm] = useState({
    name:        '',
    parent_name: '',
    address:     '',
    village:     '',
    district:    '',
    province:    '',
  })

  // Load data balita
  useEffect(() => {
    const fetchChild = async () => {
      try {
        const res  = await api.get(`/api/v1/children/${child_id}`)
        const data = res.data
        const initial = {
          name:        data.name        ?? '',
          parent_name: data.parent_name ?? '',
          address:     data.address     ?? '',
          village:     data.village     ?? '',
          district:    data.district    ?? '',
          province:    data.province    ?? '',
        }
        setForm(initial)
        setOriginal(initial)
      } catch (err) {
        toast.error('Gagal memuat data balita.')
        navigate('/kader/kelola-balita')
      } finally {
        setLoading(false)
      }
    }
    fetchChild()
  }, [child_id, navigate])

  const set  = (f) => (e) => setForm(p => ({ ...p, [f]: e.target.value }))
  const blur = (f) => setTouched(t => ({ ...t, [f]: true }))

  const errors = {
    name:        !form.name.trim()        ? 'Nama lengkap wajib diisi.' : form.name.trim().length < 2 ? 'Nama minimal 2 karakter.' : '',
    parent_name: !form.parent_name.trim() ? 'Nama orang tua wajib diisi.' : '',
  }
  const isValid = Object.values(errors).every(e => !e)

  // Cek apakah ada perubahan dari data original
  const hasChanges = original && Object.keys(form).some(k => form[k] !== original[k])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setTouched({ name: true, parent_name: true })
    if (!isValid) { toast.error('Lengkapi data yang diperlukan.'); return }
    if (!hasChanges) { toast('Tidak ada perubahan data.', { icon: 'ℹ️' }); return }

    setSaving(true)
    try {
      await api.put(`/api/v1/children/${child_id}`, {
        name:        form.name.trim(),
        parent_name: form.parent_name.trim(),
        address:     form.address.trim()  || null,
        village:     form.village.trim()  || null,
        district:    form.district.trim() || null,
        province:    form.province.trim() || null,
      })
      toast.success('Data balita berhasil diperbarui!')
      navigate(`/kader/detail-balita/${child_id}`)
    } catch (err) {
      const msg = err.response?.data?.detail?.message || 'Gagal menyimpan perubahan.'
      toast.error(msg)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return (
    <MainLayout>
      <div className="fade-in max-w-[800px] mx-auto">
        {/* Skeleton */}
        {[180, 60, 100, 60].map((w, i) => (
          <div
            key={i}
            className="skeleton-shimmer rounded-lg bg-[var(--bg-elevated)] mb-[14px]"
            style={{ height: i === 0 ? 16 : 44, width: `${w}px` }}
          />
        ))}
        <div className="card flex flex-col gap-[14px]">
          {[0,1,2,3,4,5].map(i => (
            <div
              key={i}
              className="skeleton-shimmer h-[44px] rounded-lg bg-[var(--bg-elevated)]"
            />
          ))}
        </div>
      </div>
    </MainLayout>
  )

  return (
    <MainLayout>
      <div className="fade-in max-w-[800px] mx-auto">
        <Breadcrumb items={[
          { label: 'Dashboard',      href: '/kader/dashboard' },
          { label: 'Kelola Balita',  href: '/kader/kelola-balita' },
          { label: form.name || 'Detail', href: `/kader/detail-balita/${child_id}` },
          { label: 'Edit' },
        ]} />

        <div className="mb-6">
          <h1 className="page-title">Edit Data Balita</h1>
          <p className="page-subtitle">
            Perbarui informasi identitas dan lokasi. Data antropometri diperbarui melalui pemeriksaan baru.
          </p>
        </div>

        {/* Info banner */}
        <div className="bg-[var(--primary-muted)] border border-[rgba(0,136,106,0.2)] rounded-[var(--radius-md)] p-[11px_16px] mb-5 flex gap-[10px] items-start text-[13px] text-[var(--text-secondary)]">
          <CheckCircle size={15} className="text-[var(--primary)] flex-shrink-0 mt-[1px]" />
          <span>
            Field <strong>Tanggal Lahir</strong> dan <strong>Jenis Kelamin</strong> tidak dapat diubah setelah balita terdaftar.
            Hubungi administrator jika ada kesalahan data krusial.
          </span>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          {/* Identitas */}
          <div className="card mb-[14px]">
            <div className="form-section-title mb-4">
              <User size={14} className="text-[var(--primary)]" /> Identitas Anak
            </div>
            <div className="flex flex-wrap gap-3">
              <FieldWrapper label="Nama Lengkap Anak" required error={errors.name} touched={touched.name}>
                <input
                  className={`input-field ${touched.name && errors.name ? '!border-[var(--danger)]' : ''}`}
                  placeholder="Nama balita"
                  value={form.name}
                  onChange={set('name')}
                  onBlur={() => blur('name')}
                />
              </FieldWrapper>
              <FieldWrapper label="Nama Orang Tua / Wali" required error={errors.parent_name} touched={touched.parent_name}>
                <input
                  className={`input-field ${touched.parent_name && errors.parent_name ? '!border-[var(--danger)]' : ''}`}
                  placeholder="Nama ayah / ibu"
                  value={form.parent_name}
                  onChange={set('parent_name')}
                  onBlur={() => blur('parent_name')}
                />
              </FieldWrapper>
            </div>
          </div>

          {/* Alamat */}
          <div className="card mb-5">
            <div className="form-section-title mb-4">
              <MapPin size={14} className="text-[var(--primary)]" /> Alamat & Wilayah
              <span className="text-[11px] font-normal text-[var(--text-muted)] ml-2">Opsional</span>
            </div>
            <div className="flex flex-wrap gap-3">
              <FieldWrapper label="Alamat Lengkap">
                <input
                  className="input-field"
                  placeholder="Jl. Contoh No. 1, RT 01/RW 02"
                  value={form.address}
                  onChange={set('address')}
                />
              </FieldWrapper>
              <FieldWrapper label="Kelurahan / Desa" half>
                <input
                  className="input-field"
                  placeholder="Nama kelurahan"
                  value={form.village}
                  onChange={set('village')}
                />
              </FieldWrapper>
              <FieldWrapper label="Kecamatan" half>
                <input
                  className="input-field"
                  placeholder="Nama kecamatan"
                  value={form.district}
                  onChange={set('district')}
                />
              </FieldWrapper>
              <FieldWrapper label="Provinsi">
                <select
                  className="input-field pl-3"
                  value={form.province}
                  onChange={set('province')}
                >
                  <option value="">Pilih provinsi...</option>
                  {[
                    'Aceh','Sumatera Utara','Sumatera Barat','Riau','Jambi',
                    'Sumatera Selatan','Bengkulu','Lampung','Kepulauan Bangka Belitung',
                    'Kepulauan Riau','DKI Jakarta','Jawa Barat','Jawa Tengah',
                    'DI Yogyakarta','Jawa Timur','Banten','Bali',
                    'Nusa Tenggara Barat','Nusa Tenggara Timur','Kalimantan Barat',
                    'Kalimantan Tengah','Kalimantan Selatan','Kalimantan Timur',
                    'Kalimantan Utara','Sulawesi Utara','Sulawesi Tengah',
                    'Sulawesi Selatan','Sulawesi Tenggara','Gorontalo',
                    'Sulawesi Barat','Maluku','Maluku Utara',
                    'Papua Barat','Papua','Papua Selatan','Papua Tengah',
                    'Papua Pegunungan','Papua Barat Daya',
                  ].map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </FieldWrapper>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-[10px] justify-end">
            <button
              type="button"
              className="btn-secondary"
              onClick={() => navigate(`/kader/detail-balita/${child_id}`)}
              disabled={saving}
            >
              <ChevronLeft size={15} /> Batal
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={saving || !hasChanges}
              style={{ opacity: saving || !hasChanges ? 0.7 : 1 }}
            >
              {saving ? (
                <>
                  <span className="spinner w-[15px] h-[15px] border-2 border-[rgba(255,255,255,0.3)] border-t-white rounded-full inline-block" />
                  Menyimpan...
                </>
              ) : (
                <><Save size={15} /> Simpan Perubahan</>
              )}
            </button>
          </div>
        </form>
      </div>
    </MainLayout>
  )
}