const express = require('express');
const cors = require('cors');
const pedidoRoutes = require('./routes/pedido.routes');
const authRoutes = require('./routes/auth.routes'); 

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

// 👇👇👇 AGREGÁ ESTO AQUÍ MISMO 👇👇👇
app.use((req, res, next) => {
    console.log(`🔔 LLEGÓ AL SERVER: ${req.method} ${req.originalUrl}`);
    console.log("   Cuerpo de datos:", req.body);
    next();
});
// 👆👆👆 FIN DEL AGREGADO 👆👆👆

// Rutas
app.use('/api/pedidos', pedidoRoutes);
app.use('/api/auth', authRoutes); 

app.listen(PORT, () => {
    console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
    require('./config/db'); 
});