const express = require('express');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const cartsRouter = express.Router();

cartsRouter.get('/', (req, res) => {
    res.send('Obtener todos los carritos');
});

cartsRouter.post('/', (req, res) => {
    const newCart = {
        id: uuidv4(),
        products: []
    };

    fs.writeFile('carrito.json', JSON.stringify(newCart, null, 2), err => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
        res.status(201).json({ message: 'Carrito creado con éxito', cart: newCart });
    });
});

cartsRouter.post('/:cid/products/:pid', (req, res) => {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    fs.readFile('carrito.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
        let cart = JSON.parse(data);
        if (cart.id === cartId) {
            const productIndex = cart.products.findIndex(p => p.id === productId);
            if (productIndex !== -1) {
                cart.products[productIndex].quantity++;
            } else {
                cart.products.push({ id: productId, quantity: 1 });
            }
            fs.writeFile('carrito.json', JSON.stringify(cart, null, 2), err => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({ error: 'Error interno del servidor' });
                }
                res.json({ message: 'Producto agregado al carrito con éxito', cart });
            });
        } else {
            res.status(404).json({ error: 'Carrito no encontrado' });
        }
    });
});

cartsRouter.get('/:cid', (req, res) => {
    const cartId = req.params.cid;
    fs.readFile('carrito.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
        const cart = JSON.parse(data);
        if (cart.id === cartId) {
            res.json(cart);
        } else {
            res.status(404).json({ error: 'Carrito no encontrado' });
        }
    });
});

module.exports = cartsRouter;