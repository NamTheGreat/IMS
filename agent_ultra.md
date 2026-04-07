# IMS (Inventory Management System) - Ultra Detailed AI Agent Context

This project directory contains the Inventory Management System (IMS). This document acts as the ultimate reference for an AI agent to understand, navigate, and contribute to the project. Covering the project's codebase, structure, workflows, and capabilities, this guide leaves no detail unaddressed.

---

# 1. 📚 **Project Overview**

- **Purpose:**
  The IMS is a full-stack, data-driven application for inventory stock and supplier management.
  - Tracks products, suppliers, stock levels, and reorder alerts.
  - Features include authentication, low-stock management, and dashboard statistics.

- **Core Architecture:**
  - **Frontend (Client)**: Built using React with modern libraries (React Router, Tailwind).
  - **Backend (Server)**: Node.js (Express routes handle RESTful APIs).
  - **Database (SQLite)**: Stores product, inventory, supplier, and order data.

- **Tech Stack:**
  - Frontend: React 18, TailwindCSS, Axios.
  - Backend: Node.js, Express, Nodemon.
  - Database: SQLite (compatible with PostgreSQL).

---

# 2. 📂 **File and Directory Structure**

### a) Root Directory
```
IMS/
├── client/  # Frontend React Directory
├── server/  # Backend Directory
├── db/      # Contains schema SQL files
├── assets/  # UI diagrams and assets
└── agent_ultra.md  # AI Agent Enhanced Documentation
```

### b) Client - React Application Structure
```
client/
├── src/     # Application Code
│   ├── pages/   # Individual Views/Routes
│   │   ├── Suppliers.jsx
│   │   ├── Inventory.jsx
│   │   └── Dashboard.jsx
│   │
│   ├── App.jsx       # Router Logic
│   ├── main.jsx      # ReactDOM Mounting
│   └── index.css     # Tailwind Entry CSS
│
├── package.json      # Client Dependencies
└── vite.config.js    # Vite for Dev
```
- **Key Frontend Components:**
  - `Suppliers.jsx`: Fetches supplier data via `/api/suppliers` and displays it as a table. Includes functionality to add a new supplier.
  - `Inventory.jsx`: Manages product inventory, connects to `/api/inventory`, and enables adding new inventory records.
  - `Dashboard.jsx`: Fetches real-time stats (total products, low stock, suppliers, and stock value) from `/api/dashboard` and displays interactive charts using Recharts.

- **Primary Tools:**
  - **Vite:** Used for development and bundling.
  - **Axios:** Simplifies HTTP requests.
  - **Lucide-React:** Provides icons for UI components.
  - **Recharts:** Enables effective data visualization in `Dashboard`.

### c) Server - Node.js/Backend
```
server/
├── index.js    # Main Application API Endpoints
├── db.js       # SQLite Database Functional Setup
├── schema.sql  # SQLite Schema
└── package.json
```
- **Key Backend Functions:**
  - **`index.js`**: Defines all RESTful APIs for login, inventory, suppliers, and dashboard data.
  - **`db.js`**: Responsible for SQL queries and database interaction via SQLite.
- **Database Connections:**
  - The backend uses SQLite database to store and retrieve inventory-related data.

### d) Database Directory
```
db/
├── schemaInit.sql    # PostgreSQL Base Schema Auto-converted
├── schema.dbm        # pgModeler Database Output
```
- **Details of File Contents:**
  - **`schema.sql`** (SQLite version):
    - Defines `product`, `inventory`, `supplier`, `orders`, and `customer` tables. Includes foreign keys ensuring database integrity.
  - **`schemaInit.sql`** (PostgreSQL):
    - An original .sql schema for potential Postgres migration.

---

# 3. 🚀 **Features Overview**

### a) User Authentication - `/api/login`
- Users can log in with a predefined **admin account**.
- Credentials:
  - **Email:** `admin@example.com`
  - **Password:** `password`

### b) Dashboard - `/api/dashboard`
- Displays the following statistics:
  - Total Products.
  - Number of Low Stock Items.
  - Total Registered Suppliers.
  - Total Stock Value (calculated as the sum of product prices × quantity).

### c) Inventory Management - `/api/inventory`
- Displays all products, stocks, and prices.
- Features for adding new inventory items.

### d) Suppliers - `/api/suppliers`
- Fetches and displays supplier data.
- Provides functionality for adding new suppliers.

---

# 4. 💾 **Database Schema Overview**
### Tables Overview:
- **`product`**:
  - Tracks products (ID, name, description, category, price).
- **`supplier`**:
  - Stores supplier details (ID, name, contact info).
- **`inventory`**:
  - Links `product` to `supplier` and monitors stock quantity.
- **`orders`**:
  - Tracks customer orders, referencing inventory.
- **`customer`**:
  - Stores customer records.

### Code Relationships:
- Express backend routes interact directly with SQLite tables. Queries written in `server/db.js` fetch and store data.

### Example Query:
```sql
SELECT i.inventory_id, p.name, s.name as supplier, i.quantity_on_hand
FROM inventory i
JOIN product p ON i.product_id = p.product_id
JOIN supplier s ON i.supplier_id = s.supplier_id
```
---

# 5. 🔧 **Development and Setup Guide**

### Prerequisites:
1. Node.js (18.x or later).
2. npm or yarn (for dependency management).

### Steps to Run:
1. **Clone Repository:**
   ```bash
   git clone <repo-url>
   cd IMS
   ```

2. **Backend Setup:**
   ```bash
   cd server
   npm install
   node index.js
   # Backend runs on localhost:3000
   ```

3. **Frontend Setup:**
   ```bash
   cd client
   npm install
   npm run dev
   # Frontend runs on localhost:5173
   ```

4. **Database Setup:** (For SQLite)
   - Database schema auto-executes provided you use `db.js` scripts.
   - Note: **Ensure `ims.db` exists in `server` folder.**

---

# 6. 🛠️ **Potential Improvements**
- **Feature Enhancements:**
  - Implement JWT or OAuth for production-grade authentication.
  - Add role-based access control (admin vs. staff).
- **Database Optimization:**
  - Utilize triggers for automatic reordering when stock runs low.
- **Frontend Enhancements:**
  - Switch to Material-UI or similar for modern styling.
  - Implement Progressive Web App (PWA) support.

---

# 7. 📊 **Debugging & Troubleshooting**

### Common Errors:
1. **CORS Issue:**
   - Ensure cross-origin access is allowed (middleware in `index.js`).

2. **Database Connection Error:**
   - Confirm SQLite database (`ims.db`) exists where `db.js` expects it.

3. **API Issue:**
   - Use tools like Postman or cURL to debug backend routes manually.

---

This document serves as a full context guide for navigating and expanding the IMS. For further assistance, integrate logging to trace any error paths, or utilize modern debugging tools.
