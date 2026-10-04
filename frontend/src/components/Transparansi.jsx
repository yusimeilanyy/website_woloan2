import { useState } from 'react'
import { Link } from 'react-router-dom'

function Transparansi() {
  const [selectedYear, setSelectedYear] = useState(2026)
  const [selectedCategory, setSelectedCategory] = useState('all')

  // Data APBDes
  const budgetData = [
    { id: 1, year: 2026, category: 'Pendapatan', subCategory: 'Dana Desa', planned: 500000000, realized: 500000000, description: 'Dana Desa dari APBN' },
    { id: 2, year: 2026, category: 'Pendapatan', subCategory: 'ADD (Alokasi Dana Desa)', planned: 200000000, realized: 200000000, description: 'ADD dari Pemkab' },
    { id: 3, year: 2026, category: 'Pendapatan', subCategory: 'Dana Kelurahan', planned: 150000000, realized: 150000000, description: 'Dana Kelurahan dari Pemkot' },
    { id: 4, year: 2026, category: 'Pendapatan', subCategory: 'PADes (Pendapatan Asli Desa)', planned: 50000000, realized: 45000000, description: 'Hasil usaha desa dan BUMDes' },
    { id: 5, year: 2026, category: 'Belanja', subCategory: 'Bidang Penyelenggaraan Pemerintahan', planned: 200000000, realized: 185000000, description: 'Penyelenggaraan pemerintahan kelurahan' },
    { id: 6, year: 2026, category: 'Belanja', subCategory: 'Bidang Pembangunan', planned: 300000000, realized: 275000000, description: 'Pembangunan infrastruktur jalan dan drainase' },
    { id: 7, year: 2026, category: 'Belanja', subCategory: 'Bidang Pembinaan Kemasyarakatan', planned: 100000000, realized: 90000000, description: 'Kegiatan sosial, budaya, dan olahraga' },
    { id: 8, year: 2026, category: 'Belanja', subCategory: 'Bidang Pemberdayaan Masyarakat', planned: 150000000, realized: 135000000, description: 'Pelatihan UMKM, pertanian, dan keterampilan' },
    { id: 9, year: 2026, category: 'Belanja', subCategory: 'Bidang Penanggulangan Bencana', planned: 50000000, realized: 40000000, description: 'Penanganan bencana dan darurat' },
    { id: 10, year: 2026, category: 'Belanja', subCategory: 'Belanja Tak Terduga', planned: 50000000, realized: 35000000, description: 'Cadangan untuk keperluan mendesak' },
    { id: 11, year: 2026, category: 'Pembiayaan', subCategory: 'Penerimaan Pembiayaan', planned: 30000000, realized: 28000000, description: 'SILPA tahun sebelumnya' },
    { id: 12, year: 2026, category: 'Pembiayaan', subCategory: 'Pengeluaran Pembiayaan', planned: 20000000, realized: 18000000, description: 'Penyertaan modal BUMDes' }
  ]

  // Filter data
  const filteredData = budgetData.filter(item => {
    if (item.year !== selectedYear) return false
    if (selectedCategory !== 'all' && item.category !== selectedCategory) return false
    return true
  })

  // Hitung total
  const totalPendapatan = budgetData
    .filter(b => b.year === selectedYear && b.category === 'Pendapatan')
    .reduce((sum, b) => sum + b.realized, 0)

  const totalBelanja = budgetData
    .filter(b => b.year === selectedYear && b.category === 'Belanja')
    .reduce((sum, b) => sum + b.realized, 0)

  const surplus = totalPendapatan - totalBelanja

  // Format Rupiah
  const formatRupiah = (angka) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(angka)
  }

  // Format persen
  const formatPersen = (realized, planned) => {
    return ((realized / planned) * 100).toFixed(1)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      {/* NAVBAR */}
      <nav style={{
        background: '#1e293b',
        padding: '15px 30px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}>
          <div style={{
            width: '45px', height: '45px',
            background: 'white', borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '22px'
          }}>🏘️</div>
          <div>
            <h1 style={{ color: 'white', fontSize: '18px', margin: 0 }}>Kelurahan Woloan Dua</h1>
            <p style={{ color: '#cbd5e1', fontSize: '12px', margin: 0 }}>Kota Tomohon</p>
          </div>
        </Link>
        <Link to="/" style={{ color: '#10b981', fontWeight: 'bold', textDecoration: 'none', fontSize: '16px' }}>
          ← Kembali
        </Link>
      </nav>

      {/* HEADER */}
      <section style={{
        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
        color: 'white',
        padding: '60px 20px',
        textAlign: 'center'
      }}>
        <h1 style={{ fontSize: '42px', marginBottom: '10px', textShadow: '2px 2px 8px rgba(0,0,0,0.3)' }}>
          Transparansi Anggaran
        </h1>
        <p style={{ fontSize: '18px', opacity: 0.9 }}>
          APBDes (Anggaran Pendapatan dan Belanja Desa) Kelurahan Woloan Dua
        </p>
      </section>

      {/* KONTEN */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
        {/* Filter Controls */}
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '20px',
          marginBottom: '30px',
          boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
          display: 'flex',
          gap: '20px',
          flexWrap: 'wrap',
          alignItems: 'center'
        }}>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', color: '#374151', fontWeight: '500', fontSize: '14px' }}>
              Tahun Anggaran:
            </label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              style={{
                padding: '10px 15px',
                borderRadius: '8px',
                border: '1px solid #d1d5db',
                fontSize: '14px',
                background: 'white',
                cursor: 'pointer'
              }}
            >
              <option value={2026}>2026</option>
              <option value={2025}>2025</option>
              <option value={2024}>2024</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '5px', color: '#374151', fontWeight: '500', fontSize: '14px' }}>
              Kategori:
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              style={{
                padding: '10px 15px',
                borderRadius: '8px',
                border: '1px solid #d1d5db',
                fontSize: '14px',
                background: 'white',
                cursor: 'pointer'
              }}
            >
              <option value="all">Semua Kategori</option>
              <option value="Pendapatan">Pendapatan</option>
              <option value="Belanja">Belanja</option>
              <option value="Pembiayaan">Pembiayaan</option>
            </select>
          </div>

          <button
            onClick={() => { setSelectedYear(2026); setSelectedCategory('all') }}
            style={{
              padding: '10px 20px',
              background: '#6b7280',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              marginTop: '22px'
            }}
          >
            Reset Filter
          </button>
        </div>

        {/* Summary Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '20px',
          marginBottom: '30px'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            color: 'white',
            padding: '25px',
            borderRadius: '12px',
            boxShadow: '0 4px 15px rgba(16,185,129,0.3)'
          }}>
            <p style={{ fontSize: '14px', opacity: 0.9, margin: '0 0 10px' }}>💰 Total Pendapatan</p>
            <h2 style={{ fontSize: '28px', margin: 0 }}>{formatRupiah(totalPendapatan)}</h2>
          </div>
          <div style={{
            background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
            color: 'white',
            padding: '25px',
            borderRadius: '12px',
            boxShadow: '0 4px 15px rgba(59,130,246,0.3)'
          }}>
            <p style={{ fontSize: '14px', opacity: 0.9, margin: '0 0 10px' }}>💸 Total Belanja</p>
            <h2 style={{ fontSize: '28px', margin: 0 }}>{formatRupiah(totalBelanja)}</h2>
          </div>
          <div style={{
            background: surplus >= 0 
              ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
              : 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
            color: 'white',
            padding: '25px',
            borderRadius: '12px',
            boxShadow: '0 4px 15px rgba(245,158,11,0.3)'
          }}>
            <p style={{ fontSize: '14px', opacity: 0.9, margin: '0 0 10px' }}>
              {surplus >= 0 ? '📊 Sisa Anggaran' : '⚠️ Defisit Anggaran'}
            </p>
            <h2 style={{ fontSize: '28px', margin: 0 }}>{formatRupiah(Math.abs(surplus))}</h2>
          </div>
        </div>

        {/* Tabel Detail */}
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '30px',
          boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
          marginBottom: '30px'
        }}>
          <h2 style={{ color: '#1e293b', fontSize: '24px', marginBottom: '20px' }}>
             📋 Rincian APBDes Tahun {selectedYear}
          </h2>
          
          {filteredData.length === 0 ? (
            <p style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
              Tidak ada data untuk filter yang dipilih
            </p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#f1f5f9' }}>
                    <th style={{ textAlign: 'left', padding: '15px', color: '#475569', fontSize: '13px', borderBottom: '2px solid #e2e8f0' }}>Kategori</th>
                    <th style={{ textAlign: 'left', padding: '15px', color: '#475569', fontSize: '13px', borderBottom: '2px solid #e2e8f0' }}>Sub Kategori</th>
                    <th style={{ textAlign: 'right', padding: '15px', color: '#475569', fontSize: '13px', borderBottom: '2px solid #e2e8f0' }}>Anggaran</th>
                    <th style={{ textAlign: 'right', padding: '15px', color: '#475569', fontSize: '13px', borderBottom: '2px solid #e2e8f0' }}>Realisasi</th>
                    <th style={{ textAlign: 'right', padding: '15px', color: '#475569', fontSize: '13px', borderBottom: '2px solid #e2e8f0' }}>Persentase</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((item, idx) => {
                    const persentase = formatPersen(item.realized, item.planned)
                    // PERBAIKAN DI SINI: 'persen' diganti menjadi 'persentase'
                    const isOverBudget = item.category === 'Belanja' && parseFloat(persentase) > 100
                    return (
                      <tr key={item.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '15px', color: '#1e293b', fontWeight: '500' }}>
                          {item.category === 'Pendapatan' ? '💰' : item.category === 'Belanja' ? '💸' : '🔄'} {item.category}
                        </td>
                        <td style={{ padding: '15px', color: '#475569' }}>
                          <div>{item.subCategory}</div>
                          <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '3px' }}>{item.description}</div>
                        </td>
                        <td style={{ padding: '15px', textAlign: 'right', color: '#475569' }}>{formatRupiah(item.planned)}</td>
                        <td style={{ padding: '15px', textAlign: 'right', color: '#475569' }}>{formatRupiah(item.realized)}</td>
                        <td style={{ padding: '15px', textAlign: 'right' }}>
                          <span style={{
                            // PERBAIKAN DI SINI: semua 'persen' diganti menjadi 'persentase'
                            background: isOverBudget 
                              ? '#fee2e2' 
                              : parseFloat(persentase) >= 80 
                                ? '#dcfce7' 
                                : parseFloat(persentase) >= 50 
                                  ? '#fef3c7' 
                                  : '#fee2e2',
                            color: isOverBudget
                              ? '#991b1b'
                              : parseFloat(persentase) >= 80
                                ? '#166534'
                                : parseFloat(persentase) >= 50
                                  ? '#92400e'
                                  : '#991b1b',
                            padding: '4px 10px',
                            borderRadius: '12px',
                            fontSize: '12px',
                            fontWeight: '600'
                          }}>
                            {persentase}%
                          </span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Info Box */}
        <div style={{
          background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
          border: '2px solid #3b82f6',
          borderRadius: '12px',
          padding: '20px',
          marginBottom: '20px'
        }}>
          <h4 style={{ color: '#1e40af', margin: '0 0 10px', fontSize: '16px' }}>
            ℹ️ Tentang Transparansi Anggaran
          </h4>
          <p style={{ color: '#1e3a8a', margin: 0, fontSize: '14px', lineHeight: '1.6' }}>
            Data APBDes ini diperbarui setiap triwulan sesuai dengan peraturan perundang-undangan. 
            Masyarakat dapat mengakses informasi ini sebagai bentuk transparansi dan akuntabilitas 
            pengelolaan keuangan desa. Untuk informasi lebih detail, silakan hubungi kantor 
            Kelurahan Woloan Dua atau kirim email ke <strong>kelurahan.woloandua@gmail.com</strong>
          </p>
        </div>

        {/* Download Button */}
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <button
            onClick={() => alert('Fitur download PDF akan tersedia segera!')}
            style={{
              padding: '14px 30px',
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              boxShadow: '0 4px 15px rgba(16,185,129,0.4)'
            }}
          >
            📥 Download Laporan APBDes (PDF)
          </button>
          <p style={{ color: '#64748b', fontSize: '13px', marginTop: '10px' }}>
            Fitur download akan segera tersedia
          </p>
        </div>
      </div>
    </div>
  )
}

export default Transparansi