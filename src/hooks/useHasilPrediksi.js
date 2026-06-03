// src/hooks/useHasilPrediksi.js
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { prediksiService } from '@/services/balitaService'
import toast from 'react-hot-toast'

export function useHasilPrediksi() {
  const { childId, prediksiId } = useParams()
  const navigate                = useNavigate()

  const [data, setData]             = useState(null)
  const [loading, setLoading]       = useState(true)
  const [sharing, setSharing]       = useState(false)
  const [activation, setActivation] = useState(null)

  useEffect(() => {
    if (!childId) {
      toast.error('Child ID tidak ditemukan di URL.')
      navigate('/kader/kelola-balita', { replace: true })
      return
    }

    let cancelled = false

    const fetchData = async () => {
      setLoading(true)
      try {
        const result = await prediksiService.getById(childId, prediksiId)
        if (!cancelled) setData(result)
      } catch (err) {
        if (cancelled) return
        if (err.response?.status === 429) {
          toast.error('Terlalu banyak request. Tunggu sebentar lalu refresh halaman.')
          setLoading(false)
        } else if (err.message === 'Prediksi tidak ditemukan.') {
          toast.error('Data prediksi tidak ditemukan.')
          navigate('/kader/kelola-balita', { replace: true })
        } else {
          toast.error('Gagal memuat data prediksi.')
          navigate('/kader/kelola-balita', { replace: true })
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchData()

    return () => { cancelled = true }
  }, [childId, prediksiId, navigate])

  const handleShare = async () => {
    setSharing(true)
    try {
      const result = await prediksiService.share(childId)
      setActivation({
        kode:      result.kode_aktivasi,
        childName: result.child_name || data?.balita?.nama || '',
        expiredAt: result.expired_at,
      })
    } catch (err) {
      toast.error(
        err.response?.data?.detail?.message ||
        err.message ||
        'Gagal generate kode aktivasi.',
      )
    } finally {
      setSharing(false)
    }
  }

  const handlePrint = () => window.print()

  const closeActivation = () => setActivation(null)

  return {
    data,
    loading,
    sharing,
    activation,
    handleShare,
    handlePrint,
    closeActivation,
  }
}