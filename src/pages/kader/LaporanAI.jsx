/* eslint-disable no-unused-vars */
import { useState } from 'react'
import MainLayout from '@/components/layout/MainLayout'
import { 
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, 
  ResponsiveContainer, Legend, LineChart, Line, CartesianGrid 
} from 'recharts'
import { 
  Brain, TrendingUp, TrendingDown, AlertCircle, 
  MapPin, Calendar, Download, ChevronDown, Filter,
  Users, DollarSign, Droplet, Activity, Home
} from 'lucide-react'

// Mock data - distribusi risiko per wilayah
const DATA_WILAYAH = [
  { name: 'Kec. Ciputat', normal: 68, stunted: 22, severe: 10 },
  { name: 'Kec. Pamulang', normal: 72, stunted: 20, severe: 8 },
  { name: 'Kec. Serpong', normal: 58, stunted: 28, severe: 14 },
  { name: 'Kec. Pondok Aren', normal: 75, stunted: 18, severe: 7 },
  { name: 'Kec. Ciledug', normal: 62, stunted: 25, severe: 13 },
]

// Data tren stunting 6 bulan
const DATA_TREN = [
  { bulan: 'Nov', normal: 58, stunted: 28, severe: 14 },
  { bulan: 'Des', normal: 60, stunted: 27, severe: 13 },
  { bulan: 'Jan', normal: 62, stunted: 26, severe: 12 },
  { bulan: 'Feb', normal: 64, stunted: 24, severe: 12 },
  { bulan: 'Mar', normal: 66, stunted: 24, severe: 10 },
  { bulan: 'Apr', normal: 69, stunted: 22, severe: 9 },
]

// Data distribusi risiko (pie chart)
const DATA_DISTRIBUSI = [
  { name: 'Normal', value: 68, color: '#10B981' },
  { name: 'Stunted', value: 22, color: '#F59E0B' },
  { name: 'Severely Stunted', value: 10, color: '#E53935' },
]

// Data faktor determinan
const DATA_FAKTOR = [
  { 
    faktor: 'Pendapatan Rendah', 
    korelasi: 0.72, 
    deskripsi: 'Keluarga dengan pendapatan < UMR memiliki risiko 2.5x lebih tinggi',
    icon: DollarSign,
    color: '#F59E0B'
  },
  { 
    faktor: 'Sanitasi Buruk', 
    korelasi: 0.68, 
    deskripsi: 'Akses jamban tidak sehat berkorelasi kuat dengan stunting',
    icon: Droplet,
    color: '#7866BC'
  },
  { 
    faktor: 'ASI Tidak Eksklusif', 
    korelasi: 0.61, 
    deskripsi: 'Balita tanpa ASI eksklusif 6 bulan berisiko 2.1x lebih tinggi',
    icon: Activity,
    color: '#00886A'
  },
  { 
    faktor: 'Jarak ke Faskes > 5km', 
    korelasi: 0.45, 
    deskripsi: 'Akses terbatas ke layanan kesehatan meningkatkan risiko',
    icon: MapPin,
    color: '#E53935'
  },
]

// Data perbandingan wilayah
const DATA_PERBANDINGAN = [
  { indikator: 'Prevalensi Stunting', nilai: '22%', nasional: '19.8%', status: 'above' },
  { indikator: 'Cakupan Imunisasi', nilai: '87%', nasional: '84%', status: 'above' },
  { indikator: 'ASI Eksklusif', nilai: '72%', nasional: '69%', status: 'above' },
  { indikator: 'Sanitasi Layak', nilai: '78%', nasional: '82%', status: 'below' },
]

// Insight AI
const AI_INSIGHTS = [
  {
    title: 'Tren Positif',
    description: 'Prevalensi stunting menurun 5% dalam 6 bulan terakhir di wilayah Anda. Program intervensi gizi menunjukkan hasil yang signifikan.',
    icon: TrendingDown,
    color: '#10B981',
    bgColor: 'rgba(16, 185, 129, 0.08)',
  },
  {
    title: 'Area Prioritas',
    description: 'Kecamatan Serpong dan Ciledug memiliki prevalensi stunting tertinggi. Rekomendasikan peningkatan frekuensi Posyandu di wilayah tersebut.',
    icon: AlertCircle,
    color: '#F59E0B',
    bgColor: 'rgba(245, 158, 11, 0.08)',
  },
  {
    title: 'Faktor Dominan',
    description: 'Pendapatan keluarga dan sanitasi adalah dua faktor determinan terkuat. Integrasikan program bantuan sosial dengan edukasi sanitasi.',
    icon: Brain,
    color: '#7866BC',
    bgColor: 'rgba(120, 102, 188, 0.08)',
  },
]

