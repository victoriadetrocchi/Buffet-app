const db = require('../config/db');

const listar = async (req, res) => {
    try {
        const [platos] = await db.query('SELECT * FROM item_menu');
        res.json(platos);
    } catch (error) { res.status(500).json({ error: error.message }); }
};

const crear = async (req, res) => {
    try {
        const { nombre, descripcion, categoria, precio, stock } = req.body;
        // Imagen por defecto si no mandan una
        const imagen = 'plato-default.png'; 
        
        await db.query(
            'INSERT INTO item_menu (nombre, descripcion, categoria, precio, stock, imagen) VALUES (?, ?, ?, ?, ?, ?)',
            [nombre, descripcion, categoria, precio, stock, imagen]
        );
        res.json({ message: 'Plato creado' });
    } catch (error) { res.status(500).json({ error: error.message }); }
};

const eliminar = async (req, res) => {
    try {
        const { id } = req.params;
        await db.query('DELETE FROM item_menu WHERE id = ?', [id]);
        res.json({ message: 'Plato eliminado' });
    } catch (error) { res.status(500).json({ error: error.message }); }
};

// Actualizar Stock y Precio
const actualizar = async (req, res) => {
    try {
        const { id } = req.params;
        const { precio, stock } = req.body;

        await db.query(
            'UPDATE item_menu SET precio = ?, stock = ? WHERE id = ?',
            [precio, stock, id]
        );

        res.json({ message: 'Plato actualizado correctamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ¡Agregala a la lista de exportaciones!
module.exports = { listar, crear, eliminar, actualizar };
