// src/hooks/useDetailBalita.js
import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { kaderService } from '@/services/balitaService'
import api from '@/services/api'
import toast from 'react-hot-toast'

export function useDetailBalita() {
  const { child_id } = useParams()
  const navigate     = useNavigate()

  const [child, setChild]           = useState(null)
  const [history, setHistory]       = useState([])
  const [loading, setLoading]       = useState(true)
  const [sharing, setSharing]       = useState(false)
  const [activation, setActivation] = useState(null)

  useEffect(() => {
    if (!child_id) return

    // cancelled flag: safe against StrictMode double-invoke & fast navigation
    let cancelled = false

    const fetchAll = async () => {
      setLoading(true)
      try {
        const [childRes, histRes] = await Promise.all([
          api.get(`/api/v1/children/${child_id}`),
          api.get(`/api/v1/children/${child_id}/history`),
        ])
        if (cancelled) return
        setChild(childRes.data)
        setHistory(histRes.data?.history ?? [])
      } catch (err) {
        if (cancelled) return
        if (err.response?.status === 429) {
          toast.error('Terlalu banyak request. Tunggu sebentar lalu refresh halaman.')
          setLoading(false)
        } else if (err.response?.status === 404) {
          toast.error('Data balita tidak ditemukan.')
          navigate('/kader/kelola-balita', { replace: true })
        } else {
          toast.error('Gagal memuat data balita.')
          navigate('/kader/kelola-balita', { replace: true })
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchAll()

    // Cleanup: mark as cancelled when child_id changes or component unmounts
    return () => { cancelled = true }
  }, [child_id, navigate])

  const handleShare = async () => {
    setSharing(true)
    try {
      const result = await kaderService.generateKodeAktivasi(child_id)
      setActivation({
        kode:      result.kode_aktivasi,
        childName: child?.name ?? '',
        expiredAt: result.expired_at,
      })
    } catch (err) {
      toast.error(err.response?.data?.detail?.message || 'Gagal generate kode aktivasi.')
    } finally {
      setSharing(false)
    }
  }

  const closeActivation = () => setActivation(null)

  return {
    child_id,
    child,
    history,
    loading,
    sharing,
    activation,
    handleShare,
    closeActivation,
  }
}