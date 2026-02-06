const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Routes

// Login (Mock)
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    // Simple mock logic
    if (email === 'admin@example.com' && password === 'password') {
        res.json({ success: true, token: 'mock-token', user: { name: 'Admin', role: 'admin' } });
    } else {
        res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
});

// Dashboard Stats
app.get('/api/dashboard', (req, res) => {
    const stats = {
        totalProducts: 0,
        lowStock: 0,
        suppliers: 0,
        stockValue: 0
    };

    db.get("SELECT count(*) as count FROM product", (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        stats.totalProducts = row.count;

        db.get("SELECT count(*) as count FROM inventory WHERE quantity_on_hand < reorder_level", (err, row) => {
            if (err) return res.status(500).json({ error: err.message });
            stats.lowStock = row.count;

            db.get("SELECT count(*) as count FROM supplier", (err, row) => {
                if (err) return res.status(500).json({ error: err.message });
                stats.suppliers = row.count;

                db.get("SELECT sum(p.unit_price * i.quantity_on_hand) as value FROM product p JOIN inventory i ON p.product_id = i.product_id", (err, row) => {
                    if (err) return res.status(500).json({ error: err.message });
                    stats.stockValue = row.value || 0;
                    res.json(stats);
                });
            });
        });
    });
});

// Inventory
app.get('/api/inventory', (req, res) => {
    const sql = `
        SELECT i.inventory_id, p.name, p.category, i.quantity_on_hand, p.unit_price 
        FROM inventory i 
        JOIN product p ON i.product_id = p.product_id
    `;
    db.all(sql, [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// Suppliers
app.get('/api/suppliers', (req, res) => {
    const sql = `SELECT * FROM supplier`;
    db.all(sql, [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
