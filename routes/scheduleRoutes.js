const express = require('express');
const router = express.Router();
const scheduleController = require('../controllers/scheduleController');
//const { scheduleBulkEmails } = require('../controllers/scheduleController');
// Route for scheduling an email
//router.post('/schedule', scheduleController.scheduleEmail);

// Route for creating a new schedule
router.post('/', scheduleController.createSchedule);

// Route for getting all schedules
router.get('/', scheduleController.getSchedules);
//  router.post('/bulk', scheduleBulkEmails);
router.post('/bulk', scheduleController.scheduleBulkEmails);
module.exports = router;
