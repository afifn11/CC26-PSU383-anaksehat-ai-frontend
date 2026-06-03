import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'

function ProtectedRoute({ allowedRole }) {
  const { isAuthenticated, user } = useAuthStore()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (allowedRole && user?.role !== allowedRole) {
    const redirectTo = user?.role === 'kader' ? '/kader/dashboard' : '/orangtua/dashboard'
    return <Navigate to={redirectTo} replace />
  }

  // ProtectedRoute hanya mengatur auth-guard.
  // MainLayout dipanggil di dalam masing-masing halaman — tidak di sini.
  return <Outlet />
}

export default ProtectedRoute
