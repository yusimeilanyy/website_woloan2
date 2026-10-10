import { useEffect, useState } from 'react'
import axios from 'axios'

function AdminBerita() {
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [currentId, setCurrentId] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    author: 'Admin',
    image_url: ''
  })

  // Ambil semua artikel
  const fetchArticles = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/articles')
      setArticles(res.data.data || [])
      setLoading(false)
    } catch (err) {
      console.error('Error fetching articles:', err)
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchArticles()
  }, [])

  // Buka modal untuk tambah
  const handleAdd = () => {
    setEditMode(false)
    setCurrentId(null)
    setFormData({
      title: '',
      content: '',
      author: 'Admin',
      image_url: ''
    })
    setShowModal(true)
  }

  // Buka modal untuk edit
  const handleEdit = async (article) => {
    setEditMode(true)
    setCurrentId(article.id)
    setFormData({
      title: article.title,
      content: article.content,
      author: article.author || 'Admin',
      image_url: article.image_url || ''
    })
    setShowModal(true)
  }

  // Handle input change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  // Submit form (Tambah atau Edit)
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      if (editMode) {
        // UPDATE
        await axios.put(`http://localhost:5000/api/articles/${currentId}`, formData)
        alert('✅ Berita berhasil diperbarui!')
      } else {
        // CREATE
        await axios.post('http://localhost:5000/api/articles', formData)
        alert('✅ Berita berhasil ditambahkan!')
      }
      
      setShowModal(false)
      fetchArticles() // Refresh data
    } catch (err) {
      console.error('Error:', err)
      alert('❌ Terjadi kesalahan: ' + (err.response?.data?.error || err.message))
    }
  }

  // Hapus artikel
  const handleDelete = async (id) => {
    if (!window.confirm('Yakin ingin menghapus berita ini?')) return
    
    try {
      await axios.delete(`http://localhost:5000/api/articles/${id}`)
      alert('🗑️ Berita berhasil dihapus!')
      fetchArticles() // Refresh data
    } catch (err) {
      console.error('Error:', err)
      alert(' Gagal menghapus: ' + err.message)
    }
  }

  return (
    <div className="admin-container" style={{ padding: '20px' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '30px'
      }}>
        <div>
          <h1 style={{ fontSize: '28px', color: '#1e293b', marginBottom: '5px' }}>
            Kelola Berita
          </h1>
          <p style={{ color: '#64748b' }}>Kelola semua berita yang dipublikasikan</p>
        </div>
        <button 
          onClick={handleAdd}
          style={{
            background: '#10b981',
            color: 'white',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
           Tambah Berita
        </button>
      </div>

      {/* Daftar Berita */}
      {loading ? (
        <p style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
          ⏳ Memuat...
        </p>
      ) : articles.length === 0 ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '60px',
          background: 'white',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <p style={{ fontSize: '60px', marginBottom: '20px' }}>📭</p>
          <p style={{ fontSize: '18px', color: '#64748b' }}>Belum ada berita</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {articles.map((article, index) => (
            <div 
              key={article.id}
              style={{
                background: 'white',
                padding: '20px',
                borderRadius: '12px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <div style={{
                  width: '50px',
                  height: '50px',
                  background: '#10b981',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '20px',
                  fontWeight: 'bold'
                }}>
                  {index + 1}
                </div>
                <div>
                  <h3 style={{ margin: '0 0 5px 0', color: '#1e293b' }}>
                    {article.title}
                  </h3>
                  <p style={{ margin: 0, color: '#94a3b8', fontSize: '14px' }}>
                    👤 {article.author} • 📅 {new Date(article.created_at).toLocaleDateString('id-ID')}
                  </p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button 
                  onClick={() => handleEdit(article)}
                  style={{
                    background: '#10b981',
                    color: 'white',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px'
                  }}
                >
                  ✏️ Edit
                </button>
                <button 
                  onClick={() => handleDelete(article.id)}
                  style={{
                    background: '#ef4444',
                    color: 'white',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px'
                  }}
                >
                  ️ Hapus
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Form */}
      {showModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'white',
            padding: '30px',
            borderRadius: '12px',
            width: '90%',
            maxWidth: '600px',
            maxHeight: '90vh',
            overflow: 'auto'
          }}>
            <h2 style={{ marginBottom: '20px', color: '#1e293b' }}>
              {editMode ? '️ Edit Berita' : '➕ Tambah Berita'}
            </h2>
            
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', color: '#475569' }}>
                  Judul *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #e2e8f0',
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                />
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', color: '#475569' }}>
                  Konten *
                </label>
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  required
                  rows="6"
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #e2e8f0',
                    borderRadius: '6px',
                    fontSize: '14px',
                    resize: 'vertical'
                  }}
                />
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', color: '#475569' }}>
                  Penulis
                </label>
                <input
                  type="text"
                  name="author"
                  value={formData.author}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #e2e8f0',
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', color: '#475569' }}>
                  URL Gambar (opsional)
                </label>
                <input
                  type="url"
                  name="image_url"
                  value={formData.image_url}
                  onChange={handleChange}
                  placeholder="https://example.com/gambar.jpg"
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #e2e8f0',
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  style={{
                    background: '#94a3b8',
                    color: 'white',
                    border: 'none',
                    padding: '10px 20px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  style={{
                    background: '#10b981',
                    color: 'white',
                    border: 'none',
                    padding: '10px 20px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '600'
                  }}
                >
                  💾 {editMode ? 'Perbarui' : 'Simpan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminBerita