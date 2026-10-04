import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { mockArticles } from '../data/mockData'

function DetailBerita() {
  const { id } = useParams()
  const [article, setArticle] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Nanti ganti dengan: axios.get(`http://localhost:5000/api/articles/${id}`)
    setTimeout(() => {
      const found = mockArticles.find(a => a.id === parseInt(id))
      setArticle(found)
      setLoading(false)
    }, 300)
  }, [id])

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
        <Link to="/berita" style={{ color: '#10b981', fontWeight: 'bold', textDecoration: 'none', fontSize: '16px' }}>
          ← Kembali ke Berita
        </Link>
      </nav>

      {/* KONTEN */}
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 20px' }}>
        {loading ? (
          <p style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>⏳ Memuat...</p>
        ) : !article ? (
          <div style={{ textAlign: 'center', padding: '60px' }}>
            <p style={{ fontSize: '60px', marginBottom: '20px' }}></p>
            <p style={{ fontSize: '18px', color: '#64748b' }}>Berita tidak ditemukan</p>
            <Link to="/berita" style={{
              display: 'inline-block',
              marginTop: '20px',
              color: '#10b981',
              textDecoration: 'none',
              fontWeight: '600'
            }}>
              ← Kembali ke Daftar Berita
            </Link>
          </div>
        ) : (
          <article style={{
            background: 'white',
            borderRadius: '16px',
            padding: '40px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
          }}>
            {/* Gambar Header */}
            <div style={{
              height: '300px',
              background: 'linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '100px',
              marginBottom: '30px'
            }}>
              
            </div>

            {/* Judul */}
            <h1 style={{
              color: '#1e293b',
              fontSize: '36px',
              marginBottom: '20px',
              lineHeight: '1.3'
            }}>
              {article.title}
            </h1>

            {/* Meta */}
            <div style={{
              display: 'flex',
              gap: '20px',
              paddingBottom: '20px',
              marginBottom: '30px',
              borderBottom: '2px solid #e2e8f0',
              color: '#64748b',
              fontSize: '14px'
            }}>
              <span>📅 {new Date(article.created_at).toLocaleDateString('id-ID', {
                year: 'numeric', month: 'long', day: 'numeric'
              })}</span>
              <span>️ Kelurahan Woloan Dua</span>
            </div>

            {/* Konten */}
            <div style={{
              color: '#475569',
              lineHeight: '1.8',
              fontSize: '16px'
            }}>
              <p>{article.content}</p>
            </div>

            {/* Share Buttons */}
            <div style={{
              marginTop: '40px',
              paddingTop: '20px',
              borderTop: '1px solid #e2e8f0',
              display: 'flex',
              gap: '10px'
            }}>
              <span style={{ color: '#64748b', fontSize: '14px' }}>Bagikan:</span>
              <button style={{
                background: '#3b82f6',
                color: 'white',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '13px'
              }}>📘 Facebook</button>
              <button style={{
                background: '#10b981',
                color: 'white',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '13px'
              }}>💬 WhatsApp</button>
            </div>
          </article>
        )}
      </div>
    </div>
  )
}

export default DetailBerita