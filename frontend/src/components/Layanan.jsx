import { useState } from 'react'
import { Link } from 'react-router-dom'

function Layanan() {
  const [selectedService, setSelectedService] = useState(null)

  // Data layanan (nanti diganti dengan API call)
  const layananData = [
    {
      id: 1,
      icon: '',
      title: 'Surat Keterangan Tidak Mampu (SKTM)',
      description: 'Surat keterangan untuk warga kurang mampu',
      requirements: [
        'Fotokopi KTP',
        'Fotokopi Kartu Keluarga (KK)',
        'Surat Pengantar dari RT/RW',
        'Surat Keterangan Tidak Mampu dari sekolah (jika untuk keperluan sekolah)'
      ],
      procedure: 'Datang ke kantor kelurahan → Isi formulir → Serahkan ke petugas → Tunggu 1 hari kerja → Ambil surat',
      duration: '1 hari kerja',
      cost: 'Gratis'
    },
    {
      id: 2,
      icon: '📋',
      title: 'Surat Pengantar SKCK',
      description: 'Surat pengantar untuk membuat SKCK di kepolisian',
      requirements: [
        'Fotokopi KTP',
        'Fotokopi Kartu Keluarga (KK)',
        'Pas foto 4x6 (3 lembar) dengan latar belakang merah',
        'Surat Pengantar dari RT/RW'
      ],
      procedure: 'Datang ke kantor kelurahan → Isi formulir → Serahkan berkas → Ambil surat pengantar → Ke Polresta',
      duration: '30 menit',
      cost: 'Gratis'
    },
    {
      id: 3,
      icon: '🏠',
      title: 'Surat Keterangan Domisili',
      description: 'Surat keterangan tempat tinggal',
      requirements: [
        'Fotokopi KTP',
        'Fotokopi Kartu Keluarga (KK)',
        'Surat Pengantar dari RT/RW',
        'Membawa KTP asli untuk verifikasi'
      ],
      procedure: 'Datang ke kantor kelurahan → Verifikasi data → Cetak surat → Tanda tangan Lurah',
      duration: '1 hari kerja',
      cost: 'Gratis'
    },
    {
      id: 4,
      icon: '💼',
      title: 'Surat Keterangan Usaha',
      description: 'Surat keterangan untuk usaha kecil/mikro',
      requirements: [
        'Fotokopi KTP',
        'Fotokopi Kartu Keluarga (KK)',
        'Foto tempat usaha',
        'Surat Pengantar dari RT/RW',
        'Surat Keterangan Domisili Usaha'
      ],
      procedure: 'Datang ke kantor kelurahan → Isi formulir → Survey lokasi usaha → Cetak surat',
      duration: '2-3 hari kerja',
      cost: 'Gratis'
    },
    {
      id: 5,
      icon: '💍',
      title: 'Surat Pengantar Nikah (N9)',
      description: 'Surat pengantar untuk menikah di KUA/Catatan Sipil',
      requirements: [
        'Fotokopi KTP calon mempelai',
        'Fotokopi Kartu Keluarga',
        'Surat Pengantar dari RT/RW',
        'Pas foto berdua (4x6) 3 lembar',
        'Fotokopi Akta Kelahiran',
        'Surat Keterangan Belum Menikah'
      ],
      procedure: 'Datang ke kantor kelurahan → Isi formulir N9 → Serahkan berkas → Ambil surat pengantar → Ke KUA',
      duration: '1 hari kerja',
      cost: 'Gratis'
    },
    {
      id: 6,
      icon: '',
      title: 'Surat Keterangan Kelahiran',
      description: 'Surat keterangan untuk pengurusan akta kelahiran',
      requirements: [
        'Surat keterangan kelahiran dari RS/Bidan',
        'Fotokopi KK orang tua',
        'Fotokopi KTP orang tua',
        'Fotokopi Buku Nikah/Akta Perkawinan',
        'Surat Pengantar dari RT/RW'
      ],
      procedure: 'Datang ke kantor kelurahan → Serahkan dokumen → Cetak surat → Bawa ke Disdukcapil untuk akta',
      duration: '1 hari kerja',
      cost: 'Gratis'
    },
    {
      id: 7,
      icon: '⚰️',
      title: 'Surat Keterangan Kematian',
      description: 'Surat keterangan untuk mengurus kematian',
      requirements: [
        'Surat keterangan kematian dari RS/Kelurahan',
        'Fotokopi KTP almarhum/almarhumah',
        'Fotokopi KK',
        'Fotokopi KTP pelapor',
        'Surat Pengantar dari RT/RW'
      ],
      procedure: 'Datang ke kantor kelurahan → Serahkan dokumen → Cetak surat → Bawa ke Disdukcapil',
      duration: '1 hari kerja',
      cost: 'Gratis'
    },
    {
      id: 8,
      icon: '',
      title: 'Surat Pindah Datang',
      description: 'Surat untuk pindah keluar atau datang ke kelurahan',
      requirements: [
        'Fotokopi KTP',
        'Fotokopi Kartu Keluarga',
        'Surat Pengantar dari RT/RW',
        'Surat Keterangan Pindah dari daerah asal (untuk pindah datang)',
        'Pas foto 4x6 (2 lembar)'
      ],
      procedure: 'Datang ke kantor kelurahan → Isi formulir → Serahkan berkas → Proses administrasi → Ambil surat',
      duration: '3-5 hari kerja',
      cost: 'Gratis'
    }
  ]

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
          Layanan Surat Menyurat
        </h1>
        <p style={{ fontSize: '18px', opacity: 0.9 }}>
          Informasi jenis surat dan persyaratan pengajuan
        </p>
      </section>

      {/* KONTEN */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
        {/* Info Box */}
        <div style={{
          background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
          border: '2px solid #f59e0b',
          borderRadius: '12px',
          padding: '20px',
          marginBottom: '30px',
          display: 'flex',
          gap: '15px',
          alignItems: 'center'
        }}>
          <span style={{ fontSize: '30px' }}>️</span>
          <div>
            <h3 style={{ color: '#92400e', margin: '0 0 5px' }}>Jam Pelayanan</h3>
            <p style={{ color: '#78350f', margin: 0, fontSize: '14px' }}>
              Senin - Jumat: 08.00 - 16.00 WITA | Sabtu: 08.00 - 12.00 WITA
            </p>
          </div>
        </div>

        {/* Grid Layanan */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '20px',
          marginBottom: '30px'
        }}>
          {layananData.map(service => (
            <div
              key={service.id}
              onClick={() => setSelectedService(selectedService?.id === service.id ? null : service)}
              style={{
                background: 'white',
                borderRadius: '12px',
                padding: '25px',
                boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
                cursor: 'pointer',
                transition: 'all 0.3s',
                border: selectedService?.id === service.id ? '2px solid #10b981' : '2px solid transparent'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)'
                e.currentTarget.style.boxShadow = '0 12px 30px rgba(0,0,0,0.15)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.08)'
              }}
            >
              <div style={{
                width: '60px', height: '60px',
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                borderRadius: '12px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '30px',
                marginBottom: '15px'
              }}>
                {service.icon}
              </div>
              <h3 style={{ color: '#1e293b', fontSize: '18px', marginBottom: '10px' }}>
                {service.title}
              </h3>
              <p style={{ color: '#64748b', fontSize: '14px', lineHeight: '1.5', marginBottom: '15px' }}>
                {service.description}
              </p>
              <p style={{
                color: '#10b981',
                fontSize: '13px',
                fontWeight: '600'
              }}>
                {selectedService?.id === service.id ? 'Tutup Detail ↑' : 'Klik untuk lihat detail →'}
              </p>
            </div>
          ))}
        </div>

        {/* Detail Modal */}
        {selectedService && (
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '30px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            border: '2px solid #10b981',
            animation: 'slideIn 0.3s ease'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ color: '#1e293b', fontSize: '24px', margin: 0 }}>
                {selectedService.icon} {selectedService.title}
              </h2>
              <button
                onClick={() => setSelectedService(null)}
                style={{
                  background: '#ef4444',
                  color: 'white',
                  border: 'none',
                  width: '30px', height: '30px',
                  borderRadius: '50%',
                  cursor: 'pointer',
                  fontSize: '16px'
                }}
              >
                ✕
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '25px' }}>
              <div>
                <h4 style={{ color: '#10b981', marginBottom: '10px', fontSize: '16px' }}> Persyaratan:</h4>
                <ul style={{ color: '#475569', paddingLeft: '20px', lineHeight: '1.8', margin: 0 }}>
                  {selectedService.requirements.map((req, idx) => (
                    <li key={idx}>{req}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 style={{ color: '#10b981', marginBottom: '10px', fontSize: '16px' }}>🔄 Alur Pengajuan:</h4>
                <p style={{ color: '#475569', lineHeight: '1.8', marginBottom: '15px' }}>
                  {selectedService.procedure}
                </p>
                <div style={{
                  background: '#f0fdf4',
                  padding: '12px',
                  borderRadius: '8px',
                  marginTop: '15px'
                }}>
                  <p style={{ color: '#065f46', margin: '5px 0', fontSize: '14px' }}>
                    <strong>⏱️ Durasi:</strong> {selectedService.duration}
                  </p>
                  <p style={{ color: '#065f46', margin: '5px 0', fontSize: '14px' }}>
                    <strong>💰 Biaya:</strong> {selectedService.cost}
                  </p>
                </div>
              </div>
            </div>

            <div style={{
              marginTop: '20px',
              padding: '15px',
              background: '#eff6ff',
              borderRadius: '8px',
              border: '1px solid #3b82f6'
            }}>
              <p style={{ color: '#1e40af', margin: 0, fontSize: '14px' }}>
                💡 <strong>Catatan Penting:</strong> Untuk pengajuan surat, silakan datang langsung ke kantor Kelurahan Woloan Dua dengan membawa persyaratan di atas. Pastikan semua dokumen lengkap untuk mempercepat proses pelayanan.
              </p>
            </div>
          </div>
        )}

        {/* Contact Info */}
        <div style={{
          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
          color: 'white',
          borderRadius: '12px',
          padding: '25px',
          textAlign: 'center',
          marginTop: '30px'
        }}>
          <h3 style={{ margin: '0 0 10px', fontSize: '20px' }}>
            📞 Butuh Bantuan?
          </h3>
          <p style={{ margin: 0, opacity: 0.9 }}>
            Hubungi kami di <strong>0431-123456</strong> atau email ke <strong>kelurahan.woloandua@gmail.com</strong>
          </p>
        </div>
      </div>

      {/* CSS Animation */}
      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  )
}

export default Layanan