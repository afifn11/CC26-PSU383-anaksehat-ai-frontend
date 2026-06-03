// src/App.jsx
import React, { Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { ErrorBoundary } from '@/components/layout/ErrorBoundary'
import ProtectedRoute from '@/components/layout/ProtectedRoute'
import { useAuthStore } from '@/store/authStore'
import { useThemeStore } from '@/store/themeStore'

const Landing = React.lazy(() => import('@/pages/Landing'))
const Login = React.lazy(() => import('@/pages/auth/Login'))
const Register = React.lazy(() => import('@/pages/auth/Register'))
const NotFound = React.lazy(() => import('@/pages/NotFound'))

// Lazy Load - Kader Routes (Tanpa LaporanAI)
const KaderDashboard = React.lazy(() => import('@/pages/kader/Dashboard'))
const InputBalita = React.lazy(() => import('@/pages/kader/InputBalita'))
const HasilPrediksi = React.lazy(() => import('@/pages/kader/HasilPrediksi'))
const RiwayatPemeriksaan = React.lazy(() => import('@/pages/kader/RiwayatPemeriksaan'))
const KelolaBalita = React.lazy(() => import('@/pages/kader/KelolaBalita'))
const DetailBalita = React.lazy(() => import('@/pages/kader/DetailBalita'))
const EditBalita = React.lazy(() => import('@/pages/kader/EditBalita'))
const ProfilKader = React.lazy(() => import('@/pages/kader/ProfilKader'))

// Lazy Load - Orang Tua Routes
const ProfilOrangTua = React.lazy(() => import('@/pages/orangtua/ProfilOrangTua'))
const OrangTuaDashboard = React.lazy(() => import('@/pages/orangtua/Dashboard'))
const DataAnak = React.lazy(() => import('@/pages/orangtua/DataAnak'))
const RiwayatAnak = React.lazy(() => import('@/pages/orangtua/RiwayatAnak'))
const RekomendasiAnak = React.lazy(() => import('@/pages/orangtua/RekomendasiAnak'))

const LoadingScreen = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--bg-base)]">
    <div className="w-8 h-8 border-4 border-[var(--primary-muted)] border-t-[var(--primary)] rounded-full animate-spin mb-4"></div>
    <div className="text-[13px] text-[var(--text-muted)] font-medium animate-pulse">Memuat halaman...</div>
  </div>
)

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
        <Suspense fallback={<LoadingScreen />}>
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
              <Route path="hasil-prediksi/:childId/:prediksiId" element={<HasilPrediksi />} />
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
        </Suspense>
      </BrowserRouter>
    </ErrorBoundary>
  )
}

export default App