const db = require('../config/db');
const bcrypt = require('bcryptjs');

// Función para crear un nuevo usuario
exports.createUser = async ({ username, password, email, role, profile_image }) => {
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const [result] = await db.query(
            "INSERT INTO users (username, password, email, role, profile_image) VALUES (?, ?, ?, ?, ?)",
            [username, hashedPassword, email, role, profile_image]
        );
        return result.insertId;
    } catch (error) {
        throw new Error("Error creating user");
    }
};

// Función para buscar un usuario por username
exports.findByUsername = async (username) => {
    try {
        const [user] = await db.query("SELECT * FROM users WHERE username = ?", [username]);
        return user[0];
    } catch (error) {
        throw new Error("User not found");
    }
};

// Función para buscar un usuario por email
exports.findByEmail = async (email) => {
    try {
        const [user] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
        return user[0];
    } catch (error) {
        throw new Error("User not found");
    }
};

// Función para actualizar la contraseña de un usuario
exports.updatePassword = async (id, newPassword) => {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    try {
        await db.query("UPDATE users SET password = ? WHERE id = ?", [hashedPassword, id]);
        return true;
    } catch (error) {
        throw new Error("Error updating password");
    }
};


// Función para guardar el token de restablecimiento de contraseña
exports.saveResetToken = async (userId, token) => {
    const expiration = new Date(Date.now() + 3600000); // El token expira en 1 hora

    try {
        await db.query(
            "UPDATE users SET reset_token = ?, reset_token_expiration = ? WHERE id = ?",
            [token, expiration, userId]
        );
        return true;
    } catch (error) {
        throw new Error("Error saving reset token");
    }
};

// Función para encontrar un usuario por el token de restablecimiento
exports.findByResetToken = async (token) => {
    try {
        const [user] = await db.query(
            "SELECT * FROM users WHERE reset_token = ? AND reset_token_expiration > NOW()",
            [token]
        );
        return user[0];
    } catch (error) {
        throw new Error("Token is invalid or has expired");
    }
};