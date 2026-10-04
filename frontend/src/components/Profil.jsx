import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'

function Profil() {
  const [profile, setProfile] = useState(null)
  const [officials, setOfficials] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Ambil data dari backend
    Promise.all([
      axios.get('http://localhost:5000/api/profile/info').catch(() => ({ data: { data: null } })),
      axios.get('http://localhost:5000/api/profile/officials').catch(() => ({ data: { data: [] } }))
    ])
      .then(([profileRes, officialsRes]) => {
        setProfile(profileRes.data?.data || null)
        setOfficials(officialsRes.data?.data || [])
        setLoading(false)
      })
      .catch(err => {
        console.error('Error:', err)
        setLoading(false)
      })
  }, [])

  return (
    <div className="page-wrapper">
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

      {/* PAGE HEADER */}
      <section style={{
        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
        color: 'white',
        padding: '60px 20px',
        textAlign: 'center'
      }}>
        <h1 style={{ fontSize: '42px', marginBottom: '10px', textShadow: '2px 2px 8px rgba(0,0,0,0.3)' }}>
          Profil Kelurahan
        </h1>
        <p style={{ fontSize: '18px', opacity: 0.9 }}>Mengenal lebih dekat Kelurahan Woloan Dua</p>
      </section>

      {/* KONTEN */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
        {loading ? (
          <p style={{ textAlign: 'center', padding: '40px', fontSize: '18px', color: '#64748b' }}>
            ⏳ Memuat data...
          </p>
        ) : (
          <>
            {/* SAMBUTAN LURAH */}
            <section style={{ marginBottom: '50px' }}>
              <h2 style={{
                fontSize: '28px',
                color: '#1e293b',
                marginBottom: '25px',
                paddingBottom: '10px',
                borderBottom: '3px solid #10b981',
                display: 'inline-block'
              }}>
                🏛️ Sambutan Lurah
              </h2>
              <div style={{
                background: 'white',
                padding: '30px',
                borderRadius: '12px',
                boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
                lineHeight: '1.8',
                color: '#475569',
                fontSize: '16px'
              }}>
                <p>{profile?.description || 'Selamat datang di website resmi Kelurahan Woloan Dua. Website ini merupakan sarana informasi dan komunikasi antara pemerintah kelurahan dengan masyarakat untuk mewujudkan pelayanan yang transparan dan akuntabel.'}</p>
              </div>
            </section>

            {/* SEJARAH & VISI MISI */}
            <section style={{ marginBottom: '50px' }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '25px'
              }}>
                <div style={{
                  background: 'white',
                  padding: '30px',
                  borderRadius: '12px',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.08)'
                }}>
                  <h3 style={{ color: '#10b981', marginBottom: '15px', fontSize: '20px' }}>📜 Sejarah Singkat</h3>
                  <p style={{ color: '#475569', lineHeight: '1.7' }}>
                    Kelurahan Woloan Dua terletak di Kecamatan Tomohon Barat, Kota Tomohon, Sulawesi Utara. Dikenal dengan kerajinan ukiran kayu dan anyaman bambu yang sudah mendunia, serta keindahan alam pegunungan yang sejuk.
                  </p>
                </div>
                <div style={{
                  background: 'white',
                  padding: '30px',
                  borderRadius: '12px',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.08)'
                }}>
                  <h3 style={{ color: '#10b981', marginBottom: '15px', fontSize: '20px' }}>🎯 Visi & Misi</h3>
                  <p style={{ color: '#475569', lineHeight: '1.7' }}>
                    <strong>Visi:</strong> Mewujudkan Kelurahan Woloan Dua yang maju, mandiri, dan sejahtera.
                  </p>
                  <p style={{ color: '#475569', lineHeight: '1.7', marginTop: '10px' }}>
                    <strong>Misi:</strong>
                  </p>
                  <ul style={{ color: '#475569', lineHeight: '1.7', paddingLeft: '20px' }}>
                    <li>Meningkatkan kualitas pelayanan publik</li>
                    <li>Memberdayakan ekonomi masyarakat melalui UMKM</li>
                    <li>Melestarikan budaya dan kerajinan lokal</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* STRUKTUR ORGANISASI */}
            <section style={{ marginBottom: '50px' }}>
              <h2 style={{
                fontSize: '28px',
                color: '#1e293b',
                marginBottom: '25px',
                paddingBottom: '10px',
                borderBottom: '3px solid #10b981',
                display: 'inline-block'
              }}>
                👥 Struktur Organisasi
              </h2>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: '25px'
              }}>
                {officials.length > 0 ? (
                  officials.map((official) => (
                    <div key={official.id} style={{
                      background: 'white',
                      padding: '30px 20px',
                      borderRadius: '12px',
                      textAlign: 'center',
                      boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
                      transition: 'all 0.3s'
                    }}>
                      <div style={{
                        width: '100px', height: '100px',
                        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                        borderRadius: '50%',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '50px',
                        margin: '0 auto 15px'
                      }}></div>
                      <h3 style={{ color: '#1e293b', fontSize: '18px', marginBottom: '8px' }}>{official.name}</h3>
                      <p style={{ color: '#10b981', fontWeight: '600', fontSize: '14px' }}>{official.position}</p>
                    </div>
                  ))
                ) : (
                  <>
                    <div style={{
                      background: 'white', padding: '30px 20px', borderRadius: '12px',
                      textAlign: 'center', boxShadow: '0 4px 15px rgba(0,0,0,0.08)'
                    }}>
                      <div style={{
                        width: '100px', height: '100px',
                        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                        borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '50px', margin: '0 auto 15px'
                      }}>👤</div>
                      <h3 style={{ color: '#1e293b', fontSize: '18px', marginBottom: '8px' }}>Nama Lurah</h3>
                      <p style={{ color: '#10b981', fontWeight: '600', fontSize: '14px' }}>Lurah Woloan Dua</p>
                    </div>
                    <div style={{
                      background: 'white', padding: '30px 20px', borderRadius: '12px',
                      textAlign: 'center', boxShadow: '0 4px 15px rgba(0,0,0,0.08)'
                    }}>
                      <div style={{
                        width: '100px', height: '100px',
                        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                        borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '50px', margin: '0 auto 15px'
                      }}></div>
                      <h3 style={{ color: '#1e293b', fontSize: '18px', marginBottom: '8px' }}>Nama Sekretaris</h3>
                      <p style={{ color: '#10b981', fontWeight: '600', fontSize: '14px' }}>Sekretaris Lurah</p>
                    </div>
                    <div style={{
                      background: 'white', padding: '30px 20px', borderRadius: '12px',
                      textAlign: 'center', boxShadow: '0 4px 15px rgba(0,0,0,0.08)'
                    }}>
                      <div style={{
                        width: '100px', height: '100px',
                        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                        borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '50px', margin: '0 auto 15px'
                      }}>👤</div>
                      <h3 style={{ color: '#1e293b', fontSize: '18px', marginBottom: '8px' }}>Nama Kasi</h3>
                      <p style={{ color: '#10b981', fontWeight: '600', fontSize: '14px' }}>Kasi Pemerintahan</p>
                    </div>
                  </>
                )}
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  )
}

export default Profil