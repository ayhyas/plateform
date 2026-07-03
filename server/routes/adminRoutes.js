const express = require('express');
const rateLimit = require('express-rate-limit');
const { adminAuth } = require('../middleware/auth');
const { asyncHandler } = require('../middleware/errorHandler');
const adminController = require('../controllers/adminController');

const router = express.Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { message: 'Trop de tentatives de connexion. Reessayez plus tard.' },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post('/login', loginLimiter, asyncHandler(adminController.login));

router.get('/students', adminAuth, asyncHandler(adminController.listStudents));
router.delete('/students/:id', adminAuth, asyncHandler(adminController.deleteStudent));
router.get('/export', adminAuth, asyncHandler(adminController.exportResults));

router.get('/questions', adminAuth, asyncHandler(adminController.listQuestions));
router.post('/questions', adminAuth, asyncHandler(adminController.createQuestion));
router.put('/questions/:id', adminAuth, asyncHandler(adminController.updateQuestion));
router.delete('/questions/:id', adminAuth, asyncHandler(adminController.deleteQuestion));

router.get('/settings', adminAuth, asyncHandler(adminController.getSettings));
router.put('/settings', adminAuth, asyncHandler(adminController.updateSettings));

module.exports = router;
