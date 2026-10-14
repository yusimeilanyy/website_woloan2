import { useState, useEffect, useRef } from 'react'
import './App.css'
import gunung from './assets/gunung.png'
import tomohon from './assets/tomohon.png'

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000'

// ==========================================
// PENGATURAN LAYANAN PUBLIK
// ==========================================
const SERVICE_INFO = { jam: 'Senin – Jumat, 08.00 – 16.00 WITA' }

const LETTER_TYPES = {
  'Surat Keterangan Domisili': ['Fotokopi KTP', 'Fotokopi Kartu Keluarga (KK)', 'Surat pengantar RT/RW atau Kepala Lingkungan'],
  'Surat Keterangan Usaha': ['Fotokopi KTP', 'Fotokopi Kartu Keluarga (KK)', 'Surat pengantar RT/RW atau Kepala Lingkungan', 'Foto tempat usaha'],
  'Surat Keterangan Tidak Mampu': ['Fotokopi KTP', 'Fotokopi Kartu Keluarga (KK)', 'Surat pengantar RT/RW atau Kepala Lingkungan'],
  'Surat Pengantar SKCK': ['Fotokopi KTP', 'Fotokopi Kartu Keluarga (KK)', 'Pas foto 4x6'],
  'Surat Keterangan Kematian': ['KTP almarhum/almarhumah', 'Fotokopi Kartu Keluarga (KK)', 'Keterangan kematian dari rumah sakit/dokter/Kepala Lingkungan', 'KTP pelapor'],
  'Surat Pengantar Nikah': ['Fotokopi KTP calon pengantin', 'Fotokopi Kartu Keluarga (KK)', 'Fotokopi akta kelahiran', 'Pas foto', 'Surat pengantar RT/RW atau Kepala Lingkungan'],
  'Surat Lainnya': ['Fotokopi KTP', 'Fotokopi Kartu Keluarga (KK)', 'Dokumen pendukung sesuai keperluan']
}

const COMPLAINT_CATEGORIES = [
  { label: 'Infrastruktur', icon: '🛣️' },
  { label: 'Kebersihan & Lingkungan', icon: '🌿' },
  { label: 'Keamanan & Ketertiban', icon: '🛡️' },
  { label: 'Pelayanan Publik', icon: '🏛️' },
  { label: 'Lainnya', icon: '📝' }
]

