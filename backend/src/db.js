const mysql = require("mysql2");

const db = mysql.createConnection({
    host: "127.0.0.1",
    port: 3307,
    user: "root",
    password: "4kun_database",
    database: "kelurahan_woloan"
});

db.connect((err) => {
    if (err) {
        console.log("Database gagal terkoneksi");
        console.log(err);
    } else {
        console.log("Database berhasil terkoneksi");
    }
});

module.exports = db;