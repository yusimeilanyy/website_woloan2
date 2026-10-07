import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'

function TambahBerita() {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    author: 'Admin Kelurahan',
    image_url: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  // Cek login saat halaman dibuka
  useState(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      navigate('/admin/login')
    }
  }, [])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const token = localStorage.getItem('token')

    try {
      const response = await fetch('http://localhost:5000/api/articles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (response.ok) {
        alert('✅ Berita berhasil ditambahkan!')
        navigate('/admin/dashboard')
      } else {
        setError(data.message || data.error || 'Gagal menambahkan berita')
      }
    } catch (err) {
      setError('Terjadi kesalahan. Pastikan backend sudah berjalan.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f1f5f9' }}>
      {/* Header */}
      <header style={{
        background: '#1e293b',
        color: 'white',
        padding: '15px 30px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <h1 style={{ fontSize: '20px', margin: 0 }}>Tambah Berita Baru</h1>
          <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0 }}>Kelurahan Woloan Dua</p>
        </div>
        <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
          <Link to="/admin/dashboard" style={{ color: '#10b981', textDecoration: 'none', fontSize: '14px' }}>
            ← Kembali ke Dashboard
          </Link>
        </div>
      </header>

      {/* Form Container */}
      <div style={{ maxWidth: '800px', margin: '30px auto', padding: '0 20px' }}>
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '30px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
        }}>
          {error && (
            <div style={{
              background: '#fee2e2',
              color: '#dc2626',
              padding: '12px',
              borderRadius: '8px',
              marginBottom: '20px',
              fontSize: '14px'
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Judul */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', color: '#374151', fontWeight: '600' }}>
                Judul Berita *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '14px',
                  boxSizing: 'border-box'
                }}
                placeholder="Masukkan judul berita"
              />
            </div>

            {/* Penulis */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', color: '#374151', fontWeight: '600' }}>
                Penulis
              </label>
              <input
                type="text"
                name="author"
                value={formData.author}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '14px',
                  boxSizing: 'border-box'
                }}
                placeholder="Nama penulis"
              />
            </div>

            {/* URL Gambar */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', color: '#374151', fontWeight: '600' }}>
                URL Gambar (Opsional)
              </label>
              <input
                type="url"
                name="image_url"
                value={formData.image_url}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '14px',
                  boxSizing: 'border-box'
                }}
                placeholder="https://example.com/gambar.jpg"
              />
              {formData.image_url && (
                <div style={{ marginTop: '10px' }}>
                  <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '5px' }}>Preview:</p>
                  <img 
                    src={formData.image_url} 
                    alt="Preview"
                    style={{ 
                      maxWidth: '300px', 
                      borderRadius: '8px',
                      border: '1px solid #e2e8f0'
                    }}
                    onError={(e) => { e.target.style.display = 'none' }}
                  />
                </div>
              )}
            </div>

            {/* Konten */}
            <div style={{ marginBottom: '25px' }}>
              <label style={{ display: 'block', marginBottom: '8px', color: '#374151', fontWeight: '600' }}>
                Isi Berita *
              </label>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleChange}
                required
                rows="10"
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontFamily: 'inherit',
                  resize: 'vertical',
                  boxSizing: 'border-box'
                }}
                placeholder="Tulis isi berita di sini..."
              ></textarea>
              <p style={{ fontSize: '12px', color: '#64748b', marginTop: '5px' }}>
                {formData.content.length} karakter
              </p>
            </div>

            {/* Tombol Submit */}
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                type="submit"
                disabled={loading}
                style={{
                  flex: 1,
                  padding: '14px',
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.7 : 1
                }}
              >
                {loading ? 'Menyimpan...' : '💾 Simpan Berita'}
              </button>
              <Link
                to="/admin/dashboard"
                style={{
                  padding: '14px 20px',
                  background: '#6b7280',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  fontSize: '16px',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                Batal
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default TambahBerita