const express = require('express');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const productsRouter = express.Router();

productsRouter.get('/', (req, res) => {
    fs.readFile('productos.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
        const productos = JSON.parse(data);
        const limit = parseInt(req.query.limit);
        if (limit) {
            res.json(productos.slice(0, limit));
        } else {
            res.json(productos);
        }
    });
});

productsRouter.get('/:pid', (req, res) => {
    const productId = parseInt(req.params.pid);
    fs.readFile('productos.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
        const productos = JSON.parse(data);
        const producto = productos.find(p => p.id === productId);
        if (producto) {
            res.json(producto);
        } else {
            res.status(404).json({ error: 'Producto no encontrado' });
        }
    });
});


productsRouter.post('/', (req, res) => {
    const newProduct = req.body;
    newProduct.id = uuidv4();
    fs.readFile('productos.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
        const productos = JSON.parse(data);
        productos.push(newProduct);
        fs.writeFile('productos.json', JSON.stringify(productos, null, 2), err => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Error interno del servidor' });
            }
            res.status(201).json({ message: 'Producto agregado con éxito', producto: newProduct });
        });
    });
});

productsRouter.put('/:pid', (req, res) => {
    const productId = req.params.pid;
    const updatedProduct = req.body;
    fs.readFile('productos.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
        let productos = JSON.parse(data);
        const index = productos.findIndex(p => p.id === productId);
        if (index !== -1) {
            productos[index] = { ...productos[index], ...updatedProduct };
            fs.writeFile('productos.json', JSON.stringify(productos, null, 2), err => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({ error: 'Error interno del servidor' });
                }
                res.json({ message: 'Producto actualizado con éxito', producto: productos[index] });
            });
        } else {
            res.status(404).json({ error: 'Producto no encontrado' });
        }
    });
});

productsRouter.delete('/:pid', (req, res) => {
    const productId = req.params.pid;
    fs.readFile('productos.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
        let productos = JSON.parse(data);
        const index = productos.findIndex(p => p.id === productId);
        if (index !== -1) {
            productos.splice(index, 1);
            fs.writeFile('productos.json', JSON.stringify(productos, null, 2), err => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({ error: 'Error interno del servidor' });
                }
                res.json({ message: 'Producto eliminado con éxito' });
            });
        } else {
            res.status(404).json({ error: 'Producto no encontrado' });
        }
    });
});

module.exports = productsRouter;