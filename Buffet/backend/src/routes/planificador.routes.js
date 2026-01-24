const express = require('express');
const router = express.Router();
const planificadorController = require('../controllers/planificador.controller');

// ==========================================
// RUTAS PARA EL ADMIN (Gestionar la semana)
// ==========================================

// 1. Ver toda la planificación (GET /api/planificador)
router.get('/', planificadorController.obtenerMenuSemanal);

// 2. Asignar un plato a un día (POST /api/planificador)
router.post('/', planificadorController.asignarPlato);

// 3. Quitar un plato de un día (DELETE /api/planificador/:id)
router.delete('/:id', planificadorController.eliminarAsignacion);


// ==========================================
// RUTAS PARA EL EMPLEADO (Ver qué comer)
// ==========================================

// 4. Ver el menú listo para ordenar (GET /api/planificador/vigente)
router.get('/vigente', planificadorController.obtenerMenuParaEmpleado);

module.exports = router;