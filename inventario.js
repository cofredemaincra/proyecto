document.addEventListener('DOMContentLoaded', async () => {
    const productosInventario = document.getElementById('productos-inventario');
    const productosStockBajo = document.getElementById('productos-stock-bajo');

    async function fetchProductos() {
        try {
            const response = await fetch('http://localhost:3000/productos');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('Error al obtener productos:', error);
            return [];
        }
    }

    async function fetchProductosStockBajo() {
        try {
            const response = await fetch('http://localhost:3000/productos-stock-bajo');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('Error al obtener productos con stock bajo:', error);
            return [];
        }
    }

    function mostrarProductos(productos, contenedor) {
        contenedor.innerHTML = '';
        productos.forEach(producto => {
            const productoDiv = document.createElement('div');
            productoDiv.classList.add('producto-inventario');
            productoDiv.innerHTML = `
                <h3>${producto.Nombre_Producto}</h3>
                <p>Stock actual: ${producto.Cantidad}</p>
                <p>Stock mínimo: ${producto.Stock_Minimo}</p>
                <button class="actualizar-stock" data-id="${producto.ID_Producto}" data-cantidad="${producto.Cantidad}">Actualizar Stock</button>
            `;
            contenedor.appendChild(productoDiv);
        });
    }

    async function actualizarInventario() {
        const productos = await fetchProductos();
        mostrarProductos(productos, productosInventario);

        const productosStockBajo = await fetchProductosStockBajo();
        mostrarProductos(productosStockBajo, productosStockBajo);
    }

    document.addEventListener('click', async function(e) {
        if(e.target && e.target.classList.contains('actualizar-stock')) {
            const id = e.target.dataset.id;
            const cantidadActual = parseInt(e.target.dataset.cantidad);
            const nuevaCantidad = prompt(`Ingrese la nueva cantidad para el producto (actual: ${cantidadActual}):`, cantidadActual);

            if (nuevaCantidad !== null && !isNaN(nuevaCantidad)) {
                await actualizarStockEnServidor(id, parseInt(nuevaCantidad));
                await actualizarInventario();
            }
        }
    });

    async function actualizarStockEnServidor(id, nuevaCantidad) {
        try {
            const response = await fetch('http://localhost:3000/actualizar-stock', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id: id, cantidad: nuevaCantidad }),
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const result = await response.json();
            console.log(result.message);
        } catch (error) {
            console.error('Error al actualizar stock:', error);
        }
    }

    await actualizarInventario();
});