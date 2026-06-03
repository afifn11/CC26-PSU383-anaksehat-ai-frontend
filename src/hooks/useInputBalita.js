import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { prediksiService } from '@/services/balitaService'
import { calcAgeMonths } from '@/utils/helpers'
import toast from 'react-hot-toast'

const INITIAL_IDENTITAS = {
  nama:          '',
  nama_ibu:      '',   // ← nama orang tua, dikirim sebagai parent_name ke backend
  tanggal_lahir: '',
  jenis_kelamin: '',
  no_hp_ortu:    '',   // ← dikirim sebagai parent_phone ke backend
}

const INITIAL_ANTRO = {
  berat_badan:     '',
  tinggi_badan:    '',
  lingkar_kepala:  '',
  lingkar_lengan:  '',
  tanggal_periksa: new Date().toISOString().split('T')[0],
}

const INITIAL_SOSIO = {
  pendapatan_keluarga: '',
  pendidikan_ibu:      'SMA/Sederajat', // default paling umum; dipetakan ke 'secondary' di balitaService
  sumber_air:          'PDAM',
  sanitasi:            'Jamban Sehat',
  akses_faskes:        'Dekat (< 2 km)',
  status_imunisasi:    'Lengkap',
  asi_eksklusif:       'Ya',
}

function buildIdentitasErrors(identitas, ageMonths) {
  return {
    nama: !identitas.nama.trim()
      ? 'Nama lengkap wajib diisi.'
      : '',
    nama_ibu: !identitas.nama_ibu.trim()
      ? 'Nama orang tua wajib diisi.'
      : identitas.nama_ibu.trim().length < 2
        ? 'Nama minimal 2 karakter.'
        : '',
    tanggal_lahir: !identitas.tanggal_lahir
      ? 'Tanggal lahir wajib diisi.'
      : ageMonths != null && ageMonths > 60
        ? `Usia ${ageMonths} bln melebihi 60 bln (batas balita).`
        : '',
    jenis_kelamin: !identitas.jenis_kelamin
      ? 'Jenis kelamin wajib dipilih.'
      : '',
    no_hp_ortu: !identitas.no_hp_ortu.trim()
      ? 'Nomor HP orang tua wajib diisi.'
      : !/^08\d{8,11}$/.test(identitas.no_hp_ortu.replace(/\s/g, ''))
        ? 'Format: 08xxxxxxxxxx.'
        : '',
  }
}

function buildAntroErrors(antro) {
  return {
    berat_badan: !antro.berat_badan
      ? 'Wajib diisi.'
      : isNaN(+antro.berat_badan) || +antro.berat_badan < 0.1 || +antro.berat_badan > 30
        ? 'Berat 0.1–30 kg.'
        : '',
    tinggi_badan: !antro.tinggi_badan
      ? 'Wajib diisi.'
      : isNaN(+antro.tinggi_badan) || +antro.tinggi_badan < 1 || +antro.tinggi_badan > 130
        ? 'Tinggi 1–130 cm.'
        : '',
    tanggal_periksa: !antro.tanggal_periksa
      ? 'Tanggal pemeriksaan wajib diisi.'
      : new Date(antro.tanggal_periksa) > new Date()
        ? 'Tanggal pemeriksaan tidak boleh di masa depan.'
        : '',
  }
}

export function useInputBalita() {
  const navigate = useNavigate()

  const [step, setStep]         = useState(0)
  const [loading, setLoading]   = useState(false)
  const [touched0, setTouched0] = useState({})
  const [touched1, setTouched1] = useState({})

  const [identitas, setIdentitas] = useState(INITIAL_IDENTITAS)
  const [antro, setAntro]         = useState(INITIAL_ANTRO)
  const [sosio, setSosio]         = useState(INITIAL_SOSIO)

  const setIdentitasField = (field) => (e) =>
    setIdentitas((prev) => ({ ...prev, [field]: e.target.value }))

  const setAntroField = (field) => (e) =>
    setAntro((prev) => ({ ...prev, [field]: e.target.value }))

  const setSosioField = (field) => (e) =>
    setSosio((prev) => ({ ...prev, [field]: e.target.value }))

  const touchIdentitas = (field) =>
    setTouched0((t) => ({ ...t, [field]: true }))

  const touchAntro = (field) =>
    setTouched1((t) => ({ ...t, [field]: true }))

  const ageMonths = useMemo(
    () => calcAgeMonths(identitas.tanggal_lahir),
    [identitas.tanggal_lahir],
  )

  const errors0 = useMemo(
    () => buildIdentitasErrors(identitas, ageMonths),
    [identitas, ageMonths],
  )

  const errors1 = useMemo(() => buildAntroErrors(antro), [antro])

  const step0Valid = Object.values(errors0).every((e) => !e)
  const step1Valid = Object.values(errors1).every((e) => !e)

  const goNext = () => {
    if (step === 0) {
      setTouched0({
        nama: true, nama_ibu: true,
        tanggal_lahir: true, jenis_kelamin: true, no_hp_ortu: true,
      })
      if (!step0Valid) { toast.error('Lengkapi data yang diperlukan.'); return }
    }
    if (step === 1) {
      setTouched1({ berat_badan: true, tinggi_badan: true, tanggal_periksa: true })
      if (!step1Valid) { toast.error('Lengkapi data antropometri.'); return }
    }
    setStep((s) => s + 1)
  }

  const goBack = () => setStep((s) => Math.max(0, s - 1))

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const payload = {
        ...identitas,
        ...antro,
        berat_badan:    parseFloat(antro.berat_badan),
        tinggi_badan:   parseFloat(antro.tinggi_badan),
        lingkar_kepala: antro.lingkar_kepala ? parseFloat(antro.lingkar_kepala) : null,
        lingkar_lengan: antro.lingkar_lengan ? parseFloat(antro.lingkar_lengan) : null,
        ...sosio,
      }
      const result = await prediksiService.predict(payload)
      toast.success('🎉 Prediksi berhasil diproses!')
      navigate(`/kader/hasil-prediksi/${result.child_id}/${result.prediction_id}`)
    } catch (err) {
      const msg =
        err.message ||
        err.response?.data?.detail?.message ||
        (typeof err.response?.data?.detail === 'string' ? err.response?.data?.detail : null) ||
        'Gagal memproses prediksi. Coba lagi.'
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  const progressPct = (step / 3) * 100

  return {
    step, loading,
    identitas, antro, sosio,
    touched0, touched1,
    errors0, errors1,
    ageMonths,
    step0Valid, step1Valid,
    progressPct,
    setIdentitasField, setAntroField, setSosioField,
    touchIdentitas, touchAntro,
    goNext, goBack, handleSubmit,
  }
}