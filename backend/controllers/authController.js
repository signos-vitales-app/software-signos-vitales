const jwt = require('jsonwebtoken'); //utiliza json para el token 
const transporter = require('../config/nodemailer'); //requiere nodemailer para el envio de correos electronicos 
const crypto = require('crypto'); //encripta la contraseña 
const User = require('../models/User'); //requiere el modelo del uusario para poder registarlos 
const bcrypt = require('bcryptjs'); // encrita de igual manera los atos 
const multer = require('multer');
const path = require('path');
const db = require('../config/db');

// Configuración de multer para el almacenamiento de imágenes
const storage = multer.diskStorage({
    destination: 'uploads/profile-images/',
    filename: function(req, file, cb) {
        // Crear un nombre único para la imagen: timestamp-username.extension
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'profile-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // Límite de 5MB
    },
    fileFilter: function(req, file, cb) {
        const filetypes = /jpeg|jpg|png/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error('Error: Solo se permiten archivos de imagen!'));
    }
});

// Función de registro de usuario con correo de bienvenida
exports.register = async (req, res) => {
    try {
        upload.single('profileImage')(req, res, async function(err) {
            if (err) {
                return res.status(400).json({ message: err.message });
            }

            const { username, password, email, role, numero_identificacion } = req.body;
            const profileImage = req.file ? req.file.filename : null;

            // Verificar si el usuario o el correo ya existen
            const existingUser = await User.findByUsername(username);
            const existingEmail = await User.findByEmail(email);

            if (existingUser) return res.status(400).json({ message: "Username already taken" });
            if (existingEmail) return res.status(400).json({ message: "Email already in use" });

            // Crear el nuevo usuario con la imagen de perfil
            const userId = await User.createUser({ 
                username, 
                password, 
                email, 
                role,
                profile_image: profileImage,
                numero_identificacion
            });

            // Enviar correo de bienvenida
            await transporter.sendMail({
                from: process.env.EMAIL_USER,
                to: email,
                subject: "Welcome to the Hospital Patient Management System",
                html: `<p>Hello ${username},</p>
                       <p>Welcome! Your account has been successfully created with the role of ${role}.</p>
                       <p>Thank you for registering with us.</p>`
            });

            res.status(201).json({ 
                message: "User registered successfully, welcome email sent", 
                userId,
                profileImage 
            });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

// Función de inicio de sesión
exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;

        const [rows] = await db.query(
            "SELECT id, username, password, role FROM users WHERE username = ?",
            [username]
        );

        if (rows.length === 0) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const user = rows[0];
        const isValidPassword = await bcrypt.compare(password, user.password);

        if (!isValidPassword) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // Crear token incluyendo el id del usuario
        const token = jwt.sign(
            { 
                id: user.id,
                username: user.username,
                role: user.role 
            },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            token,
            role: user.role,
            username: user.username
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: "Server error" });
    }
};

// Función de restablecimiento de contraseña
exports.resetPassword = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findByEmail(email);
        if (!user) return res.status(404).json({ message: "User not found" });

        const token = crypto.randomBytes(32).toString('hex');
        await User.saveResetToken(user.id, token);

        // Cambia el enlace para que apunte al frontend
        const resetLink = `http://localhost:5173/reset-password/${token}`;

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Password Reset Request",
            html: `<p>Click <a href="${resetLink}">here</a> to reset your password. The link is valid for 1 hour.</p>`
        });

        res.status(200).json({ message: "Password reset email sent" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

// Nueva función `verifyResetToken` en `authController.js`
exports.verifyResetToken = async (token) => {
    try {
        const user = await User.findByResetToken(token);
        return user;
    } catch (error) {
        throw new Error("Invalid or expired token");
    }
};

// Función para actualizar la contraseña (después de la verificación del token)
exports.updatePassword = async (req, res) => {
    const { token } = req.params;
    const { newPassword } = req.body;

    try {
        // Aquí debes verificar el token y asociarlo con el usuario
        const user = await exports.verifyResetToken(token); // Función que verifica el token y obtiene al usuario

        if (!user) {
            return res.status(400).json({ message: "Invalid or expired token" });
        }

        // Encripta la nueva contraseña y actualízala en la base de datos
        await User.updatePassword(user.id, newPassword);

        res.status(200).json({ message: "Password updated successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};


exports.getUserInfo = async (req, res) => {
    try {
        const userId = req.user.id;
        
        const [rows] = await db.query(
            "SELECT id, username, email, role, profile_image, numero_identificacion FROM users WHERE id = ?",
            [userId]
        );

        if (rows.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        const user = rows[0];
        res.json(user);
    } catch (error) {
        console.error('Error in getUserInfo:', error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};