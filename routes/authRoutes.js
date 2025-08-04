const express = require('express');
const router = express.Router();
const { loginWithMicrosoft } = require('../controllers/authController');

router.get('/microsoft/callback', loginWithMicrosoft);

module.exports = router;
