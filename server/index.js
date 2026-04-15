const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
const PORT = 4000;

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
        stockValue: 0,
        categories: [],
        recentItems: []
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

                    // Category distribution
                    db.all(`SELECT p.category, COUNT(*) as count, SUM(i.quantity_on_hand) as totalQty
                            FROM product p JOIN inventory i ON p.product_id = i.product_id
                            GROUP BY p.category ORDER BY totalQty DESC`, (err, rows) => {
                        if (err) return res.status(500).json({ error: err.message });
                        const totalQty = rows.reduce((s, r) => s + (r.totalQty || 0), 0);
                        stats.categories = rows.map(r => ({
                            name: r.category || 'Uncategorized',
                            count: r.count,
                            quantity: r.totalQty,
                            percentage: totalQty > 0 ? Math.round((r.totalQty / totalQty) * 100) : 0
                        }));

                        // Recent inventory items (last 5 added)
                        db.all(`SELECT i.inventory_id, p.name, p.category, i.quantity_on_hand, i.reorder_level, p.unit_price,
                                       s.name as supplier_name
                                FROM inventory i
                                JOIN product p ON i.product_id = p.product_id
                                JOIN supplier s ON i.supplier_id = s.supplier_id
                                ORDER BY i.rowid DESC LIMIT 5`, (err, rows) => {
                            if (err) return res.status(500).json({ error: err.message });
                            stats.recentItems = rows || [];
                            res.json(stats);
                        });
                    });
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

// Update Inventory Quantity
app.put('/api/inventory/:id', (req, res) => {
    const { id } = req.params;
    const { quantity, delta } = req.body;

    if (delta !== undefined) {
        // Adjust by delta (e.g. +1 or -1)
        db.run(
            `UPDATE inventory SET quantity_on_hand = MAX(0, quantity_on_hand + ?) WHERE inventory_id = ?`,
            [delta, id],
            function (err) {
                if (err) return res.status(500).json({ error: err.message });
                if (this.changes === 0) return res.status(404).json({ error: 'Item not found' });
                res.json({ success: true, message: 'Quantity updated' });
            }
        );
    } else if (quantity !== undefined) {
        // Set absolute quantity
        db.run(
            `UPDATE inventory SET quantity_on_hand = ? WHERE inventory_id = ?`,
            [Math.max(0, quantity), id],
            function (err) {
                if (err) return res.status(500).json({ error: err.message });
                if (this.changes === 0) return res.status(404).json({ error: 'Item not found' });
                res.json({ success: true, message: 'Quantity updated' });
            }
        );
    } else {
        res.status(400).json({ error: 'Provide quantity or delta' });
    }
});

// Add Inventory
app.post('/api/inventory', (req, res) => {
    const { name, category, quantity, price, supplier_id } = req.body;

    // 1. Create Product
    const productId = `prod-${Date.now()}`;
    db.run(
        `INSERT INTO product (product_id, name, category, unit_price) VALUES (?, ?, ?, ?)`,
        [productId, name, category, price],
        (err) => {
            if (err) return res.status(500).json({ error: err.message });

            // 2. Create Inventory Record
            const inventoryId = `inv-${Date.now()}`;
            // Use a default supplier or one passed in. For now, we'll pick the first supplier if not provided or just use a dummy one if empty.
            // A better way is to let user select supplier. Let's assume user passes supplier_id or we pick one.
            // Fix: We need a valid supplier_id. Let's force user to pick one or default to the first one found.

            const finalSupplierId = supplier_id || 'sup-1'; // Default Fallback

            db.run(
                `INSERT INTO inventory (inventory_id, product_id, supplier_id, quantity_on_hand, reorder_level) VALUES (?, ?, ?, ?, ?)`,
                [inventoryId, productId, finalSupplierId, quantity, 10], // Default reorder level 10
                (err) => {
                    if (err) return res.status(500).json({ error: err.message });
                    res.json({ success: true, message: 'Inventory added' });
                }
            );
        }
    );
});

// Add Supplier
app.post('/api/suppliers', (req, res) => {
    const { name, contact } = req.body;
    const supplierId = `sup-${Date.now()}`;
    db.run(
        `INSERT INTO supplier (supplier_id, name, contact_info) VALUES (?, ?, ?)`,
        [supplierId, name, contact],
        (err) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ success: true, message: 'Supplier added' });
        }
    );
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
