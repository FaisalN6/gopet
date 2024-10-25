const dbConnection = require('../config/database');

exports.connDB = (req, res) => {
    dbConnection.connect((err) => {
        if (err) {
            res.send('Sorry, DB!');
            console.error('Kesalahan koneksi ke database:', err);
        } else {
            res.send('Hello, DB!');
            console.log('Berhasil terhubung ke database!');
        }
    });
};