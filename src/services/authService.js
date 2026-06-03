import api from './api'

export const authService = {
  // ── Cek kode aktivasi sebelum orang tua isi form ──────────────────────────
  // Return: { valid, child_name, parent_name, suggested_phone, expires_at }
  checkActivationCode: async (code) => {
    const res = await api.get(`/api/v1/auth/check-activation/${code}`)
    return res.data
  },

  login: async (phone, password) => {
    const res = await api.post('/api/v1/auth/login', { phone, password })
    const raw = res.data
    // FIX: backend sekarang mengembalikan child_id untuk orangtua di response login
    return {
      access_token: raw.token,
      user: {
        id:       raw.user.user_id,
        nama:     raw.user.name,
        name:     raw.user.name,
        role:     raw.user.role,
        phone:    phone,
        child_id: raw.user.child_id ?? null,  // null untuk kader, child_id untuk orangtua
      },
    }
  },

  // Aktivasi orang tua — backend return child_id di response
  aktivasi: async (kode_aktivasi, password, nama, phone) => {
    const res = await api.post('/api/v1/auth/activate', {
      activation_code: kode_aktivasi,
      password,
      name: nama,
      phone,
    })
    const raw = res.data
    return {
      access_token: raw.token,
      user: {
        id:       raw.user_id,
        nama:     raw.name,
        name:     raw.name,
        role:     raw.role,
        phone:    phone,
        child_id: raw.child_id,
      },
    }
  },

  registerKader: async (nama, phone, password) => {
    const res = await api.post('/api/v1/auth/register', {
      name: nama, phone, password, role: 'kader',
    })
    const raw = res.data
    return {
      access_token: raw.token,
      user: {
        id:       raw.user_id,
        nama:     raw.name,
        name:     raw.name,
        role:     raw.role,
        phone:    phone,
        child_id: null,
      },
    }
  },

  logout: async () => {},
  getMe:  async () => null,
}