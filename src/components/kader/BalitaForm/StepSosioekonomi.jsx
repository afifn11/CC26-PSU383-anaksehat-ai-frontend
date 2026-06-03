import { Home } from 'lucide-react'
import { FieldWrapper } from '@/components/shared/FieldWrapper'

const PENDAPATAN_OPTIONS = [
  '< Rp 1.000.000',
  'Rp 1.000.000 – 2.000.000',
  'Rp 2.000.000 – 3.500.000',
  '> Rp 3.500.000',
]

// Opsi ini dipetakan ke nilai backend oleh motherEducationToLevel() di balitaService.js
const PENDIDIKAN_IBU_OPTIONS = [
  'Tidak Sekolah',
  'SD/Sederajat',
  'SMP/Sederajat',
  'SMA/Sederajat',
  'D3/S1/S2/S3',
]

const SELECT_FIELDS = [
  { key: 'sumber_air',       label: 'Sumber Air Bersih',         options: ['PDAM', 'Sumur Terlindungi', 'Sumur Tidak Terlindungi', 'Mata Air', 'Air Hujan'] },
  { key: 'sanitasi',         label: 'Fasilitas Sanitasi',         options: ['Jamban Sehat', 'MCK Umum', 'Tidak Ada Jamban'] },
  { key: 'akses_faskes',     label: 'Akses Fasilitas Kesehatan',  options: ['Dekat (< 2 km)', 'Sedang (2-5 km)', 'Jauh (> 5 km)'] },
  { key: 'status_imunisasi', label: 'Status Imunisasi',           options: ['Lengkap', 'Tidak Lengkap', 'Belum Imunisasi'] },
  { key: 'asi_eksklusif',    label: 'ASI Eksklusif',              options: ['Ya', 'Tidak'] },
]

export function StepSosioekonomi({ sosio, onChange }) {
  return (
    <div>
      <div className="form-section-title">
        <Home size={15} className="text-[var(--primary)]" /> Data Sosioekonomi
      </div>
      <div className="flex flex-wrap gap-3">
        {/* Pendapatan keluarga */}
        <FieldWrapper label="Pendapatan Keluarga / Bulan">
          <select
            className="input-field px-3"
            value={sosio.pendapatan_keluarga}
            onChange={onChange('pendapatan_keluarga')}
          >
            <option value="">Pilih rentang...</option>
            {PENDAPATAN_OPTIONS.map(o => <option key={o}>{o}</option>)}
          </select>
        </FieldWrapper>

        {/* Pendidikan ibu — digunakan model AI untuk nutrition score */}
        <FieldWrapper label="Pendidikan Terakhir Ibu" half>
          <select
            className="input-field px-3"
            value={sosio.pendidikan_ibu}
            onChange={onChange('pendidikan_ibu')}
          >
            {PENDIDIKAN_IBU_OPTIONS.map(o => <option key={o}>{o}</option>)}
          </select>
        </FieldWrapper>

        {/* Field-field select lainnya */}
        {SELECT_FIELDS.map(({ key, label, options }) => (
          <FieldWrapper key={key} label={label} half>
            <select
              className="input-field px-3"
              value={sosio[key]}
              onChange={onChange(key)}
            >
              {options.map(o => <option key={o}>{o}</option>)}
            </select>
          </FieldWrapper>
        ))}
      </div>
    </div>
  )
}