const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuario.controller');

router.get('/:id', usuarioController.obtenerDatos);
router.put('/:id/asistencia', usuarioController.actualizarAsistencia);

module.exports = router;