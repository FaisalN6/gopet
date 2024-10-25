const express = require('express');
const router = express.Router();
const BrngController = require('../Controllers/BrngController');
const SplrController = require('../Controllers/SplrController');
const HwnController = require('../Controllers/HwnController');
const UserController = require('../Controllers/UserController');
const PaymentController = require('../Controllers/PaymentController');

// Rute untuk user
router.get('/users', UserController.connDB);
router.get('/users/:id', UserController.connDB);
router.post('/users', UserController.connDB);
router.put('/users/:id', UserController.connDB);
router.delete('/users/:id', UserController.connDB);

// Rute untuk barang
router.get('/barang', BrngController.connDB);
router.get('/barang/:kd_barang', BrngController.connDB);
router.post('/barang', BrngController.connDB);
router.put('/barang/:kd_barang', BrngController.connDB);
router.delete('/barang/:kd_barang', BrngController.connDB);

// Rute untuk suplier
router.get('/suplier', SplrController.connDB);
router.get('/suplier/:kd_suplier', SplrController.connDB);
router.post('/suplier', SplrController.connDB);
router.put('/suplier/:kd_suplier', SplrController.connDB);
router.delete('/suplier/:kd_suplier', SplrController.connDB);

// Rute untuk hewan
router.get('/hewan', HwnController.connDB);
router.get('/hewan/:kd_hewan', HwnController.connDB);
router.post('/hewan', HwnController.connDB);
router.put('/hewan/:kd_hewan', HwnController.connDB);
router.delete('/hewan/:kd_hewan', HwnController.connDB);

// Rute untuk payment
router.post('/payments', PaymentController.createPayment);
router.put('/payments/:kd_transaksi', PaymentController.updatePayment);
router.delete('/payments/:kd_transaksi', PaymentController.deletePayment);
router.get('/payments/:kd_transaksi', PaymentController.getPaymentDetail);
router.get('/payments', PaymentController.getAllPayment);

module.exports = router;