// Komponen Stat Card
function StatCard({ label, value, change, icon: Icon, color }) {
  const isPositive = change > 0
  return (
    <div className="card" style={{ padding: '1rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
        <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 500 }}>{label}</span>
        <div style={{ width: 32, height: 32, borderRadius: 8, background: color + '22', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon size={15} color={color} />
        </div>
      </div>
      <div style={{ fontSize: 26, fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'Plus Jakarta Sans', lineHeight: 1.2 }}>
        {value}
      </div>
      {change !== undefined && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 6 }}>
          {isPositive ? <TrendingUp size={12} color="var(--danger)" /> : <TrendingDown size={12} color="var(--success)" />}
          <span style={{ fontSize: 11.5, color: isPositive ? 'var(--danger)' : 'var(--success)' }}>
            {Math.abs(change)}% dari bulan lalu
          </span>
        </div>
      )}
    </div>
  )
}

// Komponen AI Insight Card
function InsightCard({ insight }) {
  const Icon = insight.icon
  return (
    <div style={{ 
      background: insight.bgColor, 
      border: `1px solid ${insight.color}20`, 
      borderRadius: 'var(--radius-lg)', 
      padding: '16px',
      display: 'flex',
      gap: 14,
      alignItems: 'flex-start'
    }}>
      <div style={{ 
        width: 40, height: 40, 
        background: insight.color + '22', 
        borderRadius: 10, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        flexShrink: 0
      }}>
        <Icon size={18} color={insight.color} />
      </div>
      <div>
        <h4 style={{ fontSize: 14, fontWeight: 700, color: insight.color, marginBottom: 4, fontFamily: 'Plus Jakarta Sans' }}>
          {insight.title}
        </h4>
        <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
          {insight.description}
        </p>
      </div>
    </div>
  )
}

