const dbConnection = require('../config/database');

exports.connDB = (req, res) => {
    if (req.method === 'GET'){
        if (req.params.id){
            const id = req.params.id;
            const query = `SELECT * FROM users WHERE id = ?`;
            dbConnection.query(query, [id], (err, rows) => {
                if (err) {
                    res.status(500).json({
                        status: 'error',
                        message: 'Terjadi kesalahan saat mengambil data user berdasarkan id',
                        error: err
                    });
                } else if (rows.length > 0){
                    res.status(200).json({
                        status: 'success',
                        data: rows[0]
                    });
                } else {
                    res.status(404).json({
                        status: 'error',
                        message: 'Data user tidak ditemukan'
                    });
                };
            });
        } else {
            const query = 'SELECT * FROM users';
            dbConnection.query(query, (err, rows) => {
                if (err) {
                    res.status(500).json({
                        status: 'error',
                        mssage: 'Terjadi kesalahan saat mengambil data user',
                        error: err
                    });
                } else if (rows.length > 0){
                    res.status(200).json({
                        status: 'success',
                        data: rows
                    });
                } else {
                    res.status(404).json({
                        status: 'error',
                        message: 'Data user tidak ditemukan'
                    });
                }
            });
        }
    } else if (req.method === 'POST'){
        const { username, password, nama, role } = req.body;
        const query = 'INSERT INTO users (username, password, nama, role) VALUES (?, ?, ?, ?)';
        dbConnection.query(query, [username, password, nama, role], (err, result) => {
            if (err) {
                res.status(500).json({
                    status: 'error',
                    message: 'Terjadi kesalahan saat menambahkan data user',
                    error: err
                });
            } else {
                res.status(201).json({
                    status: 'success',
                    message: 'Data user berhasil ditambahkan',
                    kd_user: result.insertId
                });
            }
        });
    } else if (req.method === 'PUT'){
        const id = req.params.id;
        const { username, password, nama, role } = req.body;
        const query = 'UPDATE users SET username = ?, password = ?, nama = ?, role = ? WHERE id = ?';
        dbConnection.query(query, [username, password, nama, role, id], (err, result) => {
            if (err) {
                res.status(500).json({
                    status: 'error',
                    message: 'Terjadi kesalahan saat mengubah data user',
                    error: err
                });
            } else if (result.affectedRows > 0) {
                res.status(200).json({
                    status: 'success',
                    message: 'Data user berhasil diubah'
                });
            } else {
                res.status(404).json({
                    status: 'error',
                    message: 'Data user tidak ditemukan'
                });
            }
        });
    } else if (req.method === 'DELETE'){
        const id = req.params.id;
        const query = 'DELETE FROM users WHERE id = ?';
        dbConnection.query(query, [id], (err, result) => {
            if (err) {
                res.status(500).json({
                    status: 'error',
                    message: 'Terjadi kesalahan saat menghapus data user',
                    error: err
                });
            } else if (result.affectedRows > 0) {
                res.status(200).json({
                    status: 'success',
                    message: 'Data user berhasil dihapus'
                });
            } else {
                res.status(404).json({
                    status: 'error',
                    message: 'Data user tidak ditemukan'
                });
            }
        });
    } else {
        res.status(405).json({
            status: 'error',
            message: 'Metode tidak diizinkan'
        });
    }
};