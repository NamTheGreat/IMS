# 📊 IMS - Inventory Management System

A modern, full-stack Inventory Management System built with React and Node.js.

![ER Diagram of the database](assets/ERD.png)
![Screenshot of the UI](assets/UI.png)

## ✨ Features

- **🔐 Login System** - Secure authentication with session management
- **📈 Dashboard** - Real-time stats for products, stock levels, suppliers, and stock value
- **📦 Inventory Management** - View and manage all inventory items with stock tracking
- **🏢 Supplier Management** - Maintain supplier directory with contact information
- **⚠️ Low Stock Alerts** - Automatic detection of items below reorder level

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **React Router v6** - Client-side routing
- **Vite** - Build tool and dev server

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **SQLite** - Database (with schema based on PostgreSQL design)

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/NamTheGreat/IMS.git
   cd IMS
   ```

2. **Install Backend Dependencies**
   ```bash
   cd server
   npm install
   ```

3. **Install Frontend Dependencies**
   ```bash
   cd ../client
   npm install
   ```

### Running the Application

1. **Start the Backend** (runs on port 3000)
   ```bash
   cd server
   node index.js
   ```

2. **Start the Frontend** (runs on port 5173)
   ```bash
   cd client
   npm run dev
   ```

3. **Open your browser** at `http://localhost:5173`

### Default Login
- **Email**: `admin@example.com`
- **Password**: `password`

## 📁 Project Structure

```
IMS/
├── client/                 # React Frontend
│   ├── src/
│   │   ├── App.jsx        # Main app with routing
│   │   ├── main.jsx       # Entry point
│   │   └── index.css      # Global styles
│   ├── package.json
│   └── vite.config.js
│
├── server/                 # Node.js Backend
│   ├── index.js           # Express server & API routes
│   ├── db.js              # SQLite database connection
│   ├── schema.sql         # Database schema
│   └── package.json
│
├── db/                     # Database design files
│   ├── schema.dbm         # pgModeler file
│   └── schemaInit.sql     # PostgreSQL schema
│
└── assets/                 # Images and diagrams
    ├── ERD.png
    └── UI.png
```

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/login` | Authenticate user |
| GET | `/api/dashboard` | Get dashboard statistics |
| GET | `/api/inventory` | List all inventory items |
| GET | `/api/suppliers` | List all suppliers |

## 📊 Database Schema

The system uses the following main tables:
- **product** - Product catalog with name, description, category, and price
- **supplier** - Supplier information with contact details
- **inventory** - Stock tracking linking products and suppliers
- **orders** - Order records
- **customer** - Customer information

## 📄 License

This project is for educational purposes.

---

Made with ❤️ for Inventory Management
