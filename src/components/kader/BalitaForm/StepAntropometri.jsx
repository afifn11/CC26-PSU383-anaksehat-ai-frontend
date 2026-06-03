import { Activity } from 'lucide-react'
import { FieldWrapper } from '@/components/shared/FieldWrapper'

export function StepAntropometri({ antro, errors, touched, onChange, onBlur }) {
  const today = new Date().toISOString().split('T')[0]

  const getErrorClass = (field) =>
    touched[field] && errors[field] ? '!border-[var(--danger)]' : ''

  return (
    <div>
      <div className="form-section-title">
        <Activity size={15} className="text-[var(--primary)]" /> Data Antropometri
      </div>
      <div className="flex flex-wrap gap-3">
        <FieldWrapper label="Berat Badan (kg)" required half error={errors.berat_badan} touched={touched.berat_badan}>
          <input
            className={`input-field ${getErrorClass('berat_badan')}`}
            type="number" step="0.1" min="0.1" max="30"
            placeholder="10.5"
            value={antro.berat_badan}
            onChange={onChange('berat_badan')}
            onBlur={() => onBlur('berat_badan')}
          />
        </FieldWrapper>
        <FieldWrapper label="Tinggi Badan (cm)" required half error={errors.tinggi_badan} touched={touched.tinggi_badan}>
          <input
            className={`input-field ${getErrorClass('tinggi_badan')}`}
            type="number" step="0.1" min="1" max="130"
            placeholder="80.5"
            value={antro.tinggi_badan}
            onChange={onChange('tinggi_badan')}
            onBlur={() => onBlur('tinggi_badan')}
          />
        </FieldWrapper>
        <FieldWrapper label="Lingkar Kepala (cm)" half>
          <input
            className="input-field"
            type="number" step="0.1"
            placeholder="46.0 (opsional)"
            value={antro.lingkar_kepala}
            onChange={onChange('lingkar_kepala')}
          />
        </FieldWrapper>
        <FieldWrapper label="Lingkar Lengan (cm)" half>
          <input
            className="input-field"
            type="number" step="0.1"
            placeholder="14.5 (opsional)"
            value={antro.lingkar_lengan}
            onChange={onChange('lingkar_lengan')}
          />
        </FieldWrapper>
        <FieldWrapper label="Tanggal Pemeriksaan" required error={errors.tanggal_periksa} touched={touched.tanggal_periksa}>
          <input
            className={`input-field ${getErrorClass('tanggal_periksa')}`}
            type="date" max={today}
            value={antro.tanggal_periksa}
            onChange={onChange('tanggal_periksa')}
            onBlur={() => onBlur('tanggal_periksa')}
          />
        </FieldWrapper>
      </div>
    </div>
  )
}