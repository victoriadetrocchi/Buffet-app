const db = require('../config/db');

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log("🔥 LOGIN NUEVO EJECUTÁNDOSE");
        console.log("   Email:", email);

        // 1. Buscamos usuario (QUERY LIMPIA, SIN FECHA_BAJA)
        const [usuarios] = await db.query('SELECT * FROM usuario WHERE email = ?', [email]);
        
        if (usuarios.length === 0) {
            console.log("❌ Usuario no existe");
            return res.status(401).json({ message: 'Usuario no encontrado' });
        }

        const usuario = usuarios[0];

        // 2. Password
        if (usuario.password !== password) {
            console.log("❌ Password incorrecta");
            return res.status(401).json({ message: 'Contraseña incorrecta' });
        }

        console.log("✅ Login Exitoso. Rol:", usuario.rol);

        // 3. Respuesta
        res.json({
            id: usuario.id,
            nombre: usuario.nombre,
            apellido: usuario.apellido,
            email: usuario.email,
            rol: usuario.rol,
            asistencia: {
                lunes: usuario.asiste_lunes,
                martes: usuario.asiste_martes,
                miercoles: usuario.asiste_miercoles,
                jueves: usuario.asiste_jueves,
                viernes: usuario.asiste_viernes
            }
        });

    } catch (error) {
        console.error("💥 ERROR EN LOGIN:", error);
        res.status(500).json({ error: error.message });
    }
};

module.exports = { login };