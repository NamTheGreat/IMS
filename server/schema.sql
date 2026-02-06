-- SQLite Schema
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS product (
    product_id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    category TEXT,
    unit_price REAL NOT NULL
);

CREATE TABLE IF NOT EXISTS supplier (
    supplier_id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    contact_info TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS inventory (
    inventory_id TEXT PRIMARY KEY,
    product_id TEXT NOT NULL,
    supplier_id TEXT NOT NULL,
    quantity_on_hand INTEGER NOT NULL,
    reorder_level INTEGER NOT NULL,
    FOREIGN KEY (product_id) REFERENCES product(product_id),
    FOREIGN KEY (supplier_id) REFERENCES supplier(supplier_id)
);

CREATE TABLE IF NOT EXISTS customer (
    customer_id TEXT PRIMARY KEY,
    customer_name TEXT NOT NULL,
    contact_info TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS orders (
    order_id TEXT PRIMARY KEY,
    inventory_id TEXT NOT NULL,
    order_date TEXT NOT NULL, -- SQLite doesn't have a DATE type, uses TEXT (ISO8601)
    customer_id TEXT NOT NULL,
    FOREIGN KEY (inventory_id) REFERENCES inventory(inventory_id),
    FOREIGN KEY (customer_id) REFERENCES customer(customer_id)
);
