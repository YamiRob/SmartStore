// Obtener inventario y mostrar en pantalla
fetch('/inventario')
  .then(response => response.json())
  .then(data => {
    const listaInventario = document.getElementById('lista-inventario');
    listaInventario.innerHTML = '';
    data.forEach(item => {
      const li = document.createElement('li');
      li.textContent = `${item.nombre} - Stock: ${item.cantidad} - Precio: $${item.precio}`;
      listaInventario.appendChild(li);
    });
  });

// Función para realizar venta
function realizarVenta() {
  const idProducto = document.getElementById('producto').value;
  const cantidad = document.getElementById('cantidad').value;

  fetch('/venta', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ idProducto: parseInt(idProducto), cantidad: parseInt(cantidad) }),
  })
  .then(response => response.json())
  .then(data => {
    document.getElementById('mensaje-venta').textContent = data.mensaje;
    // Actualizar inventario después de la venta
    fetch('/inventario')
      .then(response => response.json())
      .then(data => {
        const listaInventario = document.getElementById('lista-inventario');
        listaInventario.innerHTML = '';
        data.forEach(item => {
          const li = document.createElement('li');
          li.textContent = `${item.nombre} - Stock: ${item.cantidad} - Precio: $${item.precio}`;
          listaInventario.appendChild(li);
        });
      });
  })
  .catch(error => console.log('Error:', error));
}

// Función para procesar pago
function procesarPago() {
  const cantidad = document.getElementById('cantidadPago').value;
  const descripcion = document.getElementById('descripcionPago').value;

  fetch('/pago', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ cantidad: parseInt(cantidad), moneda: 'usd', descripcion, fuente: 'tok_visa' }),
  })
  .then(response => response.json())
  .then(data => {
    document.getElementById('mensaje-pago').textContent = data.mensaje;
  })
  .catch(error => console.log('Error:', error));
}
