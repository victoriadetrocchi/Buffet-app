const db = require('../config/db');

// 1. ADMIN: Listar todo el menú planificado (ordenado por día)
const obtenerMenuSemanal = async (req, res) => {
    try {
        const sql = `
            SELECT ms.id AS id_asignacion, 
                   d.id AS id_dia, d.nombre AS nombre_dia,
                   p.id AS id_plato, p.nombre AS nombre_plato, p.categoria, p.precio
            FROM menu_semanal ms
            JOIN dia d ON ms.id_dia = d.id
            JOIN item_menu p ON ms.id_item_menu = p.id
            ORDER BY d.id, p.nombre
        `;
        const [rows] = await db.query(sql);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 2. ADMIN: Asignar un plato a un día
const asignarPlato = async (req, res) => {
    try {
        const { id_plato, id_dia } = req.body;
        
        // Verificar duplicados
        const [existe] = await db.query(
            'SELECT * FROM menu_semanal WHERE id_item_menu = ? AND id_dia = ?', 
            [id_plato, id_dia]
        );
        
        if (existe.length > 0) {
            return res.status(400).json({ message: 'Ese plato ya está asignado a ese día' });
        }

        await db.query('INSERT INTO menu_semanal (id_item_menu, id_dia) VALUES (?, ?)', [id_plato, id_dia]);
        res.json({ message: 'Plato asignado correctamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 3. ADMIN: Quitar un plato de un día
const eliminarAsignacion = async (req, res) => {
    try {
        const { id } = req.params;
        await db.query('DELETE FROM menu_semanal WHERE id = ?', [id]);
        res.json({ message: 'Plato quitado del día' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 4. EMPLEADO: Ver menú vigente (con stock, precio, imagen, etc.)
const obtenerMenuParaEmpleado = async (req, res) => {
    try {
        const sql = `
            SELECT ms.id_dia, d.nombre as nombre_dia, 
                   p.id, p.nombre, p.descripcion, p.precio, p.stock, p.categoria, p.imagen
            FROM menu_semanal ms
            JOIN item_menu p ON ms.id_item_menu = p.id
            JOIN dia d ON ms.id_dia = d.id
            WHERE p.stock > 0  -- Opcional: Solo mostrar si hay stock
            ORDER BY d.id, p.nombre
        `;
        const [rows] = await db.query(sql);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 👇 ESTO ES LO QUE TE FALTABA (Exportar las 4 funciones)
module.exports = { 
    obtenerMenuSemanal, 
    asignarPlato, 
    eliminarAsignacion, 
    obtenerMenuParaEmpleado 
};