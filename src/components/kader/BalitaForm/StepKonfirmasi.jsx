/** Summary/review step shown before AI submission */
export function StepKonfirmasi({ identitas, antro, sosio, ageMonths }) {
  const sections = [
    {
      title: 'Identitas Anak',
      rows: [
        ['Nama Anak',      identitas.nama],
        ['Nama Orang Tua', identitas.nama_ibu],
        ['Tgl. Lahir',     identitas.tanggal_lahir],
        ['Usia',           ageMonths != null ? `${ageMonths} bulan` : '—'],
        ['Jenis Kelamin',  identitas.jenis_kelamin],
        ['No. HP Ortu',    identitas.no_hp_ortu],
      ],
    },
    {
      title: 'Data Antropometri',
      rows: [
        ['Berat Badan',    antro.berat_badan  ? `${antro.berat_badan} kg`  : '—'],
        ['Tinggi Badan',   antro.tinggi_badan ? `${antro.tinggi_badan} cm` : '—'],
        ['Lingkar Kepala', antro.lingkar_kepala ? `${antro.lingkar_kepala} cm` : '—'],
        ['Lingkar Lengan', antro.lingkar_lengan ? `${antro.lingkar_lengan} cm` : '—'],
        ['Tgl. Periksa',   antro.tanggal_periksa],
      ],
    },
    {
      title: 'Data Sosioekonomi',
      rows: [
        ['Pendapatan',    sosio.pendapatan_keluarga || '—'],
        ['Sumber Air',    sosio.sumber_air],
        ['Sanitasi',      sosio.sanitasi],
        ['Akses Faskes',  sosio.akses_faskes],
        ['Imunisasi',     sosio.status_imunisasi],
        ['ASI Eksklusif', sosio.asi_eksklusif],
      ],
    },
  ]

  return (
    <div className="flex flex-col gap-[14px]">
      <div className="px-4 py-3 rounded-[var(--radius-md)] text-[13px] leading-relaxed bg-[var(--primary-muted)] border border-[rgba(0,136,106,0.2)] text-[var(--text-secondary)]">
        <strong className="text-[var(--primary-light)]">Periksa kembali</strong>{' '}
        semua data sebelum memproses analisis AI. Data yang salah dapat mempengaruhi hasil prediksi.
      </div>

      {sections.map(({ title, rows }) => (
        <div key={title} className="form-section !mb-0">
          <div className="form-section-title">{title}</div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-[6px]">
            {rows.map(([label, value]) => (
              <div
                key={label}
                className="flex justify-between py-[5px] border-b border-[var(--border)] text-[13px]"
              >
                <span className="text-[var(--text-muted)]">{label}</span>
                <span className="font-semibold text-[var(--text-primary)]">{value || '—'}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}