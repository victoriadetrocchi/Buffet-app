// backend/src/routes/pedido.routes.js
const express = require('express');
const router = express.Router();
const pedidoController = require('../controllers/pedido.controller');

// Definimos la ruta POST /api/pedidos
router.post('/', pedidoController.crear);

module.exports = router;