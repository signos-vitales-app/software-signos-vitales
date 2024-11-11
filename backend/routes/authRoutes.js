// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');

// Rutas públicas
router.post('/login', authController.login);
router.post('/register', authController.register);
router.post('/reset-password', authController.resetPassword);
router.patch('/reset-password/:token', authController.updatePassword);

// Rutas protegidas
router.get('/user-info', authMiddleware, authController.getUserInfo);

module.exports = router;