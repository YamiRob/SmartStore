const express = require('express');
const path = require('path');
const stripe = require('stripe')('tu-clave-secreta-stripe');
const app = express();
app.use(express.json());
app.use(express.static('public')); // Servir archivos estáticos desde la carpeta 'public'

let inventario = [
  { id: 1, nombre: "Producto 1", cantidad: 100, precio: 10.00 },
  { id: 2, nombre: "Producto 2", cantidad: 50, precio: 20.00 }
];

// Obtener inventario
app.get('/inventario', (req, res) => {
  res.json(inventario);
});

// Realizar una venta
app.post('/venta', (req, res) => {
  const { idProducto, cantidad } = req.body;
  const producto = inventario.find(p => p.id === idProducto);
  
  if (!producto) {
    return res.status(404).send('Producto no encontrado');
  }
  
  if (producto.cantidad < cantidad) {
    return res.status(400).send('Stock insuficiente');
  }

  // Actualizar inventario
  producto.cantidad -= cantidad;

  res.json({ mensaje: 'Venta exitosa', producto });
});

// Procesar pago con Stripe
app.post('/pago', async (req, res) => {
  const { cantidad, moneda, descripcion, fuente } = req.body;
  
  try {
    let pago = await stripe.charges.create({
      amount: cantidad * 100, // convertir a centavos
      currency: moneda,
      description: descripcion,
      source: fuente
    });
    
    res.json({ mensaje: 'Pago procesado con éxito', pago });
  } catch (error) {
    res.status(500).send('Error en el procesamiento de pago');
  }
});

app.listen(3000, () => {
  console.log('Servidor corriendo en http://localhost:3000');
});
