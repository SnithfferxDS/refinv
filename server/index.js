import express from 'express';
import cors from 'cors';
import Database from 'better-sqlite3';

const app = express();
const db = new Database('inventory.db');

// Configure CORS to allow requests from the Astro frontend
app.use(cors({
  origin: 'http://localhost:4321',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type']
}));

app.use(express.json());

// Initialize database
db.exec(`
  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    title TEXT,
    short_description TEXT,
    tags TEXT,
    sku TEXT,
    mpn TEXT,
    upc TEXT NOT NULL,
    ean TEXT,
    isbn TEXT,
    measure_unit TEXT,
    weight DECIMAL(10,2),
    width DECIMAL(10,2),
    height DECIMAL(10,2),
    length DECIMAL(10,2),
    outer_diameter DECIMAL(10,2),
    inner_diameter DECIMAL(10,2),
    brand INTEGER,
    customizable BOOLEAN DEFAULT FALSE,
    customizable_fields TEXT,
    status INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME,
    deleted_at DATETIME
  );

  CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    status INTEGER,
    parent_id INTEGER,
    logo TEXT,
    main BOOLEAN DEFAULT FALSE,
    updated_at DATETIME,
    deleted_at DATETIME
  );

  CREATE TABLE IF NOT EXISTS suppliers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    address TEXT,
    phone TEXT,
    email TEXT,
    website TEXT,
    contact TEXT,
    country TEXT,
    state TEXT,
    city TEXT,
    street TEXT,
    optional TEXT,
    logo TEXT,
    updated_at DATETIME,
    deleted_at DATETIME
  );

  CREATE TABLE IF NOT EXISTS status (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    active BOOLEAN DEFAULT FALSE,
    updated_at DATETIME,
    deleted_at DATETIME
  );

  CREATE TABLE IF NOT EXISTS brands (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    active BOOLEAN DEFAULT FALSE,
    updated_at DATETIME,
    deleted_at DATETIME
  );

  CREATE TABLE IF NOT EXISTS purchases (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    number TEXT NOT NULL,
    purchase_date DATETIME,
    ingress_date DATETIME,
    procesed_date DATETIME,
    total DECIMAL(10,2),
    taxes DECIMAL(10,2),
    discount DECIMAL(10,2),
    purchase_details INTEGER,
    supplier_id INTEGER,
    buyer_id INTEGER,
    procesed BOOLEAN DEFAULT FALSE,
    updated_at DATETIME,
    deleted_at DATETIME
  );

  CREATE TABLE IF NOT EXISTS purchase_details (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    invoice_number TEXT NOT NULL,
    product_id INTEGER,
    price DECIMAL(10,2),
    taxes DECIMAL(10,2),
    discount DECIMAL(10,2),
    quantity INTEGER,
    procesed BOOLEAN DEFAULT FALSE,
    updated_at DATETIME,
    deleted_at DATETIME
  );

  CREATE TABLE IF NOT EXISTS sales (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    hash TEXT,
    sale_date DATETIME,
    process_date DATETIME,
    paid_date DATETIME,
    total DECIMAL(10,2),
    taxes DECIMAL(10,2),
    discount DECIMAL(10,2),
    sale_details INTEGER,
    seller_id INTEGER,
    buyer_id INTEGER,
    procesed BOOLEAN DEFAULT FALSE,
    updated_at DATETIME,
    deleted_at DATETIME
  );

  CREATE TABLE IF NOT EXISTS sale_details (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    hash TEXT,
    product_id INTEGER,
    price,
    taxes,
    discount,
    quantity,
    procesed BOOLEAN DEFAULT FALSE,
    updated_at DATETIME,
    deleted_at DATETIME
  );

  CREATE TABLE IF NOT EXISTS buyers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name  TEXT NOT NULL,
    logo TEXT,
    active BOOLEAN DEFAULT FALSE,
    updated_at DATETIME,
    deleted_at DATETIME
  );

  CREATE TABLE IF NOT EXISTS transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_id INTEGER,
    type TEXT CHECK(type IN ('purchase', 'sale')),
    quantity INTEGER NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    date DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(product_id) REFERENCES products(id)
  );
`);

// Routes
app.get('/api/products', (req, res) => {
  try {
    const products = db.prepare('SELECT * FROM products').all();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/brands', (req, res) => {
  try {
    const products = db.prepare('SELECT * FROM brands').all();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/suppliers', (req, res) => {
  try {
    const products = db.prepare('SELECT * FROM suppliers').all();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/status', (req, res) => {
  try {
    const products = db.prepare('SELECT * FROM status').all();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/buyers', (req, res) => {
  try {
    const products = db.prepare('SELECT * FROM buyers').all();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/purchases', (req, res) => {
  try {
    const products = db.prepare('SELECT * FROM purchases').all();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/products', (req, res) => {
  try {
    const {
      name,
      upc,
      description,
      price,
      title,
      short_description,
      tags,
      sku,
      mpn,
      ean,
      isbn,
      measure_unit,
      weight,
      width,
      height,
      length,
      outer_diameter,
      inner_diameter,
      brand,
      customizable,
      customizable_fields,
      status } = req.body;

    if (!name || !upc) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const stmt = db.prepare('INSERT INTO products (name,description,price,title,short_description,tags,sku,mpn,upc,ean,isbn,measure_unit,weight,width,height,length,outer_diameter,inner_diameter,brand,customizable,customizable_fields,status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
    const result = stmt.run(
      name,
      upc,
      description,
      price,
      title,
      short_description,
      tags,
      sku,
      mpn,
      ean,
      isbn,
      measure_unit,
      weight,
      width,
      height,
      length,
      outer_diameter,
      inner_diameter,
      brand,
      customizable,
      customizable_fields,
      status);
    res.json({ id: result.lastInsertRowid });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/transactions', (req, res) => {
  try {
    const { product_id, type, quantity, price } = req.body;

    if (!product_id || !type || !quantity || !price) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const stmt = db.prepare('INSERT INTO transactions (product_id, type, quantity, price) VALUES (?, ?, ?, ?)');
    const updateStock = db.prepare('UPDATE products SET stock = stock + ? WHERE id = ?');

    db.transaction(() => {
      stmt.run(product_id, type, quantity, price);
      updateStock.run(type === 'purchase' ? quantity : -quantity, product_id);
    })();

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});