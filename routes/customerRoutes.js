// File: backend/routes/customerRoutes.js

const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');

router.post('/filter', customerController.filterCustomers);

module.exports = router;
