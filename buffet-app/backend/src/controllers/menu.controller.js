const db = require('../config/db');

const listar = async (req, res) => {
    try {
        // Trae todo lo que tenga stock mayor a 0
        const [platos] = await db.query('SELECT * FROM item_menu WHERE stock > 0');
        res.json(platos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { listar };