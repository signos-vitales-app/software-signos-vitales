const express = require('express');
const { getUsers, updateUserRole, toggleUserStatus,deleteUser, getUserById,updateUserDetails} = require('../controllers/userController');
const router = express.Router();

router.get('/',getUsers);
router.get('/:id', getUserById);
router.put('/:id', updateUserDetails); 
router.patch('/:id', updateUserRole);
router.patch('/:id/status', toggleUserStatus); // Nueva ruta para habilitar/inhabilitar usuario
router.delete('/:id', deleteUser); // Nueva ruta para eliminar usuarios
module.exports = router;