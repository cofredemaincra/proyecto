const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// Conectar a la base de datos SQLite
const db = new sqlite3.Database('./tienda.db', (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Conectado a la base de datos SQLite.');
});

// Crear las tablas si no existen
db.run(`CREATE TABLE IF NOT EXISTS Categoria (
  ID_Categoria INTEGER PRIMARY KEY AUTOINCREMENT,
  Nombre_Categoria TEXT NOT NULL
)`);

db.run(`CREATE TABLE IF NOT EXISTS Productos (
  ID_Producto INTEGER PRIMARY KEY AUTOINCREMENT,
  Nombre_Producto TEXT NOT NULL,
  Descripcion TEXT,
  Precio REAL NOT NULL,
  Cantidad INTEGER NOT NULL,
  Stock_Minimo INTEGER NOT NULL,
  ID_Categoria INTEGER,
  Imagen TEXT,
  FOREIGN KEY (ID_Categoria) REFERENCES Categoria(ID_Categoria)
)`);

// Función para insertar productos
function insertarProductos(productos, categoria) {
  const stmt = db.prepare(`INSERT INTO Productos (Nombre_Producto, Descripcion, Precio, Cantidad, Stock_Minimo, ID_Categoria, Imagen) 
                           VALUES (?, ?, ?, ?, ?, ?, ?)`);

  productos.forEach(producto => {
    stmt.run(
      producto.nombre,
      producto.descripcion,
      producto.precio,
      6, // Cantidad inicial
      3, // Stock mínimo
      categoria,
      producto.imagen
    );
  });

  stmt.finalize();
}

// Insertar categorías
const categorias = ['Gorras', 'Zapatillas', 'Poleras'];
categorias.forEach((categoria, index) => {
  db.run(`INSERT OR IGNORE INTO Categoria (ID_Categoria, Nombre_Categoria) VALUES (?, ?)`, [index + 1, categoria]);
});

// Productos
const gorras = [
  { nombre: "Nike Sportswear", precio: 29990, descripcion: "Beanie Unisex. Calidez, comodidad y estilo.", imagen: "image/Nike Sportswear, Beanie Unisex.png" },
  { nombre: "Jordan Essentials", precio: 26990, descripcion: "Beanie Unisex. El tejido Knit se siente suave y cálido.", imagen: "image/Jordan Essentials, Beanie Unisex (2).png" },
  { nombre: "Nike Sport Essentials", precio: 26990, descripcion: "Gorro Unisex Dri-Fit ADV. Tela avanzada que absorbe el sudor para ayudarte a mantener la frescura.", imagen: "image/Nike Sport Essentials, Gorro Unisex Dri-Fit ADV.png" },
  { nombre: "Nike Dri-FIT Club", precio: 26990, descripcion: "Gorro Tn Air Max desestructurado.", imagen: "image/Nike Dri-FIT Club, Gorro Tn Air Max desestructurado.png" },
  { nombre: "Jordan Flight MVP Pro", precio: 29990, descripcion: "Gorra estructurada. Comodidad y una visera plana para verse bien.", imagen: "image/Jordan Flight MVP Pro.png" },
  { nombre: "Jordan Rise", precio: 26990, descripcion: "Gorra estructurada. Profundidad alta para darte un ajuste espacioso y moderno.", imagen: "image/Jordan Rise.png" },
  { nombre: "Nike Apex", precio: 32990, descripcion: "Gorro reversible. Te permite cambiar tu estilo en cualquier momento.", imagen: "image/Nike Apex.png" },
  { nombre: "Jordan Fly", precio: 26990, descripcion: "Gorra estructurada.", imagen: "image/Jordan Fly.png" },
  { nombre: "Nike Club", precio: 23990, descripcion: "Gorro Swoosh desestructurada. Lleva el estilo informal a cualquier atuendo con nuestra gorra Nike Club.", imagen: "image/Nike Club Gorro Swoosh desestructurada.png" },
  { nombre: "Nike Sportswear Club", precio: 24990, descripcion: "Gorro Unisex Dri-Fit. Mejora tu estilo Swoosh con este mid-Cap de club desestructurado y profundo.", imagen: "image/Nike Sportswear Club, Gorro Unisex Dri-Fit.png" },
  { nombre: "Nike Sport Essentials", precio: 26990, descripcion: "Gorro Unisex Dri-Fit ADV. Ponte en marcha con la gorra Nike Fly hagas lo que hagas.", imagen: "image/Nike Sport Essentials, Gorro Unisex Dri-Fit ADV 1.png" },
  { nombre: "Nike Dri-FIT Rise", precio: 24990, descripcion: "Gorro estructurado con cierre a presión. Diseñada para el gimnasio, el trabajo y cualquier otro lugar.", imagen: "image/Nike Dri-FIT Rise, Gorro estructurado con cierre a presión.png" }
];

