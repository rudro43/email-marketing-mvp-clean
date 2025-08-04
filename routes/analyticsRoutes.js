// File: backend/routes/analyticsRoutes.js
const express = require('express');
const router = express.Router();
const { getDashboardStats } = require('../controllers/analyticController');

router.get('/', getDashboardStats);

module.exports = router;
