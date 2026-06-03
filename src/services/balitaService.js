import api from './api'

// ─── Normalizers ──────────────────────────────────────────────────────────────

function normalizeChild(c) {
  const pred = c.last_prediction
  return {
    id:               c.child_id,
    nama:             c.name,
    nama_ibu:         c.parent_name  ?? '',
    usia_bulan:       c.age_months   ?? calcAgeMonths(c.birth_date),
    jenis_kelamin:    c.gender === 'male' ? 'Laki-laki' : 'Perempuan',
    tanggal_lahir:    c.birth_date   ?? '',
    province:         c.province     ?? '',
    no_hp_ortu:       '',
    status_risiko:    pred?.risk_class      ?? null,
    stunting_status:  pred?.stunting_status ?? pred?.risk_class ?? null,
    underweight_status: pred?.underweight_status ?? 'Normal',
    wasting_status:   pred?.wasting_status     ?? 'Normal',

    haz_score:        pred?.haz_score       ?? null,
    waz_score:        pred?.waz_score       ?? null,
    baz_score:        pred?.baz_score       ?? null,
    berat_badan:      pred?.weight_kg       ?? null,
    tinggi_badan:     pred?.height_cm       ?? null,
    lingkar_kepala:   null,
    lingkar_lengan:   null,
    tanggal_periksa:  pred?.created_at ? pred.created_at.slice(0, 10) : null,
    last_prediction_id: pred?.prediction_id ?? null,
  }
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function calcAgeMonths(birthDate) {
  if (!birthDate) return 0;
  const b = new Date(birthDate), t = new Date();
  
  let months = (t.getFullYear() - b.getFullYear()) * 12 + (t.getMonth() - b.getMonth());
  
  // Kurangi 1 bulan jika tanggal hari ini belum melewati tanggal kelahirannya di bulan ini
  if (t.getDate() < b.getDate()) {
    months--; 
  }
  
  return Math.max(0, months);
}

function categoryIcon(cat) {
  return (cat ?? '').toLowerCase()
}

function capitalize(s) { 
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : '' 
}

// Mapping opsi form pendapatan → nilai backend
function incomeToLevel(p) {
  if (!p || p === '< Rp 1.000.000') return 'low'
  if (p === '> Rp 3.500.000')       return 'high'
  return 'medium'
}

// Mapping opsi form pendidikan ibu → nilai backend
function motherEducationToLevel(p) {
  if (!p || p === 'Tidak Sekolah') return 'none'
  if (p === 'SD/Sederajat')        return 'primary'
  if (p === 'SMP/Sederajat')       return 'secondary'
  if (p === 'SMA/Sederajat')       return 'secondary'
  if (p === 'D3/S1/S2/S3')         return 'higher'
  return 'secondary' // fallback jika field kosong
}

function whoMedianBerat(gender, age) {
  if (!age) return null
  const m = [3.3,4.5,5.6,6.4,7.0,7.5,7.9,8.3,8.6,8.9,9.2,9.4,9.6,9.9,10.1,10.3,10.5,10.7,10.9,11.1,11.3,11.5,11.8,12.0,12.2]
  const f = [3.2,4.2,5.1,5.8,6.4,6.9,7.3,7.6,7.9,8.2,8.5,8.7,8.9,9.2,9.4,9.6,9.8,10.0,10.2,10.4,10.6,10.9,11.1,11.3,11.5]
  const arr = gender === 'male' ? m : f
  return arr[Math.min(Math.max(0, Math.round(age)), arr.length - 1)] ?? null
}

function whoMedianTinggi(gender, age) {
  if (!age) return null
  const m = [49.9,54.7,58.4,61.4,63.9,65.9,67.6,69.2,70.6,72.0,73.3,74.5,75.7,76.9,78.0,79.1,80.2,81.2,82.3,83.2,84.2,85.1,86.0,86.9,87.8]
  const f = [49.1,53.7,57.1,59.8,62.1,64.0,65.7,67.3,68.7,70.1,71.5,72.8,74.0,75.2,76.4,77.5,78.6,79.7,80.7,81.7,82.7,83.7,84.6,85.5,86.4]
  const arr = gender === 'male' ? m : f
  return arr[Math.min(Math.max(0, Math.round(age)), arr.length - 1)] ?? null
}

// ─── Balita Service ───────────────────────────────────────────────────────────

export const balitaService = {
  getAll: async (params = {}) => {
    const q = new URLSearchParams()
    if (params.search)        q.set('search',     params.search)
    if (params.page)          q.set('page',        params.page)
    if (params.limit)         q.set('limit',       params.limit)
    if (params.status_risiko) q.set('risk_class',  params.status_risiko)
    const res = await api.get(`/api/v1/children${q.toString() ? '?' + q : ''}`)
    const raw = res.data
    return {
      data:  (raw.data ?? []).map(normalizeChild),
      total: raw.pagination?.total ?? 0,
      page:  raw.pagination?.page  ?? 1,
      limit: raw.pagination?.limit ?? 20,
    }
  },

  getById: async (id) => normalizeChild((await api.get(`/api/v1/children/${id}`)).data),

  update: async (id, payload) => (await api.put(`/api/v1/children/${id}`, payload)).data,

  delete: async (id) => {
    await api.delete(`/api/v1/children/${id}`)
  },
}

// ─── Prediction Normalizer ────────────────────────────────────────────────────

function normalizePrediction(p, childName = '', extraData = {}) {
  const recs = (p.recommendations ?? []).map(r => ({
    kategori: (r.category ?? 'umum').charAt(0).toUpperCase() + (r.category ?? 'umum').slice(1),
    icon_type: (r.category ?? 'umum').toLowerCase(),
    judul:    r.title ?? ((r.message ?? '').split('.')[0] || r.message),
    detail:   r.message ?? '',
    priority: r.priority ?? 'medium',
  }))
  return {
    prediction_id:      p.prediction_id,
    child_id:           p.child_id,
    balita: {
      nama:           childName,
      usia_bulan:     p.age_months,
      jenis_kelamin:  p.gender === 'male' ? 'Laki-laki' : 'Perempuan',
      berat_badan:    p.weight_kg,
      tinggi_badan:   p.height_cm,
      lingkar_kepala: extraData.lingkar_kepala ?? null,
      lingkar_lengan: extraData.lingkar_lengan ?? null,
    },
    status_risiko:      p.risk_class,
    stunting_status:    p.stunting_status    ?? p.risk_class,
    underweight_status: p.underweight_status ?? 'Normal',
    wasting_status:     p.wasting_status     ?? 'Normal',
    haz_score:          p.haz_score,
    waz_score:          p.waz_score          ?? null,
    baz_score:          p.baz_score          ?? null,
    confidence:         p.confidence != null
      ? Math.round(p.confidence)
      : p.risk_probability
        ? Math.round(Math.max(
            p.risk_probability.normal           ?? 0,
            p.risk_probability.stunted          ?? 0,
            p.risk_probability.severely_stunted ?? 0,
          ) * 100)
        : null,
    probabilitas:       p.risk_probability ?? null,
    tanggal:            p.created_at ?? null,
    rekomendasi:        recs,
  }
}

// ─── Prediksi Service ─────────────────────────────────────────────────────────

export const prediksiService = {
  predict: async (payload) => {
    const ageMonths = calcAgeMonths(payload.tanggal_lahir)
    if (ageMonths > 60) throw new Error(`Usia ${ageMonths} bulan melebihi batas balita (max 60 bulan). Periksa tanggal lahir.`)
    if (ageMonths < 0)  throw new Error('Tanggal lahir tidak valid.')
    if (!payload.nama?.trim()) throw new Error('Nama anak wajib diisi.')
    if (!payload.jenis_kelamin) throw new Error('Jenis kelamin wajib dipilih.')
    const h = parseFloat(payload.tinggi_badan), w = parseFloat(payload.berat_badan)
    if (isNaN(h) || h < 30 || h > 130) throw new Error('Tinggi badan harus 30–130 cm.')
    if (isNaN(w) || w < 1  || w > 40)  throw new Error('Berat badan harus 1–40 kg.')

    let childId   = payload.child_id || null
    let childName = payload.nama
    if (!childId) {
      const childRes = await api.post('/api/v1/children', {
        name:         payload.nama,
        birth_date:   payload.tanggal_lahir,
        gender:       payload.jenis_kelamin === 'Laki-laki' ? 'male' : 'female',
        parent_name:  payload.nama_ibu?.trim() || 'Orang Tua',
        parent_phone: payload.no_hp_ortu || null,
      })
      childId   = childRes.data.child_id
      childName = childRes.data.name
    }

    const extraData = {
      lingkar_kepala: payload.lingkar_kepala ?? null,
      lingkar_lengan: payload.lingkar_lengan ?? null,
    }

    try {
      const predRes = await api.post('/api/v1/predict/stunting', {
        child_id: childId,
        measurement: {
          age_months: Math.max(0, Math.min(60, ageMonths)),
          height_cm:  h,
          weight_kg:  w,
          gender:     payload.jenis_kelamin === 'Laki-laki' ? 'male' : 'female',
        },
        socioeconomic: {
          income_level:            incomeToLevel(payload.pendapatan_keluarga),
          access_clean_water:      ['PDAM', 'Sumur Terlindungi'].includes(payload.sumber_air),
          access_sanitation:       payload.sanitasi !== 'Tidak Ada Jamban',
          mother_education:        motherEducationToLevel(payload.pendidikan_ibu),
          exclusive_breastfeeding: payload.asi_eksklusif === 'Ya',
        },
      })

      return normalizePrediction({ ...predRes.data, child_id: childId }, childName, extraData)

    } catch (err) {
      if (childId && !payload.child_id) {
        await api.delete(`/api/v1/children/${childId}`).catch(() => {})
      }
      throw err
    }
  },

  getById: async (childId, prediksiId) => {
    if (!childId) throw new Error('Child ID diperlukan untuk memuat prediksi.')
    const res   = await api.get(`/api/v1/children/${childId}/history`)
    const child = res.data
    const found = (child.history ?? []).find(h => h.prediction_id === prediksiId)
    if (!found) throw new Error('Prediksi tidak ditemukan.')
    return normalizePrediction({ ...found, child_id: childId }, child.name ?? '')
  },

  getRiwayat: async (balitaId) => {
    const res = await api.get(`/api/v1/children/${balitaId}/history`)
    return (res.data.history ?? []).map(h =>
      normalizePrediction({ ...h, child_id: balitaId }, res.data.name ?? '')
    )
  },

  share: async (childId) => {
    if (!childId) throw new Error('Child ID diperlukan untuk generate kode aktivasi.')
    const res = await api.post(`/api/v1/children/${childId}/activation-code`)
    return {
      kode_aktivasi: res.data.activation_code,
      expired_at:    res.data.expires_at,
      child_name:    res.data.child_name ?? '',
    }
  },
}

// ─── Kader Service ────────────────────────────────────────────────────────────

export const kaderService = {
  getDashboardStats: async () => {
    try {
      return (await api.get('/api/v1/kader/dashboard')).data
    } catch {
      const res  = await api.get('/api/v1/children?limit=1000')
      const data = res.data.data ?? []
      const total = res.data.pagination?.total ?? data.length
      let normal = 0, stunted = 0, severe = 0
      data.forEach(c => {
        const rc = c.last_prediction?.risk_class
        if      (rc === 'Normal')           normal++
        else if (rc === 'Stunted')          stunted++
        else if (rc === 'Severely Stunted') severe++
      })
      return {
        total_balita:     total,
        normal,
        stunted,
        severely_stunted: severe,
        balita_terkini:   data.slice(0, 5).map(normalizeChild),
      }
    }
  },

  generateKodeAktivasi: async (balitaId) => {
    const res = await api.post(`/api/v1/children/${balitaId}/activation-code`)
    return { kode_aktivasi: res.data.activation_code, expired_at: res.data.expires_at }
  },
}

// ─── Orangtua Service ─────────────────────────────────────────────────────────

export const orangtuaService = {
  getDashboard: async () => {
    const { useAuthStore } = await import('@/store/authStore')
    const childId = useAuthStore.getState().user?.child_id
    if (!childId) return null

    const [childRes, histRes] = await Promise.all([
      api.get(`/api/v1/children/${childId}`),
      api.get(`/api/v1/children/${childId}/history`),
    ])
    const child   = childRes.data
    const history = histRes.data.history ?? []
    const latest  = history[0]
    const chart   = [...history].reverse().slice(0, 6).map(h => ({
      bulan:             new Date(h.created_at).toLocaleDateString('id-ID', { month: 'short', year: '2-digit' }),
      berat:             h.weight_kg,
      tinggi:            h.height_cm,
      who_median_berat:  whoMedianBerat(child.gender,  h.age_months),
      who_median_tinggi: whoMedianTinggi(child.gender, h.age_months),
    }))
    return {
      anak: {
        id:              child.child_id,
        nama:            child.name,
        usia_bulan:      calcAgeMonths(child.birth_date),
        jenis_kelamin:   child.gender === 'male' ? 'Laki-laki' : 'Perempuan',
        tanggal_lahir:   child.birth_date   ?? '',
        tanggal_periksa: latest?.created_at?.slice(0, 10) ?? '',
        status_risiko:      latest?.risk_class         ?? null,
        stunting_status:    latest?.stunting_status    ?? latest?.risk_class ?? null,
        underweight_status: latest?.underweight_status ?? 'Normal',
        wasting_status:     latest?.wasting_status     ?? 'Normal',
        haz_score:          latest?.haz_score          ?? null,
        waz_score:          latest?.waz_score          ?? null,
        baz_score:          latest?.baz_score          ?? null,
        berat_badan:     latest?.weight_kg   ?? null,
        tinggi_badan:    latest?.height_cm   ?? null,
        lingkar_kepala:  null,
        lingkar_lengan:  null,
      },
      chart_pertumbuhan:   chart,
      rekomendasi_terkini: latest ? normalizePrediction(latest, child.name) : null,
    }
  },
}