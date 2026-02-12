// backend/src/routes/pedido.routes.js
const express = require('express');
const router = express.Router();
const pedidoController = require('../controllers/pedido.controller');

// Definimos la ruta POST /api/pedidos
router.post('/', pedidoController.crear);
router.get('/usuario/:idUsuario', pedidoController.listarPorUsuario);
router.get('/', pedidoController.listarTodos); // Ver todo
router.put('/:id/estado', pedidoController.cambiarEstado); // Cambiar estado

module.exports = router;
