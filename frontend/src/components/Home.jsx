import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import gunung from '../assets/gunung.png'
import tomohon from '../assets/tomohon.png'

function Home() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [visitorCount] = useState(Math.floor(Math.random() * 50) + 20)

  const slides = [
    { image: gunung, title: 'Selamat Datang', subtitle: 'Website Resmi Kelurahan Woloan Dua', description: 'Sumber informasi terbaru tentang pemerintahan di Kelurahan Woloan Dua, Kota Tomohon' },
    { image: gunung, title: 'Potensi Desa', subtitle: 'Kerajinan Ukiran Kayu', description: 'Woloan terkenal dengan kerajinan ukiran kayu dan anyaman bambu yang mendunia' },
    { image: gunung, title: 'Wisata Alam', subtitle: 'Keindahan Gunung Lokon', description: 'Nikmati pemandangan alam yang memukau dengan udara sejuk pegunungan' }
  ]

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const timer = setInterval(() => setCurrentSlide((prev) => (prev + 1) % slides.length), 5000)
    return () => clearInterval(timer)
  }, [slides.length])

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length)
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)

  const menuItems = [
    { path: '/', label: 'Home' },
    { path: '/profil', label: 'Profil Desa' },
    { path: '/berita', label: 'Berita' },
    { path: '/layanan', label: 'Layanan' },
    { path: '/transparansi', label: 'Transparansi' }
  ]

  return (
    <div className="landing-page">
      {/* ===== NAVBAR ===== */}
      <nav className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`}>
        <div className="navbar-container">
          <Link to="/" className="navbar-brand">
          <div className="logo-circle">
  <img 
    src={tomohon} 
    alt="Logo Kelurahan Woloan Dua" 
    style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '4px' }} 
  />
</div>
            <div className="brand-text">
              <h1>Kelurahan Woloan Dua</h1>
              <p>Kota Tomohon</p>
            </div>
          </Link>

          <ul className="navbar-menu">
            {menuItems.map((item, index) => (
              <li key={index}>
                <Link to={item.path} className={item.path === '/' ? 'active' : ''}>
                  {item.label}
                </Link>
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
                <Link to={item.path} onClick={() => setMenuOpen(false)}>{item.label}</Link>
              </li>
            ))}
          </ul>
        )}
      </nav>

      {/* ===== HERO SECTION ===== */}
      <section className="hero">
        <div className="hero-bg" style={{ backgroundImage: `url(${slides[currentSlide].image})` }}></div>
        <div className="hero-overlay"></div>

        <button className="slider-btn prev" onClick={prevSlide}>‹</button>
        <button className="slider-btn next" onClick={nextSlide}>›</button>

        <div className="hero-content">
          <p className="hero-welcome">{slides[currentSlide].title}</p>
          <h1 className="hero-title">{slides[currentSlide].subtitle}</h1>
          <p className="hero-description">{slides[currentSlide].description}</p>
          <div className="hero-buttons">
            <Link to="/profil" className="btn-primary">Jelajahi Kelurahan</Link>
            <Link to="/layanan" className="btn-secondary">Layanan Online</Link>
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
      <section className="quick-menu">
        <div className="container">
          <h2 className="section-title">Layanan Cepat</h2>
          <div className="quick-grid">
            {[
              { icon: '🗺️', title: 'Peta Kelurahan', desc: 'Lihat peta wilayah', link: '/peta' },
              { icon: '📋', title: 'Layanan Surat', desc: 'Ajukan surat online', link: '/layanan' },
              { icon: '📢', title: 'Pengaduan', desc: 'Sampaikan keluhan', link: '/pengaduan' },
              { icon: '📞', title: 'Kontak Darurat', desc: 'Nomor penting', link: '/kontak' },
              { icon: '💰', title: 'Transparansi', desc: 'Informasi anggaran', link: '/transparansi' },
              { icon: '📊', title: 'Statistik', desc: 'Data penduduk', link: '/statistik' },
              { icon: 'ℹ️', title: 'PPID', desc: 'Informasi publik', link: '/ppid' },
              { icon: '🏆', title: 'Potensi Kelurahan', desc: 'Informasi potensi wilayah', link: '/potensi' }
            ].map((item, index) => (
              <Link to={item.link} key={index} className="quick-card">
                <div className="quick-icon">{item.icon}</div>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===== INFO SECTION ===== */}
      <section className="info-section">
        <div className="container">
          <div className="info-grid">
            <div className="info-card">
              <h3>📰 Berita Terbaru</h3>
              <p>Kegiatan dan pengumuman terkini dari Kelurahan Woloan Dua</p>
              <Link to="/berita" className="btn-link">Lihat Semua →</Link>
            </div>
            <div className="info-card">
              <h3>🏛️ Profil Kelurahan</h3>
              <p>Sejarah, visi-misi, dan struktur organisasi kelurahan</p>
              <Link to="/profil" className="btn-link">Lihat Semua →</Link>
            </div>
            <div className="info-card">
              <h3>🎯 Potensi Kelurahan</h3>
              <p>UMKM, wisata, serta potensi unggulan Woloan Dua</p>
              <Link to="/layanan" className="btn-link">Lihat Semua →</Link>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-col">
              <h4>Kelurahan Woloan Dua</h4>
              <p>Kecamatan Tomohon Barat<br />Kota Tomohon, Sulawesi Utara</p>
              <p>📞 0431-123456<br />✉️ kelurahan.woloandua@gmail.com</p>
            </div>
            <div className="footer-col">
              <h4>Menu Cepat</h4>
              <ul>
                <li><Link to="/profil">Profil Kelurahan</Link></li>
                <li><Link to="/layanan">Layanan</Link></li>
                <li><Link to="/berita">Berita</Link></li>
                <li><Link to="/transparansi">Transparansi</Link></li>
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
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Home