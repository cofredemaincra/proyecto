document.addEventListener('DOMContentLoaded', async () => {
    const carrito = {};
    const contadorCarrito = document.getElementById('contador-carrito');
    const productosCarrito = document.getElementById('productos-carrito');
    const carritoCheckoutSection = document.getElementById('carrito-checkout');
    const checkoutForm = document.getElementById('checkout-form');
    const linkCarrito = document.getElementById('link-carrito');
    const seguirComprandoBtn = document.getElementById('seguir-comprando');
    const totalCompra = document.getElementById('total-compra');
    const buscador = document.getElementById('buscador');
    const filtroCategoria = document.getElementById('filtro-categoria');
    const filtroPrecio = document.getElementById('filtro-precio');
    const productosFiltrados = document.getElementById('productos-filtrados');

    async function fetchProductos() {
        try {
            const response = await fetch('http://localhost:3000/productos');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            console.log('Productos recibidos:', data);
            return data;
        } catch (error) {
            console.error('Error al obtener productos:', error);
            return [];
        }
    }

    async function filtrarProductos() {
        const busqueda = buscador.value.toLowerCase();
        const categoria = filtroCategoria.value;
        const precioRango = filtroPrecio.value;

        let productosFiltrados = await fetchProductos();

        productosFiltrados = productosFiltrados.filter(producto => 
            producto.Nombre_Producto.toLowerCase().includes(busqueda) || 
            producto.Descripcion.toLowerCase().includes(busqueda)
        );

        if (categoria !== 'todos') {
            productosFiltrados = productosFiltrados.filter(producto => producto.ID_Categoria == categoria);
        }

        if (precioRango !== 'todos') {
            const [min, max] = precioRango.split('-').map(Number);
            productosFiltrados = productosFiltrados.filter(producto => 
                producto.Precio >= min && (max ? producto.Precio <= max : true)
            );
        }

        mostrarProductos(productosFiltrados);
    }

    function mostrarProductos(productosAMostrar) {
        productosFiltrados.innerHTML = '';
        productosAMostrar.forEach(producto => {
            const productoDiv = document.createElement('div');
            productoDiv.classList.add('producto');
            productoDiv.innerHTML = `
                <img src="${producto.Imagen}" alt="${producto.Nombre_Producto}" class="imagen-producto">
                <h3>${producto.Nombre_Producto}</h3>
                <p class="descripcion">${producto.Descripcion}</p>
                <p class="precio">$${producto.Precio.toLocaleString('es-CL')}</p>
                <p class="stock">Stock: ${producto.Cantidad}</p>
                <div class="stars" data-producto="${producto.Nombre_Producto}">
                    <span class="star" data-value="1">&#9733;</span>
                    <span class="star" data-value="2">&#9733;</span>
                    <span class="star" data-value="3">&#9733;</span>
                    <span class="star" data-value="4">&#9733;</span>
                    <span class="star" data-value="5">&#9733;</span>
                </div>
                <button class="cta agregar-carrito" data-id="${producto.ID_Producto}" data-nombre="${producto.Nombre_Producto}" data-precio="${producto.Precio}" data-descripcion="${producto.Descripcion}" data-imagen="${producto.Imagen}" ${producto.Cantidad === 0 ? 'disabled' : ''}>
                    ${producto.Cantidad === 0 ? 'Sin Stock' : 'Agregar al Carrito'}
                </button>
                <button class="cta ver-detalles" data-nombre="${producto.Nombre_Producto}" data-descripcion="${producto.Descripcion}" data-precio="${producto.Precio}" data-imagen="${producto.Imagen}">Ver Detalles</button>
            `;
            productosFiltrados.appendChild(productoDiv);
        });
    }

    document.addEventListener('click', async function(e) {
        if(e.target && e.target.classList.contains('agregar-carrito')) {
            const id = e.target.dataset.id;
            const nombre = e.target.dataset.nombre;
            const precio = parseFloat(e.target.dataset.precio);

            if (carrito[nombre]) {
                carrito[nombre].cantidad += 1;
            } else {
                carrito[nombre] = {
                    id: id,
                    precio: precio,
                    cantidad: 1,
                };
            }
            actualizarCarrito();
            await actualizarStockEnServidor(id, -1);
            await filtrarProductos(); // Recargar productos para actualizar el stock mostrado
        }
    });

    async function actualizarStockEnServidor(id, cambio) {
        try {
            const response = await fetch('http://localhost:3000/actualizar-stock', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id: id, cantidad: cambio }),
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

    buscador.addEventListener('input', filtrarProductos);
    filtroCategoria.addEventListener('change', filtrarProductos);
    filtroPrecio.addEventListener('change', filtrarProductos);

    await filtrarProductos();

    document.addEventListener('click', function(e) {
        if(e.target && e.target.classList.contains('agregar-carrito')) {
            const nombre = e.target.dataset.nombre;
            const precio = parseFloat(e.target.dataset.precio);

            if (carrito[nombre]) {
                carrito[nombre].cantidad += 1;
            } else {
                carrito[nombre] = {
                    precio: precio,
                    cantidad: 1,
                };
            }
            actualizarCarrito();
        }
    });

    document.addEventListener('click', function(e) {
        if(e.target && e.target.classList.contains('ver-detalles')) {
            const nombre = e.target.dataset.nombre;
            const descripcion = e.target.dataset.descripcion;
            const precio = e.target.dataset.precio;
            const imagen = e.target.dataset.imagen;

            document.getElementById('modal-nombre').innerText = nombre;
            document.getElementById('modal-descripcion').innerText = descripcion;
            document.getElementById('modal-precio').innerText = parseFloat(precio).toLocaleString('es-CL');
            document.getElementById('modal-imagen').src = imagen;

            const modal = document.getElementById('modal');
            modal.style.display = "block";

            document.getElementById('agregar-carrito-modal').onclick = () => {
                if (carrito[nombre]) {
                    carrito[nombre].cantidad += 1;
                } else {
                    carrito[nombre] = {
                        precio: parseFloat(precio),
                        cantidad: 1,
                    };
                }
                actualizarCarrito();
                modal.style.display = "none";
            };
        }
    });

    function actualizarCarrito() {
        contadorCarrito.innerText = Object.values(carrito).reduce((total, item) => total + item.cantidad, 0);

        productosCarrito.innerHTML = '';
        let total = 0;
        for (const [nombre, info] of Object.entries(carrito)) {
            const subtotal = info.precio * info.cantidad;
            total += subtotal;
            const productoDiv = document.createElement('div');
            productoDiv.innerHTML = `
                <p>${nombre} - $${info.precio.toLocaleString('es-CL')} x ${info.cantidad} = $${subtotal.toLocaleString('es-CL')}
                <button class="eliminar" data-nombre="${nombre}">Eliminar</button></p>
            `;
            productosCarrito.appendChild(productoDiv);
        }

        totalCompra.innerText = total.toLocaleString('es-CL');

        const botonesEliminar = document.querySelectorAll('.eliminar');
        botonesEliminar.forEach(boton => {
            boton.addEventListener('click', () => {
                const nombre = boton.dataset.nombre;
                delete carrito[nombre];
                actualizarCarrito();
            });
        });
    }

    const span = document.getElementsByClassName("close")[0];
    span.onclick = function() {
        const modal = document.getElementById('modal');
        modal.style.display = "none";
    };

    window.onclick = function(event) {
        const modal = document.getElementById('modal');
        if (event.target == modal) {
            modal.style.display = "none";
        }
    };

    linkCarrito.addEventListener('click', (e) => {
        e.preventDefault();
        carritoCheckoutSection.style.display = "block";
        document.getElementById('productos').style.display = "none";
    });

    seguirComprandoBtn.addEventListener('click', () => {
        carritoCheckoutSection.style.display = "none";
        document.getElementById('productos').style.display = "block";
    });

    checkoutForm.addEventListener('submit', (e) => {
        e.preventDefault();
        alert("¡Compra confirmada! Gracias por tu pedido.");
        for (const nombre in carrito) {
            delete carrito[nombre];
        }
        actualizarCarrito();
        carritoCheckoutSection.style.display = "none";
        document.getElementById('productos').style.display = "block";
        checkoutForm.reset();
    });

    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('star')) {
            const productName = e.target.parentElement.dataset.producto;
            const rating = e.target.dataset.value;
            localStorage.setItem(productName + '-rating', rating);
            updateStars(e.target.parentElement, rating);
            alert(`Has calificado ${productName} con ${rating} estrellas.`);
        }
    });

    function updateStars(starsContainer, rating) {
        const stars = starsContainer.querySelectorAll('.star');
        stars.forEach((star, index) => {
            if (index < rating) {
                star.classList.add('active');
            } else {
                star.classList.remove('active');
            }
        });
    }

    document.querySelectorAll('.stars').forEach(starsContainer => {
        const productName = starsContainer.dataset.producto;
        const savedRating = localStorage.getItem(productName + '-rating');
        if (savedRating) {
            updateStars(starsContainer, savedRating);
        }
    });
});