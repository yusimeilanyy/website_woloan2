const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Di hosting (Render/Railway) aplikasi berada di belakang proxy
app.set('trust proxy', 1);

// Pisahkan beberapa domain dengan koma, contoh: https://web-anda.vercel.app,http://localhost:5173
const allowedOrigins = (process.env.CORS_ORIGINS || 'http://localhost:5173').split(',');
app.use(cors({ origin: allowedOrigins }));

// Naikkan batas agar upload gambar base64 tidak ditolak
app.use(express.json({ limit: '2mb' }));

require('./db');

const articleRoutes = require('./routes/articleRoutes');
const profileRoutes = require('./routes/profileRoutes');
const statsRoutes = require('./routes/statsRoutes');
const authRoutes = require('./routes/authRoutes');
const { letterRouter, complaintRouter } = require('./routes/submissionRoutes');

app.use('/api/articles', articleRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/letters', letterRouter);
app.use('/api/complaints', complaintRouter);

app.get('/', (req, res) => {
  res.json({ message: 'API Website Kelurahan Woloan Dua', version: '1.0.0', status: 'running' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server berjalan di port ${PORT}`);
});