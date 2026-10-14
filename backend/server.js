const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Import database
require('./src/db');

// Import SEMUA routes
const articleRoutes = require('./src/routes/articleRoutes');
const profileRoutes = require('./src/routes/profileRoutes');
const statsRoutes = require('./src/routes/statsRoutes');
const authRoutes = require('./src/routes/authRoutes');
const letterRoutes = require('./src/routes/letterRoutes');
const submissionRoutes = require('./src/routes/submissionRoutes').letterRouter;

// Daftarkan SEMUA routes
app.use('/api/auth', authRoutes);
app.use('/api/articles', articleRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/letters', letterRoutes);
app.use('/api/submissions', submissionRoutes);
app.use('/api/stats', statsRoutes);

app.get('/', (req, res) => {
  res.json({ 
    message: 'API Website Kelurahan Woloan Dua',
    version: 'SUDAH-DIPERBAIKI',
    status: 'running'
  });
});

// Error handler: balas JSON (bukan HTML) agar pesan error tampil jelas di frontend
app.use((err, req, res, next) => {
  console.error('❌ Server error:', err.message);
  res.status(err.status || 500).json({ success: false, error: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});