// ==========================================
// KOMPONEN LOGIN (DI LUAR App AGAR HOOK AMAN)
// ==========================================
function LoginPage({ onSubmit, adminError, adminLoading, onBack }) {
  const [showPassword, setShowPassword] = useState(false)
  const [focus, setFocus] = useState({ username: false, password: false })
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const move = (e) => setMousePos({ x: e.clientX, y: e.clientY })
    window.addEventListener('mousemove', move)
    return () => window.removeEventListener('mousemove', move)
  }, [])

  const inputStyle = (name, extra = {}) => ({
    width: '100%', padding: '14px 16px', border: `2px solid ${focus[name] ? '#2d8a5e' : '#e2e8f0'}`,
    borderRadius: '12px', fontSize: '15px', boxSizing: 'border-box', outline: 'none', transition: 'all 0.3s',
    background: focus[name] ? '#f0fdf4' : 'white', boxShadow: focus[name] ? '0 0 0 4px rgba(45, 138, 94, 0.1)' : 'none', ...extra
  })
  const labelStyle = { display: 'block', marginBottom: '8px', color: '#374151', fontWeight: '600', fontSize: '14px' }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #2d8a5e 0%, #1e5d3f 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', position: 'relative', overflow: 'hidden', fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}>
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        {[...Array(6)].map((_, i) => (
          <div key={i} style={{ position: 'absolute', width: `${100 + i * 50}px`, height: `${100 + i * 50}px`, background: 'rgba(255,255,255,0.08)', borderRadius: '50%', top: `${(i * 17) % 100}%`, left: `${(i * 23) % 100}%`, animation: `floatBubble ${6 + i}s ease-in-out infinite`, animationDelay: `${i * 0.5}s` }}></div>
        ))}
      </div>
      <div style={{ position: 'absolute', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 70%)', borderRadius: '50%', left: mousePos.x - 200, top: mousePos.y - 200, pointerEvents: 'none', transition: 'all 0.3s ease-out' }}></div>

      <div style={{ background: 'rgba(255,255,255,0.98)', backdropFilter: 'blur(20px)', padding: '50px 40px', borderRadius: '24px', boxShadow: '0 25px 60px rgba(0,0,0,0.3)', width: '100%', maxWidth: '440px', position: 'relative', zIndex: 1, animation: 'slideUpLogin 0.7s cubic-bezier(0.34, 1.56, 0.64, 1)' }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <div style={{ width: '100px', height: '100px', margin: '0 auto 20px', background: 'linear-gradient(135deg, #2d8a5e 0%, #1e5d3f 100%)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '50px', boxShadow: '0 15px 35px rgba(45, 138, 94, 0.4)', animation: 'pulseIcon 2s ease-in-out infinite', position: 'relative' }}>
            🔐
            <div style={{ position: 'absolute', inset: '-5px', borderRadius: '50%', border: '3px solid rgba(45, 138, 94, 0.3)', animation: 'ripple 2s ease-out infinite' }}></div>
          </div>
          <h2 style={{ color: '#1e293b', marginBottom: '8px', fontSize: '32px', fontWeight: '800', letterSpacing: '-0.5px' }}>Login Admin</h2>
          <p style={{ color: '#64748b', fontSize: '14px', margin: 0 }}>Kelurahan Woloan Dua, Kota Tomohon</p>
        </div>

        {adminError && (
          <div style={{ background: 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)', color: '#dc2626', padding: '14px 16px', borderRadius: '12px', marginBottom: '20px', fontSize: '14px', borderLeft: '4px solid #dc2626', animation: 'shakeError 0.5s ease-in-out', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '20px' }}>⚠️</span><span style={{ fontWeight: '500' }}>{adminError}</span>
          </div>
        )}

        <form onSubmit={onSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={labelStyle}><span style={{ marginRight: '6px' }}>👤</span>Username</label>
            <input name="username" placeholder="Masukkan username" required autoComplete="username" style={inputStyle('username')}
              onFocus={() => setFocus(p => ({ ...p, username: true }))} onBlur={() => setFocus(p => ({ ...p, username: false }))} />
          </div>
          <div style={{ marginBottom: '25px' }}>
            <label style={labelStyle}><span style={{ marginRight: '6px' }}>🔒</span>Password</label>
            <div style={{ position: 'relative' }}>
              <input name="password" type={showPassword ? 'text' : 'password'} placeholder="Masukkan password" required autoComplete="current-password" style={inputStyle('password', { padding: '14px 50px 14px 16px' })}
                onFocus={() => setFocus(p => ({ ...p, password: true }))} onBlur={() => setFocus(p => ({ ...p, password: false }))} />
              <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '20px', padding: '4px' }}>
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>
          <button type="submit" disabled={adminLoading} style={{ width: '100%', padding: '16px', background: adminLoading ? 'linear-gradient(135deg, #94a3b8 0%, #64748b 100%)' : 'linear-gradient(135deg, #2d8a5e 0%, #1e5d3f 100%)', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 'bold', fontSize: '16px', cursor: adminLoading ? 'not-allowed' : 'pointer', boxShadow: adminLoading ? 'none' : '0 10px 25px rgba(45, 138, 94, 0.4)', transition: 'all 0.3s' }}>
            {adminLoading ? (
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                <span style={{ width: '20px', height: '20px', border: '3px solid rgba(255,255,255,0.3)', borderTop: '3px solid white', borderRadius: '50%', animation: 'spin 0.8s linear infinite', display: 'inline-block' }}></span>
                Memproses...
              </span>
            ) : 'Masuk ke Dashboard'}
          </button>
        </form>

        <button onClick={onBack} style={{ width: '100%', marginTop: '15px', padding: '14px', background: 'transparent', border: '2px solid #e2e8f0', borderRadius: '12px', color: '#64748b', cursor: 'pointer', fontSize: '14px', fontWeight: '600', transition: 'all 0.3s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
          onMouseEnter={(e) => { e.currentTarget.style.background = '#f0fdf4'; e.currentTarget.style.borderColor = '#2d8a5e'; e.currentTarget.style.color = '#2d8a5e' }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.color = '#64748b' }}>
          <span style={{ fontSize: '18px' }}>🏠</span> Kembali ke Website
        </button>

        <div style={{ marginTop: '25px', paddingTop: '20px', borderTop: '1px solid #e2e8f0', textAlign: 'center' }}>
          <p style={{ margin: 0, fontSize: '11px', color: '#94a3b8' }}>© 2026 Kelurahan Woloan Dua</p>
        </div>
      </div>

      <style>{`
        @keyframes slideUpLogin { from { opacity: 0; transform: translateY(50px) scale(0.95); } to { opacity: 1; transform: translateY(0) scale(1); } }
        @keyframes floatBubble { 0%, 100% { transform: translateY(0) translateX(0); } 33% { transform: translateY(-30px) translateX(20px); } 66% { transform: translateY(20px) translateX(-20px); } }
        @keyframes pulseIcon { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.05); } }
        @keyframes ripple { 0% { transform: scale(1); opacity: 0.5; } 100% { transform: scale(1.5); opacity: 0; } }
        @keyframes shakeError { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-10px); } 75% { transform: translateX(10px); } }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  )
}

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
  const [logoClickCount, setLogoClickCount] = useState(0)
  const [lastClickTime, setLastClickTime] = useState(0)
  const [showModal, setShowModal] = useState(null)
  const [animatedStats, setAnimatedStats] = useState({ articles: 0, officials: 0, stats: 0, galleries: 0 })

  const [formData, setFormData] = useState({ title: '', content: '', author: 'Admin Kelurahan', image_url: '' })
  const [profileForm, setProfileForm] = useState({ name: '', description: '', address: '', phone: '' })
  const [officialForm, setOfficialForm] = useState({ name: '', position: '' })
  const [statForm, setStatForm] = useState({ category: '', value: '', year: new Date().getFullYear() })
  const [galleryForm, setGalleryForm] = useState({ title: '', image_url: '' })

  // ==========================================
  // STATE LAYANAN PUBLIK & PENGAJUAN (dari database)
  // ==========================================
  const [serviceModal, setServiceModal] = useState(null)
  const [infoTab, setInfoTab] = useState('profil')
  const [letterForm, setLetterForm] = useState({ name: '', phone: '', type: '', customType: '', address: '', purpose: '' })
  const [complaintForm, setComplaintForm] = useState({ name: '', phone: '', anonymous: false, category: '', location: '', message: '' })
  const [letterSubmissions, setLetterSubmissions] = useState([])
  const [complaintSubmissions, setComplaintSubmissions] = useState([])

  const [imageMode, setImageMode] = useState('upload')
  const [imageProcessing, setImageProcessing] = useState(false)

  // Wrapper stabil agar halaman admin tidak di-remount setiap render
  const adminLayoutFn = useRef(null)
  const AdminLayout = useRef((props) => adminLayoutFn.current(props)).current

  const slides = [
    { image: gunung, title: 'Selamat Datang', subtitle: 'Website Resmi Kelurahan Woloan Dua', description: 'Sumber informasi terbaru tentang pemerintahan di Kelurahan Woloan Dua, Kota Tomohon' },
    { image: gunung, title: 'Potensi Desa', subtitle: 'Kerajinan Ukiran Kayu', description: 'Woloan terkenal dengan kerajinan ukiran kayu dan anyaman bambu yang mendunia' },
    { image: gunung, title: 'Wisata Alam', subtitle: 'Keindahan Gunung Lokon', description: 'Nikmati pemandangan alam yang memukau dengan udara sejuk pegunungan' }
  ]

  const showToast = (message, type = 'success') => {
    const id = Date.now() + Math.random()
    setToasts(prev => [...prev, { id, message, type }])
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000)
  }

  // ==========================================
  // EFFECTS (semua hook di atas, sebelum return kondisional)
  // ==========================================
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') setServiceModal(null) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => {
    const targets = { articles: articles.length, officials: officials.length, stats: statistics.length, galleries: galleries.length }
    const steps = 60
    let step = 0
    const timer = setInterval(() => {
      step++
      const p = step / steps
      setAnimatedStats({
        articles: Math.floor(targets.articles * p),
        officials: Math.floor(targets.officials * p),
        stats: Math.floor(targets.stats * p),
        galleries: Math.floor(targets.galleries * p)
      })
      if (step >= steps) clearInterval(timer)
    }, 1500 / steps)
    return () => clearInterval(timer)
  }, [articles.length, officials.length, statistics.length, galleries.length])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const timer = setInterval(() => setCurrentSlide((prev) => (prev + 1) % slides.length), 5000)
    return () => clearInterval(timer)
  }, [slides.length])

  useEffect(() => {
    fetch(`${API}/api/articles`).then(r => r.json()).then(d => { if (d.success) setArticles(d.data); setLoading(false) }).catch(() => setLoading(false))
    fetch(`${API}/api/profile/info`).then(r => r.json()).then(d => { if (d.success) { setVillageInfo(d.data); setProfileForm(d.data || {}) } setProfileLoading(false) }).catch(() => setProfileLoading(false))
    fetch(`${API}/api/profile/officials`).then(r => r.json()).then(d => { if (d.success) setOfficials(d.data) }).catch(() => {})
    fetch(`${API}/api/stats/statistics`).then(r => r.json()).then(d => { if (d.success) setStatistics(d.data); setStatsLoading(false) }).catch(() => setStatsLoading(false))
    fetch(`${API}/api/stats/galleries`).then(r => r.json()).then(d => { if (d.success) setGalleries(d.data) }).catch(() => {})
    fetch(`${API}/api/profile/map`).then(r => r.json()).then(d => { if (d.success) { setMapCoordinates(d.data); setMapForm(d.data) } }).catch(() => {})
  }, [])

  // Muat pengajuan surat & pengaduan saat admin masuk
  useEffect(() => {
    if (adminView !== 'admin' || !adminToken) return
    const headers = { Authorization: adminToken }
    fetch(`${API}/api/letters`, { headers }).then(r => r.json()).then(d => { if (d.success) setLetterSubmissions(d.data) }).catch(() => {})
    fetch(`${API}/api/complaints`, { headers }).then(r => r.json()).then(d => { if (d.success) setComplaintSubmissions(d.data) }).catch(() => {})
  }, [adminView, adminToken])

  // ==========================================
  // FUNGSI UMUM
  // ==========================================
  const handleImageFile = (file, setData, data, fieldName) => {
    if (!file) return
    if (!file.type.startsWith('image/')) { showToast('File harus berupa gambar', 'error'); return }
    if (file.size > 10 * 1024 * 1024) { showToast('Ukuran gambar maksimal 10 MB', 'error'); return }
    setImageProcessing(true)
    const reader = new FileReader()
    reader.onload = (ev) => {
      const img = new Image()
      img.onload = () => {
        const MAX_CHARS = 70000
        let maxW = 1000
        let quality = 0.7
        let dataUrl = ''
        for (let i = 0; i < 12; i++) {
          const scale = Math.min(1, maxW / img.width)
          const canvas = document.createElement('canvas')
          canvas.width = Math.max(1, Math.round(img.width * scale))
          canvas.height = Math.max(1, Math.round(img.height * scale))
          const ctx = canvas.getContext('2d')
          ctx.fillStyle = '#ffffff'
          ctx.fillRect(0, 0, canvas.width, canvas.height)
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
          dataUrl = canvas.toDataURL('image/jpeg', quality)
          if (dataUrl.length <= MAX_CHARS) break
          maxW = Math.max(240, Math.round(maxW * 0.8))
          quality = Math.max(0.4, quality - 0.05)
        }
        if (dataUrl.length > MAX_CHARS * 1.4) {
          setImageProcessing(false)
          showToast('Gambar terlalu rumit untuk dikecilkan, coba gambar lain atau pakai link', 'error')
          return
        }
        setData({ ...data, [fieldName]: dataUrl })
        setImageProcessing(false)
      }
      img.onerror = () => { setImageProcessing(false); showToast('Gambar tidak bisa dibaca', 'error') }
      img.src = ev.target.result
    }
    reader.onerror = () => { setImageProcessing(false); showToast('Gagal membaca file', 'error') }
    reader.readAsDataURL(file)
  }

  const handleLogoClick = () => {
    const now = Date.now()
    if (now - lastClickTime < 1500) {
      const newCount = logoClickCount + 1
      setLogoClickCount(newCount)
      if (newCount >= 3) {
        setAdminView('login')
        setLogoClickCount(0)
        showToast('🔐 Halaman Login Admin', 'info')
      }
    } else {
      setLogoClickCount(1)
    }
    setLastClickTime(now)
  }

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length)
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  const openArticleModal = (article) => setSelectedArticle(article)
  const closeArticleModal = () => setSelectedArticle(null)
  const getItemId = (item) => item.id || item._id

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
  // FUNGSI LAYANAN PUBLIK & PENGAJUAN
  // ==========================================
  const openService = (type) => {
    if (type === 'info') setInfoTab('profil')
    setServiceModal(type)
  }
  const closeService = () => setServiceModal(null)

  const handleSubmitLetter = async (e) => {
    e.preventDefault()
    const finalType = letterForm.type === 'Surat Lainnya' ? (letterForm.customType || 'Surat Lainnya') : letterForm.type
    try {
      const res = await fetch(`${API}/api/letters`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: letterForm.name, phone: letterForm.phone, type: finalType, address: letterForm.address, purpose: letterForm.purpose })
      })
      const data = await res.json()
      if (res.ok && data.success) {
        showToast('Pengajuan surat berhasil dikirim! Kelurahan akan memprosesnya.', 'success')
        setLetterForm({ name: '', phone: '', type: '', customType: '', address: '', purpose: '' })
        closeService()
      } else {
        showToast(data.message || 'Gagal mengirim pengajuan', 'error')
      }
    } catch (err) { showToast('Server tidak terhubung', 'error') }
  }

  const handleSubmitComplaint = async (e) => {
    e.preventDefault()
    if (!complaintForm.category) { showToast('Pilih kategori pengaduan terlebih dahulu', 'error'); return }
    try {
      const res = await fetch(`${API}/api/complaints`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(complaintForm)
      })
      const data = await res.json()
      if (res.ok && data.success) {
        showToast('Pengaduan berhasil dikirim! Terima kasih atas laporan Anda.', 'success')
        setComplaintForm({ name: '', phone: '', anonymous: false, category: '', location: '', message: '' })
        closeService()
      } else {
        showToast(data.message || 'Gagal mengirim pengaduan', 'error')
      }
    } catch (err) { showToast('Server tidak terhubung', 'error') }
  }

  const updateLetterStatus = async (id, status) => {
    try {
      const res = await fetch(`${API}/api/letters/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': adminToken },
        body: JSON.stringify({ status })
      })
      if (res.ok) {
        setLetterSubmissions(prev => prev.map(s => s.id === id ? { ...s, status } : s))
        showToast('Status pengajuan diperbarui', 'success')
      } else showToast('Gagal memperbarui status', 'error')
    } catch (err) { showToast('Server tidak terhubung', 'error') }
  }

  const updateComplaintStatus = async (id, status) => {
    try {
      const res = await fetch(`${API}/api/complaints/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': adminToken },
        body: JSON.stringify({ status })
      })
      if (res.ok) {
        setComplaintSubmissions(prev => prev.map(s => s.id === id ? { ...s, status } : s))
        showToast('Status pengaduan diperbarui', 'success')
      } else showToast('Gagal memperbarui status', 'error')
    } catch (err) { showToast('Server tidak terhubung', 'error') }
  }

  const deleteLetterSubmission = async (id) => {
    if (!window.confirm('Hapus pengajuan ini?')) return
    try {
      const res = await fetch(`${API}/api/letters/${id}`, { method: 'DELETE', headers: { 'Authorization': adminToken } })
      if (res.ok) {
        setLetterSubmissions(prev => prev.filter(s => s.id !== id))
        showToast('Pengajuan dihapus', 'info')
      } else showToast('Gagal menghapus', 'error')
    } catch (err) { showToast('Server tidak terhubung', 'error') }
  }

  const deleteComplaintSubmission = async (id) => {
    if (!window.confirm('Hapus pengaduan ini?')) return
    try {
      const res = await fetch(`${API}/api/complaints/${id}`, { method: 'DELETE', headers: { 'Authorization': adminToken } })
      if (res.ok) {
        setComplaintSubmissions(prev => prev.filter(s => s.id !== id))
        showToast('Pengaduan dihapus', 'info')
      } else showToast('Gagal menghapus', 'error')
    } catch (err) { showToast('Server tidak terhubung', 'error') }
  }

  // ==========================================
  // FUNGSI ADMIN
  // ==========================================
  const handleAdminLogin = async (e) => {
    e.preventDefault()
    setAdminError('')
    setAdminLoading(true)
    const fd = new FormData(e.target)
    try {
      const res = await fetch(`${API}/api/auth/login`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: fd.get('username'), password: fd.get('password') })
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
    setLetterSubmissions([])
    setComplaintSubmissions([])
    setAdminView('home')
    setAdminPage('dashboard')
    showToast('Berhasil logout', 'info')
  }

  const handleDeleteArticle = async (id) => {
    if (!window.confirm('Yakin ingin menghapus berita ini?')) return
    try {
      const res = await fetch(`${API}/api/articles/${id}`, { method: 'DELETE', headers: { 'Authorization': adminToken } })
      if (res.ok) { setArticles(articles.filter(a => getItemId(a) !== id)); showToast('Berita berhasil dihapus', 'success') }
      else showToast('Gagal menghapus (sesi login mungkin habis)', 'error')
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
    const itemId = getItemId(item)
    if (!itemId) { showToast('Data tidak memiliki ID valid', 'error'); return }
    setIsEditMode(true); setCurrentEditId(itemId)
    if (type === 'article') setFormData({ title: item.title || '', content: item.content || '', author: item.author || 'Admin Kelurahan', image_url: item.image_url || '' })
    if (type === 'official') setOfficialForm({ name: item.name || '', position: item.position || '' })
    if (type === 'stat') setStatForm({ category: item.category || '', value: item.value || '', year: item.year || new Date().getFullYear() })
    if (type === 'gallery') setGalleryForm({ title: item.title || '', image_url: item.image_url || '' })
    setAdminError(''); setShowModal(type)
  }

  const handleSaveArticle = async (e) => {
    e.preventDefault()
    if (!formData.image_url || !formData.image_url.trim()) { showToast('Gambar wajib diisi (upload file atau isi link)', 'error'); return }
    setAdminLoading(true)
    try {
      const url = isEditMode ? `${API}/api/articles/${currentEditId}` : `${API}/api/articles`
      const res = await fetch(url, {
        method: isEditMode ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': adminToken },
        body: JSON.stringify(formData)
      })
      const data = await res.json()
      if (res.ok && data.success) {
        showToast(isEditMode ? 'Berita diperbarui! ✏️' : 'Berita ditambahkan! 🎉', 'success')
        setShowModal(null); setIsEditMode(false); setCurrentEditId(null)
        const fresh = await (await fetch(`${API}/api/articles`)).json()
        if (fresh.success) setArticles(fresh.data)
      } else {
        showToast('Gagal: ' + (data.error || data.message || 'Cek console browser (F12)'), 'error')
      }
    } catch (err) { showToast('Terjadi kesalahan: ' + err.message, 'error') } finally { setAdminLoading(false) }
  }

  const handleAddOfficial = async (e) => {
    e.preventDefault()
    setAdminLoading(true)
    try {
      const url = isEditMode ? `${API}/api/profile/officials/${currentEditId}` : `${API}/api/profile/officials`
      const res = await fetch(url, { method: isEditMode ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': adminToken }, body: JSON.stringify(officialForm) })
      const data = await res.json()
      if (res.ok && data.success) {
        showToast(isEditMode ? 'Perangkat diperbarui! ✏️' : 'Perangkat ditambahkan! 👨‍💼', 'success')
        setShowModal(null); setIsEditMode(false); setCurrentEditId(null)
        const fresh = await (await fetch(`${API}/api/profile/officials`)).json()
        if (fresh.success) setOfficials(fresh.data)
      } else { showToast('Gagal: ' + (data.error || data.message || ''), 'error') }
    } catch (err) { showToast('Terjadi kesalahan', 'error') } finally { setAdminLoading(false) }
  }

  const handleDeleteOfficial = async (id) => {
    if (!window.confirm('Yakin ingin menghapus?')) return
    try {
      const res = await fetch(`${API}/api/profile/officials/${id}`, { method: 'DELETE', headers: { 'Authorization': adminToken } })
      if (res.ok) { setOfficials(officials.filter(o => getItemId(o) !== id)); showToast('Perangkat dihapus', 'success') }
      else showToast('Gagal menghapus (sesi login mungkin habis)', 'error')
    } catch (err) { showToast('Gagal menghapus', 'error') }
  }

  const handleAddStat = async (e) => {
    e.preventDefault()
    setAdminLoading(true)
    try {
      const url = isEditMode ? `${API}/api/stats/statistics/${currentEditId}` : `${API}/api/stats/statistics`
      const res = await fetch(url, { method: isEditMode ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': adminToken }, body: JSON.stringify(statForm) })
      const data = await res.json()
      if (res.ok && data.success) {
        showToast(isEditMode ? 'Statistik diperbarui! ✏️' : 'Statistik ditambahkan! 📊', 'success')
        setShowModal(null); setIsEditMode(false); setCurrentEditId(null)
        const fresh = await (await fetch(`${API}/api/stats/statistics`)).json()
        if (fresh.success) setStatistics(fresh.data)
      } else { showToast('Gagal: ' + (data.error || data.message || ''), 'error') }
    } catch (err) { showToast('Terjadi kesalahan', 'error') } finally { setAdminLoading(false) }
  }

  const handleDeleteStat = async (id) => {
    if (!window.confirm('Yakin ingin menghapus?')) return
    try {
      const res = await fetch(`${API}/api/stats/statistics/${id}`, { method: 'DELETE', headers: { 'Authorization': adminToken } })
      if (res.ok) { setStatistics(statistics.filter(s => getItemId(s) !== id)); showToast('Statistik dihapus', 'success') }
      else showToast('Gagal menghapus (sesi login mungkin habis)', 'error')
    } catch (err) { showToast('Gagal menghapus', 'error') }
  }

  const handleAddGallery = async (e) => {
    e.preventDefault()
    if (!galleryForm.image_url || !galleryForm.image_url.trim()) { showToast('Gambar wajib diisi (upload file atau isi link)', 'error'); return }
    setAdminLoading(true)
    try {
      const url = isEditMode ? `${API}/api/stats/galleries/${currentEditId}` : `${API}/api/stats/galleries`
      const res = await fetch(url, { method: isEditMode ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': adminToken }, body: JSON.stringify(galleryForm) })
      const data = await res.json()
      if (res.ok && data.success) {
        showToast(isEditMode ? 'Foto diperbarui! ✏️' : 'Foto ditambahkan! 🖼️', 'success')
        setShowModal(null); setIsEditMode(false); setCurrentEditId(null)
        const fresh = await (await fetch(`${API}/api/stats/galleries`)).json()
        if (fresh.success) setGalleries(fresh.data)
      } else { showToast('Gagal: ' + (data.error || data.message || ''), 'error') }
    } catch (err) { showToast('Terjadi kesalahan: ' + err.message, 'error') } finally { setAdminLoading(false) }
  }

  const handleDeleteGallery = async (id) => {
    if (!window.confirm('Yakin ingin menghapus?')) return
    try {
      const res = await fetch(`${API}/api/stats/galleries/${id}`, { method: 'DELETE', headers: { 'Authorization': adminToken } })
      if (res.ok) { setGalleries(galleries.filter(g => getItemId(g) !== id)); showToast('Foto dihapus', 'success') }
      else showToast('Gagal menghapus (sesi login mungkin habis)', 'error')
    } catch (err) { showToast('Gagal menghapus', 'error') }
  }

  const handleSaveProfile = async (e) => {
    e.preventDefault()
    setAdminLoading(true)
    try {
      const res = await fetch(`${API}/api/profile/info`, { method: 'PUT', headers: { 'Content-Type': 'application/json', 'Authorization': adminToken }, body: JSON.stringify(profileForm) })
      const data = await res.json()
      if (res.ok && data.success) { setVillageInfo(profileForm); showToast('Profil diperbarui! 🏛️', 'success') }
      else { showToast('Gagal: ' + (data.error || data.message || ''), 'error') }
    } catch (err) { showToast('Terjadi kesalahan', 'error') } finally { setAdminLoading(false) }
  }

  const handleSaveMap = async (e) => {
    e.preventDefault()
    setAdminLoading(true)
    try {
      const res = await fetch(`${API}/api/profile/map`, { method: 'PUT', headers: { 'Content-Type': 'application/json', 'Authorization': adminToken }, body: JSON.stringify(mapForm) })
      const data = await res.json()
      if (res.ok && data.success) { setMapCoordinates(mapForm); showToast('Peta berhasil diperbarui! 🗺️', 'success') }
      else { showToast('Gagal: ' + (data.error || data.message || ''), 'error') }
    } catch (err) { showToast('Terjadi kesalahan', 'error') } finally { setAdminLoading(false) }
  }

  // ==========================================
  // RENDER: LOGIN PAGE
  // ==========================================
  if (adminView === 'login') {
    return (
      <LoginPage
        onSubmit={handleAdminLogin}
        adminError={adminError}
        adminLoading={adminLoading}
        onBack={() => setAdminView('home')}
      />
    )
  }

  // ==========================================
  // HELPER TAMPILAN ADMIN
  // ==========================================
  const c = {
    card: darkMode ? '#1e293b' : 'white',
    line: darkMode ? '#334155' : '#e2e8f0',
    text: darkMode ? 'white' : '#1e293b',
    sub: darkMode ? '#94a3b8' : '#64748b',
    inner: darkMode ? '#0f172a' : '#f8fafc',
    soft: darkMode ? '#334155' : '#e2e8f0'
  }
  const cardStyle = { background: c.card, borderRadius: '20px', padding: '25px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', border: `1px solid ${c.line}` }
  const fieldStyle = { width: '100%', padding: '14px', border: `2px solid ${c.line}`, borderRadius: '12px', background: c.inner === '#f8fafc' ? 'white' : c.inner, color: c.text, boxSizing: 'border-box', outline: 'none', fontSize: '15px' }
  const lblStyle = { display: 'block', marginBottom: '8px', color: darkMode ? 'white' : '#374151', fontWeight: '600', fontSize: '14px' }
  const lift = {
    onMouseEnter: (e) => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.1)' },
    onMouseLeave: (e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.05)' }
  }
  const emptyBox = (icon, text) => (
    <div style={{ ...cardStyle, padding: '60px 20px', textAlign: 'center' }}>
      <div style={{ fontSize: '60px', marginBottom: '15px' }}>{icon}</div>
      <p style={{ color: c.sub, fontSize: '16px', margin: 0 }}>{text}</p>
    </div>
  )
  const pageHeader = (title, sub, button) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px', flexWrap: 'wrap', gap: '12px' }}>
      <div>
        <h3 style={{ color: c.text, margin: 0, fontSize: '20px', fontWeight: '800' }}>{title}</h3>
        <p style={{ color: c.sub, margin: '5px 0 0', fontSize: '14px' }}>{sub}</p>
      </div>
      {button}
    </div>
  )
  const addButton = (label, gradient, shadow, onClick) => (
    <button onClick={onClick} style={{ padding: '14px 28px', background: gradient, color: 'white', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', boxShadow: `0 4px 15px ${shadow}`, display: 'flex', alignItems: 'center', gap: '8px' }}>{label}</button>
  )
  const editDeleteButtons = (color, onEdit, onDelete) => (
    <div style={{ display: 'flex', gap: '8px' }}>
      <button onClick={onEdit} style={{ flex: 1, padding: '10px', background: color, color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontSize: '13px', fontWeight: '600' }}>✏️ Edit</button>
      <button onClick={onDelete} style={{ flex: 1, padding: '10px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontSize: '13px', fontWeight: '600' }}>🗑️ Hapus</button>
    </div>
  )
  const actionBtn = (label, bg, onClick, color = 'white') => (
    <button onClick={onClick} style={{ padding: '10px 20px', background: bg, color, border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: '600' }}>{label}</button>
  )

  const adminMenuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'letters', label: 'Pengajuan Surat', icon: '📋' },
    { id: 'complaints', label: 'Pengaduan', icon: '📢' },
    { id: 'profile', label: 'Profil Kelurahan', icon: '🏛️' },
    { id: 'officials', label: 'Perangkat Desa', icon: '👨‍💼' },
    { id: 'stats', label: 'Statistik', icon: '📈' },
    { id: 'galleries', label: 'Galeri Foto', icon: '🖼️' },
    { id: 'map', label: 'Peta Desa', icon: '🗺️' },
    { id: 'articles', label: 'Berita', icon: '📰' }
  ]

  const pendingLetters = letterSubmissions.filter(s => s.status === 'pending').length
  const pendingComplaints = complaintSubmissions.filter(s => s.status === 'pending').length
  const badge = (n) => n > 0 && (
    <span style={{ marginLeft: 'auto', background: '#ef4444', color: 'white', fontSize: '11px', padding: '2px 8px', borderRadius: '10px', fontWeight: 'bold' }}>{n}</span>
  )

  const AdminLayoutComponent = ({ children, title }) => (
    <div style={{ minHeight: '100vh', background: darkMode ? '#0f172a' : '#f1f5f9', display: 'flex', transition: 'all 0.3s' }}>
      <aside style={{ width: sidebarCollapsed ? '80px' : '280px', background: darkMode ? 'linear-gradient(180deg, #1e293b 0%, #0f172a 100%)' : 'linear-gradient(180deg, #2d8a5e 0%, #1e5d3f 100%)', color: 'white', padding: '20px 0', position: 'fixed', height: '100vh', overflowY: 'auto', transition: 'all 0.3s ease', zIndex: 100, boxShadow: '4px 0 20px rgba(0,0,0,0.1)' }}>
        <div style={{ padding: '0 20px 20px', borderBottom: '1px solid rgba(255,255,255,0.1)', marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {!sidebarCollapsed && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <img src={tomohon} alt="Logo Tomohon" style={{ width: '45px', height: '45px', objectFit: 'contain', flexShrink: 0 }} />
              <div>
                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '700' }}>Admin Panel</h3>
                <p style={{ margin: 0, fontSize: '11px', opacity: 0.8 }}>Kelurahan Woloan Dua</p>
              </div>
            </div>
          )}
          <button onClick={() => setSidebarCollapsed(!sidebarCollapsed)} style={{ background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white', width: '32px', height: '32px', borderRadius: '8px', cursor: 'pointer', fontSize: '16px' }}>
            {sidebarCollapsed ? '→' : '←'}
          </button>
        </div>
        <nav style={{ padding: '0 10px' }}>
          {adminMenuItems.map(item => (
            <button key={item.id} onClick={() => setAdminPage(item.id)} style={{ width: '100%', padding: sidebarCollapsed ? '14px 0' : '14px 16px', background: adminPage === item.id ? 'rgba(255,255,255,0.2)' : 'transparent', color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer', fontSize: '14px', fontWeight: adminPage === item.id ? '700' : '500', display: 'flex', alignItems: 'center', justifyContent: sidebarCollapsed ? 'center' : 'flex-start', gap: '12px', marginBottom: '6px', transition: 'all 0.3s', boxShadow: adminPage === item.id ? '0 4px 15px rgba(0,0,0,0.2)' : 'none' }}
              onMouseEnter={(e) => { if (adminPage !== item.id) e.currentTarget.style.background = 'rgba(255,255,255,0.1)' }}
              onMouseLeave={(e) => { if (adminPage !== item.id) e.currentTarget.style.background = 'transparent' }}>
              <span style={{ fontSize: '20px' }}>{item.icon}</span>
              {!sidebarCollapsed && <span>{item.label}</span>}
              {!sidebarCollapsed && item.id === 'letters' && badge(pendingLetters)}
              {!sidebarCollapsed && item.id === 'complaints' && badge(pendingComplaints)}
            </button>
          ))}
        </nav>
        <div style={{ padding: '20px 10px', borderTop: '1px solid rgba(255,255,255,0.1)', marginTop: '20px' }}>
          <button onClick={() => setAdminView('home')} style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.15)', color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer', fontSize: '13px', marginBottom: '8px', display: 'flex', alignItems: 'center', justifyContent: sidebarCollapsed ? 'center' : 'flex-start', gap: '10px', fontWeight: '600' }}>
            <span>🌐</span> {!sidebarCollapsed && 'Lihat Website'}
          </button>
          <button onClick={handleAdminLogout} style={{ width: '100%', padding: '12px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer', fontSize: '13px', display: 'flex', alignItems: 'center', justifyContent: sidebarCollapsed ? 'center' : 'flex-start', gap: '10px', fontWeight: '600' }}>
            <span>🚪</span> {!sidebarCollapsed && 'Logout'}
          </button>
        </div>
      </aside>

      <div style={{ marginLeft: sidebarCollapsed ? '80px' : '280px', flex: 1, transition: 'all 0.3s', minWidth: 0 }}>
        <header style={{ background: c.card, padding: '16px 30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', position: 'sticky', top: 0, zIndex: 50 }}>
          <h2 style={{ color: c.text, margin: 0, fontSize: '22px', fontWeight: '800' }}>{title}</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <input type="text" placeholder="🔍 Cari..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
              style={{ padding: '10px 16px', border: `2px solid ${c.line}`, borderRadius: '12px', background: c.inner, color: c.text, outline: 'none', width: '200px', fontSize: '14px' }} />
            <button onClick={() => setDarkMode(!darkMode)} title={darkMode ? 'Aktifkan Mode Terang' : 'Aktifkan Mode Gelap'} style={{ width: '42px', height: '42px', borderRadius: '12px', border: 'none', background: darkMode ? 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)' : 'linear-gradient(135deg, #1e293b 0%, #334155 100%)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 15px rgba(0,0,0,0.15)' }}>
              {darkMode ? (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1e293b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="5"></circle>
                  <line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line>
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                  <line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line>
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                </svg>
              ) : (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                </svg>
              )}
            </button>
            <div style={{ position: 'relative' }}>
              <button onClick={() => setShowNotifications(!showNotifications)} style={{ width: '42px', height: '42px', borderRadius: '12px', border: 'none', background: darkMode ? '#334155' : '#f1f5f9', cursor: 'pointer', fontSize: '18px', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                🔔
                {(pendingLetters > 0 || pendingComplaints > 0) && (
                  <span style={{ position: 'absolute', top: '8px', right: '8px', width: '10px', height: '10px', background: '#ef4444', borderRadius: '50%', border: `2px solid ${c.card}`, animation: 'pulse 2s infinite' }}></span>
                )}
              </button>
              {showNotifications && (
                <div style={{ position: 'absolute', top: '55px', right: 0, width: '300px', background: c.card, borderRadius: '16px', boxShadow: '0 10px 40px rgba(0,0,0,0.15)', padding: '16px', zIndex: 200, border: `1px solid ${c.line}` }}>
                  <h4 style={{ margin: '0 0 12px', color: c.text, fontSize: '15px' }}>🔔 Notifikasi</h4>
                  {pendingLetters > 0 && (
                    <div style={{ padding: '12px', background: darkMode ? '#0f172a' : '#f0fdf4', borderRadius: '10px', marginBottom: '8px' }}>
                      <p style={{ margin: 0, fontSize: '13px', color: c.text }}>📋 {pendingLetters} pengajuan surat baru</p>
                    </div>
                  )}
                  {pendingComplaints > 0 && (
                    <div style={{ padding: '12px', background: darkMode ? '#0f172a' : '#fef3c7', borderRadius: '10px' }}>
                      <p style={{ margin: 0, fontSize: '13px', color: c.text }}>📢 {pendingComplaints} pengaduan baru</p>
                    </div>
                  )}
                  {pendingLetters === 0 && pendingComplaints === 0 && <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>Tidak ada notifikasi baru</p>}
                </div>
              )}
            </div>
            <div style={{ position: 'relative' }}>
              <button onClick={() => setShowProfileMenu(!showProfileMenu)} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '6px 12px 6px 6px', background: darkMode ? '#334155' : '#f1f5f9', border: 'none', borderRadius: '30px', cursor: 'pointer' }}>
                <div style={{ width: '36px', height: '36px', background: 'linear-gradient(135deg, #2d8a5e 0%, #1e5d3f 100%)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', fontSize: '14px' }}>
                  {adminName.charAt(0).toUpperCase()}
                </div>
                <span style={{ color: c.text, fontSize: '14px', fontWeight: '600' }}>{adminName}</span>
              </button>
              {showProfileMenu && (
                <div style={{ position: 'absolute', top: '55px', right: 0, width: '200px', background: c.card, borderRadius: '16px', boxShadow: '0 10px 40px rgba(0,0,0,0.15)', padding: '8px', zIndex: 200, border: `1px solid ${c.line}` }}>
                  <div style={{ padding: '12px', borderBottom: `1px solid ${c.line}`, marginBottom: '8px' }}>
                    <p style={{ margin: 0, fontWeight: '700', color: c.text, fontSize: '14px' }}>{adminName}</p>
                    <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#64748b' }}>Administrator</p>
                  </div>
                  <button onClick={() => { setShowProfileMenu(false); setAdminPage('profile') }} style={{ width: '100%', padding: '10px', background: 'transparent', border: 'none', color: c.text, cursor: 'pointer', textAlign: 'left', fontSize: '13px', borderRadius: '8px' }}>⚙️ Pengaturan</button>
                  <button onClick={handleAdminLogout} style={{ width: '100%', padding: '10px', background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', textAlign: 'left', fontSize: '13px', borderRadius: '8px' }}>🚪 Logout</button>
                </div>
              )}
            </div>
          </div>
        </header>
        <div style={{ padding: '30px' }}>{children}</div>
      </div>

      {renderModal()}

      <div style={{ position: 'fixed', bottom: '30px', right: '30px', zIndex: 9999, display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {toasts.map(toast => (
          <div key={toast.id} style={{ padding: '16px 24px', borderRadius: '12px', color: 'white', fontWeight: '600', fontSize: '14px', background: toast.type === 'success' ? 'linear-gradient(135deg, #2d8a5e 0%, #1e5d3f 100%)' : toast.type === 'error' ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)' : 'linear-gradient(135deg, #10b981 0%, #059669 100%)', boxShadow: '0 10px 30px rgba(0,0,0,0.2)', animation: 'slideInRight 0.4s', minWidth: '250px' }}>
            {toast.type === 'success' ? '✅' : toast.type === 'error' ? '❌' : 'ℹ️'} {toast.message}
          </div>
        ))}
      </div>
      <style>{`
        @keyframes slideInRight { from { opacity: 0; transform: translateX(100px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.05); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  )
  adminLayoutFn.current = AdminLayoutComponent

  // ==========================================
  // RENDER: HALAMAN ADMIN
  // ==========================================
  if (adminView === 'admin' && adminPage === 'dashboard') {
    const stats = [
      { label: 'Total Berita', value: animatedStats.articles, icon: '📰', bg: '#dcfce7', change: '+12%' },
      { label: 'Perangkat Desa', value: animatedStats.officials, icon: '👨‍💼', bg: '#d1fae5', change: '+5%' },
      { label: 'Data Statistik', value: animatedStats.stats, icon: '📊', bg: '#ccfbf1', change: '+8%' },
      { label: 'Foto Galeri', value: animatedStats.galleries, icon: '🖼️', bg: '#a7f3d0', change: '+15%' }
    ]
    const quickActions = [
      { label: 'Tambah Berita', icon: '📰', color: '#2d8a5e', action: () => openAddForm('article') },
      { label: 'Tambah Perangkat', icon: '👨‍💼', color: '#10b981', action: () => openAddForm('official') },
      { label: 'Tambah Statistik', icon: '📈', color: '#14b8a6', action: () => openAddForm('stat') },
      { label: 'Tambah Foto', icon: '🖼️', color: '#059669', action: () => openAddForm('gallery') }
    ]
    const systemStatus = [
      { label: 'Pengajuan Surat Baru', status: pendingLetters, color: '#f59e0b', icon: '📋' },
      { label: 'Pengaduan Baru', status: pendingComplaints, color: '#ef4444', icon: '📢' },
      { label: 'Kunjungan Hari Ini', status: visitorCount, color: '#2d8a5e', icon: '👥' },
      { label: 'Total Konten', status: articles.length + statistics.length + galleries.length, color: '#059669', icon: '📁' }
    ]
    return (
      <AdminLayout title="Dashboard">
        <div style={{ background: 'linear-gradient(135deg, #2d8a5e 0%, #1e5d3f 100%)', borderRadius: '24px', padding: '40px', marginBottom: '30px', color: 'white', position: 'relative', overflow: 'hidden', boxShadow: '0 20px 40px rgba(45, 138, 94, 0.3)' }}>
          <div style={{ position: 'absolute', top: 0, right: 0, width: '300px', height: '100%', backgroundImage: `url(${gunung})`, backgroundSize: 'cover', opacity: 0.15 }}></div>
          <div style={{ position: 'relative', zIndex: 1 }}>
            <h1 style={{ fontSize: '36px', marginBottom: '10px', fontWeight: '800' }}>Selamat Datang, {adminName}! 👋</h1>
            <p style={{ fontSize: '16px', opacity: 0.9, marginBottom: '25px' }}>Kelola konten website Kelurahan Woloan Dua</p>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <button onClick={() => setAdminPage('articles')} style={{ padding: '14px 28px', background: 'white', color: '#2d8a5e', border: 'none', borderRadius: '12px', fontWeight: 'bold', fontSize: '15px', cursor: 'pointer', boxShadow: '0 4px 15px rgba(0,0,0,0.2)' }}>📰 Kelola Berita</button>
              <button onClick={() => setAdminPage('profile')} style={{ padding: '14px 28px', background: 'rgba(255,255,255,0.2)', color: 'white', border: '2px solid rgba(255,255,255,0.3)', borderRadius: '12px', fontWeight: 'bold', fontSize: '15px', cursor: 'pointer' }}>🏛️ Edit Profil</button>
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '30px' }}>
          {stats.map((stat, i) => (
            <div key={i} style={{ ...cardStyle, transition: 'all 0.3s' }} {...lift}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
                <div>
                  <p style={{ color: c.sub, fontSize: '13px', margin: '0 0 8px', fontWeight: '600' }}>{stat.label}</p>
                  <h3 style={{ color: c.text, fontSize: '36px', margin: 0, fontWeight: '800' }}>{stat.value}</h3>
                </div>
                <div style={{ width: '55px', height: '55px', background: stat.bg, borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px' }}>{stat.icon}</div>
              </div>
              <span style={{ color: '#10b981', fontSize: '13px', fontWeight: '700' }}>↑ {stat.change}</span>
              <span style={{ color: darkMode ? '#64748b' : '#94a3b8', fontSize: '12px', marginLeft: '6px' }}>dari bulan lalu</span>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
          <div style={cardStyle}>
            <h3 style={{ color: c.text, marginTop: 0, marginBottom: '20px', fontSize: '18px', fontWeight: '700' }}>⚡ Aksi Cepat</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
              {quickActions.map((a, i) => (
                <button key={i} onClick={a.action} style={{ padding: '20px', background: c.inner, border: `2px solid ${c.line}`, borderRadius: '16px', cursor: 'pointer', textAlign: 'left', transition: 'all 0.3s', display: 'flex', alignItems: 'center', gap: '15px' }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = a.color; e.currentTarget.style.transform = 'translateY(-3px)' }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = c.line; e.currentTarget.style.transform = 'translateY(0)' }}>
                  <div style={{ width: '45px', height: '45px', background: a.color, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', flexShrink: 0 }}>{a.icon}</div>
                  <span style={{ color: c.text, fontWeight: '600', fontSize: '14px' }}>{a.label}</span>
                </button>
              ))}
            </div>
          </div>
          <div style={cardStyle}>
            <h3 style={{ color: c.text, marginTop: 0, marginBottom: '20px', fontSize: '18px', fontWeight: '700' }}>📡 Ringkasan</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {systemStatus.map((item, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: c.inner, borderRadius: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '20px' }}>{item.icon}</span>
                    <span style={{ color: c.text, fontSize: '13px', fontWeight: '600' }}>{item.label}</span>
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

  if (adminView === 'admin' && adminPage === 'letters') {
    const q = searchQuery.toLowerCase()
    const list = letterSubmissions.filter(l => (l.name || '').toLowerCase().includes(q) || (l.type || '').toLowerCase().includes(q))
    const statusMap = {
      pending: ['⏳ Menunggu', '#fef3c7', '#92400e'],
      processed: ['✅ Diproses', '#d1fae5', '#065f46'],
      rejected: ['❌ Ditolak', '#fee2e2', '#991b1b']
    }
    return (
      <AdminLayout title="Pengajuan Surat Online">
        {pageHeader(`Daftar Pengajuan (${list.length})`, 'Kelola pengajuan surat dari warga')}
        {list.length === 0 ? emptyBox('📋', 'Belum ada pengajuan surat') : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {list.map((letter) => {
              const [label, bg, fg] = statusMap[letter.status] || statusMap.pending
              return (
                <div key={letter.id} style={{ ...cardStyle, padding: '20px', borderRadius: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px', gap: '12px' }}>
                    <div>
                      <h4 style={{ color: c.text, margin: '0 0 8px', fontSize: '18px', fontWeight: '700' }}>{letter.name}</h4>
                      <p style={{ color: c.sub, margin: 0, fontSize: '14px' }}>📞 {letter.phone} • 📍 {letter.address}</p>
                    </div>
                    <span style={{ padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '700', whiteSpace: 'nowrap', background: bg, color: fg }}>{label}</span>
                  </div>
                  <div style={{ background: c.inner, padding: '15px', borderRadius: '12px', marginBottom: '15px' }}>
                    <p style={{ margin: '0 0 8px', color: c.sub, fontSize: '13px', fontWeight: '600' }}>Jenis Surat:</p>
                    <p style={{ margin: '0 0 12px', color: c.text, fontWeight: '600' }}>{letter.type}</p>
                    <p style={{ margin: '0 0 8px', color: c.sub, fontSize: '13px', fontWeight: '600' }}>Keperluan:</p>
                    <p style={{ margin: 0, color: c.text, whiteSpace: 'pre-wrap' }}>{letter.purpose}</p>
                  </div>
                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    {letter.status === 'pending' && (
                      <>
                        {actionBtn('✅ Tandai Diproses', '#10b981', () => updateLetterStatus(letter.id, 'processed'))}
                        {actionBtn('❌ Tolak', '#ef4444', () => updateLetterStatus(letter.id, 'rejected'))}
                      </>
                    )}
                    {actionBtn('🗑️ Hapus', c.soft, () => deleteLetterSubmission(letter.id), darkMode ? 'white' : '#64748b')}
                  </div>
                  <p style={{ margin: '12px 0 0', fontSize: '12px', color: darkMode ? '#64748b' : '#94a3b8' }}>📅 Diajukan: {new Date(letter.submittedAt).toLocaleString('id-ID')}</p>
                </div>
              )
            })}
          </div>
        )}
      </AdminLayout>
    )
  }

  if (adminView === 'admin' && adminPage === 'complaints') {
    const q = searchQuery.toLowerCase()
    const list = complaintSubmissions.filter(x => (x.message || '').toLowerCase().includes(q) || (x.category || '').toLowerCase().includes(q))
    const statusMap = {
      pending: ['⏳ Baru', '#fef3c7', '#92400e'],
      in_progress: ['🔄 Dalam Proses', '#e0f2fe', '#0369a1'],
      resolved: ['✅ Selesai', '#d1fae5', '#065f46']
    }
    return (
      <AdminLayout title="Pengaduan Warga">
        {pageHeader(`Daftar Pengaduan (${list.length})`, 'Kelola pengaduan dan saran dari warga')}
        {list.length === 0 ? emptyBox('📢', 'Belum ada pengaduan') : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {list.map((item) => {
              const [label, bg, fg] = statusMap[item.status] || statusMap.pending
              return (
                <div key={item.id} style={{ ...cardStyle, padding: '20px', borderRadius: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px', gap: '12px' }}>
                    <div>
                      <h4 style={{ color: c.text, margin: '0 0 8px', fontSize: '18px', fontWeight: '700' }}>{item.anonymous ? '👤 Anonim' : item.name}</h4>
                      <p style={{ color: c.sub, margin: 0, fontSize: '14px' }}>
                        {item.phone && `📞 ${item.phone}`}{item.phone && item.location && ' • '}{item.location && `📍 ${item.location}`}
                      </p>
                    </div>
                    <span style={{ padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '700', whiteSpace: 'nowrap', background: bg, color: fg }}>{label}</span>
                  </div>
                  <div style={{ background: c.inner, padding: '15px', borderRadius: '12px', marginBottom: '15px' }}>
                    <p style={{ margin: '0 0 8px', color: c.sub, fontSize: '13px', fontWeight: '600' }}>Kategori: <span style={{ color: c.text }}>{item.category || '-'}</span></p>
                    <p style={{ margin: '12px 0 8px', color: c.sub, fontSize: '13px', fontWeight: '600' }}>Isi Pengaduan:</p>
                    <p style={{ margin: 0, color: c.text, lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>{item.message}</p>
                  </div>
                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    {item.status === 'pending' && (
                      <>
                        {actionBtn('🔄 Proses', '#3b82f6', () => updateComplaintStatus(item.id, 'in_progress'))}
                        {actionBtn('✅ Selesai', '#10b981', () => updateComplaintStatus(item.id, 'resolved'))}
                      </>
                    )}
                    {item.status === 'in_progress' && actionBtn('✅ Tandai Selesai', '#10b981', () => updateComplaintStatus(item.id, 'resolved'))}
                    {actionBtn('🗑️ Hapus', c.soft, () => deleteComplaintSubmission(item.id), darkMode ? 'white' : '#64748b')}
                  </div>
                  <p style={{ margin: '12px 0 0', fontSize: '12px', color: darkMode ? '#64748b' : '#94a3b8' }}>📅 Dikirim: {new Date(item.submittedAt).toLocaleString('id-ID')}</p>
                </div>
              )
            })}
          </div>
        )}
      </AdminLayout>
    )
  }

  if (adminView === 'admin' && adminPage === 'profile') {
    return (
      <AdminLayout title="Kelola Profil Kelurahan">
        <div style={{ ...cardStyle, padding: '30px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '30px', paddingBottom: '20px', borderBottom: `2px solid ${darkMode ? '#334155' : '#f1f5f9'}` }}>
            <div style={{ width: '80px', height: '80px', background: 'linear-gradient(135deg, #2d8a5e 0%, #1e5d3f 100%)', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '40px' }}>🏛️</div>
            <div>
              <h3 style={{ color: c.text, margin: 0, fontSize: '22px', fontWeight: '800' }}>Informasi Kelurahan</h3>
              <p style={{ color: c.sub, margin: '5px 0 0', fontSize: '14px' }}>Edit informasi dasar kelurahan</p>
            </div>
          </div>
          <form onSubmit={handleSaveProfile}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '20px' }}>
              <div>
                <label style={lblStyle}>📛 Nama Kelurahan</label>
                <input type="text" value={profileForm.name || ''} onChange={e => setProfileForm({ ...profileForm, name: e.target.value })} required style={fieldStyle} />
              </div>
              <div>
                <label style={lblStyle}>📞 Telepon</label>
                <input type="text" value={profileForm.phone || ''} onChange={e => setProfileForm({ ...profileForm, phone: e.target.value })} required style={fieldStyle} />
              </div>
            </div>
            <div style={{ marginBottom: '20px' }}>
              <label style={lblStyle}>📍 Alamat</label>
              <input type="text" value={profileForm.address || ''} onChange={e => setProfileForm({ ...profileForm, address: e.target.value })} required style={fieldStyle} />
            </div>
            <div style={{ marginBottom: '25px' }}>
              <label style={lblStyle}>📝 Deskripsi</label>
              <textarea value={profileForm.description || ''} onChange={e => setProfileForm({ ...profileForm, description: e.target.value })} required rows="5" style={{ ...fieldStyle, fontFamily: 'inherit', resize: 'vertical' }}></textarea>
            </div>
            <button type="submit" disabled={adminLoading} style={{ padding: '14px 32px', background: 'linear-gradient(135deg, #2d8a5e 0%, #1e5d3f 100%)', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 'bold', fontSize: '15px', cursor: adminLoading ? 'not-allowed' : 'pointer', boxShadow: '0 4px 15px rgba(45, 138, 94, 0.4)' }}>
              {adminLoading ? '⏳ Menyimpan...' : '💾 Simpan Perubahan'}
            </button>
          </form>
        </div>
      </AdminLayout>
    )
  }

  if (adminView === 'admin' && adminPage === 'officials') {
    const q = searchQuery.toLowerCase()
    const list = sortedOfficials.filter(o => (o.name || '').toLowerCase().includes(q) || (o.position || '').toLowerCase().includes(q))
    return (
      <AdminLayout title="Kelola Perangkat Desa">
        {pageHeader(`Daftar Perangkat (${list.length})`, 'Kelola struktur organisasi kelurahan',
          addButton('➕ Tambah Perangkat', 'linear-gradient(135deg, #10b981 0%, #059669 100%)', 'rgba(16, 185, 129, 0.4)', () => openAddForm('official')))}
        {list.length === 0 ? emptyBox('👨‍💼', searchQuery ? 'Tidak ada hasil pencarian' : 'Belum ada data perangkat') : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
            {list.map((o) => (
              <div key={getItemId(o)} style={{ ...cardStyle, transition: 'all 0.3s', position: 'relative', overflow: 'hidden' }} {...lift}>
                <div style={{ position: 'absolute', top: 0, right: 0, width: '80px', height: '80px', background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', borderRadius: '0 0 0 80px', opacity: 0.1 }}></div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px' }}>
                  <div style={{ width: '55px', height: '55px', background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '24px', fontWeight: 'bold' }}>{(o.name || '?').charAt(0).toUpperCase()}</div>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ color: c.text, margin: 0, fontSize: '16px', fontWeight: '700' }}>{o.name}</h4>
                    <p style={{ color: '#10b981', margin: '4px 0 0', fontSize: '13px', fontWeight: '600' }}>{o.position}</p>
                  </div>
                </div>
                {editDeleteButtons('#10b981', () => openEditForm('official', o), () => handleDeleteOfficial(getItemId(o)))}
              </div>
            ))}
          </div>
        )}
      </AdminLayout>
    )
  }

  if (adminView === 'admin' && adminPage === 'stats') {
    const list = statistics.filter(s => (s.category || '').toLowerCase().includes(searchQuery.toLowerCase()))
    return (
      <AdminLayout title="Kelola Statistik">
        {pageHeader(`Data Statistik (${list.length})`, 'Infografis dan data kelurahan',
          addButton('📈 Tambah Statistik', 'linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)', 'rgba(20, 184, 166, 0.4)', () => openAddForm('stat')))}
        {list.length === 0 ? emptyBox('📈', 'Belum ada data statistik') : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
            {list.map((s) => (
              <div key={getItemId(s)} style={{ ...cardStyle, transition: 'all 0.3s', textAlign: 'center' }} {...lift}>
                <div style={{ width: '70px', height: '70px', margin: '0 auto 15px', background: 'linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px' }}>📊</div>
                <h3 style={{ color: c.text, fontSize: '32px', margin: '0 0 8px', fontWeight: '800' }}>{s.value}</h3>
                <p style={{ color: '#14b8a6', margin: '0 0 8px', fontSize: '14px', fontWeight: '700' }}>{s.category}</p>
                <p style={{ color: c.sub, margin: '0 0 20px', fontSize: '12px' }}>Tahun {s.year}</p>
                {editDeleteButtons('#14b8a6', () => openEditForm('stat', s), () => handleDeleteStat(getItemId(s)))}
              </div>
            ))}
          </div>
        )}
      </AdminLayout>
    )
  }

  if (adminView === 'admin' && adminPage === 'galleries') {
    const list = galleries.filter(g => (g.title || '').toLowerCase().includes(searchQuery.toLowerCase()))
    return (
      <AdminLayout title="Kelola Galeri Foto">
        {pageHeader(`Galeri Foto (${list.length})`, 'Dokumentasi kegiatan kelurahan',
          addButton('🖼️ Tambah Foto', 'linear-gradient(135deg, #059669 0%, #047857 100%)', 'rgba(5, 150, 105, 0.4)', () => openAddForm('gallery')))}
        {list.length === 0 ? emptyBox('🖼️', 'Belum ada foto') : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
            {list.map((photo, i) => (
              <div key={getItemId(photo)} style={{ ...cardStyle, padding: 0, overflow: 'hidden', transition: 'all 0.3s' }} {...lift}>
                <div style={{ height: '180px', overflow: 'hidden', position: 'relative' }}>
                  <img src={photo.image_url} alt={photo.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(0,0,0,0.7)', color: 'white', padding: '6px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: '600' }}>#{i + 1}</div>
                </div>
                <div style={{ padding: '20px' }}>
                  <h4 style={{ color: c.text, margin: '0 0 15px', fontSize: '15px', fontWeight: '700' }}>{photo.title}</h4>
                  {editDeleteButtons('#059669', () => openEditForm('gallery', photo), () => handleDeleteGallery(getItemId(photo)))}
                </div>
              </div>
            ))}
          </div>
        )}
      </AdminLayout>
    )
  }

  if (adminView === 'admin' && adminPage === 'map') {
    const mapFieldStyle = { ...fieldStyle, padding: '12px', fontSize: '14px' }
    return (
      <AdminLayout title="Kelola Peta Desa">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '25px' }}>
          <div style={{ ...cardStyle, padding: '30px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '25px' }}>
              <div style={{ width: '60px', height: '60px', background: 'linear-gradient(135deg, #059669 0%, #047857 100%)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '30px' }}>🗺️</div>
              <div>
                <h3 style={{ color: c.text, margin: 0, fontSize: '22px', fontWeight: '800' }}>Koordinat Peta</h3>
                <p style={{ color: c.sub, margin: '5px 0 0', fontSize: '14px' }}>Atur lokasi kelurahan di peta</p>
              </div>
            </div>
            <form onSubmit={handleSaveMap}>
              <div style={{ marginBottom: '18px' }}>
                <label style={lblStyle}>📍 Alamat Lengkap</label>
                <textarea value={mapForm.address || ''} onChange={e => setMapForm({ ...mapForm, address: e.target.value })} required rows="3" style={{ ...mapFieldStyle, fontFamily: 'inherit', resize: 'vertical' }}></textarea>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '18px' }}>
                <div>
                  <label style={lblStyle}>Latitude</label>
                  <input type="number" step="any" value={mapForm.lat ?? ''} onChange={e => setMapForm({ ...mapForm, lat: parseFloat(e.target.value) })} required style={mapFieldStyle} />
                </div>
                <div>
                  <label style={lblStyle}>Longitude</label>
                  <input type="number" step="any" value={mapForm.lng ?? ''} onChange={e => setMapForm({ ...mapForm, lng: parseFloat(e.target.value) })} required style={mapFieldStyle} />
                </div>
              </div>
              <div style={{ marginBottom: '20px' }}>
                <label style={lblStyle}>🔎 Zoom Level (1-20)</label>
                <input type="number" min="1" max="20" value={mapForm.zoom || 15} onChange={e => setMapForm({ ...mapForm, zoom: parseInt(e.target.value) })} style={mapFieldStyle} />
              </div>
              <div style={{ background: '#f0fdf4', padding: '15px', borderRadius: '12px', marginBottom: '20px', border: '1px solid #bbf7d0' }}>
                <p style={{ margin: 0, fontSize: '13px', color: '#166534' }}>💡 <strong>Cara dapat koordinat:</strong><br />1. Buka <a href="https://maps.google.com" target="_blank" rel="noopener noreferrer" style={{ color: '#2d8a5e' }}>Google Maps</a><br />2. Klik kanan di lokasi kelurahan<br />3. Copy angka koordinat yang muncul</p>
              </div>
              <button type="submit" disabled={adminLoading} style={{ width: '100%', padding: '14px', background: 'linear-gradient(135deg, #059669 0%, #047857 100%)', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 'bold', fontSize: '15px', cursor: adminLoading ? 'not-allowed' : 'pointer', boxShadow: '0 4px 15px rgba(5, 150, 105, 0.4)' }}>
                {adminLoading ? '⏳ Menyimpan...' : '💾 Simpan Koordinat'}
              </button>
            </form>
          </div>
          <div style={{ ...cardStyle, padding: '30px' }}>
            <h3 style={{ color: c.text, margin: '0 0 20px', fontSize: '20px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '10px' }}><span style={{ fontSize: '24px' }}>👁️</span> Preview Peta</h3>
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

  if (adminView === 'admin' && adminPage === 'articles') {
    const list = articles.filter(a => (a.title || '').toLowerCase().includes(searchQuery.toLowerCase()))
    return (
      <AdminLayout title="Kelola Berita">
        {pageHeader(`Daftar Berita (${list.length})`, 'Kelola semua berita yang dipublikasikan',
          addButton('➕ Tambah Berita', 'linear-gradient(135deg, #2d8a5e 0%, #1e5d3f 100%)', 'rgba(45, 138, 94, 0.4)', () => openAddForm('article')))}
        {list.length === 0 ? emptyBox('📰', 'Belum ada berita') : (
          <div style={{ ...cardStyle, padding: 0, overflow: 'hidden' }}>
            {list.map((article, i) => (
              <div key={getItemId(article)} style={{ padding: '20px 25px', display: 'flex', alignItems: 'center', gap: '20px', borderBottom: `1px solid ${darkMode ? '#334155' : '#f1f5f9'}`, transition: 'all 0.3s' }}
                onMouseEnter={(e) => { e.currentTarget.style.background = c.inner }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}>
                <div style={{ width: '50px', height: '50px', background: 'linear-gradient(135deg, #2d8a5e 0%, #1e5d3f 100%)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', fontSize: '18px', flexShrink: 0 }}>{i + 1}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h4 style={{ color: c.text, margin: '0 0 5px', fontSize: '16px', fontWeight: '700', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{article.title}</h4>
                  <p style={{ color: c.sub, margin: 0, fontSize: '13px' }}>✍️ {article.author || 'Admin'} • 📅 {article.created_at ? new Date(article.created_at).toLocaleDateString('id-ID') : '-'}</p>
                </div>
                <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                  <button onClick={() => openEditForm('article', article)} style={{ padding: '10px 18px', background: '#10b981', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontSize: '13px', fontWeight: '600' }}>✏️ Edit</button>
                  <button onClick={() => handleDeleteArticle(getItemId(article))} style={{ padding: '10px 18px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontSize: '13px', fontWeight: '600' }}>🗑️ Hapus</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </AdminLayout>
    )
  }

  // ==========================================
  // MODAL ADMIN (CRUD)
  // ==========================================
  function renderModal() {
    if (!showModal) return null
    const modalConfig = {
      article: { title: isEditMode ? '✏️ Edit Berita' : '➕ Tambah Berita Baru', icon: '📰', color: '#2d8a5e', data: formData, setData: setFormData, onSave: handleSaveArticle, fields: [
        { name: 'title', label: 'Judul Berita *', type: 'text', required: true },
        { name: 'author', label: 'Penulis', type: 'text', required: false },
        { name: 'image_url', label: 'Gambar Berita *', type: 'image', required: true, preview: true },
        { name: 'content', label: 'Isi Berita *', type: 'textarea', required: true, rows: 8 }
      ] },
      official: { title: isEditMode ? '✏️ Edit Perangkat' : '➕ Tambah Perangkat Baru', icon: '👨‍💼', color: '#10b981', data: officialForm, setData: setOfficialForm, onSave: handleAddOfficial, fields: [
        { name: 'name', label: 'Nama Lengkap *', type: 'text', required: true },
        { name: 'position', label: 'Jabatan *', type: 'select', required: true, options: ['Lurah', 'Sekretaris Lurah', 'Kepala Seksi Pemerintahan', 'Kepala Seksi Pelayanan', 'Kepala Seksi Kesejahteraan', 'Ketua RW', 'Ketua RT', 'Lainnya'] }
      ] },
      stat: { title: isEditMode ? '✏️ Edit Statistik' : '➕ Tambah Statistik Baru', icon: '📈', color: '#14b8a6', data: statForm, setData: setStatForm, onSave: handleAddStat, fields: [
        { name: 'category', label: 'Kategori *', type: 'text', required: true, placeholder: 'Contoh: Jumlah Penduduk' },
        { name: 'value', label: 'Nilai *', type: 'text', required: true, placeholder: 'Contoh: 3.245' },
        { name: 'year', label: 'Tahun *', type: 'number', required: true }
      ] },
      gallery: { title: isEditMode ? '✏️ Edit Foto' : '➕ Tambah Foto Baru', icon: '🖼️', color: '#059669', data: galleryForm, setData: setGalleryForm, onSave: handleAddGallery, fields: [
        { name: 'title', label: 'Judul Foto *', type: 'text', required: true },
        { name: 'image_url', label: 'Gambar Foto *', type: 'image', required: true, preview: true }
      ] }
    }
    const config = modalConfig[showModal]
    if (!config) return null
    return (
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px', animation: 'fadeIn 0.3s' }}>
        <div style={{ background: c.card, borderRadius: '24px', padding: '35px', width: '100%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 25px 50px rgba(0,0,0,0.3)', animation: 'slideUp 0.4s' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px', paddingBottom: '20px', borderBottom: `2px solid ${darkMode ? '#334155' : '#f1f5f9'}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <div style={{ width: '55px', height: '55px', background: config.color, borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px' }}>{config.icon}</div>
              <h3 style={{ color: c.text, margin: 0, fontSize: '22px', fontWeight: '800' }}>{config.title}</h3>
            </div>
            <button onClick={() => setShowModal(null)} style={{ width: '40px', height: '40px', background: darkMode ? '#334155' : '#f1f5f9', border: 'none', borderRadius: '12px', cursor: 'pointer', fontSize: '20px', color: darkMode ? 'white' : '#64748b' }}>✕</button>
          </div>
          <form onSubmit={config.onSave}>
            {config.fields.map(field => (
              <div key={field.name} style={{ marginBottom: '20px' }}>
                <label style={lblStyle}>{field.label}</label>
                {field.type === 'image' ? (
                  <div>
                    <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                      {[{ id: 'upload', label: '📁 Upload File' }, { id: 'url', label: '🔗 Pakai Link' }].map(m => (
                        <button key={m.id} type="button" onClick={() => setImageMode(m.id)} style={{ flex: 1, padding: '10px', borderRadius: '10px', border: `2px solid ${imageMode === m.id ? config.color : c.line}`, background: imageMode === m.id ? config.color : 'transparent', color: imageMode === m.id ? 'white' : (darkMode ? 'white' : '#475569'), fontWeight: '600', fontSize: '13px', cursor: 'pointer' }}>{m.label}</button>
                      ))}
                    </div>
                    {imageMode === 'upload' ? (
                      <label style={{ display: 'block', padding: '22px', border: `2px dashed ${darkMode ? '#334155' : '#cbd5e1'}`, borderRadius: '12px', textAlign: 'center', cursor: 'pointer', color: c.sub, fontSize: '14px', background: c.inner }}>
                        {imageProcessing ? '⏳ Memproses gambar...' : '📤 Klik untuk memilih gambar (JPG/PNG/WEBP, maks 10 MB)'}
                        <input type="file" accept="image/*" style={{ display: 'none' }} onChange={e => { handleImageFile(e.target.files[0], config.setData, config.data, field.name); e.target.value = '' }} />
                      </label>
                    ) : (
                      <input type="url" value={(config.data[field.name] || '').startsWith('data:') ? '' : (config.data[field.name] || '')} onChange={e => config.setData({ ...config.data, [field.name]: e.target.value })} placeholder="https://contoh.com/gambar.jpg" style={fieldStyle} />
                    )}
                    {!config.data[field.name] && <p style={{ margin: '8px 0 0', color: '#ef4444', fontSize: '12px', fontWeight: '600' }}>* Gambar wajib diisi</p>}
                    {config.data[field.name] && (
                      <button type="button" onClick={() => config.setData({ ...config.data, [field.name]: '' })} style={{ marginTop: '8px', padding: '6px 12px', background: 'transparent', border: '1px solid #ef4444', color: '#ef4444', borderRadius: '8px', cursor: 'pointer', fontSize: '12px', fontWeight: '600' }}>🗑️ Hapus gambar</button>
                    )}
                  </div>
                ) : field.type === 'textarea' ? (
                  <textarea value={config.data[field.name] || ''} onChange={e => config.setData({ ...config.data, [field.name]: e.target.value })} required={field.required} rows={field.rows || 5} style={{ ...fieldStyle, fontFamily: 'inherit', resize: 'vertical' }}></textarea>
                ) : field.type === 'select' ? (
                  <select value={config.data[field.name] || ''} onChange={e => config.setData({ ...config.data, [field.name]: e.target.value })} required={field.required} style={fieldStyle}>
                    <option value="">Pilih {field.label.replace(' *', '')}</option>
                    {field.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                ) : (
                  <input type={field.type} value={config.data[field.name] || ''} onChange={e => config.setData({ ...config.data, [field.name]: e.target.value })} required={field.required} placeholder={field.placeholder || ''} style={fieldStyle} />
                )}
                {field.preview && config.data[field.name] && (
                  <img src={config.data[field.name]} alt="Preview" style={{ width: '100%', marginTop: '10px', borderRadius: '12px', maxHeight: '200px', objectFit: 'cover' }} onError={(e) => { e.currentTarget.style.display = 'none' }} />
                )}
              </div>
            ))}
            <div style={{ display: 'flex', gap: '12px', marginTop: '25px' }}>
              <button type="submit" disabled={adminLoading} style={{ flex: 1, padding: '16px', background: `linear-gradient(135deg, ${config.color} 0%, ${config.color}dd 100%)`, color: 'white', border: 'none', borderRadius: '12px', fontWeight: 'bold', fontSize: '15px', cursor: adminLoading ? 'not-allowed' : 'pointer', boxShadow: `0 4px 15px ${config.color}66` }}>
                {adminLoading ? '⏳ Menyimpan...' : '💾 Simpan'}
              </button>
              <button type="button" onClick={() => setShowModal(null)} style={{ padding: '16px 28px', background: darkMode ? '#334155' : '#e2e8f0', color: c.text, border: 'none', borderRadius: '12px', fontWeight: 'bold', fontSize: '15px', cursor: 'pointer' }}>Batal</button>
            </div>
          </form>
        </div>
      </div>
    )
  }

  // ==========================================
  // MODAL LAYANAN PUBLIK
  // ==========================================
  function renderServiceModal() {
    if (!serviceModal) return null
    const inputStyle = { width: '100%', padding: '13px 14px', border: '2px solid #e2e8f0', borderRadius: '12px', fontSize: '15px', boxSizing: 'border-box', outline: 'none', fontFamily: 'inherit', background: 'white', color: '#1e293b', transition: 'border-color 0.2s' }
    const labelStyle = { display: 'block', marginBottom: '8px', color: '#374151', fontWeight: '600', fontSize: '14px' }
    const onFocus = (e) => { e.target.style.borderColor = '#2d8a5e' }
    const onBlur = (e) => { e.target.style.borderColor = '#e2e8f0' }
    const fieldGrid = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '16px' }
    const submitStyle = { width: '100%', padding: '16px', background: 'linear-gradient(135deg, #2d8a5e 0%, #1e5d3f 100%)', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer', boxShadow: '0 8px 20px rgba(45, 138, 94, 0.35)' }

    const meta = {
      letter: { icon: '📋', title: 'Ajukan Surat Online', sub: 'Isi data, pengajuan akan diteruskan ke kelurahan' },
      complaint: { icon: '📢', title: 'Buat Pengaduan', sub: 'Sampaikan keluhan atau saran Anda' },
      info: { icon: 'ℹ️', title: 'Informasi Publik', sub: 'Informasi resmi Kelurahan Woloan Dua' }
    }[serviceModal]

    const requirements = LETTER_TYPES[letterForm.type] || []
    const complaintLen = complaintForm.message.trim().length
    const infoTabs = [
      { id: 'profil', label: '🏛️ Profil' },
      { id: 'perangkat', label: '👥 Perangkat' },
      { id: 'statistik', label: '📊 Statistik' },
      { id: 'kontak', label: '🕐 Jam & Kontak' }
    ]
    const infoBox = { padding: '14px 16px', border: '1px solid #e2e8f0', borderRadius: '14px' }
    const emptyText = { textAlign: 'center', color: '#64748b', padding: '20px' }

    return (
      <div onClick={closeService} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000, padding: '20px', animation: 'fadeIn 0.3s' }}>
        <div onClick={(e) => e.stopPropagation()} style={{ background: 'white', borderRadius: '24px', width: '100%', maxWidth: '620px', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 25px 50px rgba(0,0,0,0.3)', animation: 'slideUp 0.4s' }}>
          <div style={{ position: 'sticky', top: 0, zIndex: 2, background: 'linear-gradient(135deg, #2d8a5e 0%, #1e5d3f 100%)', color: 'white', padding: '22px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', minWidth: 0 }}>
              <div style={{ width: '50px', height: '50px', background: 'rgba(255,255,255,0.2)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '26px', flexShrink: 0 }}>{meta.icon}</div>
              <div style={{ minWidth: 0 }}>
                <h3 style={{ margin: 0, fontSize: '20px', fontWeight: '800' }}>{meta.title}</h3>
                <p style={{ margin: '3px 0 0', fontSize: '13px', opacity: 0.9 }}>{meta.sub}</p>
              </div>
            </div>
            <button onClick={closeService} aria-label="Tutup" style={{ width: '38px', height: '38px', background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '12px', cursor: 'pointer', fontSize: '18px', color: 'white', flexShrink: 0 }}>✕</button>
          </div>

          {serviceModal === 'letter' && (
            <form onSubmit={handleSubmitLetter} style={{ padding: '24px 28px 28px' }}>
              <div style={fieldGrid}>
                <div>
                  <label style={labelStyle}>Nama Lengkap *</label>
                  <input type="text" required value={letterForm.name} onChange={e => setLetterForm({ ...letterForm, name: e.target.value })} placeholder="Sesuai KTP" style={inputStyle} onFocus={onFocus} onBlur={onBlur} />
                </div>
                <div>
                  <label style={labelStyle}>No. WhatsApp *</label>
                  <input type="tel" required value={letterForm.phone} onChange={e => setLetterForm({ ...letterForm, phone: e.target.value })} placeholder="08xxxxxxxxxx" style={inputStyle} onFocus={onFocus} onBlur={onBlur} />
                </div>
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={labelStyle}>Jenis Surat *</label>
                <select required value={letterForm.type} onChange={e => setLetterForm({ ...letterForm, type: e.target.value, customType: '' })} style={inputStyle} onFocus={onFocus} onBlur={onBlur}>
                  <option value="">Pilih jenis surat</option>
                  {Object.keys(LETTER_TYPES).map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              {letterForm.type === 'Surat Lainnya' && (
                <div style={{ marginBottom: '16px', animation: 'slideUp 0.3s' }}>
                  <label style={labelStyle}>Tuliskan Jenis Surat yang Dibutuhkan *</label>
                  <input type="text" required value={letterForm.customType} onChange={e => setLetterForm({ ...letterForm, customType: e.target.value })} placeholder="Contoh: Surat Keterangan Cerai, Surat Izin Keramaian, dll" style={inputStyle} onFocus={onFocus} onBlur={onBlur} />
                </div>
              )}
              {requirements.length > 0 && (
                <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '14px', padding: '16px 18px', marginBottom: '16px', animation: 'slideUp 0.3s' }}>
                  <p style={{ margin: '0 0 10px', color: '#166534', fontWeight: '700', fontSize: '14px' }}>📎 Persyaratan yang perlu dibawa ke kantor</p>
                  <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {requirements.map(r => (<li key={r} style={{ color: '#166534', fontSize: '14px', display: 'flex', gap: '8px' }}><span>✅</span><span>{r}</span></li>))}
                  </ul>
                </div>
              )}
              <div style={{ marginBottom: '16px' }}>
                <label style={labelStyle}>Alamat / Lingkungan *</label>
                <input type="text" required value={letterForm.address} onChange={e => setLetterForm({ ...letterForm, address: e.target.value })} placeholder="Contoh: Lingkungan III, Jl. ..." style={inputStyle} onFocus={onFocus} onBlur={onBlur} />
              </div>
              <div style={{ marginBottom: '22px' }}>
                <label style={labelStyle}>Keperluan *</label>
                <textarea required rows={3} value={letterForm.purpose} onChange={e => setLetterForm({ ...letterForm, purpose: e.target.value })} placeholder="Jelaskan singkat untuk apa surat ini dibutuhkan" style={{ ...inputStyle, resize: 'vertical' }} onFocus={onFocus} onBlur={onBlur}></textarea>
              </div>
              <button type="submit" style={submitStyle}>📨 Kirim Pengajuan</button>
              <p style={{ margin: '12px 0 0', textAlign: 'center', color: '#64748b', fontSize: '12px' }}>Pengajuan akan diterima kelurahan untuk diproses.</p>
            </form>
          )}

          {serviceModal === 'complaint' && (
            <form onSubmit={handleSubmitComplaint} style={{ padding: '24px 28px 28px' }}>
              <div style={{ marginBottom: '18px' }}>
                <label style={labelStyle}>Kategori *</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {COMPLAINT_CATEGORIES.map(cat => (
                    <button key={cat.label} type="button" onClick={() => setComplaintForm({ ...complaintForm, category: cat.label })} style={{ padding: '10px 14px', borderRadius: '24px', cursor: 'pointer', fontSize: '13px', fontWeight: '600', border: `2px solid ${complaintForm.category === cat.label ? '#2d8a5e' : '#e2e8f0'}`, background: complaintForm.category === cat.label ? '#2d8a5e' : 'white', color: complaintForm.category === cat.label ? 'white' : '#475569', transition: 'all 0.2s' }}>{cat.icon} {cat.label}</button>
                  ))}
                </div>
              </div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px', cursor: 'pointer', color: '#374151', fontSize: '14px', fontWeight: '600' }}>
                <input type="checkbox" checked={complaintForm.anonymous} onChange={e => setComplaintForm({ ...complaintForm, anonymous: e.target.checked })} style={{ width: '18px', height: '18px', accentColor: '#2d8a5e' }} />
                Kirim sebagai anonim (nama tidak dicantumkan)
              </label>
              <div style={fieldGrid}>
                <div>
                  <label style={labelStyle}>Nama {complaintForm.anonymous ? '' : '*'}</label>
                  <input type="text" required={!complaintForm.anonymous} disabled={complaintForm.anonymous} value={complaintForm.anonymous ? '' : complaintForm.name} onChange={e => setComplaintForm({ ...complaintForm, name: e.target.value })} placeholder={complaintForm.anonymous ? 'Anonim' : 'Nama Anda'} style={{ ...inputStyle, background: complaintForm.anonymous ? '#f1f5f9' : 'white' }} onFocus={onFocus} onBlur={onBlur} />
                </div>
                <div>
                  <label style={labelStyle}>No. HP / WhatsApp (opsional)</label>
                  <input type="tel" value={complaintForm.phone} onChange={e => setComplaintForm({ ...complaintForm, phone: e.target.value })} placeholder="08xxxxxxxxxx" style={inputStyle} onFocus={onFocus} onBlur={onBlur} />
                </div>
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={labelStyle}>Lokasi Kejadian (opsional)</label>
                <input type="text" value={complaintForm.location} onChange={e => setComplaintForm({ ...complaintForm, location: e.target.value })} placeholder="Contoh: Jalan depan Lingkungan II" style={inputStyle} onFocus={onFocus} onBlur={onBlur} />
              </div>
              <div style={{ marginBottom: '22px' }}>
                <label style={labelStyle}>Isi Pengaduan *</label>
                <textarea required minLength={20} rows={5} value={complaintForm.message} onChange={e => setComplaintForm({ ...complaintForm, message: e.target.value })} placeholder="Ceritakan keluhan atau saran Anda dengan jelas (minimal 20 karakter)" style={{ ...inputStyle, resize: 'vertical' }} onFocus={onFocus} onBlur={onBlur}></textarea>
                <p style={{ margin: '6px 0 0', textAlign: 'right', fontSize: '12px', fontWeight: '600', color: complaintLen >= 20 ? '#2d8a5e' : '#94a3b8' }}>{complaintLen} / minimal 20 karakter</p>
              </div>
              <button type="submit" style={submitStyle}>📤 Kirim Pengaduan</button>
              <p style={{ margin: '12px 0 0', textAlign: 'center', color: '#64748b', fontSize: '12px' }}>Pengaduan akan diterima kelurahan untuk ditindaklanjuti.</p>
            </form>
          )}

          {serviceModal === 'info' && (
            <div style={{ padding: '20px 28px 28px' }}>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', background: '#f1f5f9', borderRadius: '14px', padding: '5px', marginBottom: '20px' }}>
                {infoTabs.map(t => (
                  <button key={t.id} type="button" onClick={() => setInfoTab(t.id)} style={{ flex: '1 1 auto', padding: '10px 12px', border: 'none', borderRadius: '10px', cursor: 'pointer', fontSize: '13px', fontWeight: '700', background: infoTab === t.id ? 'linear-gradient(135deg, #2d8a5e 0%, #1e5d3f 100%)' : 'transparent', color: infoTab === t.id ? 'white' : '#64748b', transition: 'all 0.2s' }}>{t.label}</button>
                ))}
              </div>
              {infoTab === 'profil' && (
                villageInfo ? (
                  <div style={{ animation: 'slideUp 0.3s' }}>
                    <h4 style={{ margin: '0 0 10px', color: '#1e293b', fontSize: '20px', fontWeight: '800' }}>{villageInfo.name}</h4>
                    <p style={{ margin: '0 0 16px', color: '#475569', lineHeight: '1.7', fontSize: '15px' }}>{villageInfo.description}</p>
                    <p style={{ margin: '0 0 6px', color: '#334155', fontSize: '14px' }}><strong>📍 Alamat:</strong> {villageInfo.address}</p>
                    <p style={{ margin: 0, color: '#334155', fontSize: '14px' }}><strong>📞 Telepon:</strong> {villageInfo.phone}</p>
                  </div>
                ) : (<p style={emptyText}>Data profil belum tersedia.</p>)
              )}
              {infoTab === 'perangkat' && (
                sortedOfficials.length === 0 ? (<p style={emptyText}>Belum ada data perangkat kelurahan.</p>) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', animation: 'slideUp 0.3s' }}>
                    {sortedOfficials.map((o, i) => (
                      <div key={getItemId(o) || i} style={{ ...infoBox, display: 'flex', alignItems: 'center', gap: '14px' }}>
                        <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', color: 'white', fontWeight: '800', fontSize: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{(o.name || '?').charAt(0).toUpperCase()}</div>
                        <div style={{ minWidth: 0 }}>
                          <p style={{ margin: 0, color: '#1e293b', fontWeight: '700', fontSize: '15px' }}>{o.name}</p>
                          <p style={{ margin: '2px 0 0', color: '#059669', fontWeight: '600', fontSize: '13px' }}>{o.position}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )
              )}
              {infoTab === 'statistik' && (
                statistics.length === 0 ? (<p style={emptyText}>Belum ada data statistik.</p>) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '12px', animation: 'slideUp 0.3s' }}>
                    {statistics.map((s, i) => (
                      <div key={getItemId(s) || i} style={{ ...infoBox, textAlign: 'center', padding: '16px 12px', background: '#f8fafc' }}>
                        <p style={{ margin: 0, color: '#2d8a5e', fontWeight: '800', fontSize: '26px' }}>{s.value}</p>
                        <p style={{ margin: '4px 0 2px', color: '#1e293b', fontWeight: '700', fontSize: '13px' }}>{s.category}</p>
                        <p style={{ margin: 0, color: '#94a3b8', fontSize: '12px' }}>Tahun {s.year}</p>
                      </div>
                    ))}
                  </div>
                )
              )}
              {infoTab === 'kontak' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', animation: 'slideUp 0.3s' }}>
                  <div style={infoBox}>
                    <p style={{ margin: '0 0 4px', color: '#64748b', fontSize: '12px', fontWeight: '700' }}>🕐 JAM LAYANAN</p>
                    <p style={{ margin: 0, color: '#1e293b', fontSize: '15px', fontWeight: '600' }}>{SERVICE_INFO.jam}</p>
                  </div>
                  <div style={infoBox}>
                    <p style={{ margin: '0 0 4px', color: '#64748b', fontSize: '12px', fontWeight: '700' }}>📍 ALAMAT KANTOR</p>
                    <p style={{ margin: 0, color: '#1e293b', fontSize: '15px', lineHeight: '1.6' }}>{mapCoordinates.address}</p>
                  </div>
                  {villageInfo?.phone && (
                    <div style={infoBox}>
                      <p style={{ margin: '0 0 4px', color: '#64748b', fontSize: '12px', fontWeight: '700' }}>📞 TELEPON</p>
                      <p style={{ margin: 0, color: '#1e293b', fontSize: '15px', fontWeight: '600' }}>{villageInfo.phone}</p>
                    </div>
                  )}
                  <a href={`https://www.google.com/maps/search/?api=1&query=${mapCoordinates.lat},${mapCoordinates.lng}`} target="_blank" rel="noopener noreferrer" style={{ display: 'block', padding: '14px', background: 'linear-gradient(135deg, #2d8a5e 0%, #1e5d3f 100%)', color: 'white', textAlign: 'center', borderRadius: '12px', textDecoration: 'none', fontWeight: 'bold', fontSize: '14px' }}>🗺️ Buka Lokasi di Google Maps</a>
                </div>
              )}
            </div>
          )}
        </div>
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
          <div className="navbar-brand" onClick={handleLogoClick} style={{ cursor: 'pointer' }}>
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
        <div className="visitor-widget"><div className="visitor-icon">👥</div><div className="visitor-info"><span className="visitor-count">{visitorCount}</span><span className="visitor-label">Kunjungan Hari Ini</span></div></div>
        <div className="complaint-widget">
          <button className="btn-complaint" onClick={() => openService('complaint')}><span className="complaint-icon">📢</span><span>Pengaduan</span></button>
          <button className="btn-accessibility">♿</button>
        </div>
      </section>

      <section className="quick-menu" id="quick-menu">
        <div className="container">
          <h2 className="section-title">Layanan Cepat</h2>
          <div className="quick-grid">
            {[
              { icon: '🗺️', title: 'Peta Kelurahan', desc: 'Lihat peta wilayah', link: '#peta' },
              { icon: '📋', title: 'Layanan Surat', desc: 'Ajukan surat online', link: '#layanan' },
              { icon: '📢', title: 'Pengaduan', desc: 'Sampaikan keluhan', link: '#layanan' },
              { icon: '📞', title: 'Kontak Darurat', desc: 'Nomor penting', link: '#profil' },
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
            <div className="info-grid"><div className="info-card" style={{ gridColumn: '1 / -1' }}><h3>🏛️ {villageInfo.name}</h3><p>{villageInfo.description}</p><p style={{ marginTop: '15px' }}><strong>📍 Alamat:</strong> {villageInfo.address}</p><p><strong>📞 Telepon:</strong> {villageInfo.phone}</p></div></div>
          ) : (<p style={{ textAlign: 'center', padding: '20px' }}>Data profil belum tersedia.</p>)}
          <h3 style={{ marginTop: '40px', marginBottom: '20px' }}>Perangkat Kelurahan</h3>
          {sortedOfficials.length === 0 ? (<p style={{ textAlign: 'center', padding: '20px' }}>Belum ada data perangkat kelurahan.</p>) : (
            <div className="info-grid">{sortedOfficials.map((official, index) => (<div key={getItemId(official) || index} className="info-card"><h3>{official.name}</h3><p style={{ color: '#2d8a5e', fontWeight: 'bold', marginTop: '10px' }}>{official.position}</p></div>))}</div>
          )}
        </div>
      </section>

      <section className="info-section" id="infografis">
        <div className="container">
          <h2 className="section-title">Infografis & Statistik</h2>
          {statsLoading ? (<p style={{ textAlign: 'center', padding: '20px' }}>Memuat data...</p>) : statistics.length === 0 ? (<p style={{ textAlign: 'center', padding: '20px' }}>Belum ada data statistik.</p>) : (
            <div className="info-grid">{statistics.map((stat, index) => (<div key={getItemId(stat) || index} className="info-card" style={{ textAlign: 'center' }}><h3 style={{ fontSize: '2rem', color: '#2d8a5e', marginBottom: '10px' }}>{stat.value}</h3><p style={{ fontWeight: 'bold', marginBottom: '5px' }}>{stat.category}</p><p style={{ fontSize: '0.85rem', color: '#666' }}>Tahun {stat.year}</p></div>))}</div>
          )}
        </div>
      </section>

      <section className="info-section" id="galeri" style={{ backgroundColor: '#f8fafc' }}>
        <div className="container">
          <h2 className="section-title">Galeri Kegiatan</h2>
          {galleries.length === 0 ? (<p style={{ textAlign: 'center', padding: '20px' }}>Belum ada foto kegiatan.</p>) : (
            <div className="info-grid">{galleries.map((photo, index) => (<div key={getItemId(photo) || index} className="info-card" style={{ padding: '10px' }}><img src={photo.image_url} alt={photo.title} style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '8px', marginBottom: '10px' }} /><h3 style={{ fontSize: '1rem', textAlign: 'center' }}>{photo.title}</h3></div>))}</div>
          )}
        </div>
      </section>

      <section className="info-section" id="layanan">
        <div className="container">
          <h2 className="section-title">Layanan</h2>
          <div className="info-grid">
            <div className="info-card"><h3>📋 Surat Menyurat</h3><p>Layanan pengajuan surat secara online.</p><a href="#" className="btn-link" onClick={(e) => { e.preventDefault(); openService('letter') }}>Ajukan Surat →</a></div>
            <div className="info-card"><h3>📢 Pengaduan</h3><p>Sampaikan keluhan dan saran Anda.</p><a href="#" className="btn-link" onClick={(e) => { e.preventDefault(); openService('complaint') }}>Buat Pengaduan →</a></div>
            <div className="info-card"><h3>ℹ️ Informasi Publik</h3><p>Akses informasi publik kelurahan.</p><a href="#" className="btn-link" onClick={(e) => { e.preventDefault(); openService('info') }}>Lihat Informasi →</a></div>
          </div>
        </div>
      </section>

      <section className="info-section" id="berita">
        <div className="container">
          <h2 className="section-title">Berita Terbaru</h2>
          {loading ? (<p style={{ textAlign: 'center', padding: '20px' }}>Memuat berita...</p>) : articles.length === 0 ? (<p style={{ textAlign: 'center', padding: '20px' }}>Belum ada berita yang dipublikasikan.</p>) : (
            <div className="info-grid">{articles.slice(0, 3).map((article, index) => (<div key={getItemId(article) || index} className="info-card"><h3>📰 {article.title}</h3><p>{(article.content || '').substring(0, 100)}...</p><p style={{ fontSize: '0.8rem', color: '#666', marginTop: '10px' }}>Oleh: {article.author || 'Admin'}</p><button onClick={() => openArticleModal(article)} style={{ background: 'none', border: 'none', color: '#2d8a5e', cursor: 'pointer', fontSize: '1rem', fontWeight: 'bold', padding: 0, marginTop: '10px' }}>Baca Selengkapnya →</button></div>))}</div>
          )}
        </div>
      </section>

      <section className="info-section" id="peta" style={{ backgroundColor: '#f0fdf4' }}>
        <div className="container">
          <h2 className="section-title">📍 Peta Lokasi Kelurahan</h2>
          <p style={{ textAlign: 'center', color: '#64748b', marginBottom: '30px', fontSize: '16px' }}>{mapCoordinates.address}</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '25px', alignItems: 'start' }}>
            <div style={{ height: '450px', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(45, 138, 94, 0.15)', border: '3px solid #2d8a5e', position: 'relative' }}>
              <iframe src={`https://www.openstreetmap.org/export/embed.html?bbox=${mapCoordinates.lng - 0.01}%2C${mapCoordinates.lat - 0.01}%2C${mapCoordinates.lng + 0.01}%2C${mapCoordinates.lat + 0.01}&layer=mapnik&marker=${mapCoordinates.lat}%2C${mapCoordinates.lng}`} style={{ width: '100%', height: '100%', border: 'none' }} title="Peta Kelurahan Woloan Dua"></iframe>
            </div>
            <div style={{ background: 'white', borderRadius: '20px', padding: '25px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' }}>
              <h3 style={{ color: '#2d8a5e', marginTop: 0, fontSize: '20px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}><span style={{ fontSize: '28px' }}>📌</span> Informasi Lokasi</h3>
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
              <a href={`https://www.google.com/maps/search/?api=1&query=${mapCoordinates.lat},${mapCoordinates.lng}`} target="_blank" rel="noopener noreferrer" style={{ display: 'block', padding: '14px', background: 'linear-gradient(135deg, #2d8a5e 0%, #1e5d3f 100%)', color: 'white', textAlign: 'center', borderRadius: '12px', textDecoration: 'none', fontWeight: 'bold', fontSize: '14px', boxShadow: '0 4px 15px rgba(45, 138, 94, 0.3)' }}>🗺️ Buka di Google Maps</a>
            </div>
          </div>
        </div>
      </section>

      <section className="info-section" id="ppid">
        <div className="container">
          <h2 className="section-title">PPID</h2>
          <div className="info-grid">
            <div className="info-card"><h3>ℹ️ Informasi Publik</h3><p>Pejabat Pengelola Informasi dan Dokumentasi.</p><a href="#" className="btn-link" onClick={(e) => { e.preventDefault(); openService('info') }}>Lihat Informasi →</a></div>
            <div className="info-card"><h3>📄 Permohonan Informasi</h3><p>Ajukan permohonan informasi publik.</p><a href="#" className="btn-link" onClick={(e) => { e.preventDefault(); openService('letter') }}>Ajukan →</a></div>
            <div className="info-card"><h3>📊 Statistik Informasi</h3><p>Statistik permohonan informasi publik.</p><a href="#infografis" className="btn-link">Lihat Statistik →</a></div>
          </div>
        </div>
      </section>

      {selectedArticle && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: '20px' }} onClick={closeArticleModal}>
          <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '30px', maxWidth: '600px', width: '100%', maxHeight: '80vh', overflowY: 'auto', position: 'relative' }} onClick={(e) => e.stopPropagation()}>
            <button onClick={closeArticleModal} style={{ position: 'absolute', top: '15px', right: '15px', background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#666' }}>✕</button>
            <h2 style={{ color: '#2d8a5e', marginBottom: '15px', paddingRight: '30px' }}>📰 {selectedArticle.title}</h2>
            <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '20px' }}>Oleh: {selectedArticle.author || 'Admin'}</p>
            <div style={{ lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>{selectedArticle.content}</div>
          </div>
        </div>
      )}

      {renderServiceModal()}

      <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-col"><h4>Kelurahan Woloan Dua</h4><p>Kecamatan Tomohon Barat<br />Kota Tomohon, Sulawesi Utara</p><p>📞 {villageInfo?.phone || '-'}<br />✉️ kelurahan.woloandua@gmail.com</p></div>
            <div className="footer-col"><h4>Menu Cepat</h4><ul><li><a href="#profil">Profil Kelurahan</a></li><li><a href="#layanan">Layanan</a></li><li><a href="#berita">Berita</a></li></ul></div>
            <div className="footer-col"><h4>Ikuti Kami</h4><div className="social-links"><a href="#">📘 Facebook</a><a href="#">📷 Instagram</a><a href="#">▶ YouTube</a></div></div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2026 Kelurahan Woloan Dua.</p>
          </div>
        </div>
      </footer>

      <div style={{ position: 'fixed', bottom: '30px', right: '30px', zIndex: 9999, display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {toasts.map(toast => (
          <div key={toast.id} style={{ padding: '16px 24px', borderRadius: '12px', color: 'white', fontWeight: '600', fontSize: '14px', background: toast.type === 'success' ? 'linear-gradient(135deg, #2d8a5e 0%, #1e5d3f 100%)' : toast.type === 'error' ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)' : 'linear-gradient(135deg, #10b981 0%, #059669 100%)', boxShadow: '0 10px 30px rgba(0,0,0,0.2)', animation: 'slideInRight 0.4s', minWidth: '250px' }}>
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