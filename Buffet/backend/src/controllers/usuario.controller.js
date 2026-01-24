const db = require('../config/db');

// 1. LOGIN (Versión Simplificada)
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log("👉 Intentando login:", email, password);

        // Buscamos el usuario
        const [usuarios] = await db.query('SELECT * FROM usuario WHERE email = ?', [email]);
        
        if (usuarios.length === 0) {
            return res.status(401).json({ message: 'Usuario no encontrado' });
        }

        const usuario = usuarios[0];

        // Verificamos contraseña
        if (usuario.password !== password) {
            return res.status(401).json({ message: 'Contraseña incorrecta' });
        }

        // ✅ YA NO BUSCAMOS EN TABLA ADMINISTRADOR
        // El rol viene directo de la tabla usuario
        console.log("✅ Login OK. Rol:", usuario.rol);

        res.json({
            id: usuario.id,
            nombre: usuario.nombre,
            apellido: usuario.apellido,
            email: usuario.email,
            rol: usuario.rol, // 'ADMINISTRADOR' o 'EMPLEADO'
            asistencia: {
                lunes: usuario.asiste_lunes,
                martes: usuario.asiste_martes,
                miercoles: usuario.asiste_miercoles,
                jueves: usuario.asiste_jueves,
                viernes: usuario.asiste_viernes
            }
        });

    } catch (error) {
        console.error("❌ Error en Login:", error);
        res.status(500).json({ error: error.message });
    }
};

// 2. OBTENER DATOS (Versión Simplificada)
const obtenerDatos = async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await db.query('SELECT * FROM usuario WHERE id = ?', [id]);
        
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        
        const usuario = rows[0];

        // Preparamos el objeto limpio (Sin password)
        const usuarioLimpio = {
            id: usuario.id,
            nombre: usuario.nombre,
            apellido: usuario.apellido,
            email: usuario.email,
            rol: usuario.rol, // Usamos el rol directo de la tabla
            asiste_lunes: usuario.asiste_lunes,
            asiste_martes: usuario.asiste_martes,
            asiste_miercoles: usuario.asiste_miercoles,
            asiste_jueves: usuario.asiste_jueves,
            asiste_viernes: usuario.asiste_viernes
        };

        res.json(usuarioLimpio);
    } catch (error) {
        console.error("❌ Error obteniendo datos:", error);
        res.status(500).json({ error: error.message });
    }
};

// 3. ACTUALIZAR ASISTENCIA (Igual que antes)
const actualizarAsistencia = async (req, res) => {
    try {
        const { id } = req.params;
        const { lunes, martes, miercoles, jueves, viernes } = req.body;

        await db.query(
            `UPDATE usuario SET 
             asiste_lunes = ?, asiste_martes = ?, asiste_miercoles = ?, 
             asiste_jueves = ?, asiste_viernes = ? 
             WHERE id = ?`,
            [lunes, martes, miercoles, jueves, viernes, id]
        );

        res.json({ 
            message: 'Asistencia actualizada correctamente', 
            asistencia: { lunes, martes, miercoles, jueves, viernes } 
        });
    } catch (error) {
        console.error("❌ Error guardando asistencia:", error);
        res.status(500).json({ error: error.message });
    }
};

module.exports = { login, obtenerDatos, actualizarAsistencia };