const bcrypt = require('bcryptjs');

const password = 'admin123';

bcrypt.hash(password, 10, (err, hash) => {
  if (err) {
    console.error('Error:', err);
    return;
  }
  console.log('');
  console.log('=====================================');
  console.log('Password: admin123');
  console.log('Hash yang harus dimasukkan:');
  console.log(hash);
  console.log('=====================================');
  console.log('');
});