import { useEffect, useState } from 'react'
import { useAuthStore } from '@/store/authStore'
import api from '@/services/api'
import toast from 'react-hot-toast'

const INITIAL_PW_FORM = {
  current_password: '',
  new_password: '',
  confirm_password: '',
}

function buildInfoErrors(form) {
  return {
    name:
      !form.name.trim()
        ? 'Nama wajib diisi.'
        : form.name.trim().length < 2
          ? 'Nama minimal 2 karakter.'
          : '',
    email:
      form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)
        ? 'Format email tidak valid.'
        : '',
  }
}

function buildPwErrors(form) {
  return {
    current_password: !form.current_password
      ? 'Password saat ini wajib diisi.'
      : '',
    new_password: !form.new_password
      ? 'Password baru wajib diisi.'
      : form.new_password.length < 8
        ? 'Password minimal 8 karakter.'
        : form.new_password === form.current_password
          ? 'Password baru tidak boleh sama dengan yang lama.'
          : '',
    confirm_password: !form.confirm_password
      ? 'Konfirmasi password wajib diisi.'
      : form.confirm_password !== form.new_password
        ? 'Konfirmasi password tidak cocok.'
        : '',
  }
}

export function useProfil() {
  const { user, updateUser } = useAuthStore()

  const [profile, setProfile]   = useState(null)
  const [loading, setLoading]   = useState(true)
  const [editMode, setEditMode] = useState(false)
  const [saving, setSaving]     = useState(false)
  const [infoForm, setInfoForm] = useState({ name: '', email: '' })
  const [infoTouched, setInfoTouched] = useState({})

  const [pwForm, setPwForm]       = useState(INITIAL_PW_FORM)
  const [pwTouched, setPwTouched] = useState({})
  const [pwSaving, setPwSaving]   = useState(false)
  const [pwSuccess, setPwSuccess] = useState(false)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/api/v1/users/me')
        setProfile(res.data)
        setInfoForm({ name: res.data.name ?? '', email: res.data.email ?? '' })
      } catch {
        const fallback = {
          name:       user?.nama ?? user?.name ?? '',
          phone:      user?.phone ?? '',
          email:      user?.email ?? '',
          role:       user?.role ?? 'kader',
          created_at: null,
          stats:      null,
        }
        setProfile(fallback)
        setInfoForm({ name: fallback.name, email: fallback.email })
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
  }, [user])

  const infoErrors = buildInfoErrors(infoForm)
  const infoValid  = Object.values(infoErrors).every((e) => !e)

  const handleSaveInfo = async () => {
    setInfoTouched({ name: true, email: true })
    if (!infoValid) return
    setSaving(true)
    try {
      const res = await api.put('/api/v1/users/me', {
        name:  infoForm.name.trim(),
        email: infoForm.email.trim() || null,
      })
      setProfile((p) => ({ ...p, name: res.data.name, email: res.data.email }))
      updateUser({ nama: res.data.name, name: res.data.name, email: res.data.email })
      setEditMode(false)
      toast.success('Profil berhasil diperbarui!')
    } catch (err) {
      toast.error(err.response?.data?.detail?.message || 'Gagal menyimpan profil.')
    } finally {
      setSaving(false)
    }
  }

  const cancelEdit = () => {
    setEditMode(false)
    setInfoForm({ name: profile?.name ?? '', email: profile?.email ?? '' })
    setInfoTouched({})
  }

  const pwErrors = buildPwErrors(pwForm)
  const pwValid  = Object.values(pwErrors).every((e) => !e)

  const handleChangePassword = async (e) => {
    e.preventDefault()
    setPwTouched({ current_password: true, new_password: true, confirm_password: true })
    if (!pwValid) return
    setPwSaving(true)
    try {
      await api.put('/api/v1/users/me/change-password', {
        current_password: pwForm.current_password,
        new_password:     pwForm.new_password,
      })
      setPwSuccess(true)
      setPwForm(INITIAL_PW_FORM)
      setPwTouched({})
      toast.success('Password berhasil diperbarui!')
      setTimeout(() => setPwSuccess(false), 4000)
    } catch (err) {
      toast.error(err.response?.data?.detail?.message || 'Gagal mengubah password.')
    } finally {
      setPwSaving(false)
    }
  }

  return {
    profile,
    loading,
    editMode,
    saving,
    infoForm,
    infoTouched,
    infoErrors,
    infoValid,
    pwForm,
    pwTouched,
    pwErrors,
    pwSaving,
    pwSuccess,
    setEditMode,
    setInfoForm,
    setInfoTouched,
    setPwForm,
    setPwTouched,
    handleSaveInfo,
    cancelEdit,
    handleChangePassword,
  }
}
