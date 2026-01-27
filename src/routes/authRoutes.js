const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/signup', authController.signup);
router.post('/verify', authController.verify);
router.post('/password-reset', authController.sendPasswordReset);

module.exports = router;
