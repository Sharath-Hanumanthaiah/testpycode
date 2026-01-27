const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
// const { authenticate, authorizeModerator } = require('../middleware/auth'); // To be implemented

// All routes assume authentication middleware is applied globally or here

// Report a post
router.post('/', /*authenticate,*/ reportController.reportPost);

// Get all reports (moderator/admin)
router.get('/', /*authenticate, authorizeModerator,*/ reportController.getReports);

// Update report status (moderator/admin)
router.patch('/:id/status', /*authenticate, authorizeModerator,*/ reportController.updateReportStatus);

module.exports = router;
