import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Error Boundary Component
class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error('Error caught by boundary:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div style={{ padding: '20px', color: 'red' }}>
                    <h1>Something went wrong.</h1>
                    <pre>{this.state.error?.toString()}</pre>
                </div>
            );
        }
        return this.props.children;
    }
}

// Simple inline-styled Login to bypass Tailwind issues
function Login() {
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [error, setError] = React.useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:3000/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await response.json();
            if (data.success) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                window.location.href = '/dashboard';
            } else {
                setError(data.message || 'Login failed');
            }
        } catch (err) {
            setError('Login failed: ' + err.message);
        }
    };

    return (
        <div style={{
            display: 'flex',
            minHeight: '100vh',
            backgroundColor: '#f8fafc',
            fontFamily: 'system-ui, sans-serif'
        }}>
            {/* Left Side */}
            <div style={{
                width: '50%',
                backgroundColor: '#1e40af',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
                color: 'white'
            }}>
                <h1 style={{ fontSize: '3rem', marginBottom: '10px' }}>📊 IMS</h1>
                <p style={{ fontSize: '1.2rem' }}>Inventory Management System</p>
            </div>

            {/* Right Side - Form */}
            <div style={{
                width: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'white'
            }}>
                <div style={{ width: '350px' }}>
                    <h2 style={{ fontSize: '1.8rem', marginBottom: '30px', color: '#1e293b' }}>Login</h2>

                    {error && (
                        <div style={{
                            backgroundColor: '#fee2e2',
                            color: '#dc2626',
                            padding: '12px',
                            borderRadius: '8px',
                            marginBottom: '20px'
                        }}>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleLogin}>
                        <div style={{ marginBottom: '20px' }}>
                            <input
                                type="email"
                                placeholder="admin@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                style={{
                                    width: '100%',
                                    padding: '14px',
                                    border: '1px solid #e2e8f0',
                                    borderRadius: '8px',
                                    fontSize: '1rem',
                                    boxSizing: 'border-box'
                                }}
                            />
                        </div>

                        <div style={{ marginBottom: '20px' }}>
                            <input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                style={{
                                    width: '100%',
                                    padding: '14px',
                                    border: '1px solid #e2e8f0',
                                    borderRadius: '8px',
                                    fontSize: '1rem',
                                    boxSizing: 'border-box'
                                }}
                            />
                        </div>

                        <button
                            type="submit"
                            style={{
                                width: '100%',
                                padding: '14px',
                                backgroundColor: '#2563eb',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                fontSize: '1rem',
                                fontWeight: '600',
                                cursor: 'pointer'
                            }}
                        >
                            Login
                        </button>
                    </form>

                    <p style={{ marginTop: '30px', textAlign: 'center', color: '#64748b', fontSize: '0.8rem' }}>
                        © 2024 Inventory Management System
                    </p>
                </div>
            </div>
        </div>
    );
}

