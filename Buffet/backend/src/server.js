const express = require('express');
const cors = require('cors');
require('./config/db'); 
const pedidoRoutes = require('./routes/pedido.routes');
const authRoutes = require('./routes/auth.routes'); 
const menuRoutes = require('./routes/menu.routes');
const usuarioRoutes = require('./routes/usuario.routes');
const platosRoutes = require('./routes/platos.routes');
const planificadorRoutes = require('./routes/planificador.routes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
    console.log(`🔔 LLEGÓ AL SERVER: ${req.method} ${req.originalUrl}`);
    console.log("   Cuerpo de datos:", req.body);
    next();
});

app.get('/api/', (req, res) => {
    res.json({ mensaje: "¡Hola desde el Backend! Conexión exitosa." });
});

// Rutas
app.use('/api/menu', menuRoutes);
app.use('/api/pedidos', pedidoRoutes);
app.use('/api/auth', authRoutes); 
app.get('/api/', (req, res) => {
    res.json({ mensaje: "API Online" });
});
app.listen(PORT, () => {
    console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
});
app.get('/api/', (req, res) => {
    res.json({ mensaje: "¡Bienvenido! El Backend está conectado y feliz. 🚀" });
});
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/platos', platosRoutes);
app.use('/api/planificador', require('./routes/planificador.routes'));