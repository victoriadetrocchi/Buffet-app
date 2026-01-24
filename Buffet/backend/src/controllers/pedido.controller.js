const db = require('../config/db'); // <--- ESTO ES LO QUE TE FALTABA

const crear = async (req, res) => {
    try {
        const { id_usuario, detalles } = req.body; 
        // detalles es un array: [{ id_item_menu: 1, cantidad: 2 }, ...]

        console.log("🛒 Nuevo pedido recibido. Items:", detalles.length);

        // 1. VALIDACIÓN DE STOCK (Antes de cobrar, miramos si hay)
        for (const item of detalles) {
            const [plato] = await db.query('SELECT nombre, stock FROM item_menu WHERE id = ?', [item.id_item_menu]);
            
            if (plato.length === 0) {
                return res.status(400).json({ message: `El producto ID ${item.id_item_menu} no existe` });
            }

            if (plato[0].stock < item.cantidad) {
                return res.status(400).json({ 
                    message: `No hay suficiente stock de ${plato[0].nombre}. Quedan: ${plato[0].stock}` 
                });
            }
        }

        // 2. CREAR EL PEDIDO (Cabecera)
        const [resultPedido] = await db.query(
            'INSERT INTO pedido (id_usuario, id_estado, total) VALUES (?, 1, 0)',
            [id_usuario]
        );
        const idPedido = resultPedido.insertId;

        // 3. GUARDAR DETALLES Y DESCONTAR STOCK
        let total = 0;

        for (const item of detalles) {
            // Obtenemos precio actual
            const [infoPlato] = await db.query('SELECT precio FROM item_menu WHERE id = ?', [item.id_item_menu]);
            const precio = infoPlato[0].precio;
            
            // Insertamos en detalle_pedido
            await db.query(
                'INSERT INTO detalle_pedido (id_pedido, id_item_menu, cantidad, precio_unitario) VALUES (?, ?, ?, ?)',
                [idPedido, item.id_item_menu, item.cantidad, precio]
            );

            // 🔥 ACÁ ESTÁ LA MAGIA: RESTAR STOCK 🔥
            // Actualizamos la tabla item_menu restando la cantidad
            await db.query(
                'UPDATE item_menu SET stock = stock - ? WHERE id = ?',
                [item.cantidad, item.id_item_menu]
            );

            total += precio * item.cantidad;
        }

        // 4. ACTUALIZAR TOTAL DEL PEDIDO
        await db.query('UPDATE pedido SET total = ? WHERE id = ?', [total, idPedido]);

        res.json({ message: 'Pedido creado y stock descontado!', id_pedido: idPedido });

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
// Función para cambiar estado (Pendiente -> En Proceso -> Entregado)
const cambiarEstado = async (req, res) => {
    try {
        const { id } = req.params;      // El ID del pedido (ej: 5)
        const { id_estado } = req.body; // El nuevo estado (ej: 2 o 3)

        console.log(`📝 Cambiando pedido ${id} a estado ${id_estado}`);

        // Actualizamos en la Base de Datos
        const [result] = await db.query(
            'UPDATE pedido SET id_estado = ? WHERE id = ?',
            [id_estado, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Pedido no encontrado' });
        }

        res.json({ message: 'Estado actualizado correctamente' });
    } catch (error) {
        console.error(error);
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