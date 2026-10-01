const express = require('express');
const cors = require('cors');
const db = require('./db');
const articleRoutes = require('./routes/articleRoutes');
const profileRoutes = require('./routes/profileRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const statsRoutes = require('./routes/statsRoutes');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Website Kelurahan Backend Aktif');
});

app.use('/api/articles', articleRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/stats', statsRoutes);

app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});