import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'

function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation() // Untuk mendeteksi halaman aktif

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const menuItems = [
    { path: '/', label: 'Home' },
    { path: '/profil', label: 'Profil Desa' },
    { path: '/berita', label: 'Berita' },
    { path: '/layanan', label: 'Layanan' },
    { path: '/transparansi', label: 'Transparansi' }
  ]

  return (
    <nav className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`}>
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          <div className="logo-circle">🏘️</div>
          <div className="brand-text">
            <h1>Kelurahan Woloan Dua</h1>
            <p>Kota Tomohon</p>
          </div>
        </Link>

        <ul className="navbar-menu">
          {menuItems.map((item, index) => (
            <li key={index}>
              <Link to={item.path} className={location.pathname === item.path ? 'active' : ''}>
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
              <Link to={item.path} onClick={() => setMenuOpen(false)}>
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </nav>
  )
}

export default Navbar