const db = require('../config/db');

class AuthService {
    static async login(email, password) {
        // 1. Buscamos al usuario por email
        // (Sacamos 'fecha_baja' porque esa columna NO existe en tu base nueva)
        const sqlUsuario = "SELECT * FROM usuario WHERE email = ?";
        const [users] = await db.query(sqlUsuario, [email]);

        if (users.length === 0) {
            throw new Error('Usuario no encontrado');
        }

        const usuario = users[0];

        // 2. Verificamos la contraseña
        if (usuario.password !== password) {
            throw new Error('Contraseña incorrecta');
        }

        // 3. Retornamos el objeto completo
        // IMPORTANTE: Usamos usuario.rol (que viene de la BD) en vez de inventarlo
        return {
            id: usuario.id,
            nombre: usuario.nombre,
            apellido: usuario.apellido,
            email: usuario.email,
            rol: usuario.rol, // <--- ESTO ES LO QUE VALE AHORA
            
            // Agregamos la asistencia para que el Home funcione bien
            asistencia: {
                lunes: usuario.asiste_lunes,
                martes: usuario.asiste_martes,
                miercoles: usuario.asiste_miercoles,
                jueves: usuario.asiste_jueves,
                viernes: usuario.asiste_viernes
            }
        };
    }
}

module.exports = AuthService;