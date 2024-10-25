const dbConnection = require('../config/database');

exports.connDB = (req, res) => {
    if (req.method === 'GET') {
        if (req.params.kd_hewan) {
            // Menampilkan 1 data berdasarkan kd_hewan
            const kd_hewan = req.params.kd_hewan;
            dbConnection.query('SELECT * FROM hewan WHERE kd_hewan = ?', [kd_hewan], (err, rows) => {
                if (err) {
                    res.status(500).json({
                        status: 'error',
                        message: 'Terjadi kesalahan saat mengambil data hewan',
                        error: err
                    });
                } else {
                    if (rows.length > 0) {
                        res.status(200).json({
                            status: 'success',
                            data: rows[0]
                        });
                    } else {
                        res.status(404).json({
                            status: 'error',
                            message: 'Data hewan tidak ditemukan'
                        });
                    }
                }
            });
        } else {
            // Menampilkan semua data
            dbConnection.query('SELECT * FROM hewan', (err, rows) => {
                if (err) {
                    res.status(500).json({
                        status: 'error',
                        message: 'Terjadi kesalahan saat mengambil data hewan',
                        error: err
                    });
                } else {
                    res.status(200).json({
                        status: 'success',
                        data: rows
                    });
                }
            });
        }
    } else if (req.method === 'POST') {
        const { kd_hewan, nama_hewan, kategori_hewan, deskripsi_hewan } = req.body;
        const query = 'INSERT INTO hewan (kd_hewan, nama_hewan, kategori_hewan, deskripsi_hewan) VALUES (?, ?, ?, ?)';
        dbConnection.query(query, [kd_hewan, nama_hewan, kategori_hewan, deskripsi_hewan], (err, result) => {
            if (err) {
                res.status(500).json({
                    status: 'error',
                    message: 'Terjadi kesalahan saat menambahkan data hewan',
                    error: err
                });
            } else {
                res.status(201).json({
                    status: 'success',
                    message: 'Data hewan berhasil ditambahkan',
                    kd_hewan: result.insertId
                });
            }
        });
    } else if (req.method === 'PUT') {
        const kd_hewan = req.params.kd_hewan;
        const { nama_hewan, kategori_hewan, deskripsi_hewan } = req.body;
        const query = 'UPDATE hewan SET nama_hewan = ?, kategori_hewan = ?, deskripsi_hewan = ? WHERE kd_hewan = ?';
        dbConnection.query(query, [nama_hewan, kategori_hewan, deskripsi_hewan, kd_hewan], (err, result) => {
            if (err) {
                res.status(500).json({
                    status: 'error',
                    message: 'Terjadi kesalahan saat memperbarui data hewan',
                    error: err
                });
            } else {
                if (result.affectedRows > 0) {
                    res.status(200).json({
                        status: 'success',
                        message: 'Data hewan berhasil diperbarui'
                    });
                } else {
                    res.status(404).json({
                        status: 'error',
                        message: 'Data hewan tidak ditemukan'
                    });
                }
            }
        });
    } else if (req.method === 'DELETE') {
        const kd_hewan = req.params.kd_hewan;
        const query = 'DELETE FROM hewan WHERE kd_hewan = ?';
        dbConnection.query(query, [kd_hewan], (err, result) => {
            if (err) {
                res.status(500).json({
                    status: 'error',
                    message: 'Terjadi kesalahan saat menghapus data hewan',
                    error: err
                });
            } else {
                if (result.affectedRows > 0) {
                    res.status(200).json({
                        status: 'success',
                        message: 'Data hewan berhasil dihapus'
                    });
                } else {
                    res.status(404).json({
                        status: 'error',
                        message: 'Data hewan tidak ditemukan'
                    });
                }
            }
        });
    } else {
        res.status(405).json({
            status: 'error',
            message: 'Metode tidak diizinkan'
        });
    }
};