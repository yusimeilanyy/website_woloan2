const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function seedDatabase() {
  console.log('🌱 Memulai seed database...\n');

  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || '127.0.0.1',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT || 3306
  });

  try {
    // 1. Buat database jika belum ada
    await connection.query('CREATE DATABASE IF NOT EXISTS db_woloan CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci');
    await connection.query('USE db_woloan');
    console.log('✅ Database db_woloan siap');

    // 2. Buat semua tabel
    const tables = `
      CREATE TABLE IF NOT EXISTS admins (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(20) DEFAULT 'admin',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS village_info (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        description TEXT,
        address TEXT,
        phone VARCHAR(50)
      );

      CREATE TABLE IF NOT EXISTS officials (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        position VARCHAR(100) NOT NULL,
        photo VARCHAR(255)
      );

      CREATE TABLE IF NOT EXISTS institutions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        description TEXT
      );

      CREATE TABLE IF NOT EXISTS articles (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        author VARCHAR(100),
        image_url VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS services (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        description TEXT,
        requirements TEXT
      );

      CREATE TABLE IF NOT EXISTS statistics (
        id INT AUTO_INCREMENT PRIMARY KEY,
        category VARCHAR(100) NOT NULL,
        value VARCHAR(50) NOT NULL,
        year INT
      );

      CREATE TABLE IF NOT EXISTS budget (
        id INT AUTO_INCREMENT PRIMARY KEY,
        category VARCHAR(100) NOT NULL,
        amount BIGINT,
        year INT
      );

      CREATE TABLE IF NOT EXISTS galleries (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        image_url VARCHAR(255)
      );

      CREATE TABLE IF NOT EXISTS letter_requests (
        id INT AUTO_INCREMENT PRIMARY KEY,
        requester_name VARCHAR(100) NOT NULL,
        nik VARCHAR(16),
        phone VARCHAR(20),
        service_id INT,
        purpose TEXT,
        status ENUM('pending', 'processed', 'completed', 'rejected') DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    await connection.query(tables);
    console.log('✅ Semua tabel dibuat');

    // 3. Kosongkan data lama (optional - hapus komentar jika ingin reset)
    // await connection.query('SET FOREIGN_KEY_CHECKS = 0');
    // await connection.query('TRUNCATE TABLE admins');
    // await connection.query('TRUNCATE TABLE village_info');
    // ... (tabel lainnya)
    // await connection.query('SET FOREIGN_KEY_CHECKS = 1');

    // 4. Insert data admin
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await connection.query(
      'INSERT IGNORE INTO admins (username, password, role) VALUES (?, ?, ?)',
      ['admin', hashedPassword, 'admin']
    );
    console.log('✅ Admin default dibuat (username: admin, password: admin123)');

    // 5. Insert data kelurahan
    await connection.query(
      `INSERT IGNORE INTO village_info (name, description, address, phone) VALUES 
       ('Kelurahan Woloan Dua', 'Kelurahan Woloan Dua adalah kelurahan yang terletak di Kecamatan Tomohon Barat, Kota Tomohon, Sulawesi Utara (Kode Pos: 95422). Wilayah ini dikenal sebagai sentra kerajinan ukiran kayu khas Minahasa yang telah mendunia, serta memiliki potensi wisata alam seperti Puncak Kai Santi Flower Garden.', 'Jl. Raya Woloan, Kel. Woloan Dua, Kec. Tomohon Barat, Kota Tomohon, Sulawesi Utara 95422', '(0431) 351234')`
    );
    console.log('✅ Data kelurahan di-insert');

    // 6. Insert perangkat kelurahan
    const officials = [
      ['Jeane M. Kures, S.E.', 'Lurah'],
      ['Maria S. Wowor, S.Sos', 'Sekretaris Lurah'],
      ['Denny R. Maramis', 'Kepala Seksi Pemerintahan'],
      ['Siska L. Tangon', 'Kepala Seksi Pelayanan'],
      ['Ravel Tundo', 'Kepala Lingkungan / Staf']
    ];
    for (const [name, position] of officials) {
      await connection.query(
        'INSERT IGNORE INTO officials (name, position) VALUES (?, ?)',
        [name, position]
      );
    }
    console.log('✅ 5 Perangkat kelurahan di-insert');

    // 7. Insert artikel
    const articles = [
      ['Pemerintah Kecamatan Edukasi Hukum Warga Woloan Dua', 'Kegiatan edukasi hukum yang dihadiri langsung oleh Lurah Jeane M. Kures, S.E. beserta perangkat kelurahan dan kepala lingkungan untuk meningkatkan kesadaran hukum masyarakat di wilayah Woloan Dua.', 'Admin Kelurahan'],
      ['Pelatihan Inovasi Pertanian Modern untuk Petani Padi', 'Program pemberdayaan petani di Kelurahan Woloan Dua dalam mengadopsi alat pertanian modern untuk meningkatkan hasil panen padi sawah di wilayah Tomohon Barat.', 'Admin Kelurahan'],
      ['Pemberdayaan Kelompok Lanjut Usia Melalui Program Kesehatan', 'Kegiatan Pengabdian Kepada Masyarakat (PKM) bekerjasama dengan Puskesmas untuk menangani masalah kesehatan dan meningkatkan kesejahteraan para lansia di lingkungan Woloan Dua.', 'Admin Kelurahan']
    ];
    for (const [title, content, author] of articles) {
      await connection.query(
        'INSERT IGNORE INTO articles (title, content, author) VALUES (?, ?, ?)',
        [title, content, author]
      );
    }
    console.log('✅ 3 Artikel di-insert');

    // 8. Insert statistik
    const stats = [
      ['Jumlah Penduduk', '2.512', 2026],
      ['Jumlah Kepala Keluarga (KK)', '845', 2026],
      ['Jumlah Laki-laki', '1.280', 2026],
      ['Jumlah Perempuan', '1.232', 2026],
      ['Jumlah Lansia', '315', 2026],
      ['Jumlah Balita & Anak', '420', 2026]
    ];
    for (const [category, value, year] of stats) {
      await connection.query(
        'INSERT IGNORE INTO statistics (category, value, year) VALUES (?, ?, ?)',
        [category, value, year]
      );
    }
    console.log('✅ 6 Data statistik di-insert');

    // 9. Insert galeri
    const galleries = [
      ['Sentra Kerajinan Ukiran Kayu Khas Woloan', 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=400'],
      ['Puncak Kai Santi Flower Garden', 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=400'],
      ['Kegiatan Edukasi Hukum Warga', 'https://images.unsplash.com/photo-1577962917302-cd874c4e31d2?w=400'],
      ['Gotong Royong Bersih Lingkungan', 'https://images.unsplash.com/photo-1593113598332-cd288d649433?w=400']
    ];
    for (const [title, image_url] of galleries) {
      await connection.query(
        'INSERT IGNORE INTO galleries (title, image_url) VALUES (?, ?)',
        [title, image_url]
      );
    }
    console.log('✅ 4 Foto galeri di-insert');

    console.log('\n🎉 SEED DATABASE BERHASIL!');
    console.log('   Website siap digunakan.');
    console.log('   Login admin: username=admin, password=admin123');

  } catch (err) {
    console.error(' Error saat seed:', err);
  } finally {
    await connection.end();
  }
}

seedDatabase();