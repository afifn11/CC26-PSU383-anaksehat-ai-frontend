// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { ErrorBoundary } from '@/components/layout/ErrorBoundary'
import Landing from '@/pages/Landing'
import Login from '@/pages/auth/Login'
import Register from '@/pages/auth/Register'
import NotFound from '@/pages/NotFound'
import KaderDashboard from '@/pages/kader/Dashboard'
import InputBalita from '@/pages/kader/InputBalita'
import HasilPrediksi from '@/pages/kader/HasilPrediksi'
import RiwayatPemeriksaan from '@/pages/kader/RiwayatPemeriksaan'
import KelolaBalita from '@/pages/kader/KelolaBalita'
import DetailBalita from '@/pages/kader/DetailBalita'
import EditBalita from '@/pages/kader/EditBalita'
import ProfilKader from '@/pages/kader/ProfilKader'
import ProfilOrangTua from '@/pages/orangtua/ProfilOrangTua'
import OrangTuaDashboard from '@/pages/orangtua/Dashboard'
import DataAnak from '@/pages/orangtua/DataAnak'
import RiwayatAnak from '@/pages/orangtua/RiwayatAnak'
import RekomendasiAnak from '@/pages/orangtua/RekomendasiAnak'
import ProtectedRoute from '@/components/layout/ProtectedRoute'
import { useAuthStore } from '@/store/authStore'
import { useThemeStore } from '@/store/themeStore'

function App() {
  const { isAuthenticated, user } = useAuthStore()
  const { theme } = useThemeStore()
  const isLight = theme === 'light'
  const toastStyle = {
    background: isLight ? '#FFFFFF' : '#1E2334',
    color: isLight ? '#0F1A16' : '#F0F2F8',
    border: isLight ? '1px solid rgba(0,0,0,0.10)' : '1px solid rgba(255,255,255,0.1)',
    borderRadius: 10, fontSize: 13, fontFamily: 'DM Sans, sans-serif',
    boxShadow: isLight ? '0 4px 16px rgba(0,0,0,0.10)' : '0 4px 16px rgba(0,0,0,0.5)',
  }
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3500,
            style: toastStyle,
            success: { iconTheme: { primary: '#00886A', secondary: '#fff' } },
            error:   { iconTheme: { primary: '#E05252', secondary: '#fff' } },
          }}
        />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route
            path="/login"
            element={isAuthenticated
              ? <Navigate to={user?.role === 'kader' ? '/kader/dashboard' : '/orangtua/dashboard'} replace />
              : <Login />}
          />
          <Route
            path="/register"
            element={isAuthenticated
              ? <Navigate to={user?.role === 'kader' ? '/kader/dashboard' : '/orangtua/dashboard'} replace />
              : <Register />}
          />

          {/* Kader routes */}
          <Route path="/kader" element={<ProtectedRoute allowedRole="kader" />}>
            <Route index                                      element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard"                           element={<KaderDashboard />} />
            <Route path="input-balita"                        element={<InputBalita />} />
            <Route path="hasil-prediksi/:childId/:prediksiId"          element={<HasilPrediksi />} />
            <Route path="riwayat"                             element={<RiwayatPemeriksaan />} />
            <Route path="kelola-balita"                       element={<KelolaBalita />} />
            <Route path="detail-balita/:child_id"             element={<DetailBalita />} />
            <Route path="edit-balita/:child_id"               element={<EditBalita />} />
            <Route path="profil"                              element={<ProfilKader />} />
          </Route>

          {/* Orangtua routes */}
          <Route path="/orangtua" element={<ProtectedRoute allowedRole="orangtua" />}>
            <Route index                                      element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard"                           element={<OrangTuaDashboard />} />
            <Route path="data-anak"                           element={<DataAnak />} />
            <Route path="riwayat"                             element={<RiwayatAnak />} />
            <Route path="rekomendasi"                         element={<RekomendasiAnak />} />
            <Route path="rekomendasi/:prediksiId"             element={<RekomendasiAnak />} />
            <Route path="profil"                              element={<ProfilOrangTua />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  )
}

export default App