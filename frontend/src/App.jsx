import { useEffect, useState } from 'react'
import './App.css'
import gunung from './assets/gunung.png'

function App() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [visitorCount] = useState(Math.floor(Math.random() * 50) + 20)

  const slides = [
    {
      image: gunung,
      title: 'Selamat Datang',
      subtitle: 'Website Resmi Kelurahan Woloan Dua',
      description: 'Sumber informasi terbaru tentang pemerintahan di Kelurahan WoloanDua, Kota Tomohon'
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

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [slides.length])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  const menuItems = [
    { name: 'Home', link: '#home' },
    { name: 'Profil Desa', link: '#profil' },
    { name: 'Infografis', link: '#infografis' },
    { name: 'Layanan', link: '#layanan' },
    { name: 'Berita', link: '#berita' },
    { name: 'Transparansi', link: '#transparansi' },
    { name: 'PPID', link: '#ppid' }
  ]

  return (
    <div className="landing-page">

      {/* ===== NAVBAR ===== */}
      <nav className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`}>
        <div className="navbar-container">
          <div className="navbar-brand">
            <div className="logo-circle">️</div>
            <div className="brand-text">
              <h1>Kelurahan Woloan Dua</h1>
              <p>Kota Tomohon</p>
            </div>
          </div>

          <ul className="navbar-menu">
            {menuItems.map((item, index) => (
              <li key={index}>
                <a href={item.link} className={index === 0 ? 'active' : ''}>
                  {item.name}
                </a>
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
                <a href={item.link} onClick={() => setMenuOpen(false)}>
                  {item.name}
                </a>
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
              <button
                key={index}
                className={`indicator ${currentSlide === index ? 'active' : ''}`}
                onClick={() => setCurrentSlide(index)}
              ></button>
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
          <button className="btn-accessibility" title="Accessibility"></button>
        </div>
      </section>

      {/* ===== QUICK MENU SECTION ===== */}
      <section className="quick-menu" id="quick-menu">
        <div className="container">
          <h2 className="section-title">Layanan Cepat</h2>
          <div className="quick-grid">
            {[
              { icon: '🗺️', title: 'Peta Kelurahan', desc: 'Lihat peta wilayah' },
              { icon: '📋', title: 'Layanan Surat', desc: 'Ajukan surat online' },
              { icon: '📢', title: 'Pengaduan', desc: 'Sampaikan keluhan' },
              { icon: '📞', title: 'Kontak Darurat', desc: 'Nomor penting' },
              { icon: '💰', title: 'Transparansi', desc: 'Informasi anggaran' },
              { icon: '📊', title: 'Statistik', desc: 'Data penduduk' },
              { icon: 'ℹ️', title: 'PPID', desc: 'Informasi publik' },
              { icon: '🏆', title: 'Potensi Kelurahan', desc: 'Informasi potensi wilayah' }
            ].map((item, index) => (
              <div key={index} className="quick-card">
                <div className="quick-icon">{item.icon}</div>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== PROFIL SECTION ===== */}
      <section className="info-section" id="profil">
        <div className="container">
          <h2 className="section-title">Profil Kelurahan</h2>
          <div className="info-grid">
            <div className="info-card">
              <h3>🏛️ Sejarah</h3>
              <p>Sejarah Kelurahan Woloan Dua dari masa ke masa.</p>
            </div>
            <div className="info-card">
              <h3> Visi & Misi</h3>
              <p>Visi dan misi pemerintahan Kelurahan Woloan Dua.</p>
            </div>
            <div className="info-card">
              <h3>👥 Struktur Organisasi</h3>
              <p>Struktur organisasi dan perangkat kelurahan.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== INFOGRAFIS SECTION ===== */}
      <section className="info-section" id="infografis">
        <div className="container">
          <h2 className="section-title">Infografis</h2>
          <div className="info-grid">
            <div className="info-card">
              <h3>📊 Data Penduduk</h3>
              <p>Informasi statistik penduduk Kelurahan Woloan Dua.</p>
            </div>
            <div className="info-card">
              <h3>🗺️ Peta Wilayah</h3>
              <p>Peta wilayah dan batas-batas kelurahan.</p>
            </div>
            <div className="info-card">
              <h3>📈 Pembangunan</h3>
              <p>Program dan realisasi pembangunan kelurahan.</p>
            </div>
          </div>
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
          <div className="info-grid">
            <div className="info-card">
              <h3>📰 Kegiatan Kelurahan</h3>
              <p>Kegiatan dan pengumuman terkini dari Kelurahan Woloan Dua.</p>
              <a href="#" className="btn-link">Lihat Semua →</a>
            </div>
            <div className="info-card">
              <h3>🏛️ Pengumuman</h3>
              <p>Pengumuman resmi dari pemerintah kelurahan.</p>
              <a href="#" className="btn-link">Lihat Semua →</a>
            </div>
            <div className="info-card">
              <h3>🎯 Agenda</h3>
              <p>Agenda dan kegiatan mendatang.</p>
              <a href="#" className="btn-link">Lihat Semua →</a>
            </div>
          </div>
        </div>
      </section>

      {/* ===== TRANSPARANSI SECTION ===== */}
      <section className="info-section" id="transparansi">
        <div className="container">
          <h2 className="section-title">Transparansi</h2>
          <div className="info-grid">
            <div className="info-card">
              <h3>💰 APBDes</h3>
              <p>Informasi Anggaran Pendapatan dan Belanja Desa.</p>
              <a href="#" className="btn-link">Lihat Detail →</a>
            </div>
            <div className="info-card">
              <h3>📊 Laporan Keuangan</h3>
              <p>Laporan realisasi anggaran kelurahan.</p>
              <a href="#" className="btn-link">Lihat Laporan →</a>
            </div>
            <div className="info-card">
              <h3>📋 Program Kerja</h3>
              <p>Program kerja dan realisasinya.</p>
              <a href="#" className="btn-link">Lihat Program →</a>
            </div>
          </div>
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
              <h3>📄 Permohonan Informasi</h3>
              <p>Ajukan permohonan informasi publik.</p>
              <a href="#" className="btn-link">Ajukan →</a>
            </div>
            <div className="info-card">
              <h3>📊 Statistik Informasi</h3>
              <p>Statistik permohonan informasi publik.</p>
              <a href="#" className="btn-link">Lihat Statistik →</a>
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
                <li><a href="#profil">Profil Kelurahan</a></li>
                <li><a href="#layanan">Layanan</a></li>
                <li><a href="#berita">Berita</a></li>
                <li><a href="#transparansi">Transparansi</a></li>
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

export default App