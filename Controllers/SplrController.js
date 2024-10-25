const dbConnection = require('../config/database');

exports.connDB = (req, res) => {
    if (req.method === 'GET') {
        if (req.params.kd_suplier) {
            // Menampilkan 1 data berdasarkan kd_suplier
            const kd_suplier = req.params.kd_suplier;
            dbConnection.query('SELECT * FROM suplier WHERE kd_suplier = ?', [kd_suplier], (err, rows) => {
                if (err) {
                    res.status(500).json({
                        status: 'error',
                        message: 'Terjadi kesalahan saat mengambil data suplier',
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
                            message: 'Data suplier tidak ditemukan'
                        });
                    }
                }
            });
        } else {
            // Menampilkan semua data
            dbConnection.query('SELECT * FROM suplier', (err, rows) => {
                if (err) {
                    res.status(500).json({
                        status: 'error',
                        message: 'Terjadi kesalahan saat mengambil data suplier',
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
        const { kd_suplier, nama_suplier, alamat_suplier, telepon_suplier, email_suplier } = req.body;
        const query = 'INSERT INTO suplier (kd_suplier, nama_suplier, alamat_suplier, telepon_suplier, email_suplier) VALUES (?, ?, ?, ?, ?)';
        dbConnection.query(query, [kd_suplier, nama_suplier, alamat_suplier, telepon_suplier, email_suplier], (err, result) => {
            if (err) {
                res.status(500).json({
                    status: 'error',
                    message: 'Terjadi kesalahan saat menambahkan data suplier',
                    error: err
                });
            } else {
                res.status(201).json({
                    status: 'success',
                    message: 'Data suplier berhasil ditambahkan',
                    kd_suplier: result.insertId
                });
            }
        });
    } else if (req.method === 'PUT') {
        const kd_suplier = req.params.kd_suplier;
        const { nama_suplier, alamat_suplier, telepon_suplier, email_suplier } = req.body;
        const query = 'UPDATE suplier SET nama_suplier = ?, alamat_suplier = ?, telepon_suplier = ?, email_suplier = ? WHERE kd_suplier = ?';
        dbConnection.query(query, [nama_suplier, alamat_suplier, telepon_suplier, email_suplier, kd_suplier], (err, result) => {
            if (err) {
                res.status(500).json({
                    status: 'error',
                    message: 'Terjadi kesalahan saat memperbarui data suplier',
                    error: err
                });
            } else {
                if (result.affectedRows > 0) {
                    res.status(200).json({
                        status: 'success',
                        message: 'Data suplier berhasil diperbarui'
                    });
                } else {
                    res.status(404).json({
                        status: 'error',
                        message: 'Data suplier tidak ditemukan'
                    });
                }
            }
        });
    } else if (req.method === 'DELETE') {
        const kd_suplier = req.params.kd_suplier;
        const query = 'DELETE FROM suplier WHERE kd_suplier = ?';
        dbConnection.query(query, [kd_suplier], (err, result) => {
            if (err) {
                res.status(500).json({
                    status: 'error',
                    message: 'Terjadi kesalahan saat menghapus data suplier',
                    error: err
                });
            } else {
                if (result.affectedRows > 0) {
                    res.status(200).json({
                        status: 'success',
                        message: 'Data suplier berhasil dihapus'
                    });
                } else {
                    res.status(404).json({
                        status: 'error',
                        message: 'Data suplier tidak ditemukan'
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