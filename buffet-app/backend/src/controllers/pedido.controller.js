const db = require('../config/db'); // <--- ESTO ES LO QUE TE FALTABA

// 1. Función para CREAR un pedido (Cuando le das "Confirmar" en el carrito)
const crear = async (req, res) => {
    try {
        const { id_usuario, semana, detalles } = req.body;

        // a) Insertamos la cabecera del pedido
        const [result] = await db.query(
            'INSERT INTO pedido (id_usuario, fecha, id_estado, total) VALUES (?, NOW(), 1, 0)', 
            [id_usuario]
        );
        const idPedido = result.insertId;

        // b) Insertamos los platos (detalles) y calculamos el total
        let total = 0;
        for (const item of detalles) {
            // Buscamos el precio real de la base de datos para no confiar en el frontend
            const [plato] = await db.query('SELECT precio FROM item_menu WHERE id = ?', [item.id_item_menu]);
            const precio = plato[0].precio;
            
            await db.query(
                'INSERT INTO detalle_pedido (id_pedido, id_item_menu, cantidad, precio_unitario) VALUES (?, ?, ?, ?)',
                [idPedido, item.id_item_menu, item.cantidad, precio]
            );
            total += precio * item.cantidad;
        }

        // c) Actualizamos el total final en la cabecera
        await db.query('UPDATE pedido SET total = ? WHERE id = ?', [total, idPedido]);

        res.json({ message: 'Pedido creado exitosamente', id: idPedido });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

// 2. Función para LISTAR pedidos de un usuario (Para "Mis Pedidos")
const listarPorUsuario = async (req, res) => {
    try {
        const { idUsuario } = req.params;
        // Consulta simplificada para evitar errores
        const [pedidos] = await db.query(
            'SELECT * FROM pedido WHERE id_usuario = ? ORDER BY fecha DESC', 
            [idUsuario]
        );
        res.json(pedidos);
    } catch (error) {
        console.error("Error SQL:", error);
        res.status(500).json({ error: error.message });
    }
};

// 3. Función para CAMBIAR ESTADO (Para el Admin más adelante)
const cambiarEstado = async (req, res) => {
    try {
        const { id } = req.params;
        const { id_estado } = req.body;
        await db.query('UPDATE pedido SET id_estado = ? WHERE id = ?', [id_estado, id]);
        res.json({ message: 'Estado actualizado' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const listarTodos = async (req, res) => {
    try {
        // 👇 VERSIÓN ARREGLADA: Sin JOIN a tablas que no existen.
        // Usamos CASE para ponerle nombre al estado directamente en la consulta.
        const sql = `
            SELECT p.id, p.fecha, p.id_estado, p.total, 
                   u.nombre, u.apellido,
                   CASE 
                       WHEN p.id_estado = 1 THEN 'PENDIENTE'
                       WHEN p.id_estado = 2 THEN 'EN PREPARACIÓN'
                       WHEN p.id_estado = 3 THEN 'ENTREGADO'
                       ELSE 'DESCONOCIDO'
                   END as nombre_estado
            FROM pedido p
            JOIN usuario u ON p.id_usuario = u.id
            ORDER BY p.fecha DESC
        `;
        
        const [pedidos] = await db.query(sql);
        res.json(pedidos);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

module.exports = { crear, listarPorUsuario, cambiarEstado, listarTodos };