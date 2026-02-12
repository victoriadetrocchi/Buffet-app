const express = require('express');
const router = express.Router();

// Importamos el controlador ESPECÍFICO de autenticación
const authController = require('../controllers/auth.controller');

// Definimos la ruta POST /login
router.post('/login', authController.login);

module.exports = router;