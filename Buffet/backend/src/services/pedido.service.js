// backend/src/services/pedido.service.js
const db = require('../config/db');

class PedidoService {
    
    // Método para crear un pedido con transacción completa
    static async crearPedido(idUsuario, semana, detalles) {
        const connection = await db.getConnection(); // Obtenemos una conexión exclusiva para la transacción
        
        try {
            await connection.beginTransaction(); // 1. Iniciamos transacción

            // 2. Buscamos el ID del empleado basado en el usuario
            const [empleados] = await connection.query('SELECT id FROM empleado WHERE id_usuario = ?', [idUsuario]);
            if (empleados.length === 0) {
                throw new Error("Empleado no encontrado para este usuario.");
            }
            const idEmpleado = empleados[0].id;

            // 3. Creamos el encabezado del pedido
            const fechaPedido = new Date();
            const [pedidoResult] = await connection.query(
                'INSERT INTO pedido (id_empleado, semana, fecha_pedido) VALUES (?, ?, ?)',
                [idEmpleado, semana, fechaPedido]
            );
            const pedidoId = pedidoResult.insertId;

            // 4. Procesamos cada item (Validar Stock -> Descontar -> Agregar al pedido)
            // Usamos un for...of para poder usar await dentro del loop y detenernos si algo falla
            const itemsParaInsertar = [];

            for (const item of detalles) {
                // A. Verificamos Stock
                const [platos] = await connection.query('SELECT stock, nombre FROM item_menu WHERE id = ?', [item.id_item_menu]);
                
                if (platos.length === 0) throw new Error(`El item ID ${item.id_item_menu} no existe.`);
                
                const plato = platos[0];
                if (plato.stock < item.cantidad) {
                    throw new Error(`Stock insuficiente para ${plato.nombre}. Disponible: ${plato.stock}`);
                }

                // B. Descontamos Stock
                await connection.query('UPDATE item_menu SET stock = stock - ? WHERE id = ?', [item.cantidad, item.id_item_menu]);

                // C. Preparamos datos para insertar en la tabla intermedia
                // id_dia puede venir null si no aplica
                itemsParaInsertar.push([pedidoId, item.id_item_menu, item.id_dia || null, item.cantidad]);
            }

            // 5. Insertamos todos los detalles de una sola vez (Bulk Insert)
            if (itemsParaInsertar.length > 0) {
                await connection.query(
                    'INSERT INTO pedido_item_menu (id_pedido, id_item_menu, id_dia, cantidad) VALUES ?',
                    [itemsParaInsertar]
                );
            }

            await connection.commit(); // ✅ Si llegamos acá, confirmamos todo
            return { message: 'Pedido creado exitosamente', pedidoId };

        } catch (error) {
            await connection.rollback(); // ❌ Si algo falló, deshacemos todo
            console.error("Error en transacción de pedido:", error.message);
            throw error; // Lanzamos el error para que lo capture el Controller
        } finally {
            connection.release(); // Liberamos la conexión de vuelta al pool
        }
    }
}

module.exports = PedidoService;