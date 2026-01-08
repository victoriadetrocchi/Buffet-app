const AuthService = require('../services/auth.service');

const login = async (req, res) => {
    console.log("👉 1. Petición de Login recibida. Datos:", req.body); // <--- LOG 1
    
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            console.log("❌ Faltan datos");
            return res.status(400).json({ error: "Email y contraseña son obligatorios" });
        }

        console.log("👉 2. Llamando al servicio de autenticación...");
        const usuario = await AuthService.login(email, password);
        
        console.log("✅ 3. Login exitoso! Respondiendo al frontend...");
        res.json(usuario);

    } catch (error) {
        console.error("❌ ERROR EN EL LOGIN:", error.message);
        res.status(401).json({ error: "Email o contraseña incorrectos" });
    }
};

module.exports = { login };