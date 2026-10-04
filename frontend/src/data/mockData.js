// Data dummy untuk development (nanti diganti dengan API call)

export const mockProfile = {
  description: 'Selamat datang di website resmi Kelurahan Woloan Dua. Website ini merupakan sarana informasi dan komunikasi antara pemerintah kelurahan dengan masyarakat untuk mewujudkan pelayanan yang transparan dan akuntabel.',
  address: 'Jl. Raya Woloan Dua, Tomohon Barat',
  phone: '0431-123456',
  email: 'kelurahan.woloandua@gmail.com'
}

export const mockOfficials = [
  { id: 1, name: 'Bapak John Doe', position: 'Lurah Woloan Dua' },
  { id: 2, name: 'Ibu Jane Smith', position: 'Sekretaris Lurah' },
  { id: 3, name: 'Bapak Bob Wilson', position: 'Kasi Pemerintahan' },
  { id: 4, name: 'Ibu Alice Brown', position: 'Kasi Pelayanan' },
  { id: 5, name: 'Bapak Charlie Davis', position: 'Kaur Keuangan' }
]

export const mockArticles = [
  {
    id: 1,
    title: 'Kerja Bakti Bersama Warga',
    content: 'Warga desa Woloan melakukan kerja bakti membersihkan lingkungan desa setiap hari Minggu pagi. Kegiatan ini diikuti oleh seluruh lapisan masyarakat, dari anak-anak hingga orang tua. Kerja bakti ini merupakan wujud gotong royong yang masih kental di Kelurahan Woloan Dua. Selain membersihkan jalan, warga juga membersihkan saluran air dan taman-taman di sekitar kelurahan. Kegiatan ini diharapkan dapat menjaga kebersihan dan kesehatan lingkungan serta mempererat tali silaturahmi antar warga.',
    image: null,
    created_at: '2026-10-01T08:00:00.000Z'
  },
  {
    id: 2,
    title: 'Penyaluran BLT Desa Tahap 3',
    content: 'Pembagian Bantuan Langsung Tunai (BLT) Dana Desa tahap 3 telah dilaksanakan di balai desa. Sebanyak 150 KK menerima bantuan sebesar Rp 600.000 per keluarga. Penyaluran dilakukan dengan tertib dan sesuai prosedur. Kepala Kelurahan Woloan Dua menekankan bahwa BLT ini diberikan kepada warga yang benar-benar membutuhkan sesuai dengan data yang telah diverifikasi. Warga yang menerima BLT diharapkan menggunakan dana tersebut untuk kebutuhan pokok keluarga.',
    image: null,
    created_at: '2026-10-01T10:00:00.000Z'
  },
  {
    id: 3,
    title: 'Pelatihan UMKM untuk Ibu-Ibu PKK',
    content: 'Desa Woloan mengadakan pelatihan pembuatan kerajinan tangan untuk ibu-ibu PKK guna meningkatkan perekonomian keluarga. Pelatihan ini mencakup pembuatan anyaman bambu, ukiran kayu mini, dan produk kerajinan lainnya. Narasumber datang dari pengrajin senior yang sudah berpengalaman lebih dari 20 tahun. Peserta sangat antusias mengikuti pelatihan dan berharap dapat menjual produk mereka ke pasar yang lebih luas, bahkan ekspor.',
    image: null,
    created_at: '2026-10-01T14:00:00.000Z'
  }
]

export const mockServices = [
  {
    id: 1,
    icon: '',
    title: 'Surat Keterangan Tidak Mampu (SKTM)',
    description: 'Surat keterangan untuk warga kurang mampu',
    requirements: ['KTP', 'KK', 'Surat Pengantar RT/RW'],
    procedure: 'Datang ke kantor kelurahan → Isi formulir → Serahkan ke petugas → Tunggu 1 hari kerja'
  },
  {
    id: 2,
    icon: '📄',
    title: 'Surat Pengantar SKCK',
    description: 'Surat pengantar untuk membuat SKCK di kepolisian',
    requirements: ['KTP', 'KK', 'Pas foto 4x6 (3 lembar)'],
    procedure: 'Datang ke kantor kelurahan → Isi formulir → Ambil surat pengantar → Ke kepolisian'
  },
  {
    id: 3,
    icon: '🏠',
    title: 'Surat Keterangan Domisili',
    description: 'Surat keterangan tempat tinggal',
    requirements: ['KTP', 'KK', 'Surat Pengantar RT/RW'],
    procedure: 'Datang ke kantor kelurahan → Verifikasi data → Cetak surat'
  },
  {
    id: 4,
    icon: '💼',
    title: 'Surat Keterangan Usaha',
    description: 'Surat keterangan untuk usaha kecil',
    requirements: ['KTP', 'KK', 'Foto tempat usaha'],
    procedure: 'Datang ke kantor kelurahan → Isi formulir → Survey lokasi → Cetak surat'
  },
  {
    id: 5,
    icon: '💍',
    title: 'Surat Pengantar Nikah (N9)',
    description: 'Surat pengantar untuk menikah di KUA',
    requirements: ['KTP', 'KK', 'Surat Pengantar RT/RW', 'Pas foto berdua'],
    procedure: 'Datang ke kantor kelurahan → Isi formulir N9 → Ambil surat pengantar → Ke KUA'
  },
  {
    id: 6,
    icon: '👶',
    title: 'Surat Keterangan Kelahiran',
    description: 'Surat keterangan untuk akta kelahiran',
    requirements: ['Surat kelahiran dari RS/Bidan', 'KK orang tua', 'KTP orang tua', 'Buku Nikah'],
    procedure: 'Datang ke kantor kelurahan → Serahkan dokumen → Cetak surat → Ke Disdukcapil'
  }
]

export const mockBudget = [
  { id: 1, year: 2026, category: 'Pendapatan', subCategory: 'Dana Desa', planned: 500000000, realized: 500000000 },
  { id: 2, year: 2026, category: 'Pendapatan', subCategory: 'ADD', planned: 200000000, realized: 200000000 },
  { id: 3, year: 2026, category: 'Belanja', subCategory: 'Pembangunan', planned: 300000000, realized: 250000000 },
  { id: 4, year: 2026, category: 'Belanja', subCategory: 'Pemberdayaan', planned: 150000000, realized: 120000000 },
  { id: 5, year: 2026, category: 'Belanja', subCategory: 'Kemasyarakatan', planned: 100000000, realized: 80000000 },
  { id: 6, year: 2026, category: 'Belanja', subCategory: 'Operasional', planned: 50000000, realized: 45000000 }
]

export const formatRupiah = (angka) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(angka)
}