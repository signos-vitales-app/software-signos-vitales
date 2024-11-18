const db = require('../config/db'); //requiere la base de datos

// Obtener lista de usuarios
exports.getUsers = async (req, res) => {
    try {
        const [users] = await db.query("SELECT id, username, email, role, numero_identificacion, is_active FROM users");
        res.status(200).json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error en el servidor" });
    }
};

// Actualizar rol de usuario
exports.updateUserRole = async (req, res) => {
    const { id } = req.params;
    const { role } = req.body;

    try {
        await db.query("UPDATE users SET role = ? WHERE id = ?", [role, id]);
        res.status(200).json({ message: "Rol de usuario actualizado exitosamente" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error en el servidor" });
    }
};

//borrar usuario 
exports.deleteUser = async (req, res) => {
    const { id } = req.params;
    try {
        // Lógica para eliminar usuario de la base de datos
        // Suponiendo que usas un ORM como Sequelize o Mongoose:
        const deletedUser = await User.destroy({ where: { id } });
        if (deletedUser) {
            res.status(200).json({ message: "Usuario eliminado exitosamente" });
        } else {
            res.status(404).json({ error: "Usuario no encontrado" });
        }
    } catch (error) {
        res.status(500).json({ error: "Error al eliminar el usuario" });
    }
};
// Habilitar o deshabilitar usuario
exports.toggleUserStatus = async (req, res) => {
    const { id } = req.params;
    const { is_active } = req.body;

    try {
        await db.query("UPDATE users SET is_active = ? WHERE id = ?", [is_active, id]);
        res.status(200).json({ message: `User ${is_active ? 'enabled' : 'disabled'} successfully` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error en el servidor" });
    }
};
