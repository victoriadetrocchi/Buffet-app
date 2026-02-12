const express = require('express');
const router = express.Router();
const platosController = require('../controllers/platos.controller');

router.get('/', platosController.listar);
router.post('/', platosController.crear);
router.delete('/:id', platosController.eliminar);
router.put('/:id', platosController.actualizar);

module.exports = router;