import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'

function Berita() {
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axios.get('http://localhost:5000/api/articles')
      .then(res => {
        setArticles(res.data.data || [])
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
          Berita & Pengumuman
        </h1>
        <p style={{ fontSize: '18px', opacity: 0.9 }}>Informasi terbaru dari Kelurahan Woloan Dua</p>
      </section>

      {/* KONTEN */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
        {loading ? (
          <p style={{ textAlign: 'center', padding: '40px', fontSize: '18px', color: '#64748b' }}>
            ⏳ Memuat berita...
          </p>
        ) : articles.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px' }}>
            <p style={{ fontSize: '60px', marginBottom: '20px' }}>📭</p>
            <p style={{ fontSize: '18px', color: '#64748b' }}>Belum ada berita yang dipublikasikan</p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '25px'
          }}>
            {articles.map(article => (
              <Link 
                to={`/berita/${article.id}`} 
                key={article.id}
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <div style={{
                  background: 'white',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
                  transition: 'all 0.3s',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)'
                  e.currentTarget.style.boxShadow = '0 12px 30px rgba(0,0,0,0.15)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.08)'
                }}>
                  {/* Gambar Placeholder */}
                  <div style={{
                    height: '180px',
                    background: 'linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '60px'
                  }}>
                    📰
                  </div>

                  {/* Konten Berita */}
                  <div style={{ padding: '20px' }}>
                    <h3 style={{
                      color: '#1e293b',
                      fontSize: '20px',
                      marginBottom: '10px',
                      lineHeight: '1.3'
                    }}>
                      {article.title}
                    </h3>
                    <p style={{
                      color: '#64748b',
                      lineHeight: '1.6',
                      marginBottom: '15px',
                      fontSize: '14px'
                    }}>
                      {article.content?.substring(0, 120)}...
                    </p>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      paddingTop: '15px',
                      borderTop: '1px solid #e2e8f0'
                    }}>
                      <span style={{ color: '#94a3b8', fontSize: '13px' }}>
                        📅 {new Date(article.created_at).toLocaleDateString('id-ID', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                      <span style={{
                        color: '#10b981',
                        fontSize: '13px',
                        fontWeight: '600'
                      }}>
                        Baca Selengkapnya →
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Berita