// Simple Dashboard
function Dashboard() {
    const [stats, setStats] = React.useState({ totalProducts: 0, lowStock: 0, suppliers: 0, stockValue: 0 });

    React.useEffect(() => {
        fetch('http://localhost:3000/api/dashboard')
            .then(res => res.json())
            .then(data => setStats(data))
            .catch(err => console.error('Error:', err));
    }, []);

    return (
        <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'system-ui, sans-serif' }}>
            {/* Sidebar */}
            <aside style={{ width: '250px', backgroundColor: '#1e293b', color: 'white', padding: '20px' }}>
                <h2 style={{ marginBottom: '30px' }}>📊 IMS</h2>
                <nav>
                    <a href="/dashboard" style={{ display: 'block', padding: '12px', color: 'white', backgroundColor: '#334155', borderRadius: '6px', marginBottom: '8px', textDecoration: 'none' }}>Dashboard</a>
                    <a href="/inventory" style={{ display: 'block', padding: '12px', color: '#94a3b8', textDecoration: 'none', marginBottom: '8px' }}>Inventory</a>
                    <a href="/suppliers" style={{ display: 'block', padding: '12px', color: '#94a3b8', textDecoration: 'none' }}>Suppliers</a>
                </nav>
            </aside>

            {/* Main Content */}
            <main style={{ flex: 1, backgroundColor: '#f1f5f9', padding: '30px' }}>
                <h1 style={{ marginBottom: '30px', color: '#1e293b' }}>Admin Dashboard</h1>

                {/* Stats Cards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '30px' }}>
                    <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                        <p style={{ color: '#64748b', marginBottom: '8px' }}>Total Products</p>
                        <h3 style={{ fontSize: '2rem', color: '#1e293b' }}>{stats.totalProducts}</h3>
                    </div>
                    <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                        <p style={{ color: '#64748b', marginBottom: '8px' }}>Low Stock</p>
                        <h3 style={{ fontSize: '2rem', color: '#ef4444' }}>{stats.lowStock}</h3>
                    </div>
                    <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                        <p style={{ color: '#64748b', marginBottom: '8px' }}>Suppliers</p>
                        <h3 style={{ fontSize: '2rem', color: '#22c55e' }}>{stats.suppliers}</h3>
                    </div>
                    <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                        <p style={{ color: '#64748b', marginBottom: '8px' }}>Stock Value</p>
                        <h3 style={{ fontSize: '2rem', color: '#f97316' }}>${stats.stockValue}</h3>
                    </div>
                </div>
            </main>
        </div>
    );
}

// Simple Inventory
function Inventory() {
    const [items, setItems] = React.useState([]);

    React.useEffect(() => {
        fetch('http://localhost:3000/api/inventory')
            .then(res => res.json())
            .then(data => setItems(data))
            .catch(err => console.error('Error:', err));
    }, []);

    return (
        <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'system-ui, sans-serif' }}>
            <aside style={{ width: '250px', backgroundColor: '#1e293b', color: 'white', padding: '20px' }}>
                <h2 style={{ marginBottom: '30px' }}>📊 IMS</h2>
                <nav>
                    <a href="/dashboard" style={{ display: 'block', padding: '12px', color: '#94a3b8', textDecoration: 'none', marginBottom: '8px' }}>Dashboard</a>
                    <a href="/inventory" style={{ display: 'block', padding: '12px', color: 'white', backgroundColor: '#334155', borderRadius: '6px', marginBottom: '8px', textDecoration: 'none' }}>Inventory</a>
                    <a href="/suppliers" style={{ display: 'block', padding: '12px', color: '#94a3b8', textDecoration: 'none' }}>Suppliers</a>
                </nav>
            </aside>
            <main style={{ flex: 1, backgroundColor: '#f1f5f9', padding: '30px' }}>
                <h1 style={{ marginBottom: '30px', color: '#1e293b' }}>Inventory</h1>
                <div style={{ backgroundColor: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead style={{ backgroundColor: '#f8fafc' }}>
                            <tr>
                                <th style={{ padding: '16px', textAlign: 'left', borderBottom: '1px solid #e2e8f0' }}>Product</th>
                                <th style={{ padding: '16px', textAlign: 'left', borderBottom: '1px solid #e2e8f0' }}>Category</th>
                                <th style={{ padding: '16px', textAlign: 'left', borderBottom: '1px solid #e2e8f0' }}>Stock</th>
                                <th style={{ padding: '16px', textAlign: 'left', borderBottom: '1px solid #e2e8f0' }}>Price</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((item, i) => (
                                <tr key={i}>
                                    <td style={{ padding: '16px', borderBottom: '1px solid #e2e8f0' }}>{item.name}</td>
                                    <td style={{ padding: '16px', borderBottom: '1px solid #e2e8f0' }}>{item.category}</td>
                                    <td style={{ padding: '16px', borderBottom: '1px solid #e2e8f0' }}>{item.quantity_on_hand}</td>
                                    <td style={{ padding: '16px', borderBottom: '1px solid #e2e8f0' }}>${item.unit_price}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    );
}

// Simple Suppliers
function Suppliers() {
    const [suppliers, setSuppliers] = React.useState([]);

    React.useEffect(() => {
        fetch('http://localhost:3000/api/suppliers')
            .then(res => res.json())
            .then(data => setSuppliers(data))
            .catch(err => console.error('Error:', err));
    }, []);

    return (
        <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'system-ui, sans-serif' }}>
            <aside style={{ width: '250px', backgroundColor: '#1e293b', color: 'white', padding: '20px' }}>
                <h2 style={{ marginBottom: '30px' }}>📊 IMS</h2>
                <nav>
                    <a href="/dashboard" style={{ display: 'block', padding: '12px', color: '#94a3b8', textDecoration: 'none', marginBottom: '8px' }}>Dashboard</a>
                    <a href="/inventory" style={{ display: 'block', padding: '12px', color: '#94a3b8', textDecoration: 'none', marginBottom: '8px' }}>Inventory</a>
                    <a href="/suppliers" style={{ display: 'block', padding: '12px', color: 'white', backgroundColor: '#334155', borderRadius: '6px', textDecoration: 'none' }}>Suppliers</a>
                </nav>
            </aside>
            <main style={{ flex: 1, backgroundColor: '#f1f5f9', padding: '30px' }}>
                <h1 style={{ marginBottom: '30px', color: '#1e293b' }}>Suppliers</h1>
                <div style={{ backgroundColor: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead style={{ backgroundColor: '#f8fafc' }}>
                            <tr>
                                <th style={{ padding: '16px', textAlign: 'left', borderBottom: '1px solid #e2e8f0' }}>Name</th>
                                <th style={{ padding: '16px', textAlign: 'left', borderBottom: '1px solid #e2e8f0' }}>Contact</th>
                            </tr>
                        </thead>
                        <tbody>
                            {suppliers.map((s, i) => (
                                <tr key={i}>
                                    <td style={{ padding: '16px', borderBottom: '1px solid #e2e8f0' }}>{s.name}</td>
                                    <td style={{ padding: '16px', borderBottom: '1px solid #e2e8f0' }}>{s.contact_info}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    );
}

function App() {
    return (
        <ErrorBoundary>
            <Router>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/inventory" element={<Inventory />} />
                    <Route path="/suppliers" element={<Suppliers />} />
                    <Route path="/" element={<Navigate to="/login" replace />} />
                </Routes>
            </Router>
        </ErrorBoundary>
    );
}

export default App;
