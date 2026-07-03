const express = require('express');
const rateLimit = require('express-rate-limit');
const { studentAuth } = require('../middleware/auth');
const { asyncHandler } = require('../middleware/errorHandler');
const studentController = require('../controllers/studentController');

const router = express.Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  message: { message: 'Trop de tentatives de connexion. Reessayez plus tard.' },
  standardHeaders: true,
  legacyHeaders: false,
});

router.get('/status', asyncHandler(studentController.getStatus));
router.post('/login', loginLimiter, asyncHandler(studentController.login));
router.get('/exam/current', studentAuth, asyncHandler(studentController.getCurrentQuestion));
router.post('/exam/answer', studentAuth, asyncHandler(studentController.submitAnswer));

module.exports = router;
