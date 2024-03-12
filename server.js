const express = require('express');
const productosRouter = require('./products');
const cartsRouter = require('./carts');

const app = express();
const PORT = 8080;

app.use(express.json());

// Rutas principales
app.get('/', (req, res) => {
    res.send('¡Bienvenido a la página principal!');
});

// Usar enrutadores de productos y carritos
app.use('/api/products', productosRouter);
app.use('/api/carts', cartsRouter);

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});