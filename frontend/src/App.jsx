import { useEffect, useState } from 'react'
import './App.css'
import gunung from './assets/gunung.png'
import tomohon from './assets/tomohon.png'

function App() {
  // ==========================================
  // STATE UTAMA
  // ==========================================
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [visitorCount] = useState(Math.floor(Math.random() * 50) + 20)

  // State untuk data dari database
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [villageInfo, setVillageInfo] = useState(null)
  const [officials, setOfficials] = useState([])
  const [profileLoading, setProfileLoading] = useState(true)
  const [selectedArticle, setSelectedArticle] = useState(null)
  const [statistics, setStatistics] = useState([])
  const [galleries, setGalleries] = useState([])
  const [statsLoading, setStatsLoading] = useState(true)

  // State untuk Admin
  const [adminView, setAdminView] = useState('home') // 'home', 'login', 'dashboard', 'form'
  const [isEditMode, setIsEditMode] = useState(false)
  const [currentEditId, setCurrentEditId] = useState(null)
  const [adminToken, setAdminToken] = useState(localStorage.getItem('adminToken') || '')
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    author: 'Admin Kelurahan',
    image_url: ''
  })
  const [adminLoading, setAdminLoading] = useState(false)
  const [adminError, setAdminError] = useState('')

  const slides = [
    {
      image: gunung,
      title: 'Selamat Datang',
      subtitle: 'Website Resmi Kelurahan Woloan Dua',
      description: 'Sumber informasi terbaru tentang pemerintahan di Kelurahan Woloan Dua, Kota Tomohon'
    },
    {
      image: gunung,
      title: 'Potensi Desa',
      subtitle: 'Kerajinan Ukiran Kayu',
      description: 'Woloan terkenal dengan kerajinan ukiran kayu dan anyaman bambu yang mendunia'
    },
    {
      image: gunung,
      title: 'Wisata Alam',
      subtitle: 'Keindahan Gunung Lokon',
      description: 'Nikmati pemandangan alam yang memukau dengan udara sejuk pegunungan'
    }
  ]

  // ==========================================
  // USE EFFECT
  // ==========================================
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [slides.length])

  // Ambil data artikel
  useEffect(() => {
    fetch('http://localhost:5000/api/articles')
      .then(res => res.json())
      .then(data => {
        if (data.success) setArticles(data.data)
        setLoading(false)
      })
      .catch(err => {
        console.error('Gagal mengambil artikel:', err)
        setLoading(false)
      })
  }, [])

  // Ambil data profil kelurahan
  useEffect(() => {
    fetch('http://localhost:5000/api/profile/info')
      .then(res => res.json())
      .then(data => {
        if (data.success) setVillageInfo(data.data)
        setProfileLoading(false)
      })
      .catch(err => {
        console.error('Gagal ambil info kelurahan:', err)
        setProfileLoading(false)
      })

    fetch('http://localhost:5000/api/profile/officials')
      .then(res => res.json())
      .then(data => {
        if (data.success) setOfficials(data.data)
      })
      .catch(err => console.error('Gagal ambil perangkat:', err))
  }, [])

  // Ambil data statistik dan galeri
  useEffect(() => {
    fetch('http://localhost:5000/api/stats/statistics')
      .then(res => res.json())
      .then(data => {
        if (data.success) setStatistics(data.data)
        setStatsLoading(false)
      })
      .catch(err => {
        console.error('Gagal ambil statistik:', err)
        setStatsLoading(false)
      })

    fetch('http://localhost:5000/api/stats/galleries')
      .then(res => res.json())
      .then(data => {
        if (data.success) setGalleries(data.data)
      })
      .catch(err => console.error('Gagal ambil galeri:', err))
  }, [])

  // ==========================================
  // FUNGSI HELPER
  // ==========================================
  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length)
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  const openArticleModal = (article) => setSelectedArticle(article)
  const closeArticleModal = () => setSelectedArticle(null)

  const menuItems = [
    { name: 'Home', link: '#home' },
    { name: 'Profil Desa', link: '#profil' },
    { name: 'Infografis', link: '#infografis' },
    { name: 'Galeri', link: '#galeri' },
    { name: 'Berita', link: '#berita' },
    { name: 'PPID', link: '#ppid' }
  ]

  const sortedOfficials = [...officials].sort((a, b) => {
    const priority = {
      'Lurah': 1,
      'Sekretaris Lurah': 2,
      'Kepala Seksi Pemerintahan': 3,
      'Kepala Seksi Pelayanan': 4,
      'Kepala Seksi Kesejahteraan': 5,
    }
    const aPriority = priority[a.position] || 99
    const bPriority = priority[b.position] || 99
    return aPriority - bPriority
  })

  // ==========================================
  // FUNGSI ADMIN
  // ==========================================
  const handleAdminLogin = async (e) => {
    e.preventDefault()
    setAdminError('')
    setAdminLoading(true)

    const formData = new FormData(e.target)
    const username = formData.get('username')
    const password = formData.get('password')

    console.log(' Mencoba login dengan username:', username)

    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      })

      console.log(' Status Response dari Backend:', res.status)
      const data = await res.json()
      console.log(' Data Response dari Backend:', data)

      if (res.ok && data.success) {
        console.log(' LOGIN BERHASIL! Mengalihkan ke dashboard...')
        localStorage.setItem('adminToken', data.token)
        setAdminToken(data.token)
        setAdminView('dashboard')
        
        // Refresh artikel
        fetch('http://localhost:5000/api/articles')
          .then(r => r.json())
          .then(d => { if (d.success) setArticles(d.data) })
      } else {
        console.log(' Login ditolak backend:', data.message)
        setAdminError(data.message || 'Username atau password salah')
      }
    } catch (err) {
      console.error(' ERROR JARINGAN:', err)
      setAdminError('Gagal terhubung ke server. Pastikan backend (node src/server.js) sedang berjalan.')
    } finally {
      console.log(' Proses login selesai')
      setAdminLoading(false)
    }
  }

  const handleAdminLogout = () => {
    localStorage.removeItem('adminToken')
    setAdminToken('')
    setAdminView('home')
  }

  const openAddForm = () => {
    setIsEditMode(false)
    setCurrentEditId(null)
    setFormData({ title: '', content: '', author: 'Admin Kelurahan', image_url: '' })
    setAdminError('')
    setAdminView('form')
  }

  const openEditForm = (article) => {
    setIsEditMode(true)
    setCurrentEditId(article.id)
    setFormData({
      title: article.title,
      content: article.content,
      author: article.author || 'Admin Kelurahan',
      image_url: article.image_url || ''
    })
    setAdminError('')
    setAdminView('form')
  }

  const handleSaveArticle = async (e) => {
    e.preventDefault()
    setAdminLoading(true)
    setAdminError('')
    try {
      const url = isEditMode
        ? `http://localhost:5000/api/articles/${currentEditId}`
        : 'http://localhost:5000/api/articles'
      const method = isEditMode ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      const data = await res.json()

      if (data.success) {
        setAdminView('dashboard')
        const resArticles = await fetch('http://localhost:5000/api/articles')
        const dataArticles = await resArticles.json()
        if (dataArticles.success) setArticles(dataArticles.data)
      } else {
        setAdminError(data.error || 'Gagal menyimpan data')
      }
    } catch (err) {
      setAdminError('Gagal terhubung ke server')
    } finally {
      setAdminLoading(false)
    }
  }

  const handleDeleteArticle = async (id) => {
    if (!window.confirm('Yakin ingin menghapus berita ini?')) return
    try {
      const res = await fetch(`http://localhost:5000/api/articles/${id}`, { method: 'DELETE' })
      const data = await res.json()
      if (data.success) {
        setArticles(articles.filter(a => a.id !== id))
      } else {
        alert('Gagal menghapus')
      }
    } catch (err) {
      alert('Gagal terhubung ke server')
    }
  }

  // ==========================================
  // RENDER: LOGIN ADMIN
  // ==========================================
  if (adminView === 'login') {
    return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
        <div style={{ background: 'white', padding: '40px', borderRadius: '16px', boxShadow: '0 10px 40px rgba(0,0,0,0.2)', width: '100%', maxWidth: '400px' }}>
          <h2 style={{ textAlign: 'center', color: '#1e293b', marginBottom: '20px' }}>🔐 Login Admin</h2>
          {adminError && <div style={{ background: '#fee2e2', color: '#dc2626', padding: '10px', borderRadius: '8px', marginBottom: '15px', fontSize: '14px' }}>{adminError}</div>}
          <form onSubmit={handleAdminLogin}>
            <input name="username" placeholder="Username" required style={{ width: '100%', padding: '12px', marginBottom: '15px', border: '1px solid #d1d5db', borderRadius: '8px', boxSizing: 'border-box' }} />
            <input name="password" type="password" placeholder="Password" required style={{ width: '100%', padding: '12px', marginBottom: '20px', border: '1px solid #d1d5db', borderRadius: '8px', boxSizing: 'border-box' }} />
            <button type="submit" disabled={adminLoading} style={{ width: '100%', padding: '12px', background: '#667eea', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
              {adminLoading ? 'Loading...' : 'Masuk'}
            </button>
          </form>
          <button onClick={() => setAdminView('home')} style={{ width: '100%', marginTop: '10px', padding: '10px', background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer' }}>← Kembali ke Website</button>
        </div>
      </div>
    )
  }

  // ==========================================
  // RENDER: DASHBOARD ADMIN
  // ==========================================
  if (adminView === 'dashboard') {
    return (
      <div style={{ minHeight: '100vh', background: '#f1f5f9', padding: '20px' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
            <h2 style={{ color: '#1e293b' }}>📰 Dashboard Admin - Kelola Berita</h2>
            <div>
              <button onClick={() => setAdminView('home')} style={{ marginRight: '10px', padding: '8px 16px', background: '#64748b', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Lihat Website</button>
              <button onClick={handleAdminLogout} style={{ padding: '8px 16px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Logout</button>
            </div>
          </div>

          <button onClick={openAddForm} style={{ marginBottom: '20px', padding: '10px 20px', background: '#10b981', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>+ Tambah Berita Baru</button>

          <div style={{ background: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #e2e8f0' }}>
                  <th style={{ textAlign: 'left', padding: '12px', color: '#64748b' }}>Judul</th>
                  <th style={{ textAlign: 'left', padding: '12px', color: '#64748b' }}>Penulis</th>
                  <th style={{ textAlign: 'right', padding: '12px', color: '#64748b' }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {articles.map(article => (
                  <tr key={article.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '15px 12px', color: '#1e293b' }}>{article.title}</td>
                    <td style={{ padding: '15px 12px', color: '#64748b' }}>{article.author}</td>
                    <td style={{ padding: '15px 12px', textAlign: 'right' }}>
                      <button onClick={() => openEditForm(article)} style={{ marginRight: '8px', padding: '6px 12px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' }}>Edit</button>
                      <button onClick={() => handleDeleteArticle(article.id)} style={{ padding: '6px 12px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' }}>Hapus</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    )
  }

  // ==========================================
  // RENDER: FORM TAMBAH/EDIT BERITA
  // ==========================================
  if (adminView === 'form') {
    return (
      <div style={{ minHeight: '100vh', background: '#f1f5f9', padding: '20px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', background: 'white', borderRadius: '12px', padding: '30px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
          <h2 style={{ color: '#1e293b', marginBottom: '20px' }}>{isEditMode ? '️ Edit Berita' : '➕ Tambah Berita Baru'}</h2>
          {adminError && <div style={{ background: '#fee2e2', color: '#dc2626', padding: '10px', borderRadius: '8px', marginBottom: '15px' }}>{adminError}</div>}

          <form onSubmit={handleSaveArticle}>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>Judul *</label>
              <input type="text" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} required style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '6px', boxSizing: 'border-box' }} />
            </div>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>Penulis</label>
              <input type="text" value={formData.author} onChange={e => setFormData({ ...formData, author: e.target.value })} style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '6px', boxSizing: 'border-box' }} />
            </div>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>URL Gambar (Opsional)</label>
              <input type="url" value={formData.image_url} onChange={e => setFormData({ ...formData, image_url: e.target.value })} placeholder="https://..." style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '6px', boxSizing: 'border-box' }} />
            </div>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>Isi Berita *</label>
              <textarea value={formData.content} onChange={e => setFormData({ ...formData, content: e.target.value })} required rows="8" style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '6px', boxSizing: 'border-box', fontFamily: 'inherit' }}></textarea>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button type="submit" disabled={adminLoading} style={{ flex: 1, padding: '12px', background: '#10b981', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>
                {adminLoading ? 'Menyimpan...' : 'Simpan'}
              </button>
              <button type="button" onClick={() => setAdminView('dashboard')} style={{ padding: '12px 24px', background: '#64748b', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Batal</button>
            </div>
          </form>
        </div>
      </div>
    )
  }

  // ==========================================
  // RENDER: WEBSITE PUBLIK
  // ==========================================
  return (
    <div className="landing-page">

      {/* ===== NAVBAR ===== */}
      <nav className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`}>
        <div className="navbar-container">
          <div className="navbar-brand">
            <div className="logo-circle">
              <img src={tomohon} alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '4px' }} />
            </div>
            <div className="brand-text">
              <h1>Kelurahan Woloan Dua</h1>
              <p>Kota Tomohon</p>
            </div>
          </div>

          <ul className="navbar-menu">
            {menuItems.map((item, index) => (
              <li key={index}>
                <a href={item.link} className={index === 0 ? 'active' : ''}>{item.name}</a>
              </li>
            ))}
          </ul>

          <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
            <span className={menuOpen ? 'open' : ''}></span>
            <span className={menuOpen ? 'open' : ''}></span>
            <span className={menuOpen ? 'open' : ''}></span>
          </button>
        </div>

        {menuOpen && (
          <ul className="mobile-menu">
            {menuItems.map((item, index) => (
              <li key={index}>
                <a href={item.link} onClick={() => setMenuOpen(false)}>{item.name}</a>
              </li>
            ))}
          </ul>
        )}
      </nav>

      {/* ===== HERO SECTION ===== */}
      <section className="hero" id="home">
        <div className="hero-bg" style={{ backgroundImage: `url(${slides[currentSlide].image})` }}></div>
        <div className="hero-overlay"></div>

        <button className="slider-btn prev" onClick={prevSlide}>‹</button>
        <button className="slider-btn next" onClick={nextSlide}>›</button>

        <div className="hero-content">
          <div className="slide-content">
            <p className="hero-welcome">{slides[currentSlide].title}</p>
            <h1 className="hero-title">{slides[currentSlide].subtitle}</h1>
            <p className="hero-description">{slides[currentSlide].description}</p>
            <div className="hero-buttons">
              <a href="#quick-menu" className="btn-primary">Jelajahi Kelurahan</a>
              <a href="#layanan" className="btn-secondary">Layanan Online</a>
            </div>
          </div>

          <div className="slide-indicators">
            {slides.map((_, index) => (
              <button key={index} className={`indicator ${currentSlide === index ? 'active' : ''}`} onClick={() => setCurrentSlide(index)}></button>
            ))}
          </div>
        </div>

        <div className="scroll-indicator">
          <div className="mouse"><div className="wheel"></div></div>
          <p>Scroll Down</p>
        </div>

        <div className="visitor-widget">
          <div className="visitor-icon">👥</div>
          <div className="visitor-info">
            <span className="visitor-count">{visitorCount}</span>
            <span className="visitor-label">Kunjungan Hari Ini</span>
          </div>
        </div>

        <div className="complaint-widget">
          <button className="btn-complaint">
            <span className="complaint-icon">📢</span>
            <span>Pengaduan</span>
          </button>
          <button className="btn-accessibility" title="Accessibility">♿</button>
        </div>
      </section>

      {/* ===== QUICK MENU SECTION ===== */}
      <section className="quick-menu" id="quick-menu">
        <div className="container">
          <h2 className="section-title">Layanan Cepat</h2>
          <div className="quick-grid">
            {[
              { icon: '🗺️', title: 'Peta Kelurahan', desc: 'Lihat peta wilayah', link: '#infografis' },
              { icon: '', title: 'Layanan Surat', desc: 'Ajukan surat online', link: '#layanan' },
              { icon: '', title: 'Pengaduan', desc: 'Sampaikan keluhan', link: '#layanan' },
              { icon: '📞', title: 'Kontak Darurat', desc: 'Nomor penting', link: '#profil' },
              { icon: '📊', title: 'Statistik', desc: 'Data penduduk', link: '#infografis' },
              { icon: 'ℹ️', title: 'PPID', desc: 'Informasi publik', link: '#ppid' },
              { icon: '📰', title: 'Berita', desc: 'Kabar terbaru', link: '#berita' },
              { icon: '🏆', title: 'Potensi Kelurahan', desc: 'Sentra ukiran kayu', link: '#profil' }
            ].map((item, index) => (
              <a key={index} href={item.link} className="quick-card" style={{ textDecoration: 'none', color: 'inherit' }}>
                <div className="quick-icon">{item.icon}</div>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ===== PROFIL SECTION ===== */}
      <section className="info-section" id="profil">
        <div className="container">
          <h2 className="section-title">Profil Kelurahan</h2>

          {profileLoading ? (
            <p style={{ textAlign: 'center', padding: '20px' }}>Memuat profil...</p>
          ) : villageInfo ? (
            <div className="info-grid">
              <div className="info-card" style={{ gridColumn: '1 / -1' }}>
                <h3>🏛️ {villageInfo.name}</h3>
                <p>{villageInfo.description}</p>
                <p style={{ marginTop: '15px' }}><strong>📍 Alamat:</strong> {villageInfo.address}</p>
                <p><strong> Telepon:</strong> {villageInfo.phone}</p>
              </div>
            </div>
          ) : (
            <p style={{ textAlign: 'center', padding: '20px' }}>Data profil belum tersedia.</p>
          )}

          <h3 style={{ marginTop: '40px', marginBottom: '20px' }}>👥 Perangkat Kelurahan</h3>

          {sortedOfficials.length === 0 ? (
            <p style={{ textAlign: 'center', padding: '20px' }}>Belum ada data perangkat kelurahan.</p>
          ) : (
            <div className="info-grid">
              {sortedOfficials.map((official, index) => (
                <div key={official.id || index} className="info-card">
                  <h3>{official.name}</h3>
                  <p style={{ color: '#2d8a5e', fontWeight: 'bold', marginTop: '10px' }}>{official.position}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ===== INFOGRAFIS SECTION ===== */}
      <section className="info-section" id="infografis">
        <div className="container">
          <h2 className="section-title">Infografis & Statistik</h2>

          {statsLoading ? (
            <p style={{ textAlign: 'center', padding: '20px' }}>Memuat data...</p>
          ) : statistics.length === 0 ? (
            <p style={{ textAlign: 'center', padding: '20px' }}>Belum ada data statistik.</p>
          ) : (
            <div className="info-grid">
              {statistics.map((stat, index) => (
                <div key={stat.id || index} className="info-card" style={{ textAlign: 'center' }}>
                  <h3 style={{ fontSize: '2rem', color: '#2d8a5e', marginBottom: '10px' }}>{stat.value}</h3>
                  <p style={{ fontWeight: 'bold', marginBottom: '5px' }}>{stat.category}</p>
                  <p style={{ fontSize: '0.85rem', color: '#666' }}>Tahun {stat.year}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ===== GALERI SECTION ===== */}
      <section className="info-section" id="galeri" style={{ backgroundColor: '#f8fafc' }}>
        <div className="container">
          <h2 className="section-title">Galeri Kegiatan</h2>

          {galleries.length === 0 ? (
            <p style={{ textAlign: 'center', padding: '20px' }}>Belum ada foto kegiatan.</p>
          ) : (
            <div className="info-grid">
              {galleries.map((photo, index) => (
                <div key={photo.id || index} className="info-card" style={{ padding: '10px' }}>
                  <img src={photo.image_url} alt={photo.title} style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '8px', marginBottom: '10px' }} />
                  <h3 style={{ fontSize: '1rem', textAlign: 'center' }}>{photo.title}</h3>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ===== LAYANAN SECTION ===== */}
      <section className="info-section" id="layanan">
        <div className="container">
          <h2 className="section-title">Layanan</h2>
          <div className="info-grid">
            <div className="info-card">
              <h3>📋 Surat Menyurat</h3>
              <p>Layanan pengajuan surat secara online.</p>
              <a href="#" className="btn-link">Ajukan Surat →</a>
            </div>
            <div className="info-card">
              <h3>📢 Pengaduan</h3>
              <p>Sampaikan keluhan dan saran Anda.</p>
              <a href="#" className="btn-link">Buat Pengaduan →</a>
            </div>
            <div className="info-card">
              <h3>ℹ️ Informasi Publik</h3>
              <p>Akses informasi publik kelurahan.</p>
              <a href="#" className="btn-link">Lihat Informasi →</a>
            </div>
          </div>
        </div>
      </section>

      {/* ===== BERITA SECTION ===== */}
      <section className="info-section" id="berita">
        <div className="container">
          <h2 className="section-title">Berita Terbaru</h2>

          {loading ? (
            <p style={{ textAlign: 'center', padding: '20px' }}>Memuat berita...</p>
          ) : articles.length === 0 ? (
            <p style={{ textAlign: 'center', padding: '20px' }}>Belum ada berita yang dipublikasikan.</p>
          ) : (
            <div className="info-grid">
              {articles.slice(0, 3).map((article, index) => (
                <div key={article.id || index} className="info-card">
                  <h3>📰 {article.title}</h3>
                  <p>{article.content.substring(0, 100)}...</p>
                  <p style={{ fontSize: '0.8rem', color: '#666', marginTop: '10px' }}>Oleh: {article.author || 'Admin'}</p>
                  <button onClick={() => openArticleModal(article)} style={{ background: 'none', border: 'none', color: '#2d8a5e', cursor: 'pointer', fontSize: '1rem', fontWeight: 'bold', padding: 0, marginTop: '10px' }}>
                    Baca Selengkapnya →
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ===== PPID SECTION ===== */}
      <section className="info-section" id="ppid">
        <div className="container">
          <h2 className="section-title">PPID</h2>
          <div className="info-grid">
            <div className="info-card">
              <h3>ℹ️ Informasi Publik</h3>
              <p>Pejabat Pengelola Informasi dan Dokumentasi.</p>
              <a href="#" className="btn-link">Lihat Informasi →</a>
            </div>
            <div className="info-card">
              <h3> Permohonan Informasi</h3>
              <p>Ajukan permohonan informasi publik.</p>
              <a href="#" className="btn-link">Ajukan →</a>
            </div>
            <div className="info-card">
              <h3> Statistik Informasi</h3>
              <p>Statistik permohonan informasi publik.</p>
              <a href="#" className="btn-link">Lihat Statistik →</a>
            </div>
          </div>
        </div>
      </section>

      {/* ===== MODAL ARTIKEL ===== */}
      {selectedArticle && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: '20px' }} onClick={closeArticleModal}>
          <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '30px', maxWidth: '600px', width: '100%', maxHeight: '80vh', overflowY: 'auto', position: 'relative' }} onClick={(e) => e.stopPropagation()}>
            <button onClick={closeArticleModal} style={{ position: 'absolute', top: '15px', right: '15px', background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#666' }}>✕</button>
            <h2 style={{ color: '#2d8a5e', marginBottom: '15px', paddingRight: '30px' }}>📰 {selectedArticle.title}</h2>
            <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '20px' }}>Oleh: {selectedArticle.author || 'Admin'}</p>
            <div style={{ lineHeight: '1.6' }}>{selectedArticle.content}</div>
          </div>
        </div>
      )}

      {/* ===== FOOTER ===== */}
      <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-col">
              <h4>Kelurahan Woloan Dua</h4>
              <p>Kecamatan Tomohon Barat<br />Kota Tomohon, Sulawesi Utara</p>
              <p> 0431-123456<br />✉️ kelurahan.woloandua@gmail.com</p>
            </div>
            <div className="footer-col">
              <h4>Menu Cepat</h4>
              <ul>
                <li><a href="#profil">Profil Kelurahan</a></li>
                <li><a href="#layanan">Layanan</a></li>
                <li><a href="#berita">Berita</a></li>
              </ul>
            </div>
            <div className="footer-col">
              <h4>Ikuti Kami</h4>
              <div className="social-links">
                <a href="#">📘 Facebook</a>
                <a href="#">📷 Instagram</a>
                <a href="#">▶ YouTube</a>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2026 Kelurahan Woloan Dua.</p>
            <p style={{ marginTop: '10px' }}>
              <a href="#" onClick={(e) => { e.preventDefault(); setAdminView('login'); }} style={{ color: '#64748b', fontSize: '12px', textDecoration: 'none' }}>
                🔒 Login Admin
              </a>
            </p>
          </div>
        </div>
      </footer>

    </div>
  )
}

export default App