// Komponen Faktor Card
function FaktorCard({ faktor }) {
  const Icon = faktor.icon
  return (
    <div className="card" style={{ padding: '14px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
        <div style={{ width: 36, height: 36, background: faktor.color + '22', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon size={16} color={faktor.color} />
        </div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{faktor.faktor}</div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Korelasi: {(faktor.korelasi * 100).toFixed(0)}%</div>
        </div>
      </div>
      <div style={{ marginBottom: 8 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>
          <span>Kekuatan Korelasi</span>
          <span style={{ color: faktor.color, fontWeight: 600 }}>{(faktor.korelasi * 100).toFixed(0)}%</span>
        </div>
        <div className="progress-bar" style={{ height: 4 }}>
          <div 
            className="progress-fill" 
            style={{ width: `${faktor.korelasi * 100}%`, background: faktor.color }}
          />
        </div>
      </div>
      <p style={{ fontSize: 11.5, color: 'var(--text-secondary)', lineHeight: 1.5, marginTop: 8 }}>
        {faktor.deskripsi}
      </p>
    </div>
  )
}

export default function LaporanAI() {
  const [selectedWilayah, setSelectedWilayah] = useState('Semua Wilayah')
  const [periode, setPeriode] = useState('6 Bulan Terakhir')

  const totalBalita = DATA_WILAYAH.reduce((acc, w) => acc + w.normal + w.stunted + w.severe, 0)
  const totalStunted = DATA_WILAYAH.reduce((acc, w) => acc + w.stunted + w.severe, 0)
  const prevalensiStunting = ((totalStunted / totalBalita) * 100).toFixed(1)

  return (
    <MainLayout>
      <div className="fade-in">
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
          <div>
            <h1 className="page-title">Laporan AI & Analitik</h1>
            <p className="page-subtitle">
              Visualisasi distribusi risiko stunting dan analisis faktor determinan berbasis AI.
            </p>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button className="btn-secondary" style={{ fontSize: 13 }}>
              <Calendar size={14} /> {periode}
            </button>
            <button className="btn-primary" style={{ fontSize: 13 }}>
              <Download size={14} /> Unduh Laporan
            </button>
          </div>
        </div>

        {/* Filter Bar */}
        <div style={{ 
          display: 'flex', 
          gap: 12, 
          marginBottom: 20, 
          padding: '12px 16px',
          background: 'var(--bg-card)', 
          border: '1px solid var(--border)', 
          borderRadius: 'var(--radius-lg)' 
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <MapPin size={14} color="var(--text-muted)" />
            <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Wilayah:</span>
          </div>
          <select 
            className="input-field" 
            style={{ width: 'auto', height: 34, fontSize: 13 }} 
            value={selectedWilayah}
            onChange={(e) => setSelectedWilayah(e.target.value)}
          >
            <option>Semua Wilayah</option>
            <option>Kec. Ciputat</option>
            <option>Kec. Pamulang</option>
            <option>Kec. Serpong</option>
            <option>Kec. Pondok Aren</option>
            <option>Kec. Ciledug</option>
          </select>
          <div style={{ width: 1, height: 24, background: 'var(--border)', margin: '0 4px' }} />
          <button className="btn-ghost" style={{ fontSize: 12, padding: '5px 12px' }}>
            <Filter size={13} /> Filter Lanjutan
          </button>
          <div style={{ flex: 1 }} />
          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
            Data diperbarui: 15 April 2026
          </span>
        </div>

        {/* Stats Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 20 }}>
          <StatCard 
            label="Total Balita" 
            value={totalBalita.toLocaleString()} 
            change={2.5}
            icon={Users} 
            color="var(--primary)" 
          />
          <StatCard 
            label="Prevalensi Stunting" 
            value={`${prevalensiStunting}%`} 
            change={-5.2}
            icon={Activity} 
            color="var(--warning)" 
          />
          <StatCard 
            label="Rata-rata HAZ Z-Score" 
            value="72.4" 
            change={3.1}
            icon={TrendingUp} 
            color="var(--success)" 
          />
          <StatCard 
            label="Balita Prioritas" 
            value="32" 
            change={-2}
            icon={AlertCircle} 
            color="var(--danger)" 
          />
        </div>

        {/* AI Insights */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 20 }}>
          {AI_INSIGHTS.map((insight, i) => (
            <InsightCard key={i} insight={insight} />
          ))}
        </div>

        {/* Charts Row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
          {/* Distribusi Risiko - Pie Chart */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>Distribusi Risiko Stunting</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Total {totalBalita.toLocaleString()} balita</div>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={DATA_DISTRIBUSI}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {DATA_DISTRIBUSI.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    background: 'var(--bg-elevated)', 
                    border: '1px solid var(--border)', 
                    borderRadius: 8, 
                    fontSize: 12 
                  }} 
                />
                <Legend 
                  verticalAlign="bottom" 
                  height={36}
                  formatter={(value) => <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Tren Stunting - Line Chart */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>Tren Prevalensi Stunting</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>6 bulan terakhir</div>
              </div>
              <span className="badge badge-success" style={{ fontSize: 11 }}>
                <TrendingDown size={11} /> -5.2%
              </span>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={DATA_TREN}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="bulan" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} width={30} />
                <Tooltip 
                  contentStyle={{ 
                    background: 'var(--bg-elevated)', 
                    border: '1px solid var(--border)', 
                    borderRadius: 8, 
                    fontSize: 12 
                  }} 
                />
                <Legend 
                  verticalAlign="bottom" 
                  height={36}
                  formatter={(value) => <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{value}</span>}
                />
                <Line type="monotone" dataKey="normal" stroke="#10B981" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="stunted" stroke="#F59E0B" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="severe" stroke="#E53935" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Perbandingan Wilayah - Bar Chart */}
        <div className="card" style={{ marginBottom: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>Distribusi Risiko per Kecamatan</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Perbandingan antar wilayah</div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={DATA_WILAYAH} barSize={36}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} width={30} />
              <Tooltip 
                contentStyle={{ 
                  background: 'var(--bg-elevated)', 
                  border: '1px solid var(--border)', 
                  borderRadius: 8, 
                  fontSize: 12 
                }} 
              />
              <Legend 
                verticalAlign="bottom" 
                height={36}
                formatter={(value) => <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{value}</span>}
              />
              <Bar dataKey="normal" stackId="a" fill="#10B981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="stunted" stackId="a" fill="#F59E0B" radius={[4, 4, 0, 0]} />
              <Bar dataKey="severe" stackId="a" fill="#E53935" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Faktor Determinan + Perbandingan Nasional */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 16 }}>
          {/* Faktor Determinan */}
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <Brain size={16} color="var(--primary)" />
              <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>Faktor Determinan Stunting</span>
              <span style={{ fontSize: 11, color: 'var(--text-muted)', marginLeft: 'auto' }}>Berdasarkan analisis AI</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
              {DATA_FAKTOR.map((faktor, i) => (
                <FaktorCard key={i} faktor={faktor} />
              ))}
            </div>
          </div>

          {/* Perbandingan Nasional */}
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <MapPin size={16} color="var(--primary)" />
              <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>Perbandingan Nasional</span>
            </div>
            <div style={{ marginBottom: 12 }}>
              {DATA_PERBANDINGAN.map((item, i) => (
                <div key={i} style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  padding: '10px 0',
                  borderBottom: i < DATA_PERBANDINGAN.length - 1 ? '1px solid var(--border)' : 'none'
                }}>
                  <span style={{ fontSize: 12.5, color: 'var(--text-secondary)' }}>{item.indikator}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{item.nilai}</span>
                    <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Nasional: {item.nasional}</span>
                    {item.status === 'above' ? (
                      <TrendingUp size={13} color="var(--danger)" />
                    ) : (
                      <TrendingDown size={13} color="var(--success)" />
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="alert alert-info" style={{ marginTop: 8, padding: '10px 12px' }}>
              <AlertCircle size={14} style={{ flexShrink: 0 }} />
              <span style={{ fontSize: 12 }}>
                Prevalensi stunting wilayah Anda (22%) masih di atas target nasional RPJMN 2029 (14.2%).
              </span>
            </div>
          </div>
        </div>

        {/* Footer note */}
        <div style={{ 
          marginTop: 20, 
          padding: '12px 16px', 
          background: 'var(--bg-elevated)', 
          borderRadius: 'var(--radius-md)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Brain size={14} color="var(--primary)" />
            <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
              Analisis AI diperbarui setiap 24 jam. Data bersumber dari SSGI 2024 dan input Posyandu.
            </span>
          </div>
          <button className="btn-ghost" style={{ fontSize: 12 }}>
            Lihat Metodologi <ChevronDown size={12} />
          </button>
        </div>
      </div>
    </MainLayout>
  )
}