const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Import database
require('./db');

// Import SEMUA routes
const articleRoutes = require('./routes/articleRoutes');
const profileRoutes = require('./routes/profileRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const statsRoutes = require('./routes/statsRoutes');

// Daftarkan SEMUA routes
app.use('/api/articles', articleRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/stats', statsRoutes);

app.get('/', (req, res) => {
  res.json({ 
    message: 'API Website Kelurahan Woloan Dua',
    version: '1.0.0',
    status: 'running'
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});