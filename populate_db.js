const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./tienda.db', (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Conectado a la base de datos SQLite.');
});

// Insertar categorías
const categorias = ['Gorros', 'Zapatillas', 'Poleras'];
categorias.forEach((categoria, index) => {
  db.run(`INSERT INTO Categoria (ID_Categoria, Nombre_Categoria) VALUES (?, ?)`, [index + 1, categoria], (err) => {
    if (err) {
      console.error(err.message);
    }
  });
});

// Insertar productos de ejemplo
const productos = [
  { nombre: "Nike Sportswear", precio: 29990, descripcion: "Beanie Unisex. Calidez, comodidad y estilo.", imagen: "image/Nike Sportswear, Beanie Unisex.png", categoria: 1 },
  { nombre: "Air Jordan 1 High Method of Make", precio: 156990, descripcion: "Zapatillas para Mujer. Tu estilo es icónico y tu gusto es de primer nivel.", imagen: "image/Air Jordan 1 High Method of Make.png", categoria: 2 },
  { nombre: "Jordan Jumpman", precio: 29990, descripcion: "Polera Jordan Jumpman.", imagen: "image/Jordan Jumpman.png", categoria: 3 }
];

productos.forEach((producto) => {
  db.run(`INSERT INTO Productos (Nombre_Producto, Descripcion, Precio, Cantidad, ID_Categoria, Imagen)
          VALUES (?, ?, ?, ?, ?, ?)`,
          [producto.nombre, producto.descripcion, producto.precio, 100, producto.categoria, producto.imagen],
          (err) => {
    if (err) {
      console.error(err.message);
    }
  });
});

db.close((err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Base de datos poblada y cerrada.');
});