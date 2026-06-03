import { CheckCircle, Baby } from 'lucide-react'
import { FieldWrapper } from '@/components/shared/FieldWrapper'
import { JENIS_KELAMIN_OPTIONS } from '@/constants/formOptions'

export function StepIdentitas({ identitas, errors, touched, ageMonths, onChange, onBlur }) {
  const today = new Date().toISOString().split('T')[0]

  const getErrorClass = (field) =>
    touched[field] && errors[field] ? '!border-[var(--danger)]' : ''

  return (
    <div>
      <div className="form-section-title">
        <Baby size={15} className="text-[var(--primary)]" /> Identitas Anak
      </div>
      <div className="flex flex-wrap gap-3">

        {/* Nama anak */}
        <FieldWrapper label="Nama Lengkap Anak" required error={errors.nama} touched={touched.nama}>
          <input
            className={`input-field ${getErrorClass('nama')}`}
            placeholder="Nama balita"
            value={identitas.nama}
            onChange={onChange('nama')}
            onBlur={() => onBlur('nama')}
          />
        </FieldWrapper>

        {/* Nama ibu / orang tua */}
        <FieldWrapper label="Nama Orang Tua / Ibu" required error={errors.nama_ibu} touched={touched.nama_ibu}>
          <input
            className={`input-field ${getErrorClass('nama_ibu')}`}
            placeholder="Nama ibu atau wali"
            value={identitas.nama_ibu}
            onChange={onChange('nama_ibu')}
            onBlur={() => onBlur('nama_ibu')}
          />
        </FieldWrapper>

        {/* Tanggal lahir */}
        <FieldWrapper label="Tanggal Lahir" required half error={errors.tanggal_lahir} touched={touched.tanggal_lahir}>
          <input
            className={`input-field ${getErrorClass('tanggal_lahir')}`}
            type="date"
            max={today}
            value={identitas.tanggal_lahir}
            onChange={onChange('tanggal_lahir')}
            onBlur={() => onBlur('tanggal_lahir')}
          />
        </FieldWrapper>

        {/* Jenis kelamin */}
        <FieldWrapper label="Jenis Kelamin" required half error={errors.jenis_kelamin} touched={touched.jenis_kelamin}>
          <select
            className={`input-field ${getErrorClass('jenis_kelamin')}`}
            value={identitas.jenis_kelamin}
            onChange={onChange('jenis_kelamin')}
            onBlur={() => onBlur('jenis_kelamin')}
          >
            <option value="">Pilih...</option>
            {JENIS_KELAMIN_OPTIONS.map(o => <option key={o}>{o}</option>)}
          </select>
        </FieldWrapper>

        {/* Nomor HP orang tua */}
        <FieldWrapper label="Nomor HP Orang Tua" required error={errors.no_hp_ortu} touched={touched.no_hp_ortu}>
          <input
            className={`input-field ${getErrorClass('no_hp_ortu')}`}
            type="tel"
            placeholder="08xxxxxxxxxx"
            value={identitas.no_hp_ortu}
            onChange={onChange('no_hp_ortu')}
            onBlur={() => onBlur('no_hp_ortu')}
          />
        </FieldWrapper>

      </div>

      {ageMonths !== null && !errors.tanggal_lahir && (
        <div className="flex items-center gap-[6px] mt-3 px-3 py-[6px] rounded-[8px] text-[12.5px] bg-[var(--success-muted)] text-[var(--success)]">
          <CheckCircle size={14} />
          Usia terdeteksi: <strong>{ageMonths} bulan</strong>
        </div>
      )}
    </div>
  )
}