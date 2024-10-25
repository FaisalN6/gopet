const express = require('express');
const router = express.Router();
const ConnController = require('../Controllers/ConnController');

router.get('/conn', ConnController.connDB);

module.exports = router;