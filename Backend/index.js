const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const port = 3000;

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'productdb'
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the database');
}
);

app.post("/products", (req, res) => {
    let { name, price } = req.body;
    price = parseFloat(price);
    if (isNaN(price) || price <= 0) {
        return res.status(400).json({ error: "Invalid price value" });
    }

    db.query("INSERT INTO products (name, price) VALUES (?, ?)", [name, price], (err, result) => {
        if (err) return res.json({ error: err.message });
        res.json({ message: "Product added", id: result.insertId });
    });
});



app.get("/products", (req, res) => {
    const { search, sort } = req.query;
    let conditions = [];
    if (search) {
        conditions.push(`name LIKE '%${search}%'`);
    }
    let sql = "SELECT id, name, price FROM products"; // Fetch with correct lowercase column names
    if (conditions.length) {
        sql += " WHERE " + conditions.join(" AND ");
    }
    if (sort === "asc") {
        sql += " ORDER BY price ASC";
    } else if (sort === "desc") {
        sql += " ORDER BY price DESC";
    }
    console.log("SQL Query:", sql);
    db.query(sql, (err, result) => {
        if (err) return res.json({ error: err.message });
        console.log("Fetched products:", result); // Debugging log
        res.json(result);
    });
});



app.get("/products/:id", (req, res) => {
    const id = req.params.id;
    db.query("SELECT * FROM products WHERE id = ?", [id], (err, result) => {
      if (err) return res.json({ error: err.message });
      res.json(result[0]);
    });
  });
  
app.put("/products/:id", (req, res) => {
    const id = req.params.id;
    const { name, price } = req.body;
    db.query("UPDATE products SET name = ?, price = ? WHERE id = ?", [name, price, id], (err, result) => {
      if (err) return res.json({ error: err.message });
      res.json({ message: "Product updated" });
    });
  });

app.delete("/products/:id", (req, res) => {
    const id = req.params.id;
    db.query("DELETE FROM products WHERE id = ?", [id], (err, result) => {
      if (err) return res.json({ error: err.message });
      res.json({ message: "Product deleted" });
    });
  });

  app.listen(5000, () => {
    console.log("Server running on port 5000");
  });