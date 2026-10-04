import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './components/Home'
import Profil from './components/Profil'
import Berita from './components/Berita'
import DetailBerita from './components/DetailBerita'
import Layanan from './components/Layanan'
import Kontak from './components/Kontak'
import Transparansi from './components/Transparansi' 
import './App.css'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/profil" element={<Profil />} />
        <Route path="/berita" element={<Berita />} />
        <Route path="/berita/:id" element={<DetailBerita />} />
        <Route path="/layanan" element={<Layanan />} />
        <Route path="/kontak" element={<Kontak />} />
        <Route path="/transparansi" element={<Transparansi />} /> 
        <Route path="/pengaduan" element={<Kontak />} />
        <Route path="/statistik" element={<Home />} />
        <Route path="/ppid" element={<Home />} />
        <Route path="/potensi" element={<Home />} />
        <Route path="/peta" element={<Home />} />
      </Routes>
    </Router>
  )
}

export default App