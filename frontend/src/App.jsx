import { useState, useEffect } from 'react'
import './App.css'
import gunung from './assets/gunung.png'
import tomohon from './assets/tomohon.png'

function App() {
  // ==========================================
  // STATE WEBSITE PUBLIK
  // ==========================================
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [visitorCount] = useState(Math.floor(Math.random() * 50) + 20)
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [villageInfo, setVillageInfo] = useState(null)
  const [officials, setOfficials] = useState([])
  const [profileLoading, setProfileLoading] = useState(true)
  const [selectedArticle, setSelectedArticle] = useState(null)
  const [statistics, setStatistics] = useState([])
  const [galleries, setGalleries] = useState([])
  const [statsLoading, setStatsLoading] = useState(true)
  
  const [mapCoordinates, setMapCoordinates] = useState({ 
    lat: 1.315820000424215, 
    lng: 124.80444529717123,
    zoom: 16,
    address: 'Kelurahan Woloan Dua, Kecamatan Tomohon Barat, Kota Tomohon, Sulawesi Utara'
  })
  const [mapForm, setMapForm] = useState(mapCoordinates)

  // ==========================================
  // STATE ADMIN
  // ==========================================
  const [adminView, setAdminView] = useState('home')
  const [adminPage, setAdminPage] = useState('dashboard')
  const [adminToken, setAdminToken] = useState(localStorage.getItem('adminToken') || '')
  const [adminName, setAdminName] = useState(localStorage.getItem('adminName') || 'Administrator')
  const [darkMode, setDarkMode] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [showNotifications, setShowNotifications] = useState(false)
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [currentEditId, setCurrentEditId] = useState(null)
  const [adminLoading, setAdminLoading] = useState(false)
  const [adminError, setAdminError] = useState('')
  const [toasts, setToasts] = useState([])
  const [showModal, setShowModal] = useState(null)
  const [animatedStats, setAnimatedStats] = useState({ articles: 0, officials: 0, stats: 0, galleries: 0 })

  const [formData, setFormData] = useState({ title: '', content: '', author: 'Admin Kelurahan', image_url: '' })
  const [profileForm, setProfileForm] = useState({ name: '', description: '', address: '', phone: '' })
  const [officialForm, setOfficialForm] = useState({ name: '', position: '' })
  const [statForm, setStatForm] = useState({ category: '', value: '', year: new Date().getFullYear() })
  const [galleryForm, setGalleryForm] = useState({ title: '', image_url: '' })

  const slides = [
    { image: gunung, title: 'Selamat Datang', subtitle: 'Website Resmi Kelurahan Woloan Dua', description: 'Sumber informasi terbaru tentang pemerintahan di Kelurahan Woloan Dua, Kota Tomohon' },
    { image: gunung, title: 'Potensi Desa', subtitle: 'Kerajinan Ukiran Kayu', description: 'Woloan terkenal dengan kerajinan ukiran kayu dan anyaman bambu yang mendunia' },
    { image: gunung, title: 'Wisata Alam', subtitle: 'Keindahan Gunung Lokon', description: 'Nikmati pemandangan alam yang memukau dengan udara sejuk pegunungan' }
  ]

  // ==========================================
  // TOAST NOTIFICATION SYSTEM
  // ==========================================
  const showToast = (message, type = 'success') => {
    const id = Date.now()
    setToasts(prev => [...prev, { id, message, type }])
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000)
  }

  // ==========================================
  // ANIMATED COUNTER
  // ==========================================
  useEffect(() => {
    const targets = { articles: articles.length, officials: officials.length, stats: statistics.length, galleries: galleries.length }
    const duration = 1500
    const steps = 60
    const interval = duration / steps
    let step = 0
    const timer = setInterval(() => {
      step++
      const progress = step / steps
      setAnimatedStats({
        articles: Math.floor(targets.articles * progress),
        officials: Math.floor(targets.officials * progress),
        stats: Math.floor(targets.stats * progress),
        galleries: Math.floor(targets.galleries * progress)
      })
      if (step >= steps) clearInterval(timer)
    }, interval)
    return () => clearInterval(timer)
  }, [articles.length, officials.length, statistics.length, galleries.length])

  // ==========================================
  // USE EFFECT WEBSITE
  // ==========================================
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const timer = setInterval(() => setCurrentSlide((prev) => (prev + 1) % slides.length), 5000)
    return () => clearInterval(timer)
  }, [slides.length])

  useEffect(() => {
    fetch('http://localhost:5000/api/articles').then(res => res.json()).then(data => { if (data.success) setArticles(data.data); setLoading(false) }).catch(() => setLoading(false))
    fetch('http://localhost:5000/api/profile/info').then(res => res.json()).then(data => { if (data.success) { setVillageInfo(data.data); setProfileForm(data.data || {}) } setProfileLoading(false) }).catch(() => setProfileLoading(false))
    fetch('http://localhost:5000/api/profile/officials').then(res => res.json()).then(data => { if (data.success) setOfficials(data.data) }).catch(() => {})
    fetch('http://localhost:5000/api/stats/statistics').then(res => res.json()).then(data => { if (data.success) setStatistics(data.data); setStatsLoading(false) }).catch(() => setStatsLoading(false))
    fetch('http://localhost:5000/api/stats/galleries').then(res => res.json()).then(data => { if (data.success) setGalleries(data.data) }).catch(() => {})
    fetch('http://localhost:5000/api/profile/map')
      .then(res => res.json())
      .then(data => { 
        if (data.success) { 
          setMapCoordinates(data.data)
          setMapForm(data.data)
        } 
      })
      .catch(() => {})
  }, [])

  // ==========================================
  // FUNGSI WEBSITE
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
    { name: 'Peta', link: '#peta' },
    { name: 'Berita', link: '#berita' }, 
    { name: 'PPID', link: '#ppid' }
  ]

  const sortedOfficials = [...officials].sort((a, b) => {
    const priority = { 'Lurah': 1, 'Sekretaris Lurah': 2, 'Kepala Seksi Pemerintahan': 3, 'Kepala Seksi Pelayanan': 4, 'Kepala Seksi Kesejahteraan': 5 }
    return (priority[a.position] || 99) - (priority[b.position] || 99)
  })

  // ==========================================
  // FUNGSI ADMIN - AUTH
  // ==========================================
  const handleAdminLogin = async (e) => {
    e.preventDefault()
    setAdminError('')
    setAdminLoading(true)
    const formDataObj = new FormData(e.target)
    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: formDataObj.get('username'), password: formDataObj.get('password') })
      })
      const data = await res.json()
      if (res.ok && data.success) {
        localStorage.setItem('adminToken', data.token)
        localStorage.setItem('adminName', data.admin?.name || 'Administrator')
        setAdminToken(data.token)
        setAdminName(data.admin?.name || 'Administrator')
        setAdminView('admin')
        setAdminPage('dashboard')
        showToast('Login berhasil! Selamat datang 👋', 'success')
      } else {
        setAdminError(data.message || 'Login gagal')
        showToast('Login gagal', 'error')
      }
    } catch (err) {
      setAdminError('Gagal terhubung ke server')
      showToast('Server tidak terhubung', 'error')
    } finally { setAdminLoading(false) }
  }

  const handleAdminLogout = () => {
    localStorage.removeItem('adminToken')
    localStorage.removeItem('adminName')
    setAdminToken('')
    setAdminName('Administrator')
    setAdminView('home')
    setAdminPage('dashboard')
    showToast('Berhasil logout', 'info')
  }

  // ==========================================
  // FUNGSI ADMIN - CRUD
  // ==========================================
  const handleDeleteArticle = async (id) => {
    if (!window.confirm('Yakin ingin menghapus berita ini?')) return
    try {
      const res = await fetch(`http://localhost:5000/api/articles/${id}`, { method: 'DELETE', headers: { 'Authorization': adminToken } })
      if (res.ok) { setArticles(articles.filter(a => a.id !== id)); showToast('Berita berhasil dihapus', 'success') }
    } catch (err) { showToast('Gagal menghapus', 'error') }
  }

  const openAddForm = (type) => {
    setIsEditMode(false); setCurrentEditId(null)
    if (type === 'article') setFormData({ title: '', content: '', author: 'Admin Kelurahan', image_url: '' })
    if (type === 'official') setOfficialForm({ name: '', position: '' })
    if (type === 'stat') setStatForm({ category: '', value: '', year: new Date().getFullYear() })
    if (type === 'gallery') setGalleryForm({ title: '', image_url: '' })
    setAdminError(''); setShowModal(type)
  }

  const openEditForm = (type, item) => {
    setIsEditMode(true); setCurrentEditId(item.id)
    if (type === 'article') setFormData({ title: item.title || '', content: item.content || '', author: item.author || 'Admin Kelurahan', image_url: item.image_url || '' })
    if (type === 'official') setOfficialForm({ name: item.name || '', position: item.position || '' })
    if (type === 'stat') setStatForm({ category: item.category || '', value: item.value || '', year: item.year || new Date().getFullYear() })
    if (type === 'gallery') setGalleryForm({ title: item.title || '', image_url: item.image_url || '' })
    setAdminError(''); setShowModal(type)
  }

  const handleSaveArticle = async (e) => {
    e.preventDefault()
    setAdminLoading(true)
    try {
      const url = isEditMode ? `http://localhost:5000/api/articles/${currentEditId}` : 'http://localhost:5000/api/articles'
      const res = await fetch(url, {
        method: isEditMode ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': adminToken },
        body: JSON.stringify(formData)
      })
      if (res.ok) {
        showToast(isEditMode ? 'Berita diperbarui! ✏️' : 'Berita ditambahkan! 🎉', 'success')
        setShowModal(null)
        setIsEditMode(false)
        setCurrentEditId(null)
        const freshRes = await fetch('http://localhost:5000/api/articles')
        const freshData = await freshRes.json()
        if (freshData.success) setArticles(freshData.data)
      } else { showToast('Gagal menyimpan', 'error') }
    } catch (err) { showToast('Terjadi kesalahan', 'error') } finally { setAdminLoading(false) }
  }

  const handleAddOfficial = async (e) => {
    e.preventDefault()
    setAdminLoading(true)
    try {
      const url = isEditMode 
        ? `http://localhost:5000/api/profile/officials/${currentEditId}` 
        : 'http://localhost:5000/api/profile/officials'
      const method = isEditMode ? 'PUT' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', 'Authorization': adminToken },
        body: JSON.stringify(officialForm)
      })
      if (res.ok) {
        showToast(isEditMode ? 'Perangkat diperbarui! ✏️' : 'Perangkat ditambahkan! 👨‍💼', 'success')
        setShowModal(null)
        setIsEditMode(false)
        setCurrentEditId(null)
        const freshRes = await fetch('http://localhost:5000/api/profile/officials')
        const freshData = await freshRes.json()
        if (freshData.success) setOfficials(freshData.data)
      } else { showToast('Gagal menyimpan', 'error') }
    } catch (err) { showToast('Terjadi kesalahan', 'error') } finally { setAdminLoading(false) }
  }

  const handleDeleteOfficial = async (id) => {
    if (!window.confirm('Yakin ingin menghapus?')) return
    try {
      const res = await fetch(`http://localhost:5000/api/profile/officials/${id}`, { method: 'DELETE', headers: { 'Authorization': adminToken } })
      if (res.ok) { setOfficials(officials.filter(o => o.id !== id)); showToast('Perangkat dihapus', 'success') }
    } catch (err) { showToast('Gagal menghapus', 'error') }
  }

  const handleAddStat = async (e) => {
    e.preventDefault()
    setAdminLoading(true)
    try {
      const url = isEditMode 
        ? `http://localhost:5000/api/stats/statistics/${currentEditId}` 
        : 'http://localhost:5000/api/stats/statistics'
      const method = isEditMode ? 'PUT' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', 'Authorization': adminToken },
        body: JSON.stringify(statForm)
      })
      if (res.ok) {
        showToast(isEditMode ? 'Statistik diperbarui! ✏️' : 'Statistik ditambahkan! 📊', 'success')
        setShowModal(null)
        setIsEditMode(false)
        setCurrentEditId(null)
        const freshRes = await fetch('http://localhost:5000/api/stats/statistics')
        const freshData = await freshRes.json()
        if (freshData.success) setStatistics(freshData.data)
      } else { showToast('Gagal menyimpan', 'error') }
    } catch (err) { showToast('Terjadi kesalahan', 'error') } finally { setAdminLoading(false) }
  }

  const handleDeleteStat = async (id) => {
    if (!window.confirm('Yakin ingin menghapus?')) return
    try {
      const res = await fetch(`http://localhost:5000/api/stats/statistics/${id}`, { method: 'DELETE', headers: { 'Authorization': adminToken } })
      if (res.ok) { setStatistics(statistics.filter(s => s.id !== id)); showToast('Statistik dihapus', 'success') }
    } catch (err) { showToast('Gagal menghapus', 'error') }
  }

  const handleAddGallery = async (e) => {
    e.preventDefault()
    setAdminLoading(true)
    try {
      const url = isEditMode 
        ? `http://localhost:5000/api/stats/galleries/${currentEditId}` 
        : 'http://localhost:5000/api/stats/galleries'
      const method = isEditMode ? 'PUT' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', 'Authorization': adminToken },
        body: JSON.stringify(galleryForm)
      })
      if (res.ok) {
        showToast(isEditMode ? 'Foto diperbarui! ✏️' : 'Foto ditambahkan! 🖼️', 'success')
        setShowModal(null)
        setIsEditMode(false)
        setCurrentEditId(null)
        const freshRes = await fetch('http://localhost:5000/api/stats/galleries')
        const freshData = await freshRes.json()
        if (freshData.success) setGalleries(freshData.data)
      } else { showToast('Gagal menyimpan', 'error') }
    } catch (err) { showToast('Terjadi kesalahan', 'error') } finally { setAdminLoading(false) }
  }

  const handleDeleteGallery = async (id) => {
    if (!window.confirm('Yakin ingin menghapus?')) return
    try {
      const res = await fetch(`http://localhost:5000/api/stats/galleries/${id}`, { method: 'DELETE', headers: { 'Authorization': adminToken } })
      if (res.ok) { setGalleries(galleries.filter(g => g.id !== id)); showToast('Foto dihapus', 'success') }
    } catch (err) { showToast('Gagal menghapus', 'error') }
  }

  const handleSaveProfile = async (e) => {
    e.preventDefault()
    setAdminLoading(true)
    try {
      const res = await fetch('http://localhost:5000/api/profile/info', {
        method: 'PUT', headers: { 'Content-Type': 'application/json', 'Authorization': adminToken },
        body: JSON.stringify(profileForm)
      })
      if (res.ok) { setVillageInfo(profileForm); showToast('Profil diperbarui! 🏛️', 'success') }
      else { showToast('Gagal menyimpan', 'error') }
    } catch (err) { showToast('Terjadi kesalahan', 'error') } finally { setAdminLoading(false) }
  }

  // ==========================================
  // RENDER: LOGIN PAGE
  // ==========================================
  if (adminView === 'login') {
    return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #2d8a5e 0%, #1e5d3f 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', width: '300px', height: '300px', background: 'rgba(255,255,255,0.1)', borderRadius: '50%', top: '-100px', left: '-100px', animation: 'float 6s ease-in-out infinite' }}></div>
        <div style={{ position: 'absolute', width: '200px', height: '200px', background: 'rgba(255,255,255,0.1)', borderRadius: '50%', bottom: '-50px', right: '-50px', animation: 'float 8s ease-in-out infinite reverse' }}></div>
        <div style={{ background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(20px)', padding: '50px 40px', borderRadius: '24px', boxShadow: '0 25px 50px rgba(0,0,0,0.25)', width: '100%', maxWidth: '420px', position: 'relative', zIndex: 1, animation: 'slideUp 0.6s ease-out' }}>
          <div style={{ textAlign: 'center', marginBottom: '35px' }}>
            <div style={{ width: '90px', height: '90px', margin: '0 auto 20px', background: 'linear-gradient(135deg, #2d8a5e 0%, #1e5d3f 100%)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '45px', boxShadow: '0 10px 30px rgba(45, 138, 94, 0.4)', animation: 'pulse 2s ease-in-out infinite' }}>🔐</div>
            <h2 style={{ color: '#1e293b', marginBottom: '8px', fontSize: '32px', fontWeight: '800' }}>Login Admin</h2>
            <p style={{ color: '#64748b', fontSize: '14px' }}>Kelurahan Woloan Dua, Kota Tomohon</p>
          </div>
          {adminError && (
            <div style={{ background: '#fee2e2', color: '#dc2626', padding: '14px', borderRadius: '12px', marginBottom: '20px', fontSize: '14px', borderLeft: '4px solid #dc2626', animation: 'shake 0.5s' }}>⚠️ {adminError}</div>
          )}
          <form onSubmit={handleAdminLogin}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', color: '#374151', fontWeight: '600', fontSize: '14px' }}>Username</label>
              <input name="username" placeholder="Masukkan username" required style={{ width: '100%', padding: '14px 16px', border: '2px solid #e2e8f0', borderRadius: '12px', fontSize: '15px', boxSizing: 'border-box', outline: 'none', transition: 'all 0.3s' }} onFocus={(e) => e.target.style.borderColor = '#2d8a5e'} onBlur={(e) => e.target.style.borderColor = '#e2e8f0'} />
            </div>
            <div style={{ marginBottom: '25px' }}>
              <label style={{ display: 'block', marginBottom: '8px', color: '#374151', fontWeight: '600', fontSize: '14px' }}>Password</label>
              <input name="password" type="password" placeholder="Masukkan password" required style={{ width: '100%', padding: '14px 16px', border: '2px solid #e2e8f0', borderRadius: '12px', fontSize: '15px', boxSizing: 'border-box', outline: 'none', transition: 'all 0.3s' }} onFocus={(e) => e.target.style.borderColor = '#2d8a5e'} onBlur={(e) => e.target.style.borderColor = '#e2e8f0'} />
            </div>
            <button type="submit" disabled={adminLoading} style={{ width: '100%', padding: '16px', background: 'linear-gradient(135deg, #2d8a5e 0%, #1e5d3f 100%)', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 'bold', fontSize: '16px', cursor: adminLoading ? 'not-allowed' : 'pointer', boxShadow: '0 10px 25px rgba(45, 138, 94, 0.4)', transition: 'all 0.3s', transform: adminLoading ? 'scale(0.98)' : 'scale(1)' }}>
              {adminLoading ? ' Memproses...' : 'Masuk ke Dashboard'}
            </button>
          </form>
          <button onClick={() => setAdminView('home')} style={{ width: '100%', marginTop: '15px', padding: '12px', background: 'transparent', border: '2px solid #e2e8f0', borderRadius: '12px', color: '#64748b', cursor: 'pointer', fontSize: '14px', fontWeight: '600', transition: 'all 0.3s' }} onMouseEnter={(e) => { e.target.style.background = '#f0fdf4'; e.target.style.borderColor = '#2d8a5e' }} onMouseLeave={(e) => { e.target.style.background = 'transparent'; e.target.style.borderColor = '#e2e8f0' }}>
            Kembali ke Website
          </button>
        </div>
        <style>{`
          @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-20px); } }
          @keyframes slideUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
          @keyframes pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.05); } }
          @keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-10px); } 75% { transform: translateX(10px); } }
        `}</style>
      </div>
    )
  }

  // ==========================================
  // RENDER: ADMIN LAYOUT
  // ==========================================
  const adminMenuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊', color: '#2d8a5e' },
    { id: 'profile', label: 'Profil Kelurahan', icon: '🏛️', color: '#10b981' },
    { id: 'officials', label: 'Perangkat Desa', icon: '👨‍💼', color: '#059669' },
    { id: 'stats', label: 'Statistik', icon: '📈', color: '#14b8a6' },
    { id: 'galleries', label: 'Galeri Foto', icon: '🖼️', color: '#0d9488' },
    { id: 'map', label: 'Peta Desa', icon: '️', color: '#059669' }, 
    { id: 'articles', label: 'Berita', icon: '📰', color: '#1e5d3f' }
  ]

  const AdminLayout = ({ children, title }) => (
    <div style={{ minHeight: '100vh', background: darkMode ? '#0f172a' : '#f1f5f9', display: 'flex', transition: 'all 0.3s' }}>
      <aside style={{ 
        width: sidebarCollapsed ? '80px' : '280px', 
        background: darkMode ? 'linear-gradient(180deg, #1e293b 0%, #0f172a 100%)' : 'linear-gradient(180deg, #2d8a5e 0%, #1e5d3f 100%)',
        color: 'white', padding: '20px 0', position: 'fixed', height: '100vh', overflowY: 'auto',
        transition: 'all 0.3s ease', zIndex: 100, boxShadow: '4px 0 20px rgba(0,0,0,0.1)'
      }}>
        <div style={{ padding: '0 20px 20px', borderBottom: '1px solid rgba(255,255,255,0.1)', marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {!sidebarCollapsed && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <img src={tomohon} alt="Logo Tomohon" style={{ width: '45px', height: '45px', objectFit: 'contain', flexShrink: 0, filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' }} />
              <div>
                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '700' }}>Admin Panel</h3>
                <p style={{ margin: 0, fontSize: '11px', opacity: 0.8 }}>Kelurahan Woloan Dua</p>
              </div>
            </div>
          )}
          <button onClick={() => setSidebarCollapsed(!sidebarCollapsed)} style={{ background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white', width: '32px', height: '32px', borderRadius: '8px', cursor: 'pointer', fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {sidebarCollapsed ? '→' : '←'}
          </button>
        </div>
        <nav style={{ padding: '0 10px' }}>
          {adminMenuItems.map(item => (
            <button key={item.id} onClick={() => setAdminPage(item.id)} style={{
              width: '100%', padding: sidebarCollapsed ? '14px 0' : '14px 16px', 
              background: adminPage === item.id ? 'rgba(255,255,255,0.2)' : 'transparent',
              color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer',
              textAlign: sidebarCollapsed ? 'center' : 'left', fontSize: '14px', fontWeight: adminPage === item.id ? '700' : '500',
              display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '6px',
              transition: 'all 0.3s', boxShadow: adminPage === item.id ? '0 4px 15px rgba(0,0,0,0.2)' : 'none'
            }} onMouseEnter={(e) => { if (adminPage !== item.id) e.target.style.background = 'rgba(255,255,255,0.1)' }} onMouseLeave={(e) => { if (adminPage !== item.id) e.target.style.background = 'transparent' }}>
              <span style={{ fontSize: '20px' }}>{item.icon}</span>
              {!sidebarCollapsed && <span>{item.label}</span>}
            </button>
          ))}
        </nav>
        <div style={{ padding: '20px 10px', borderTop: '1px solid rgba(255,255,255,0.1)', marginTop: '20px' }}>
          <button onClick={() => setAdminView('home')} style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.15)', color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer', fontSize: '13px', marginBottom: '8px', display: 'flex', alignItems: 'center', justifyContent: sidebarCollapsed ? 'center' : 'flex-start', gap: '10px', fontWeight: '600' }}>
            <span>🌐</span> {!sidebarCollapsed && 'Lihat Website'}
          </button>
          <button onClick={handleAdminLogout} style={{ width: '100%', padding: '12px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer', fontSize: '13px', display: 'flex', alignItems: 'center', justifyContent: sidebarCollapsed ? 'center' : 'flex-start', gap: '10px', fontWeight: '600' }}>
            <span></span> {!sidebarCollapsed && 'Logout'}
          </button>
        </div>
      </aside>
      <div style={{ marginLeft: sidebarCollapsed ? '80px' : '280px', flex: 1, transition: 'all 0.3s' }}>
        <header style={{ 
          background: darkMode ? '#1e293b' : 'white',
          padding: '16px 30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          boxShadow: '0 2px 10px rgba(0,0,0,0.05)', position: 'sticky', top: 0, zIndex: 50
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <h2 style={{ color: darkMode ? 'white' : '#1e293b', margin: 0, fontSize: '22px', fontWeight: '800' }}>{title}</h2>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <input type="text" placeholder=" Cari..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
              style={{ padding: '10px 16px', border: `2px solid ${darkMode ? '#334155' : '#e2e8f0'}`, borderRadius: '12px', background: darkMode ? '#0f172a' : '#f8fafc', color: darkMode ? 'white' : '#1e293b', outline: 'none', width: '200px', fontSize: '14px' }} />
            <button onClick={() => setDarkMode(!darkMode)} style={{ 
              width: '42px', height: '42px', borderRadius: '12px', border: 'none',
              background: darkMode ? 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)' : 'linear-gradient(135deg, #1e293b 0%, #334155 100%)', 
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.3s', boxShadow: '0 4px 15px rgba(0,0,0,0.15)'
            }} onMouseEnter={(e) => e.target.style.transform = 'scale(1.1) rotate(15deg)'} onMouseLeave={(e) => e.target.style.transform = 'scale(1) rotate(0deg)'} title={darkMode ? 'Aktifkan Mode Terang' : 'Aktifkan Mode Gelap'}>
              {darkMode ? (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1e293b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="5"></circle>
                  <line x1="12" y1="1" x2="12" y2="3"></line>
                  <line x1="12" y1="21" x2="12" y2="23"></line>
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                  <line x1="1" y1="12" x2="3" y2="12"></line>
                  <line x1="21" y1="12" x2="23" y2="12"></line>
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                </svg>
              ) : (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                </svg>
              )}
            </button>
            <div style={{ position: 'relative' }}>
              <button onClick={() => setShowNotifications(!showNotifications)} style={{ 
                width: '42px', height: '42px', borderRadius: '12px', border: 'none',
                background: darkMode ? '#334155' : '#f1f5f9', cursor: 'pointer', fontSize: '18px',
                position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                🔔
                <span style={{ position: 'absolute', top: '8px', right: '8px', width: '10px', height: '10px', background: '#ef4444', borderRadius: '50%', border: `2px solid ${darkMode ? '#1e293b' : 'white'}` }}></span>
              </button>
              {showNotifications && (
                <div style={{ position: 'absolute', top: '55px', right: 0, width: '300px', background: darkMode ? '#1e293b' : 'white', borderRadius: '16px', boxShadow: '0 10px 40px rgba(0,0,0,0.15)', padding: '16px', zIndex: 200, border: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}` }}>
                  <h4 style={{ margin: '0 0 12px', color: darkMode ? 'white' : '#1e293b', fontSize: '15px' }}>🔔 Notifikasi</h4>
                  <div style={{ padding: '12px', background: darkMode ? '#0f172a' : '#f0fdf4', borderRadius: '10px', marginBottom: '8px' }}>
                    <p style={{ margin: 0, fontSize: '13px', color: darkMode ? 'white' : '#1e293b' }}>✅ Sistem berjalan normal</p>
                    <p style={{ margin: '4px 0 0', fontSize: '11px', color: '#64748b' }}>Baru saja</p>
                  </div>
                  <div style={{ padding: '12px', background: darkMode ? '#0f172a' : '#fef3c7', borderRadius: '10px' }}>
                    <p style={{ margin: 0, fontSize: '13px', color: darkMode ? 'white' : '#1e293b' }}>📊 {articles.length} berita aktif</p>
                    <p style={{ margin: '4px 0 0', fontSize: '11px', color: '#64748b' }}>Hari ini</p>
                  </div>
                </div>
              )}
            </div>
            <div style={{ position: 'relative' }}>
              <button onClick={() => setShowProfileMenu(!showProfileMenu)} style={{ 
                display: 'flex', alignItems: 'center', gap: '10px', padding: '6px 12px 6px 6px',
                background: darkMode ? '#334155' : '#f1f5f9', border: 'none', borderRadius: '30px', cursor: 'pointer'
              }}>
                <div style={{ width: '36px', height: '36px', background: 'linear-gradient(135deg, #2d8a5e 0%, #1e5d3f 100%)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', fontSize: '14px' }}>
                  {adminName.charAt(0).toUpperCase()}
                </div>
                <span style={{ color: darkMode ? 'white' : '#1e293b', fontSize: '14px', fontWeight: '600' }}>{adminName}</span>
              </button>
              {showProfileMenu && (
                <div style={{ position: 'absolute', top: '55px', right: 0, width: '200px', background: darkMode ? '#1e293b' : 'white', borderRadius: '16px', boxShadow: '0 10px 40px rgba(0,0,0,0.15)', padding: '8px', zIndex: 200, border: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}` }}>
                  <div style={{ padding: '12px', borderBottom: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`, marginBottom: '8px' }}>
                    <p style={{ margin: 0, fontWeight: '700', color: darkMode ? 'white' : '#1e293b', fontSize: '14px' }}>{adminName}</p>
                    <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#64748b' }}>Administrator</p>
                  </div>
                  <button onClick={() => { setShowProfileMenu(false); setAdminPage('profile'); }} style={{ width: '100%', padding: '10px', background: 'transparent', border: 'none', color: darkMode ? 'white' : '#1e293b', cursor: 'pointer', textAlign: 'left', fontSize: '13px', borderRadius: '8px' }}>⚙️ Pengaturan</button>
                  <button onClick={handleAdminLogout} style={{ width: '100%', padding: '10px', background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', textAlign: 'left', fontSize: '13px', borderRadius: '8px' }}>🚪 Logout</button>
                </div>
              )}
            </div>
          </div>
        </header>
        <div style={{ padding: '30px' }}>{children}</div>
      </div>
    </div>
  )

  // ==========================================
  // RENDER: DASHBOARD
  // ==========================================
  if (adminView === 'admin' && adminPage === 'dashboard') {
    const stats = [
      { label: 'Total Berita', value: animatedStats.articles, icon: '📰', color: 'linear-gradient(135deg, #2d8a5e 0%, #1e5d3f 100%)', bg: '#dcfce7', change: '+12%' },
      { label: 'Perangkat Desa', value: animatedStats.officials, icon: '👨‍💼', color: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', bg: '#d1fae5', change: '+5%' },
      { label: 'Data Statistik', value: animatedStats.stats, icon: '', color: 'linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)', bg: '#ccfbf1', change: '+8%' },
      { label: 'Foto Galeri', value: animatedStats.galleries, icon: '️', color: 'linear-gradient(135deg, #059669 0%, #047857 100%)', bg: '#a7f3d0', change: '+15%' }
    ]
    return (
      <AdminLayout title="Dashboard">
        <div style={{ background: 'linear-gradient(135deg, #2d8a5e 0%, #1e5d3f 100%)', borderRadius: '24px', padding: '40px', marginBottom: '30px', color: 'white', position: 'relative', overflow: 'hidden', boxShadow: '0 20px 40px rgba(45, 138, 94, 0.3)' }}>
          <div style={{ position: 'absolute', top: 0, right: 0, width: '300px', height: '100%', backgroundImage: `url(${gunung})`, backgroundSize: 'cover', opacity: 0.15 }}></div>
          <div style={{ position: 'relative', zIndex: 1 }}>
            <h1 style={{ fontSize: '36px', marginBottom: '10px', fontWeight: '800' }}>Selamat Datang, {adminName}! </h1>
            <p style={{ fontSize: '16px', opacity: 0.9, marginBottom: '25px' }}>Kelola konten website Kelurahan Woloan Dua</p>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <button onClick={() => setAdminPage('articles')} style={{ padding: '14px 28px', background: 'white', color: '#2d8a5e', border: 'none', borderRadius: '12px', fontWeight: 'bold', fontSize: '15px', cursor: 'pointer', boxShadow: '0 4px 15px rgba(0,0,0,0.2)' }} onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'} onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}> Kelola Berita</button>
              <button onClick={() => setAdminPage('profile')} style={{ padding: '14px 28px', background: 'rgba(255,255,255,0.2)', color: 'white', border: '2px solid rgba(255,255,255,0.3)', borderRadius: '12px', fontWeight: 'bold', fontSize: '15px', cursor: 'pointer' }} onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.3)'} onMouseLeave={(e) => e.target.style.background = 'rgba(255,255,255,0.2)'}>🏛️ Edit Profil</button>
            </div>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '30px' }}>
          {stats.map((stat, i) => (
            <div key={i} style={{ background: darkMode ? '#1e293b' : 'white', padding: '25px', borderRadius: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', transition: 'all 0.3s', cursor: 'pointer', border: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}` }} onMouseEnter={(e) => { e.target.style.transform = 'translateY(-5px)'; e.target.style.boxShadow = '0 10px 30px rgba(0,0,0,0.1)' }} onMouseLeave={(e) => { e.target.style.transform = 'translateY(0)'; e.target.style.boxShadow = '0 4px 20px rgba(0,0,0,0.05)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
                <div>
                  <p style={{ color: darkMode ? '#94a3b8' : '#64748b', fontSize: '13px', margin: '0 0 8px', fontWeight: '600' }}>{stat.label}</p>
                  <h3 style={{ color: darkMode ? 'white' : '#1e293b', fontSize: '36px', margin: 0, fontWeight: '800' }}>{stat.value}</h3>
                </div>
                <div style={{ width: '55px', height: '55px', background: stat.bg, borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px' }}>{stat.icon}</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ color: '#10b981', fontSize: '13px', fontWeight: '700' }}>↑ {stat.change}</span>
                <span style={{ color: darkMode ? '#64748b' : '#94a3b8', fontSize: '12px' }}>dari bulan lalu</span>
              </div>
            </div>
          ))}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
          <div style={{ background: darkMode ? '#1e293b' : 'white', borderRadius: '20px', padding: '25px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', border: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}` }}>
            <h3 style={{ color: darkMode ? 'white' : '#1e293b', marginBottom: '20px', fontSize: '18px', fontWeight: '700' }}>⚡ Aksi Cepat</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
              {[
                { label: 'Tambah Berita', icon: '📰', color: '#2d8a5e', action: () => openAddForm('article') },
                { label: 'Tambah Perangkat', icon: '👨‍💼', color: '#10b981', action: () => openAddForm('official') },
                { label: 'Tambah Statistik', icon: '📈', color: '#14b8a6', action: () => openAddForm('stat') },
                { label: 'Tambah Foto', icon: '🖼️', color: '#059669', action: () => openAddForm('gallery') }
              ].map((action, i) => (
                <button key={i} onClick={action.action} style={{ padding: '20px', background: darkMode ? '#0f172a' : '#f8fafc', border: `2px solid ${darkMode ? '#334155' : '#e2e8f0'}`, borderRadius: '16px', cursor: 'pointer', textAlign: 'left', transition: 'all 0.3s', display: 'flex', alignItems: 'center', gap: '15px' }} onMouseEnter={(e) => { e.target.style.borderColor = action.color; e.target.style.transform = 'translateY(-3px)' }} onMouseLeave={(e) => { e.target.style.borderColor = darkMode ? '#334155' : '#e2e8f0'; e.target.style.transform = 'translateY(0)' }}>
                  <div style={{ width: '45px', height: '45px', background: action.color, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px' }}>{action.icon}</div>
                  <span style={{ color: darkMode ? 'white' : '#1e293b', fontWeight: '600', fontSize: '14px' }}>{action.label}</span>
                </button>
              ))}
            </div>
          </div>
          <div style={{ background: darkMode ? '#1e293b' : 'white', borderRadius: '20px', padding: '25px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', border: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}` }}>
            <h3 style={{ color: darkMode ? 'white' : '#1e293b', marginBottom: '20px', fontSize: '18px', fontWeight: '700' }}> Status Sistem</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {[
                { label: 'Server Backend', status: 'Online', color: '#10b981', icon: '✅' },
                { label: 'Database MySQL', status: 'Terhubung', color: '#10b981', icon: '🗄️' },
                { label: 'Kunjungan Hari Ini', status: visitorCount, color: '#2d8a5e', icon: '👥' },
                { label: 'Total Konten', status: articles.length + statistics.length + galleries.length, color: '#059669', icon: '' }
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: darkMode ? '#0f172a' : '#f8fafc', borderRadius: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '20px' }}>{item.icon}</span>
                    <span style={{ color: darkMode ? 'white' : '#1e293b', fontSize: '13px', fontWeight: '600' }}>{item.label}</span>
                  </div>
                  <span style={{ color: item.color, fontSize: '13px', fontWeight: '700' }}>{item.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </AdminLayout>
    )
  }

  // ==========================================
  // RENDER: KELOLA PROFIL
  // ==========================================
  if (adminView === 'admin' && adminPage === 'profile') {
    return (
      <AdminLayout title="Kelola Profil Kelurahan">
        <div style={{ background: darkMode ? '#1e293b' : 'white', borderRadius: '20px', padding: '30px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', border: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '30px', paddingBottom: '20px', borderBottom: `2px solid ${darkMode ? '#334155' : '#f1f5f9'}` }}>
            <div style={{ width: '80px', height: '80px', background: 'linear-gradient(135deg, #2d8a5e 0%, #1e5d3f 100%)', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '40px' }}>🏛️</div>
            <div>
              <h3 style={{ color: darkMode ? 'white' : '#1e293b', margin: 0, fontSize: '22px', fontWeight: '800' }}>Informasi Kelurahan</h3>
              <p style={{ color: darkMode ? '#94a3b8' : '#64748b', margin: '5px 0 0', fontSize: '14px' }}>Edit informasi dasar kelurahan</p>
            </div>
          </div>
          <form onSubmit={handleSaveProfile}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: darkMode ? 'white' : '#374151', fontWeight: '600', fontSize: '14px' }}>📛 Nama Kelurahan</label>
                <input type="text" value={profileForm.name || ''} onChange={e => setProfileForm({...profileForm, name: e.target.value})} required style={{ width: '100%', padding: '14px', border: `2px solid ${darkMode ? '#334155' : '#e2e8f0'}`, borderRadius: '12px', background: darkMode ? '#0f172a' : 'white', color: darkMode ? 'white' : '#1e293b', boxSizing: 'border-box', outline: 'none', fontSize: '15px' }} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: darkMode ? 'white' : '#374151', fontWeight: '600', fontSize: '14px' }}>📞 Telepon</label>
                <input type="text" value={profileForm.phone || ''} onChange={e => setProfileForm({...profileForm, phone: e.target.value})} required style={{ width: '100%', padding: '14px', border: `2px solid ${darkMode ? '#334155' : '#e2e8f0'}`, borderRadius: '12px', background: darkMode ? '#0f172a' : 'white', color: darkMode ? 'white' : '#1e293b', boxSizing: 'border-box', outline: 'none', fontSize: '15px' }} />
              </div>
            </div>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', color: darkMode ? 'white' : '#374151', fontWeight: '600', fontSize: '14px' }}>📍 Alamat</label>
              <input type="text" value={profileForm.address || ''} onChange={e => setProfileForm({...profileForm, address: e.target.value})} required style={{ width: '100%', padding: '14px', border: `2px solid ${darkMode ? '#334155' : '#e2e8f0'}`, borderRadius: '12px', background: darkMode ? '#0f172a' : 'white', color: darkMode ? 'white' : '#1e293b', boxSizing: 'border-box', outline: 'none', fontSize: '15px' }} />
            </div>
            <div style={{ marginBottom: '25px' }}>
              <label style={{ display: 'block', marginBottom: '8px', color: darkMode ? 'white' : '#374151', fontWeight: '600', fontSize: '14px' }}>📝 Deskripsi</label>
              <textarea value={profileForm.description || ''} onChange={e => setProfileForm({...profileForm, description: e.target.value})} required rows="5" style={{ width: '100%', padding: '14px', border: `2px solid ${darkMode ? '#334155' : '#e2e8f0'}`, borderRadius: '12px', background: darkMode ? '#0f172a' : 'white', color: darkMode ? 'white' : '#1e293b', boxSizing: 'border-box', outline: 'none', fontFamily: 'inherit', fontSize: '15px', resize: 'vertical' }}></textarea>
            </div>
            <button type="submit" disabled={adminLoading} style={{ padding: '14px 32px', background: 'linear-gradient(135deg, #2d8a5e 0%, #1e5d3f 100%)', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 'bold', fontSize: '15px', cursor: adminLoading ? 'not-allowed' : 'pointer', boxShadow: '0 4px 15px rgba(45, 138, 94, 0.4)' }}>
              {adminLoading ? '⏳ Menyimpan...' : '💾 Simpan Perubahan'}
            </button>
          </form>
        </div>
      </AdminLayout>
    )
  }

  // ==========================================
  // RENDER: KELOLA PERANGKAT
  // ==========================================
  if (adminView === 'admin' && adminPage === 'officials') {
    const filteredOfficials = sortedOfficials.filter(o => o.name.toLowerCase().includes(searchQuery.toLowerCase()) || o.position.toLowerCase().includes(searchQuery.toLowerCase()))
    return (
      <AdminLayout title="Kelola Perangkat Desa">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
          <div>
            <h3 style={{ color: darkMode ? 'white' : '#1e293b', margin: 0, fontSize: '20px', fontWeight: '800' }}>Daftar Perangkat ({filteredOfficials.length})</h3>
            <p style={{ color: darkMode ? '#94a3b8' : '#64748b', margin: '5px 0 0', fontSize: '14px' }}>Kelola struktur organisasi kelurahan</p>
          </div>
          <button onClick={() => openAddForm('official')} style={{ padding: '14px 28px', background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 15px rgba(16, 185, 129, 0.4)', display: 'flex', alignItems: 'center', gap: '8px' }}>➕ Tambah Perangkat</button>
        </div>
        {filteredOfficials.length === 0 ? (
          <div style={{ background: darkMode ? '#1e293b' : 'white', borderRadius: '20px', padding: '60px 20px', textAlign: 'center', border: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}` }}>
            <div style={{ fontSize: '60px', marginBottom: '15px' }}>👨‍</div>
            <p style={{ color: darkMode ? '#94a3b8' : '#64748b', fontSize: '16px' }}>{searchQuery ? 'Tidak ada hasil pencarian' : 'Belum ada data perangkat'}</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
            {filteredOfficials.map((official) => (
              <div key={official.id} style={{ background: darkMode ? '#1e293b' : 'white', borderRadius: '20px', padding: '25px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', border: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`, transition: 'all 0.3s', position: 'relative', overflow: 'hidden' }} onMouseEnter={(e) => { e.target.style.transform = 'translateY(-5px)'; e.target.style.boxShadow = '0 10px 30px rgba(0,0,0,0.1)' }} onMouseLeave={(e) => { e.target.style.transform = 'translateY(0)'; e.target.style.boxShadow = '0 4px 20px rgba(0,0,0,0.05)' }}>
                <div style={{ position: 'absolute', top: 0, right: 0, width: '80px', height: '80px', background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', borderRadius: '0 0 0 80px', opacity: 0.1 }}></div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px' }}>
                  <div style={{ width: '55px', height: '55px', background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '24px', fontWeight: 'bold' }}>{official.name.charAt(0).toUpperCase()}</div>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ color: darkMode ? 'white' : '#1e293b', margin: 0, fontSize: '16px', fontWeight: '700' }}>{official.name}</h4>
                    <p style={{ color: '#10b981', margin: '4px 0 0', fontSize: '13px', fontWeight: '600' }}>{official.position}</p>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={() => openEditForm('official', official)} style={{ flex: 1, padding: '10px', background: '#10b981', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontSize: '13px', fontWeight: '600' }}>✏️ Edit</button>
                  <button onClick={() => handleDeleteOfficial(official.id)} style={{ flex: 1, padding: '10px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontSize: '13px', fontWeight: '600' }}>🗑️ Hapus</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </AdminLayout>
    )
  }

  // ==========================================
  // RENDER: KELOLA STATISTIK
  // ==========================================
  if (adminView === 'admin' && adminPage === 'stats') {
    const filteredStats = statistics.filter(s => s.category.toLowerCase().includes(searchQuery.toLowerCase()))
    return (
      <AdminLayout title="Kelola Statistik">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
          <div>
            <h3 style={{ color: darkMode ? 'white' : '#1e293b', margin: 0, fontSize: '20px', fontWeight: '800' }}>Data Statistik ({filteredStats.length})</h3>
            <p style={{ color: darkMode ? '#94a3b8' : '#64748b', margin: '5px 0 0', fontSize: '14px' }}>Infografis dan data kelurahan</p>
          </div>
          <button onClick={() => openAddForm('stat')} style={{ padding: '14px 28px', background: 'linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 15px rgba(20, 184, 166, 0.4)', display: 'flex', alignItems: 'center', gap: '8px' }}>➕ Tambah Statistik</button>
        </div>
        {filteredStats.length === 0 ? (
          <div style={{ background: darkMode ? '#1e293b' : 'white', borderRadius: '20px', padding: '60px 20px', textAlign: 'center', border: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}` }}>
            <div style={{ fontSize: '60px', marginBottom: '15px' }}>📈</div>
            <p style={{ color: darkMode ? '#94a3b8' : '#64748b', fontSize: '16px' }}>Belum ada data statistik</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
            {filteredStats.map((stat) => (
              <div key={stat.id} style={{ background: darkMode ? '#1e293b' : 'white', borderRadius: '20px', padding: '25px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', border: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`, transition: 'all 0.3s', textAlign: 'center' }} onMouseEnter={(e) => { e.target.style.transform = 'translateY(-5px)'; e.target.style.boxShadow = '0 10px 30px rgba(0,0,0,0.1)' }} onMouseLeave={(e) => { e.target.style.transform = 'translateY(0)'; e.target.style.boxShadow = '0 4px 20px rgba(0,0,0,0.05)' }}>
                <div style={{ width: '70px', height: '70px', margin: '0 auto 15px', background: 'linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px' }}>📊</div>
                <h3 style={{ color: darkMode ? 'white' : '#1e293b', fontSize: '32px', margin: '0 0 8px', fontWeight: '800' }}>{stat.value}</h3>
                <p style={{ color: '#14b8a6', margin: '0 0 8px', fontSize: '14px', fontWeight: '700' }}>{stat.category}</p>
                <p style={{ color: darkMode ? '#94a3b8' : '#64748b', margin: '0 0 20px', fontSize: '12px' }}>Tahun {stat.year}</p>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={() => openEditForm('stat', stat)} style={{ flex: 1, padding: '10px', background: '#14b8a6', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontSize: '13px', fontWeight: '600' }}>✏️ Edit</button>
                  <button onClick={() => handleDeleteStat(stat.id)} style={{ flex: 1, padding: '10px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontSize: '13px', fontWeight: '600' }}>🗑️</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </AdminLayout>
    )
  }

  // ==========================================
  // RENDER: KELOLA GALERI
  // ==========================================
  if (adminView === 'admin' && adminPage === 'galleries') {
    const filteredGalleries = galleries.filter(g => g.title.toLowerCase().includes(searchQuery.toLowerCase()))
    return (
      <AdminLayout title="Kelola Galeri Foto">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
          <div>
            <h3 style={{ color: darkMode ? 'white' : '#1e293b', margin: 0, fontSize: '20px', fontWeight: '800' }}>Galeri Foto ({filteredGalleries.length})</h3>
            <p style={{ color: darkMode ? '#94a3b8' : '#64748b', margin: '5px 0 0', fontSize: '14px' }}>Dokumentasi kegiatan kelurahan</p>
          </div>
          <button onClick={() => openAddForm('gallery')} style={{ padding: '14px 28px', background: 'linear-gradient(135deg, #059669 0%, #047857 100%)', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 15px rgba(5, 150, 105, 0.4)', display: 'flex', alignItems: 'center', gap: '8px' }}>🖼️ Tambah Foto</button>
        </div>
        {filteredGalleries.length === 0 ? (
          <div style={{ background: darkMode ? '#1e293b' : 'white', borderRadius: '20px', padding: '60px 20px', textAlign: 'center', border: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}` }}>
            <div style={{ fontSize: '60px', marginBottom: '15px' }}>🖼️</div>
            <p style={{ color: darkMode ? '#94a3b8' : '#64748b', fontSize: '16px' }}>Belum ada foto</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
            {filteredGalleries.map((photo, i) => (
              <div key={photo.id} style={{ background: darkMode ? '#1e293b' : 'white', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', border: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`, transition: 'all 0.3s' }} onMouseEnter={(e) => { e.target.style.transform = 'translateY(-5px)'; e.target.style.boxShadow = '0 10px 30px rgba(0,0,0,0.15)' }} onMouseLeave={(e) => { e.target.style.transform = 'translateY(0)'; e.target.style.boxShadow = '0 4px 20px rgba(0,0,0,0.05)' }}>
                <div style={{ height: '180px', overflow: 'hidden', position: 'relative' }}>
                  <img src={photo.image_url} alt={photo.title} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s' }} onMouseEnter={(e) => e.target.style.transform = 'scale(1.1)'} onMouseLeave={(e) => e.target.style.transform = 'scale(1)'} />
                  <div style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(0,0,0,0.7)', color: 'white', padding: '6px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: '600' }}>#{i + 1}</div>
                </div>
                <div style={{ padding: '20px' }}>
                  <h4 style={{ color: darkMode ? 'white' : '#1e293b', margin: '0 0 15px', fontSize: '15px', fontWeight: '700' }}>{photo.title}</h4>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={() => openEditForm('gallery', photo)} style={{ flex: 1, padding: '10px', background: '#059669', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontSize: '13px', fontWeight: '600' }}>✏️ Edit</button>
                    <button onClick={() => handleDeleteGallery(photo.id)} style={{ flex: 1, padding: '10px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontSize: '13px', fontWeight: '600' }}>🗑️ Hapus</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </AdminLayout>
    )
  }

  // ==========================================
  // RENDER: KELOLA PETA DESA
  // ==========================================
  if (adminView === 'admin' && adminPage === 'map') {
    return (
      <AdminLayout title="Kelola Peta Desa">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '25px' }}>
          <div style={{ background: darkMode ? '#1e293b' : 'white', borderRadius: '20px', padding: '30px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', border: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '25px' }}>
              <div style={{ width: '60px', height: '60px', background: 'linear-gradient(135deg, #059669 0%, #047857 100%)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '30px' }}>🗺️</div>
              <div>
                <h3 style={{ color: darkMode ? 'white' : '#1e293b', margin: 0, fontSize: '22px', fontWeight: '800' }}>Koordinat Peta</h3>
                <p style={{ color: darkMode ? '#94a3b8' : '#64748b', margin: '5px 0 0', fontSize: '14px' }}>Atur lokasi kelurahan di peta</p>
              </div>
            </div>
            <form onSubmit={async (e) => {
              e.preventDefault()
              setAdminLoading(true)
              try {
                const res = await fetch('http://localhost:5000/api/profile/map', {
                  method: 'PUT',
                  headers: { 'Content-Type': 'application/json', 'Authorization': adminToken },
                  body: JSON.stringify(mapForm)
                })
                if (res.ok) {
                  setMapCoordinates(mapForm)
                  showToast('Peta berhasil diperbarui! ️', 'success')
                } else { showToast('Gagal menyimpan', 'error') }
              } catch (err) { showToast('Terjadi kesalahan', 'error') } finally { setAdminLoading(false) }
            }}>
              <div style={{ marginBottom: '18px' }}>
                <label style={{ display: 'block', marginBottom: '8px', color: darkMode ? 'white' : '#374151', fontWeight: '600', fontSize: '14px' }}>📍 Alamat Lengkap</label>
                <textarea value={mapForm.address || ''} onChange={e => setMapForm({...mapForm, address: e.target.value})} required rows="3" style={{ width: '100%', padding: '12px', border: `2px solid ${darkMode ? '#334155' : '#e2e8f0'}`, borderRadius: '12px', background: darkMode ? '#0f172a' : 'white', color: darkMode ? 'white' : '#1e293b', boxSizing: 'border-box', outline: 'none', fontFamily: 'inherit', fontSize: '14px', resize: 'vertical' }}></textarea>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '18px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', color: darkMode ? 'white' : '#374151', fontWeight: '600', fontSize: '14px' }}>Latitude</label>
                  <input type="number" step="0.0001" value={mapForm.lat || ''} onChange={e => setMapForm({...mapForm, lat: parseFloat(e.target.value)})} required style={{ width: '100%', padding: '12px', border: `2px solid ${darkMode ? '#334155' : '#e2e8f0'}`, borderRadius: '12px', background: darkMode ? '#0f172a' : 'white', color: darkMode ? 'white' : '#1e293b', boxSizing: 'border-box', outline: 'none', fontSize: '14px' }} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', color: darkMode ? 'white' : '#374151', fontWeight: '600', fontSize: '14px' }}>Longitude</label>
                  <input type="number" step="0.0001" value={mapForm.lng || ''} onChange={e => setMapForm({...mapForm, lng: parseFloat(e.target.value)})} required style={{ width: '100%', padding: '12px', border: `2px solid ${darkMode ? '#334155' : '#e2e8f0'}`, borderRadius: '12px', background: darkMode ? '#0f172a' : 'white', color: darkMode ? 'white' : '#1e293b', boxSizing: 'border-box', outline: 'none', fontSize: '14px' }} />
                </div>
              </div>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', color: darkMode ? 'white' : '#374151', fontWeight: '600', fontSize: '14px' }}>🔍 Zoom Level (1-20)</label>
                <input type="number" min="1" max="20" value={mapForm.zoom || 15} onChange={e => setMapForm({...mapForm, zoom: parseInt(e.target.value)})} style={{ width: '100%', padding: '12px', border: `2px solid ${darkMode ? '#334155' : '#e2e8f0'}`, borderRadius: '12px', background: darkMode ? '#0f172a' : 'white', color: darkMode ? 'white' : '#1e293b', boxSizing: 'border-box', outline: 'none', fontSize: '14px' }} />
              </div>
              <div style={{ background: '#f0fdf4', padding: '15px', borderRadius: '12px', marginBottom: '20px', border: '1px solid #bbf7d0' }}>
                <p style={{ margin: 0, fontSize: '13px', color: '#166534' }}> <strong>Cara dapat koordinat:</strong><br />1. Buka <a href="https://maps.google.com" target="_blank" rel="noopener noreferrer" style={{ color: '#2d8a5e' }}>Google Maps</a><br />2. Klik kanan di lokasi kelurahan<br />3. Copy angka koordinat yang muncul</p>
              </div>
              <button type="submit" disabled={adminLoading} style={{ width: '100%', padding: '14px', background: 'linear-gradient(135deg, #059669 0%, #047857 100%)', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 'bold', fontSize: '15px', cursor: adminLoading ? 'not-allowed' : 'pointer', boxShadow: '0 4px 15px rgba(5, 150, 105, 0.4)' }}>
                {adminLoading ? '⏳ Menyimpan...' : '💾 Simpan Koordinat'}
              </button>
            </form>
          </div>
          <div style={{ background: darkMode ? '#1e293b' : 'white', borderRadius: '20px', padding: '30px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', border: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}` }}>
            <h3 style={{ color: darkMode ? 'white' : '#1e293b', margin: '0 0 20px', fontSize: '20px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '10px' }}><span style={{ fontSize: '24px' }}>👁️</span> Preview Peta</h3>
            <div style={{ height: '350px', borderRadius: '16px', overflow: 'hidden', border: '3px solid #059669', marginBottom: '20px' }}>
              <iframe src={`https://www.openstreetmap.org/export/embed.html?bbox=${mapForm.lng - 0.01}%2C${mapForm.lat - 0.01}%2C${mapForm.lng + 0.01}%2C${mapForm.lat + 0.01}&layer=mapnik&marker=${mapForm.lat}%2C${mapForm.lng}`} style={{ width: '100%', height: '100%', border: 'none' }} title="Preview Peta"></iframe>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div style={{ background: '#f0fdf4', padding: '15px', borderRadius: '12px', textAlign: 'center' }}>
                <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>Latitude</p>
                <p style={{ margin: '5px 0 0', fontSize: '18px', fontWeight: '800', color: '#059669' }}>{mapForm.lat}</p>
              </div>
              <div style={{ background: '#f0fdf4', padding: '15px', borderRadius: '12px', textAlign: 'center' }}>
                <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>Longitude</p>
                <p style={{ margin: '5px 0 0', fontSize: '18px', fontWeight: '800', color: '#059669' }}>{mapForm.lng}</p>
              </div>
            </div>
          </div>
        </div>
      </AdminLayout>
    )
  }

  // ==========================================
  // RENDER: KELOLA BERITA
  // ==========================================
  if (adminView === 'admin' && adminPage === 'articles') {
    const filteredArticles = articles.filter(a => a.title.toLowerCase().includes(searchQuery.toLowerCase()))
    return (
      <AdminLayout title="Kelola Berita">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
          <div>
            <h3 style={{ color: darkMode ? 'white' : '#1e293b', margin: 0, fontSize: '20px', fontWeight: '800' }}>Daftar Berita ({filteredArticles.length})</h3>
            <p style={{ color: darkMode ? '#94a3b8' : '#64748b', margin: '5px 0 0', fontSize: '14px' }}>Kelola semua berita yang dipublikasikan</p>
          </div>
          <button onClick={() => openAddForm('article')} style={{ padding: '14px 28px', background: 'linear-gradient(135deg, #2d8a5e 0%, #1e5d3f 100%)', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 15px rgba(45, 138, 94, 0.4)', display: 'flex', alignItems: 'center', gap: '8px' }}>➕ Tambah Berita</button>
        </div>
        {filteredArticles.length === 0 ? (
          <div style={{ background: darkMode ? '#1e293b' : 'white', borderRadius: '20px', padding: '60px 20px', textAlign: 'center', border: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}` }}>
            <div style={{ fontSize: '60px', marginBottom: '15px' }}>📰</div>
            <p style={{ color: darkMode ? '#94a3b8' : '#64748b', fontSize: '16px' }}>Belum ada berita</p>
          </div>
        ) : (
          <div style={{ background: darkMode ? '#1e293b' : 'white', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', border: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}` }}>
            {filteredArticles.map((article, i) => (
              <div key={article.id} style={{ padding: '20px 25px', display: 'flex', alignItems: 'center', gap: '20px', borderBottom: `1px solid ${darkMode ? '#334155' : '#f1f5f9'}`, transition: 'all 0.3s' }} onMouseEnter={(e) => e.target.style.background = darkMode ? '#0f172a' : '#f0fdf4'} onMouseLeave={(e) => e.target.style.background = 'transparent'}>
                <div style={{ width: '50px', height: '50px', background: 'linear-gradient(135deg, #2d8a5e 0%, #1e5d3f 100%)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', fontSize: '18px', flexShrink: 0 }}>{i + 1}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h4 style={{ color: darkMode ? 'white' : '#1e293b', margin: '0 0 5px', fontSize: '16px', fontWeight: '700', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{article.title}</h4>
                  <p style={{ color: darkMode ? '#94a3b8' : '#64748b', margin: 0, fontSize: '13px' }}>✍️ {article.author || 'Admin'} • 📅 {article.created_at ? new Date(article.created_at).toLocaleDateString('id-ID') : '-'}</p>
                </div>
                <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                  <button onClick={() => openEditForm('article', article)} style={{ padding: '10px 18px', background: '#10b981', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontSize: '13px', fontWeight: '600' }}>✏️ Edit</button>
                  <button onClick={() => handleDeleteArticle(article.id)} style={{ padding: '10px 18px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontSize: '13px', fontWeight: '600' }}>🗑️ Hapus</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </AdminLayout>
    )
  }

  // ==========================================
  // RENDER: MODAL FORM
  // ==========================================
  if (showModal) {
    const modalConfig = {
      article: { title: isEditMode ? '✏️ Edit Berita' : '➕ Tambah Berita Baru', icon: '📰', color: '#2d8a5e', data: formData, setData: setFormData, onSave: handleSaveArticle, fields: [
        { name: 'title', label: 'Judul Berita *', type: 'text', required: true },
        { name: 'author', label: 'Penulis', type: 'text', required: false },
        { name: 'image_url', label: 'URL Gambar (Opsional)', type: 'url', required: false, preview: true },
        { name: 'content', label: 'Isi Berita *', type: 'textarea', required: true, rows: 8 }
      ]},
      official: { title: isEditMode ? '✏️ Edit Perangkat' : '➕ Tambah Perangkat Baru', icon: '👨‍💼', color: '#10b981', data: officialForm, setData: setOfficialForm, onSave: handleAddOfficial, fields: [
        { name: 'name', label: 'Nama Lengkap *', type: 'text', required: true },
        { name: 'position', label: 'Jabatan *', type: 'select', required: true, options: ['Lurah', 'Sekretaris Lurah', 'Kepala Seksi Pemerintahan', 'Kepala Seksi Pelayanan', 'Kepala Seksi Kesejahteraan', 'Ketua RW', 'Ketua RT', 'Lainnya'] }
      ]},
      stat: { title: isEditMode ? '✏️ Edit Statistik' : '➕ Tambah Statistik Baru', icon: '📈', color: '#14b8a6', data: statForm, setData: setStatForm, onSave: handleAddStat, fields: [
        { name: 'category', label: 'Kategori *', type: 'text', required: true, placeholder: 'Contoh: Jumlah Penduduk' },
        { name: 'value', label: 'Nilai *', type: 'text', required: true, placeholder: 'Contoh: 3.245' },
        { name: 'year', label: 'Tahun *', type: 'number', required: true }
      ]},
      gallery: { title: isEditMode ? '✏️ Edit Foto' : '➕ Tambah Foto Baru', icon: '🖼️', color: '#059669', data: galleryForm, setData: setGalleryForm, onSave: handleAddGallery, fields: [
        { name: 'title', label: 'Judul Foto *', type: 'text', required: true },
        { name: 'image_url', label: 'URL Gambar *', type: 'url', required: true, preview: true }
      ]}
    }
    const config = modalConfig[showModal]
    return (
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px', animation: 'fadeIn 0.3s' }}>
        <div style={{ background: darkMode ? '#1e293b' : 'white', borderRadius: '24px', padding: '35px', width: '100%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 25px 50px rgba(0,0,0,0.3)', animation: 'slideUp 0.4s' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px', paddingBottom: '20px', borderBottom: `2px solid ${darkMode ? '#334155' : '#f1f5f9'}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <div style={{ width: '55px', height: '55px', background: config.color, borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px' }}>{config.icon}</div>
              <h3 style={{ color: darkMode ? 'white' : '#1e293b', margin: 0, fontSize: '22px', fontWeight: '800' }}>{config.title}</h3>
            </div>
            <button onClick={() => setShowModal(null)} style={{ width: '40px', height: '40px', background: darkMode ? '#334155' : '#f1f5f9', border: 'none', borderRadius: '12px', cursor: 'pointer', fontSize: '20px', color: darkMode ? 'white' : '#64748b' }}>✕</button>
          </div>
          <form onSubmit={config.onSave}>
            {config.fields.map(field => (
              <div key={field.name} style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', color: darkMode ? 'white' : '#374151', fontWeight: '600', fontSize: '14px' }}>{field.label}</label>
                {field.type === 'textarea' ? (
                  <textarea value={config.data[field.name] || ''} onChange={e => config.setData({...config.data, [field.name]: e.target.value})} required={field.required} rows={field.rows || 5} style={{ width: '100%', padding: '14px', border: `2px solid ${darkMode ? '#334155' : '#e2e8f0'}`, borderRadius: '12px', background: darkMode ? '#0f172a' : 'white', color: darkMode ? 'white' : '#1e293b', boxSizing: 'border-box', outline: 'none', fontFamily: 'inherit', fontSize: '15px', resize: 'vertical' }}></textarea>
                ) : field.type === 'select' ? (
                  <select value={config.data[field.name] || ''} onChange={e => config.setData({...config.data, [field.name]: e.target.value})} required={field.required} style={{ width: '100%', padding: '14px', border: `2px solid ${darkMode ? '#334155' : '#e2e8f0'}`, borderRadius: '12px', background: darkMode ? '#0f172a' : 'white', color: darkMode ? 'white' : '#1e293b', boxSizing: 'border-box', outline: 'none', fontSize: '15px' }}>
                    <option value="">Pilih {field.label.replace(' *', '')}</option>
                    {field.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                ) : (
                  <input type={field.type} value={config.data[field.name] || ''} onChange={e => config.setData({...config.data, [field.name]: e.target.value})} required={field.required} placeholder={field.placeholder || ''} style={{ width: '100%', padding: '14px', border: `2px solid ${darkMode ? '#334155' : '#e2e8f0'}`, borderRadius: '12px', background: darkMode ? '#0f172a' : 'white', color: darkMode ? 'white' : '#1e293b', boxSizing: 'border-box', outline: 'none', fontSize: '15px' }} />
                )}
                {field.preview && config.data[field.name] && (
                  <img src={config.data[field.name]} alt="Preview" style={{ width: '100%', marginTop: '10px', borderRadius: '12px', maxHeight: '200px', objectFit: 'cover' }} onError={(e) => e.target.style.display = 'none'} />
                )}
              </div>
            ))}
            <div style={{ display: 'flex', gap: '12px', marginTop: '25px' }}>
              <button type="submit" disabled={adminLoading} style={{ flex: 1, padding: '16px', background: `linear-gradient(135deg, ${config.color} 0%, ${config.color}dd 100%)`, color: 'white', border: 'none', borderRadius: '12px', fontWeight: 'bold', fontSize: '15px', cursor: adminLoading ? 'not-allowed' : 'pointer', boxShadow: `0 4px 15px ${config.color}66` }}>
                {adminLoading ? '⏳ Menyimpan...' : '💾 Simpan'}
              </button>
              <button type="button" onClick={() => setShowModal(null)} style={{ padding: '16px 28px', background: darkMode ? '#334155' : '#e2e8f0', color: darkMode ? 'white' : '#1e293b', border: 'none', borderRadius: '12px', fontWeight: 'bold', fontSize: '15px', cursor: 'pointer' }}>Batal</button>
            </div>
          </form>
        </div>
        <style>{`
          @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
          @keyframes slideUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        `}</style>
      </div>
    )
  }

  // ==========================================
  // RENDER: WEBSITE PUBLIK
  // ==========================================
  return (
    <div className="landing-page">
      <nav className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`}>
        <div className="navbar-container">
          <div className="navbar-brand">
            <div className="logo-circle"><img src={tomohon} alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '4px' }} /></div>
            <div className="brand-text"><h1>Kelurahan Woloan Dua</h1><p>Kota Tomohon</p></div>
          </div>
          <ul className="navbar-menu">
            {menuItems.map((item, index) => (<li key={index}><a href={item.link} className={index === 0 ? 'active' : ''}>{item.name}</a></li>))}
          </ul>
          <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
            <span className={menuOpen ? 'open' : ''}></span><span className={menuOpen ? 'open' : ''}></span><span className={menuOpen ? 'open' : ''}></span>
          </button>
        </div>
        {menuOpen && (<ul className="mobile-menu">{menuItems.map((item, index) => (<li key={index}><a href={item.link} onClick={() => setMenuOpen(false)}>{item.name}</a></li>))}</ul>)}
      </nav>

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
          <div className="slide-indicators">{slides.map((_, index) => (<button key={index} className={`indicator ${currentSlide === index ? 'active' : ''}`} onClick={() => setCurrentSlide(index)}></button>))}</div>
        </div>
        <div className="scroll-indicator"><div className="mouse"><div className="wheel"></div></div><p>Scroll Down</p></div>
        <div className="visitor-widget"><div className="visitor-icon"></div><div className="visitor-info"><span className="visitor-count">{visitorCount}</span><span className="visitor-label">Kunjungan Hari Ini</span></div></div>
        <div className="complaint-widget"><button className="btn-complaint"><span className="complaint-icon">📢</span><span>Pengaduan</span></button><button className="btn-accessibility">♿</button></div>
      </section>

      <section className="quick-menu" id="quick-menu">
        <div className="container">
          <h2 className="section-title">Layanan Cepat</h2>
          <div className="quick-grid">
            {[
              { icon: '️', title: 'Peta Kelurahan', desc: 'Lihat peta wilayah', link: '#peta' },
              { icon: '📋', title: 'Layanan Surat', desc: 'Ajukan surat online', link: '#layanan' },
              { icon: '📢', title: 'Pengaduan', desc: 'Sampaikan keluhan', link: '#layanan' },
              { icon: '', title: 'Kontak Darurat', desc: 'Nomor penting', link: '#profil' },
              { icon: '📊', title: 'Statistik', desc: 'Data penduduk', link: '#infografis' },
              { icon: 'ℹ️', title: 'PPID', desc: 'Informasi publik', link: '#ppid' },
              { icon: '📰', title: 'Berita', desc: 'Kabar terbaru', link: '#berita' },
              { icon: '🎨', title: 'Potensi Kelurahan', desc: 'Sentra ukiran kayu', link: '#profil' }
            ].map((item, index) => (<a key={index} href={item.link} className="quick-card" style={{ textDecoration: 'none', color: 'inherit' }}><div className="quick-icon">{item.icon}</div><h3>{item.title}</h3><p>{item.desc}</p></a>))}
          </div>
        </div>
      </section>

      <section className="info-section" id="profil">
        <div className="container">
          <h2 className="section-title">Profil Kelurahan</h2>
          {profileLoading ? (<p style={{ textAlign: 'center', padding: '20px' }}>Memuat profil...</p>) : villageInfo ? (
            <div className="info-grid"><div className="info-card" style={{ gridColumn: '1 / -1' }}><h3>️ {villageInfo.name}</h3><p>{villageInfo.description}</p><p style={{ marginTop: '15px' }}><strong> Alamat:</strong> {villageInfo.address}</p><p><strong>📞 Telepon:</strong> {villageInfo.phone}</p></div></div>
          ) : (<p style={{ textAlign: 'center', padding: '20px' }}>Data profil belum tersedia.</p>)}
          <h3 style={{ marginTop: '40px', marginBottom: '20px' }}>Perangkat Kelurahan</h3>
          {sortedOfficials.length === 0 ? (<p style={{ textAlign: 'center', padding: '20px' }}>Belum ada data perangkat kelurahan.</p>) : (
            <div className="info-grid">{sortedOfficials.map((official, index) => (<div key={official.id || index} className="info-card"><h3>{official.name}</h3><p style={{ color: '#2d8a5e', fontWeight: 'bold', marginTop: '10px' }}>{official.position}</p></div>))}</div>
          )}
        </div>
      </section>

      <section className="info-section" id="infografis">
        <div className="container">
          <h2 className="section-title">Infografis & Statistik</h2>
          {statsLoading ? (<p style={{ textAlign: 'center', padding: '20px' }}>Memuat data...</p>) : statistics.length === 0 ? (<p style={{ textAlign: 'center', padding: '20px' }}>Belum ada data statistik.</p>) : (
            <div className="info-grid">{statistics.map((stat, index) => (<div key={stat.id || index} className="info-card" style={{ textAlign: 'center' }}><h3 style={{ fontSize: '2rem', color: '#2d8a5e', marginBottom: '10px' }}>{stat.value}</h3><p style={{ fontWeight: 'bold', marginBottom: '5px' }}>{stat.category}</p><p style={{ fontSize: '0.85rem', color: '#666' }}>Tahun {stat.year}</p></div>))}</div>
          )}
        </div>
      </section>

      <section className="info-section" id="galeri" style={{ backgroundColor: '#f8fafc' }}>
        <div className="container">
          <h2 className="section-title">Galeri Kegiatan</h2>
          {galleries.length === 0 ? (<p style={{ textAlign: 'center', padding: '20px' }}>Belum ada foto kegiatan.</p>) : (
            <div className="info-grid">{galleries.map((photo, index) => (<div key={photo.id || index} className="info-card" style={{ padding: '10px' }}><img src={photo.image_url} alt={photo.title} style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '8px', marginBottom: '10px' }} /><h3 style={{ fontSize: '1rem', textAlign: 'center' }}>{photo.title}</h3></div>))}</div>
          )}
        </div>
      </section>

      <section className="info-section" id="layanan">
        <div className="container">
          <h2 className="section-title">Layanan</h2>
          <div className="info-grid">
            <div className="info-card"><h3>📋 Surat Menyurat</h3><p>Layanan pengajuan surat secara online.</p><a href="#" className="btn-link">Ajukan Surat →</a></div>
            <div className="info-card"><h3>📢 Pengaduan</h3><p>Sampaikan keluhan dan saran Anda.</p><a href="#" className="btn-link">Buat Pengaduan →</a></div>
            <div className="info-card"><h3>ℹ️ Informasi Publik</h3><p>Akses informasi publik kelurahan.</p><a href="#" className="btn-link">Lihat Informasi →</a></div>
          </div>
        </div>
      </section>

      <section className="info-section" id="berita">
        <div className="container">
          <h2 className="section-title">Berita Terbaru</h2>
          {loading ? (<p style={{ textAlign: 'center', padding: '20px' }}>Memuat berita...</p>) : articles.length === 0 ? (<p style={{ textAlign: 'center', padding: '20px' }}>Belum ada berita yang dipublikasikan.</p>) : (
            <div className="info-grid">{articles.slice(0, 3).map((article, index) => (<div key={article.id || index} className="info-card"><h3>📰 {article.title}</h3><p>{article.content.substring(0, 100)}...</p><p style={{ fontSize: '0.8rem', color: '#666', marginTop: '10px' }}>Oleh: {article.author || 'Admin'}</p><button onClick={() => openArticleModal(article)} style={{ background: 'none', border: 'none', color: '#2d8a5e', cursor: 'pointer', fontSize: '1rem', fontWeight: 'bold', padding: 0, marginTop: '10px' }}>Baca Selengkapnya →</button></div>))}</div>
          )}
        </div>
      </section>

      <section className="info-section" id="peta" style={{ backgroundColor: '#f0fdf4' }}>
        <div className="container">
          <h2 className="section-title">📍 Peta Lokasi Kelurahan</h2>
          <p style={{ textAlign: 'center', color: '#64748b', marginBottom: '30px', fontSize: '16px' }}>{mapCoordinates.address}</p>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '25px', alignItems: 'start' }}>
            <div style={{ height: '450px', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(45, 138, 94, 0.15)', border: '3px solid #2d8a5e', position: 'relative' }}>
              <iframe src={`https://www.openstreetmap.org/export/embed.html?bbox=${mapCoordinates.lng - 0.01}%2C${mapCoordinates.lat - 0.01}%2C${mapCoordinates.lng + 0.01}%2C${mapCoordinates.lat + 0.01}&layer=mapnik&marker=${mapCoordinates.lat}%2C${mapCoordinates.lng}`} style={{ width: '100%', height: '100%', border: 'none' }} title="Peta Kelurahan Woloan Dua"></iframe>
            </div>
            <div style={{ background: 'white', borderRadius: '20px', padding: '25px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' }}>
              <h3 style={{ color: '#2d8a5e', marginTop: 0, fontSize: '20px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}><span style={{ fontSize: '28px' }}>📍</span> Informasi Lokasi</h3>
              <div style={{ marginBottom: '20px' }}>
                <p style={{ color: '#64748b', fontSize: '13px', margin: '0 0 5px', fontWeight: '600' }}>ALAMAT LENGKAP</p>
                <p style={{ color: '#1e293b', fontSize: '15px', margin: 0, lineHeight: '1.6' }}>{mapCoordinates.address}</p>
              </div>
              <div style={{ marginBottom: '20px' }}>
                <p style={{ color: '#64748b', fontSize: '13px', margin: '0 0 5px', fontWeight: '600' }}>KOORDINAT</p>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <div style={{ flex: 1, background: '#f0fdf4', padding: '10px', borderRadius: '10px', textAlign: 'center' }}>
                    <p style={{ margin: 0, fontSize: '11px', color: '#64748b' }}>Latitude</p>
                    <p style={{ margin: '4px 0 0', fontSize: '14px', fontWeight: '700', color: '#2d8a5e' }}>{mapCoordinates.lat}</p>
                  </div>
                  <div style={{ flex: 1, background: '#f0fdf4', padding: '10px', borderRadius: '10px', textAlign: 'center' }}>
                    <p style={{ margin: 0, fontSize: '11px', color: '#64748b' }}>Longitude</p>
                    <p style={{ margin: '4px 0 0', fontSize: '14px', fontWeight: '700', color: '#2d8a5e' }}>{mapCoordinates.lng}</p>
                  </div>
                </div>
              </div>
              <a href={`https://www.google.com/maps/search/?api=1&query=${mapCoordinates.lat},${mapCoordinates.lng}`} target="_blank" rel="noopener noreferrer" style={{ display: 'block', padding: '14px', background: 'linear-gradient(135deg, #2d8a5e 0%, #1e5d3f 100%)', color: 'white', textAlign: 'center', borderRadius: '12px', textDecoration: 'none', fontWeight: 'bold', fontSize: '14px', boxShadow: '0 4px 15px rgba(45, 138, 94, 0.3)', transition: 'all 0.3s' }} onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'} onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}>🗺️ Buka di Google Maps</a>
            </div>
          </div>
        </div>
      </section>

      <section className="info-section" id="ppid">
        <div className="container">
          <h2 className="section-title">PPID</h2>
          <div className="info-grid">
            <div className="info-card"><h3>ℹ️ Informasi Publik</h3><p>Pejabat Pengelola Informasi dan Dokumentasi.</p><a href="#" className="btn-link">Lihat Informasi →</a></div>
            <div className="info-card"><h3>📄 Permohonan Informasi</h3><p>Ajukan permohonan informasi publik.</p><a href="#" className="btn-link">Ajukan →</a></div>
            <div className="info-card"><h3>📊 Statistik Informasi</h3><p>Statistik permohonan informasi publik.</p><a href="#" className="btn-link">Lihat Statistik →</a></div>
          </div>
        </div>
      </section>

      {selectedArticle && (<div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: '20px' }} onClick={closeArticleModal}><div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '30px', maxWidth: '600px', width: '100%', maxHeight: '80vh', overflowY: 'auto', position: 'relative' }} onClick={(e) => e.stopPropagation()}><button onClick={closeArticleModal} style={{ position: 'absolute', top: '15px', right: '15px', background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#666' }}></button><h2 style={{ color: '#2d8a5e', marginBottom: '15px', paddingRight: '30px' }}> {selectedArticle.title}</h2><p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '20px' }}>Oleh: {selectedArticle.author || 'Admin'}</p><div style={{ lineHeight: '1.6' }}>{selectedArticle.content}</div></div></div>)}

      <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-col"><h4>Kelurahan Woloan Dua</h4><p>Kecamatan Tomohon Barat<br />Kota Tomohon, Sulawesi Utara</p><p>📞 0431-123456<br />️ kelurahan.woloandua@gmail.com</p></div>
            <div className="footer-col"><h4>Menu Cepat</h4><ul><li><a href="#profil">Profil Kelurahan</a></li><li><a href="#layanan">Layanan</a></li><li><a href="#berita">Berita</a></li></ul></div>
            <div className="footer-col"><h4>Ikuti Kami</h4><div className="social-links"><a href="#">📘 Facebook</a><a href="#">📷 Instagram</a><a href="#">▶ YouTube</a></div></div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2026 Kelurahan Woloan Dua.</p>
            <p style={{ marginTop: '10px' }}><a href="#" onClick={(e) => { e.preventDefault(); setAdminView('login'); }} style={{ color: '#64748b', fontSize: '12px', textDecoration: 'none' }}>🔒 Login Admin</a></p>
          </div>
        </div>
      </footer>

      <div style={{ position: 'fixed', bottom: '30px', right: '30px', zIndex: 9999, display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {toasts.map(toast => (
          <div key={toast.id} style={{
            padding: '16px 24px', borderRadius: '12px', color: 'white', fontWeight: '600', fontSize: '14px',
            background: toast.type === 'success' ? 'linear-gradient(135deg, #2d8a5e 0%, #1e5d3f 100%)' : toast.type === 'error' ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)' : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            boxShadow: '0 10px 30px rgba(0,0,0,0.2)', animation: 'slideInRight 0.4s', minWidth: '250px'
          }}>
            {toast.type === 'success' ? '✅' : toast.type === 'error' ? '❌' : 'ℹ️'} {toast.message}
          </div>
        ))}
      </div>

      <style>{`
        @keyframes slideInRight { from { opacity: 0; transform: translateX(100px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  )
}

export default App