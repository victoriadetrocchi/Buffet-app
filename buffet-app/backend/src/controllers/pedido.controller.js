// backend/src/controllers/pedido.controller.js
const PedidoService = require('../services/pedido.service');

const crear = async (req, res) => {
    try {
        const { id_usuario, semana, detalles } = req.body;

        // Validaciones básicas de entrada
        if (!id_usuario || !semana || !Array.isArray(detalles) || detalles.length === 0) {
            return res.status(400).json({ 
                error: "Faltan datos obligatorios (id_usuario, semana o detalles)." 
            });
        }

        // Llamamos al servicio (la lógica difícil ya no está aquí)
        const resultado = await PedidoService.crearPedido(id_usuario, semana, detalles);
        
        res.status(201).json(resultado);

    } catch (error) {
        // Manejo de errores limpio
        // Si el error es de negocio (ej: stock insuficiente), podríamos devolver 409 Conflict
        const status = error.message.includes('Stock') ? 409 : 500;
        res.status(status).json({ error: error.message });
    }
};

module.exports = {
    crear
};