const zapatillas = [
  { nombre: "Air Jordan 1 High Method of Make", precio: 156990, descripcion: "Zapatillas para Mujer. Tu estilo es icónico y tu gusto es de primer nivel.", imagen: "image/Air Jordan 1 High Method of Make.png" },
  { nombre: "Air Jordan 1 Retro High OG", precio: 151990, descripcion: "Zapatillas para Hombre. Renueva el calzado clásico, y te ofrece un nuevo look con una sensación familiar.", imagen: "image/Air Jordan 1 Retro High OG.png" },
  { nombre: "Air Jordan 1 Mid", precio: 112990, descripcion: "Zapatillas para Niños. Ofrecen un soporte máximo y celebran al calzado que lo inició todo.", imagen: "image/Air Jordan 1 Mid .png" },
  { nombre: "Jordan Stadium 90", precio: 146990, descripcion: "Zapatillas para Hombre. La comodidad es lo más importante, pero eso no significa que debas sacrificar el estilo.", imagen: "image/Jordan Stadium 90.png" },
  { nombre: "Nike City Classic Boot PMR", precio: 156990, descripcion: "Botas para Mujer. Las condiciones del tiempo ya no son una excusa: estas botas pueden hacerlo todo, igual que tú.", imagen: "image/Nike City Classic Boot PRM.png" },
  { nombre: "Nike AL8", precio: 96990, descripcion: "Zapatillas para Mujer. La mezcla perfecta de nostalgia (echa un vistazo al Swoosh bordado) y la comodidad moderna que amas.", imagen: "image/Nike AL8.png" },
  { nombre: "Nike Air Max Plus Drift Tn", precio: 192990, descripcion: "Zapatillas para Mujer. Una experiencia Nike Air mejorada que ofrece una estabilidad premium y una amortiguación increíble.", imagen: "image/Nike Air Max Plus Drift Tn.png" },
  { nombre: "Nike Journey Run", precio: 96990, descripcion: "Zapatillas para correr.", imagen: "image/Nike Journey Run.png" },
  { nombre: "W AIR MAX 90 SE", precio: 146990, descripcion: "Zapatillas para mujer. No hay nada más ligero, más cómodo ni más probado.", imagen: "image/W AIR MAX 90 SE.png" },
  { nombre: "Nike ReactX Pegasus Trail 5", precio: 149990, descripcion: "Zapatillas de Trail Running para hombre. Es suave en la carretera, estable en el sendero y mejor para el medio ambiente.", imagen: "image/Nike ReactX Pegasus Trail 5.png" },
  { nombre: "Nike Pegasus Trail 4", precio: 149990, descripcion: "Zapatillas de trail Running para Hombre. ENERGÍA DE LA CARRETERA AL SENDERO.", imagen: "image/Nike Pegasus Trail 4.png" },
  { nombre: "Nike Infinity RN 4", precio: 179990, descripcion: "Zapatillas de Running para hombre. Tiene una amortiguación con soporte hecha para una carrera cómoda, te ayuda a vivir el running.", imagen: "image/Nike Infinity RN 4.png" }
];

const poleras = [
  { nombre: "Jordan Jumpman", precio: 29990, descripcion: "Polera Jordan Jumpman.", imagen: "image/Jordan Jumpman.png" },
  { nombre: "Jordan", precio: 36990, descripcion: "Polera Jordan clásica.", imagen: "image/Jordan.png" },
  { nombre: "Jordan Air", precio: 32990, descripcion: "Polera Jordan Air.", imagen: "image/Jordan Air.png" },
  { nombre: "Jordan Sport", precio: 32990, descripcion: "Polera Jordan Sport.", imagen: "image/Jordan Sport.png" },
  { nombre: "Nike Hyverse", precio: 39990, descripcion: "Polera Nike Hyverse.", imagen: "image/Nike Hyverse.png" },
  { nombre: "2024 All-Star Weekend", precio: 112990, descripcion: "Polera conmemorativa 2024 All-Star Weekend.", imagen: "image/2024 All-Star Weekend.png" },
  { nombre: "M NSW TEE OS NCPS", precio: 49990, descripcion: "Polera M NSW TEE OS NCPS.", imagen: "image/M NSW TEE OS NCPS.png" },
  { nombre: "Nike Short Sleeve Hydroguard", precio: 29990, descripcion: "Polera Nike Short Sleeve Hydroguard.", imagen: "image/Nike Short Sleeve Hydroguard.png" },
  { nombre: "Nike Rise 365 Run Division", precio: 56990, descripcion: "Polera de running de manga corta Dri-FIT.", imagen: "image/Nike Rise 365 Run Division.png" },
  { nombre: "Nike Sportswear Club Fleece", precio: 46990, descripcion: "Polerón de cuello redondo. Comodidad suave del tejido Fleece para brindar un look mejorado para el día a día.", imagen: "image/Nike Sportswear Club Fleece.png" },
  { nombre: "Nike Rise 365 Run Energy", precio: 26990, descripcion: "Polera de Running. Esta playera ligera, transpirable y absorbente del sudor mantiene vivo el espíritu rebelde.", imagen: "image/Nike Rise 365 Run Energy.png" },
  { nombre: "Nike Rise 365 Running Division", precio: 49990, descripcion: "Polera Dri-Fit para hombre. Con un corte de ajuste holgado, esta playera mantiene la frescura con la tela elástica y absorbente de sudor.", imagen: "image/Nike Rise 365 Running Division1.png" }
];

// Insertar productos
db.serialize(() => {
  db.run("BEGIN TRANSACTION");

  insertarProductos(gorras, 1);
  insertarProductos(zapatillas, 2);
  insertarProductos(poleras, 3);

  db.run("COMMIT", (err) => {
    if (err) {
      console.error("Error al insertar productos:", err.message);
    } else {
      console.log("Productos insertados correctamente");
    }
  });
});

// Ruta para obtener todos los productos
app.get('/productos', (req, res) => {
  db.all("SELECT * FROM Productos", [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Ruta para actualizar la cantidad de un producto
app.post('/actualizar-stock', (req, res) => {
  const { id, cantidad } = req.body;
  db.run(`UPDATE Productos SET Cantidad = ? WHERE ID_Producto = ?`, [cantidad, id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: "Stock actualizado correctamente" });
  });
});

// Ruta para obtener productos con stock bajo
app.get('/productos-stock-bajo', (req, res) => {
  db.all("SELECT * FROM Productos WHERE Cantidad <= Stock_Minimo", [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});