import { useState } from 'react'
import { Link } from 'react-router-dom'

function Kontak() {
  const [formData, setFormData] = useState({
    nama: '',
    email: '',
    telepon: '',
    kategori: 'Infrastruktur',
    judul: '',
    isi: ''
  })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    // Nanti ganti dengan API call: axios.post('http://localhost:5000/api/complaints', formData)
    console.log('Data pengaduan:', formData)
    setSubmitted(true)
    setTimeout(() => {
      setSubmitted(false)
      setFormData({ nama: '', email: '', telepon: '', kategori: 'Infrastruktur', judul: '', isi: '' })
    }, 3000)
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
          }}>️</div>
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
          Kontak & Pengaduan
        </h1>
        <p style={{ fontSize: '18px', opacity: 0.9 }}>
          Sampaikan aspirasi dan pengaduan Anda kepada kami
        </p>
      </section>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
          {/* Info Kontak */}
          <div>
            <div style={{
              background: 'white',
              borderRadius: '16px',
              padding: '30px',
              boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
              marginBottom: '20px'
            }}>
              <h2 style={{ color: '#1e293b', fontSize: '24px', marginBottom: '20px' }}>📍 Informasi Kontak</h2>
              
              <div style={{ marginBottom: '20px' }}>
                <h4 style={{ color: '#10b981', marginBottom: '5px' }}>Alamat</h4>
                <p style={{ color: '#475569', margin: 0 }}>Jl. Raya Woloan Dua, Tomohon Barat, Kota Tomohon, Sulawesi Utara</p>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <h4 style={{ color: '#10b981', marginBottom: '5px' }}>📞 Telepon</h4>
                <p style={{ color: '#475569', margin: 0 }}>0431-123456</p>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <h4 style={{ color: '#10b981', marginBottom: '5px' }}>✉️ Email</h4>
                <p style={{ color: '#475569', margin: 0 }}>kelurahan.woloandua@gmail.com</p>
              </div>

              <div>
                <h4 style={{ color: '#10b981', marginBottom: '5px' }}> Jam Operasional</h4>
                <p style={{ color: '#475569', margin: 0 }}>Senin - Jumat: 08.00 - 16.00 WITA</p>
                <p style={{ color: '#475569', margin: 0 }}>Sabtu: 08.00 - 12.00 WITA</p>
              </div>
            </div>

            {/* Google Maps Embed */}
            <div style={{
              background: 'white',
              borderRadius: '16px',
              overflow: 'hidden',
              boxShadow: '0 4px 15px rgba(0,0,0,0.08)'
            }}>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d127548.58892381237!2d124.7739!3d1.3333!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMcKwMjAnMDAuMCJOIDEyNMKwNDYnMjQuMCJF!5e0!3m2!1sen!2sid!4v1234567890"
                width="100%"
                height="300"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                title="Peta Kelurahan Woloan Dua"
              ></iframe>
            </div>
          </div>

          {/* Form Pengaduan */}
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '30px',
            boxShadow: '0 4px 15px rgba(0,0,0,0.08)'
          }}>
            <h2 style={{ color: '#1e293b', fontSize: '24px', marginBottom: '20px' }}> Form Pengaduan</h2>

            {submitted ? (
              <div style={{
                background: '#f0fdf4',
                border: '2px solid #10b981',
                borderRadius: '12px',
                padding: '30px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '60px', marginBottom: '15px' }}>✅</div>
                <h3 style={{ color: '#065f46', marginBottom: '10px' }}>Pengaduan Terkirim!</h3>
                <p style={{ color: '#047857' }}>Terima kasih, pengaduan Anda akan segera kami proses.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', marginBottom: '5px', color: '#374151', fontWeight: '500' }}>Nama Lengkap *</label>
                  <input
                    type="text"
                    required
                    value={formData.nama}
                    onChange={(e) => setFormData({...formData, nama: e.target.value})}
                    style={{
                      width: '100%', padding: '12px',
                      border: '1px solid #d1d5db', borderRadius: '8px',
                      fontSize: '14px', boxSizing: 'border-box'
                    }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '5px', color: '#374151', fontWeight: '500' }}>Email</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      style={{
                        width: '100%', padding: '12px',
                        border: '1px solid #d1d5db', borderRadius: '8px',
                        fontSize: '14px', boxSizing: 'border-box'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '5px', color: '#374151', fontWeight: '500' }}>No. Telepon *</label>
                    <input
                      type="tel"
                      required
                      value={formData.telepon}
                      onChange={(e) => setFormData({...formData, telepon: e.target.value})}
                      style={{
                        width: '100%', padding: '12px',
                        border: '1px solid #d1d5db', borderRadius: '8px',
                        fontSize: '14px', boxSizing: 'border-box'
                      }}
                    />
                  </div>
                </div>

                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', marginBottom: '5px', color: '#374151', fontWeight: '500' }}>Kategori *</label>
                  <select
                    required
                    value={formData.kategori}
                    onChange={(e) => setFormData({...formData, kategori: e.target.value})}
                    style={{
                      width: '100%', padding: '12px',
                      border: '1px solid #d1d5db', borderRadius: '8px',
                      fontSize: '14px', boxSizing: 'border-box',
                      background: 'white'
                    }}
                  >
                    <option>Infrastruktur</option>
                    <option>Keamanan</option>
                    <option>Kebersihan</option>
                    <option>Pelayanan</option>
                    <option>Lainnya</option>
                  </select>
                </div>

                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', marginBottom: '5px', color: '#374151', fontWeight: '500' }}>Judul Pengaduan *</label>
                  <input
                    type="text"
                    required
                    value={formData.judul}
                    onChange={(e) => setFormData({...formData, judul: e.target.value})}
                    style={{
                      width: '100%', padding: '12px',
                      border: '1px solid #d1d5db', borderRadius: '8px',
                      fontSize: '14px', boxSizing: 'border-box'
                    }}
                  />
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '5px', color: '#374151', fontWeight: '500' }}>Isi Pengaduan *</label>
                  <textarea
                    required
                    rows="5"
                    value={formData.isi}
                    onChange={(e) => setFormData({...formData, isi: e.target.value})}
                    style={{
                      width: '100%', padding: '12px',
                      border: '1px solid #d1d5db', borderRadius: '8px',
                      fontSize: '14px', boxSizing: 'border-box',
                      fontFamily: 'inherit', resize: 'vertical'
                    }}
                  ></textarea>
                </div>

                <button
                  type="submit"
                  style={{
                    width: '100%',
                    padding: '14px',
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  📤 Kirim Pengaduan
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Kontak