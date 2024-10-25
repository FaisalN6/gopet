const dbConnection = require('../config/database');
const util = require('util');

// Fungsi untuk menambah pembayaran
exports.createPayment = async (req, res) => {
    if (req.method === 'POST') {
        const { kd_barang, jumlah_pembelian, total_harga, tanggal_pembayaran, metode_pembayaran, status_pembayaran } = req.body;
        const query = util.promisify(dbConnection.query).bind(dbConnection);

        try {
            // Mulai transaksi
            await query('START TRANSACTION');

            // 1. Ambil stok barang saat ini
            const [barang] = await query('SELECT stok_barang, harga FROM barang WHERE kd_barang = ?', [kd_barang]);
            
            if (!barang) {
                await query('ROLLBACK');
                return res.status(404).json({
                    status: 'error',
                    message: 'Data barang tidak ditemukan'
                });
            }

            const stokSaatIni = barang.stok_barang;

            // 2. Cek apakah stok cukup
            if (stokSaatIni < jumlah_pembelian) {
                await query('ROLLBACK');
                return res.status(400).json({
                    status: 'error',
                    message: 'Stok tidak mencukupi'
                });
            }

            // 3. Simpan transaksi pembelian
            await query(
                'INSERT INTO payment (kd_barang, jumlah_pembelian, total_harga, tanggal_pembayaran, metode_pembayaran, status_pembayaran) VALUES (?, ?, ?, ?, ?, ?)',
                [kd_barang, jumlah_pembelian, total_harga, tanggal_pembayaran, metode_pembayaran, status_pembayaran]
            );

            // 4. Update stok barang
            await query(
                'UPDATE barang SET stok_barang = stok_barang - ? WHERE kd_barang = ?',
                [jumlah_pembelian, kd_barang]
            );

            // 5. Commit transaksi
            await query('COMMIT');

            res.status(200).json({
                status: 'success',
                message: 'Transaksi berhasil, stok diperbarui.'
            });
        } catch (error) {
            // Rollback jika ada kesalahan
            await query('ROLLBACK');
            res.status(500).json({
                status: 'error',
                message: 'Terjadi kesalahan saat menambahkan data pembayaran',
                error: error
            });
        }
    } else {
        res.status(405).json({
            status: 'error',
            message: 'Metode tidak diizinkan'
        });
    }
};

// Fungsi untuk mengupdate pembayaran
exports.updatePayment = async (req, res) => {
    if (req.method === 'PUT') {
        const { kd_transaksi } = req.params;
        const { jumlah_pembelian } = req.body;
        const query = util.promisify(dbConnection.query).bind(dbConnection);

        try {
            // Mulai transaksi
            await query('START TRANSACTION');

            // 1. Ambil detail transaksi
            const [transaksi] = await query('SELECT * FROM payment WHERE kd_transaksi = ?', [kd_transaksi]);

            if (!transaksi) {
                await query('ROLLBACK');
                return res.status(404).json({
                    status: 'error',
                    message: 'Data transaksi tidak ditemukan'
                });
            }

            // 2. Hitung perbedaan jumlah pembelian (apakah bertambah atau berkurang)
            const selisihPembelian = jumlah_pembelian - transaksi.jumlah_pembelian;

            // 3. Cek stok barang saat ini
            const [barang] = await query('SELECT stok_barang, harga FROM barang WHERE kd_barang = ?', [transaksi.kd_barang]);

            if (!barang) {
                await query('ROLLBACK');
                return res.status(404).json({
                    status: 'error',
                    message: 'Data barang tidak ditemukan'
                });
            }

            if (barang.stok_barang < selisihPembelian) {
                await query('ROLLBACK');
                return res.status(400).json({
                    status: 'error',
                    message: 'Stok tidak mencukupi'
                });
            }

            // 4. Update jumlah pembelian dan total harga
            const totalHargaBaru = jumlah_pembelian * barang.harga;
            await query(
                'UPDATE payment SET jumlah_pembelian = ?, total_harga = ? WHERE kd_transaksi = ?',
                [jumlah_pembelian, totalHargaBaru, kd_transaksi]
            );

            // 5. Update stok barang sesuai dengan perubahan jumlah pembelian
            await query(
                'UPDATE barang SET stok_barang = stok_barang - ? WHERE kd_barang = ?',
                [selisihPembelian, transaksi.kd_barang]
            );

            // 6. Commit transaksi
            await query('COMMIT');

            res.status(200).json({
                status: 'success',
                message: 'Transaksi berhasil diperbarui.'
            });
        } catch (error) {
            // Rollback jika ada kesalahan
            await query('ROLLBACK');
            res.status(500).json({
                status: 'error',
                message: 'Terjadi kesalahan saat memperbarui transaksi',
                error: error
            });
        }
    } else {
        res.status(405).json({
            status: 'error',
            message: 'Metode tidak diizinkan'
        });
    }
};

// Fungsi untuk menghapus pembayaran
exports.deletePayment = async (req, res) => {
    if (req.method === 'DELETE') {
        const { kd_transaksi } = req.params;
        const query = util.promisify(dbConnection.query).bind(dbConnection);

        try {
            // Mulai transaksi
            await query('START TRANSACTION');

            // 1. Ambil detail transaksi
            const [payment] = await query('SELECT * FROM payment WHERE kd_transaksi = ?', [kd_transaksi]);
            
            if (!payment) {
                await query('ROLLBACK');
                return res.status(404).json({
                    status: 'error',
                    message: 'Data transaksi tidak ditemukan'
                });
            }

            // 2. Hapus transaksi
            await query(
                'DELETE FROM payment WHERE kd_transaksi = ?',
                [kd_transaksi]
            );

            // 3. Update stok barang
            await query(
                'UPDATE barang SET stok_barang = stok_barang + ? WHERE kd_barang = ?',
                [payment.jumlah_pembelian, payment.kd_barang]
            );

            // 4. Commit transaksi
            await query('COMMIT');

            res.status(200).json({
                status: 'success',
                message: 'Transaksi berhasil dihapus.'
            });
        } catch (error) {
            // Rollback jika ada kesalahan
            await query('ROLLBACK');
            res.status(500).json({
                status: 'error',
                message: 'Terjadi kesalahan saat menghapus transaksi',
                error: error
            });
        }
    } else {
        res.status(405).json({
            status: 'error',
            message: 'Metode tidak diizinkan'
        });
    }
};

// Fungsi untuk mendapatkan detail pembayaran
exports.getPaymentDetail = async (req, res) => {
    if (req.method === 'GET') {
        const { kd_transaksi } = req.params;
        const query = util.promisify(dbConnection.query).bind(dbConnection);

        try {
            // Ambil detail transaksi
            const [transaksi] = await query('SELECT * FROM payment WHERE kd_transaksi = ?', [kd_transaksi]);
            
            if (!transaksi) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Data transaksi tidak ditemukan'
                });
            }

            res.status(200).json({
                status: 'success',
                message: 'Detail transaksi berhasil diambil.',
                data: transaksi
            });
        } catch (error) {
            res.status(500).json({
                status: 'error',
                message: 'Terjadi kesalahan saat mengambil detail transaksi',
                error: error
            });
        }
    } else {
        res.status(405).json({
            status: 'error',
            message: 'Metode tidak diizinkan'
        });
    }
};

exports.getAllPayment = async (req, res) => {
    const query = util.promisify(dbConnection.query).bind(dbConnection);
    try {
        const payments = await query('SELECT * FROM payment');
        res.status(200).json({
            status: 'success',
            data: payments
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Terjadi kesalahan saat mengambil data pembayaran',
            error: error
        });
    }
};  
