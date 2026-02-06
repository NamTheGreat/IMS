const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

const dbPath = path.resolve(__dirname, 'ims.db');
const schemaPath = path.resolve(__dirname, 'schema.sql');

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database ' + dbPath + ': ' + err.message);
    } else {
        console.log('Connected to the SQLite database.');
        initDb();
    }
});

function initDb() {
    const schema = fs.readFileSync(schemaPath, 'utf8');
    db.exec(schema, (err) => {
        if (err) {
            console.error('Error initializing database schema:', err.message);
        } else {
            console.log('Database schema initialized.');
            seedData();
        }
    });
}

function seedData() {
    // Check if data exists, if not, add some dummy data
    db.get("SELECT count(*) as count FROM product", (err, row) => {
        if (err) {
            console.error(err.message);
            return;
        }
        if (row.count === 0) {
            console.log('Seeding data...');
            const insertProduct = `INSERT INTO product (product_id, name, description, category, unit_price) VALUES (?, ?, ?, ?, ?)`;
            const insertSupplier = `INSERT INTO supplier (supplier_id, name, contact_info) VALUES (?, ?, ?)`;
            const insertInventory = `INSERT INTO inventory (inventory_id, product_id, supplier_id, quantity_on_hand, reorder_level) VALUES (?, ?, ?, ?, ?)`;

            const p1 = ['prod-1', 'Cake Flour', 'Fine flour for cakes', 'Baking', 5.00];
            const p2 = ['prod-2', 'Olive Oil', 'Extra virgin', 'Pantry', 20.00];
            const p3 = ['prod-3', 'Black Tea', 'Earl Grey', 'Beverage', 8.00];
            const p4 = ['prod-4', 'Dish Soap', 'Lemon scent', 'Cleaning', 3.50];

            db.run(insertProduct, p1);
            db.run(insertProduct, p2);
            db.run(insertProduct, p3);
            db.run(insertProduct, p4);

            const s1 = ['sup-1', 'ABC Foods', 'contact@abcfoods.com'];
            const s2 = ['sup-2', 'Gourmet Distributors', 'sales@gourmet.com'];

            db.run(insertSupplier, s1);
            db.run(insertSupplier, s2);
            
            // Link them
            db.run(insertInventory, ['inv-1', 'prod-1', 'sup-1', 10, 20]); // Low stock
            db.run(insertInventory, ['inv-2', 'prod-2', 'sup-2', 45, 10]);
            db.run(insertInventory, ['inv-3', 'prod-3', 'sup-1', 5, 10]); // Low stock
            db.run(insertInventory, ['inv-4', 'prod-4', 'sup-2', 100, 15]);

            console.log('Data seeded.');
        }
    });
}

module.exports = db;
