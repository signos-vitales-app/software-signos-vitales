const express = require('express');
const { getUsers, updateUserRole, toggleUserStatus} = require('../controllers/userController');
const router = express.Router();

router.get('/',getUsers);
router.patch('/:id', updateUserRole);
router.patch('/:id/status', toggleUserStatus); // Nueva ruta para habilitar/inhabilitar usuario

module.exports = router;
