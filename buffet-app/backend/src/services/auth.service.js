const db = require('../config/db');

class AuthService {
    static async login(email, password) {
        // 1. Buscamos al usuario básico
        const sqlUsuario = "SELECT * FROM usuario WHERE TRIM(email) = ? AND TRIM(password) = ? AND fecha_baja IS NULL";
        const [users] = await db.query(sqlUsuario, [email, password]);

        if (users.length === 0) {
            throw new Error('Credenciales inválidas');
        }

        const usuario = users[0];
        let rol = 'EMPLEADO'; // Por defecto

        // 2. Verificamos si es Administrador
        const sqlAdmin = "SELECT * FROM administrador WHERE id_usuario = ?";
        const [admins] = await db.query(sqlAdmin, [usuario.id]);

        if (admins.length > 0) {
            rol = 'ADMINISTRADOR';
        }

        // 3. Retornamos el objeto limpio (sin password)
        return {
            id: usuario.id,
            nombre: usuario.nombre,
            apellido: usuario.apellido,
            email: usuario.email,
            rol: rol
        };
    }
}

module.exports = AuthService;