import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { authService } from '@/services/authService'
import toast from 'react-hot-toast'

export function useLogout() {
  const { logout } = useAuthStore()
  const navigate   = useNavigate()
  const [logoutModal, setLogoutModal]   = useState(false)
  const [loggingOut, setLoggingOut]     = useState(false)

  const openLogoutModal  = () => setLogoutModal(true)
  const closeLogoutModal = () => setLogoutModal(false)

  const handleLogout = async () => {
    setLoggingOut(true)
    try {
      await authService.logout()
      logout()
      toast.success('Berhasil logout')
      navigate('/login')
    } finally {
      setLoggingOut(false)
      setLogoutModal(false)
    }
  }

  return { logoutModal, loggingOut, openLogoutModal, closeLogoutModal, handleLogout }
}
