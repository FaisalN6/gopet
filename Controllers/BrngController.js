const dbConnection = require('../config/database');

exports.connDB = (req, res) => {
    if (req.method === 'GET') {
        if (req.params.kd_barang) {
            // Menampilkan 1 data berdasarkan kd_barang
            const kd_barang = req.params.kd_barang;
            const query = `
                SELECT b.kd_barang, b.nama_barang, b.stok_barang, b.kategori, b.jenis, s.nama_suplier, h.nama_hewan, b.harga
                FROM barang b
                LEFT JOIN suplier s ON b.kd_suplier = s.kd_suplier
                LEFT JOIN hewan h ON b.kd_hewan = h.kd_hewan
                WHERE b.kd_barang = ?
            `;
            dbConnection.query(query, [kd_barang], (err, rows) => {
                if (err) {
                    res.status(500).json({
                        status: 'error',
                        message: 'Terjadi kesalahan saat mengambil data barang',
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
                            message: 'Data barang tidak ditemukan'
                        });
                    }
                }
            });
        } else {
            // Menampilkan semua data
            const query = `
                SELECT b.kd_barang, b.nama_barang, b.stok_barang, b.kategori, b.jenis, s.nama_suplier, h.nama_hewan, b.harga
                FROM barang b
                LEFT JOIN suplier s ON b.kd_suplier = s.kd_suplier
                LEFT JOIN hewan h ON b.kd_hewan = h.kd_hewan
            `;
            dbConnection.query(query, (err, rows) => {
                if (err) {
                    res.status(500).json({
                        status: 'error',
                        message: 'Terjadi kesalahan saat mengambil data barang',
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
        const { kd_barang, nama_barang, stok_barang, kategori, jenis, kd_suplier, kd_hewan, harga } = req.body;
        const query = 'INSERT INTO barang (kd_barang, nama_barang, stok_barang, kategori, jenis, kd_suplier, kd_hewan, harga) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
        dbConnection.query(query, [kd_barang, nama_barang, stok_barang, kategori, jenis, kd_suplier, kd_hewan, harga], (err, result) => {
            if (err) {
                res.status(500).json({
                    status: 'error',
                    message: 'Terjadi kesalahan saat menambahkan data barang',
                    error: err
                });
            } else {
                res.status(201).json({
                    status: 'success',
                    message: 'Data barang berhasil ditambahkan',
                    kd_barang: result.insertId
                });
            }
        });
    } else if (req.method === 'PUT') {
        const kd_barang = req.params.kd_barang;
        const { nama_barang, stok_barang, kategori, jenis, kd_suplier, kd_hewan, harga } = req.body;
        const query = 'UPDATE barang SET nama_barang = ?, stok_barang = ?, kategori = ?, jenis = ?, kd_suplier = ?, kd_hewan = ?, harga = ? WHERE kd_barang = ?';
        dbConnection.query(query, [nama_barang, stok_barang, kategori, jenis, kd_suplier, kd_hewan, harga, kd_barang], (err, result) => {
            if (err) {
                res.status(500).json({
                    status: 'error',
                    message: 'Terjadi kesalahan saat memperbarui data barang',
                    error: err
                });
            } else {
                if (result.affectedRows > 0) {
                    res.status(200).json({
                        status: 'success',
                        message: 'Data barang berhasil diperbarui'
                    });
                } else {
                    res.status(404).json({
                        status: 'error',
                        message: 'Data barang tidak ditemukan'
                    });
                }
            }
        });
    } else if (req.method === 'DELETE') {
        const kd_barang = req.params.kd_barang;
        const query = 'DELETE FROM barang WHERE kd_barang = ?';
        dbConnection.query(query, [kd_barang], (err, result) => {
            if (err) {
                res.status(500).json({
                    status: 'error',
                    message: 'Terjadi kesalahan saat menghapus data barang',
                    error: err
                });
            } else {
                if (result.affectedRows > 0) {
                    res.status(200).json({
                        status: 'success',
                        message: 'Data barang berhasil dihapus'
                    });
                } else {
                    res.status(404).json({
                        status: 'error',
                        message: 'Data barang tidak ditemukan'
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
