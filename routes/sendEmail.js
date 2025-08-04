const express = require('express');
const router = express.Router();
const { sendOutlookEmail } = require('../services/outlookMailer');

router.post('/', async (req, res) => {
  const { to, subject, message } = req.body;
  try {
    await sendOutlookEmail(to, subject, message);
    res.status(200).json({ message: 'Email sent!' });
  } catch (err) {
    console.error('Email send failed:', err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
