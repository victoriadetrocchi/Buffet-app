const db = require('../config/db');

class AuthService {
    static async login(email, password) {
        // 1. Buscamos al usuario por email
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
        return {
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
        };
    }
}

module.exports = AuthService;