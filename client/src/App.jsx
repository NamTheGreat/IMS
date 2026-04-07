import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';

const API = 'http://localhost:4000/api';

// ─── Error Boundary ──────────────────────────────────────────────
class ErrorBoundary extends React.Component {
    constructor(props) { super(props); this.state = { hasError: false, error: null }; }
    static getDerivedStateFromError(error) { return { hasError: true, error }; }
    componentDidCatch(error, info) { console.error('ErrorBoundary:', error, info); }
    render() {
        if (this.state.hasError) return (
            <div className="min-h-screen flex items-center justify-center bg-surface">
                <div className="bg-white p-8 rounded-xl shadow-lg text-center max-w-md">
                    <span className="material-symbols-outlined text-5xl text-error mb-4">error</span>
                    <h1 className="text-xl font-bold text-on-surface mb-2">Something went wrong</h1>
                    <pre className="text-sm text-on-surface-variant break-all">{this.state.error?.toString()}</pre>
                </div>
            </div>
        );
        return this.props.children;
    }
}

// ─── Login ───────────────────────────────────────────────────────
function Login() {
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [error, setError] = React.useState('');
    const [loading, setLoading] = React.useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const res = await fetch(`${API}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await res.json();
            if (data.success) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                window.location.href = '/dashboard';
            } else {
                setError(data.message || 'Invalid credentials');
            }
        } catch (err) {
            setError('Connection failed. Is the server running?');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen">
            {/* Left branding */}
            <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-primary to-primary-dim items-center justify-center">
                <div className="text-center text-white space-y-4">
                    <span className="material-symbols-outlined text-7xl">inventory_2</span>
                    <h1 className="text-4xl font-extrabold tracking-tight">InvenTrack</h1>
                    <p className="text-on-primary/70 text-lg">Inventory Management System</p>
                </div>
            </div>
            {/* Right form */}
            <div className="flex-1 flex items-center justify-center bg-surface-container-lowest p-8">
                <div className="w-full max-w-sm space-y-8">
                    <div className="lg:hidden text-center space-y-2">
                        <span className="material-symbols-outlined text-5xl text-primary">inventory_2</span>
                        <h1 className="text-2xl font-bold text-on-surface">InvenTrack</h1>
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-on-surface">Welcome back</h2>
                        <p className="text-on-surface-variant text-sm mt-1">Sign in to your account</p>
                    </div>

                    {error && (
                        <div className="flex items-center gap-2 bg-error-container/20 text-on-error-container p-3 rounded-lg text-sm">
                            <span className="material-symbols-outlined text-sm">error</span>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="space-y-5">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-2">Email</label>
                            <div className="relative">
                                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-sm">mail</span>
                                <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                                    placeholder="admin@example.com"
                                    className="w-full pl-10 pr-4 py-3 bg-surface-container-low border-none rounded-lg text-sm focus:ring-2 focus:ring-primary" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-2">Password</label>
                            <div className="relative">
                                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-sm">lock</span>
                                <input type="password" value={password} onChange={e => setPassword(e.target.value)} required
                                    placeholder="••••••••"
                                    className="w-full pl-10 pr-4 py-3 bg-surface-container-low border-none rounded-lg text-sm focus:ring-2 focus:ring-primary" />
                            </div>
                        </div>
                        <button type="submit" disabled={loading}
                            className="w-full py-3 bg-gradient-to-br from-primary to-primary-dim text-white font-semibold rounded-lg shadow-sm hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50">
                            {loading ? 'Signing in...' : 'Sign In'}
                        </button>
                    </form>
                    <p className="text-center text-xs text-outline">© 2024 InvenTrack — Inventory Management System</p>
                </div>
            </div>
        </div>
    );
}

// ─── Shared Layout ───────────────────────────────────────────────
function TopNav() {
    return (
        <header className="w-full h-16 sticky top-0 z-50 bg-white shadow-sm flex items-center justify-between px-6">
            <div className="flex items-center gap-8">
                <span className="text-xl font-bold text-blue-700 tracking-tight">InvenTrack</span>
                <nav className="hidden md:flex space-x-6 items-center">
                    <a href="/dashboard" className="text-slate-500 hover:text-slate-800 text-sm transition-colors">Dashboard</a>
                    <a href="/inventory" className="text-slate-500 hover:text-slate-800 text-sm transition-colors">Analytics</a>
                    <a href="/suppliers" className="text-slate-500 hover:text-slate-800 text-sm transition-colors">Reports</a>
                </nav>
            </div>
            <div className="flex items-center space-x-4">
                <div className="relative hidden sm:block">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">search</span>
                    <input type="text" placeholder="Search inventory..."
                        className="pl-10 pr-4 py-1.5 bg-surface-container-low border-none rounded-lg text-sm focus:ring-2 focus:ring-primary w-64" />
                </div>
                <button className="material-symbols-outlined text-slate-500 hover:bg-slate-50 p-2 rounded-full transition-colors">notifications</button>
                <button className="material-symbols-outlined text-slate-500 hover:bg-slate-50 p-2 rounded-full transition-colors">settings</button>
                <div className="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center text-primary text-sm font-bold">A</div>
            </div>
        </header>
    );
}

function SideNav() {
    const location = useLocation();
    const path = location.pathname;

    const navItems = [
        { href: '/dashboard', icon: 'dashboard', label: 'Dashboard' },
        { href: '/inventory', icon: 'inventory_2', label: 'Stock Levels' },
        { href: '/suppliers', icon: 'conveyor_belt', label: 'Suppliers' },
    ];

    return (
        <aside className="w-64 h-[calc(100vh-4rem)] sticky left-0 top-16 bg-slate-50 flex flex-col py-4 px-3 space-y-2 border-r border-slate-100">
            <div className="px-3 mb-6">
                <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-1">Inventory Ops</p>
                <p className="text-[10px] text-slate-500">Primary Hub</p>
            </div>
            <nav className="flex-1 space-y-1">
                {navItems.map(item => {
                    const active = path === item.href;
                    return (
                        <a key={item.href} href={item.href}
                            className={`flex items-center px-3 py-2.5 text-sm transition-all duration-200 rounded-lg
                                ${active
                                    ? 'bg-white text-blue-700 font-bold shadow-sm'
                                    : 'text-slate-600 hover:bg-slate-200/50 hover:translate-x-1'
                                }`}>
                            <span className="material-symbols-outlined mr-3 text-[20px]"
                                style={active ? { fontVariationSettings: "'FILL' 1" } : {}}>{item.icon}</span>
                            {item.label}
                        </a>
                    );
                })}
            </nav>
            <div className="pt-4 border-t border-slate-200/50">
                <a href="#" className="flex items-center px-3 py-2.5 text-sm text-slate-600 hover:bg-slate-200/50 transition-all rounded-lg">
                    <span className="material-symbols-outlined mr-3 text-[20px]">help_outline</span>
                    Help Center
                </a>
            </div>
        </aside>
    );
}

function AppLayout({ children }) {
    return (
        <div className="min-h-screen bg-surface">
            <TopNav />
            <div className="flex">
                <SideNav />
                <main className="flex-1 bg-surface min-h-[calc(100vh-4rem)] p-8">
                    <div className="max-w-6xl mx-auto">{children}</div>
                </main>
            </div>
        </div>
    );
}

// ─── Dashboard ───────────────────────────────────────────────────
function Dashboard() {
    const [stats, setStats] = React.useState({ totalProducts: 0, lowStock: 0, suppliers: 0, stockValue: 0 });

    React.useEffect(() => {
        fetch(`${API}/dashboard`).then(r => r.json()).then(setStats).catch(console.error);
    }, []);

    return (
        <>
            <header className="mb-10">
                <h1 className="text-3xl font-bold tracking-tight text-on-surface mb-2">Inventory Overview</h1>
                <p className="text-on-surface-variant">Real-time metrics for warehouse logistics and stock distribution.</p>
            </header>

            {/* Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                <MetricCard icon="inventory" iconBg="bg-primary-container/30" iconColor="text-primary"
                    label="Total Stock" value={stats.totalProducts} badge="+2.4%" badgeColor="text-green-600 bg-green-50" showBar barWidth="w-3/4" />
                <MetricCard icon="warning" iconBg="bg-tertiary-container/30" iconColor="text-tertiary"
                    label="Low Stock Alerts" value={stats.lowStock} badge="Critical" badgeColor="text-error bg-error-container/20"
                    subtitle="Requires immediate action" />
                <MetricCard icon="local_shipping" iconBg="bg-secondary-container/30" iconColor="text-secondary"
                    label="Suppliers" value={stats.suppliers} badge="Active" badgeColor="text-blue-600 bg-blue-50" />
                <MetricCard icon="payments" iconBg="bg-surface-container-high" iconColor="text-on-surface"
                    label="Asset Value" value={`$${stats.stockValue}`} badge="+12%" badgeColor="text-green-600 bg-green-50"
                    subtitle="Estimated warehouse net worth" />
            </div>

            {/* Recent Transactions + Supplier Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <section className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-on-surface">Recent Transactions</h2>
                        <button className="text-sm text-primary font-semibold hover:underline">View All</button>
                    </div>
                    <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/10 overflow-hidden">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-surface-container-low/50">
                                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-on-surface-variant">Item ID</th>
                                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-on-surface-variant">Description</th>
                                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-on-surface-variant">Type</th>
                                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-on-surface-variant">Qty</th>
                                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-on-surface-variant">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-outline-variant/10">
                                {[
                                    { id: '#INV-9821', desc: 'Industrial Filter XL-90', type: 'Inbound', qty: '+150', status: 'Completed', color: 'bg-green-100 text-green-700' },
                                    { id: '#INV-9819', desc: 'Steel Fastener M8 (500pk)', type: 'Outbound', qty: '-45', status: 'Pending', color: 'bg-blue-100 text-blue-700' },
                                    { id: '#INV-9818', desc: 'Electric Motor Coil 2kW', type: 'Adjustment', qty: '-2', status: 'Manual', color: 'bg-slate-100 text-slate-700' },
                                    { id: '#INV-9815', desc: 'Poly-Pipe 20m Rolls', type: 'Inbound', qty: '+24', status: 'Completed', color: 'bg-green-100 text-green-700' },
                                ].map(row => (
                                    <tr key={row.id} className="hover:bg-surface-container-low/30 transition-colors">
                                        <td className="px-6 py-4 text-sm font-medium text-primary">{row.id}</td>
                                        <td className="px-6 py-4 text-sm text-on-surface">{row.desc}</td>
                                        <td className="px-6 py-4 text-sm text-on-surface-variant">{row.type}</td>
                                        <td className="px-6 py-4 text-sm text-on-surface">{row.qty}</td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${row.color}`}>{row.status}</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>

                <section className="space-y-6">
                    <h2 className="text-xl font-bold text-on-surface">Supplier Activity</h2>
                    <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/10 space-y-6">
                        {[
                            { icon: 'factory', name: 'Tech-Steel Corp', desc: 'Restock order confirmed', time: '2 hours ago', isError: false },
                            { icon: 'precision_manufacturing', name: 'Global Hydraulics Ltd', desc: 'Delayed shipment notification', time: '4 hours ago', isError: true },
                            { icon: 'local_shipping', name: 'Fast-Track Logistics', desc: '3 new pallets arrived at Dock B', time: '6 hours ago', isError: false },
                        ].map((item, i) => (
                            <div key={i} className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center shrink-0">
                                    <span className="material-symbols-outlined text-secondary">{item.icon}</span>
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-bold text-on-surface">{item.name}</p>
                                    <p className="text-xs text-on-surface-variant mb-2">{item.desc}</p>
                                    <div className={`text-[10px] flex items-center gap-1 ${item.isError ? 'text-error' : 'text-on-surface-variant'}`}>
                                        <span className="material-symbols-outlined text-[12px]">{item.isError ? 'error' : 'schedule'}</span>
                                        {item.time}
                                    </div>
                                </div>
                            </div>
                        ))}
                        <button className="w-full py-2 border border-outline-variant/30 rounded-lg text-xs font-semibold text-on-surface-variant hover:bg-surface-container-low transition-colors">
                            Manage Suppliers
                        </button>
                    </div>
                </section>
            </div>
        </>
    );
}

function MetricCard({ icon, iconBg, iconColor, label, value, badge, badgeColor, subtitle, showBar, barWidth }) {
    return (
        <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/10 hover:shadow-lg transition-shadow duration-300">
            <div className="flex justify-between items-start mb-4">
                <span className={`p-2 ${iconBg} ${iconColor} rounded-lg material-symbols-outlined`}>{icon}</span>
                {badge && <span className={`text-xs font-semibold ${badgeColor} px-2 py-1 rounded-full`}>{badge}</span>}
            </div>
            <p className="text-sm font-medium text-on-surface-variant mb-1">{label}</p>
            <h3 className="text-2xl font-bold text-on-surface">{value}</h3>
            {subtitle && <p className="mt-2 text-xs text-on-surface-variant italic">{subtitle}</p>}
            {showBar && (
                <div className="mt-4 h-1 bg-surface-container rounded-full overflow-hidden">
                    <div className={`${barWidth} h-full bg-primary`}></div>
                </div>
            )}
        </div>
    );
}

// ─── Inventory ───────────────────────────────────────────────────
function Inventory() {
    const [items, setItems] = React.useState([]);
    const [showForm, setShowForm] = React.useState(false);
    const [newItem, setNewItem] = React.useState({ name: '', category: '', quantity: '', price: '' });

    const fetchItems = () => {
        fetch(`${API}/inventory`).then(r => r.json()).then(setItems).catch(console.error);
    };
    React.useEffect(fetchItems, []);

    const handleAdd = (e) => {
        e.preventDefault();
        fetch(`${API}/inventory`, {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newItem)
        }).then(r => r.json()).then(data => {
            if (data.success) { setShowForm(false); setNewItem({ name: '', category: '', quantity: '', price: '' }); fetchItems(); }
            else alert('Error: ' + (data.error || 'Unknown'));
        }).catch(err => alert('Error: ' + err.message));
    };

    return (
        <>
            {/* Header */}
            <div className="flex items-center justify-between mb-10">
                <div>
                    <h1 className="text-3xl font-extrabold text-on-surface tracking-tight mb-2">Stock Levels</h1>
                    <p className="text-on-surface-variant text-sm">Managing {items.length} active product lines.</p>
                </div>
                <button onClick={() => setShowForm(!showForm)}
                    className="inline-flex items-center px-6 py-2.5 bg-gradient-to-br from-primary to-primary-dim text-white font-semibold rounded-lg shadow-sm hover:opacity-90 active:scale-[0.98] transition-all">
                    <span className="material-symbols-outlined mr-2 text-[20px]">{showForm ? 'close' : 'add'}</span>
                    {showForm ? 'Cancel' : 'New Item'}
                </button>
            </div>

            {/* Add form */}
            {showForm && (
                <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-outline-variant/10 mb-6">
                    <h3 className="font-bold text-on-surface mb-4">Add New Product</h3>
                    <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <input placeholder="Product Name" value={newItem.name} onChange={e => setNewItem({...newItem, name: e.target.value})} required
                            className="px-4 py-2.5 bg-surface-container-low border-none rounded-lg text-sm focus:ring-2 focus:ring-primary" />
                        <input placeholder="Category" value={newItem.category} onChange={e => setNewItem({...newItem, category: e.target.value})} required
                            className="px-4 py-2.5 bg-surface-container-low border-none rounded-lg text-sm focus:ring-2 focus:ring-primary" />
                        <input type="number" placeholder="Quantity" value={newItem.quantity} onChange={e => setNewItem({...newItem, quantity: e.target.value})} required
                            className="px-4 py-2.5 bg-surface-container-low border-none rounded-lg text-sm focus:ring-2 focus:ring-primary" />
                        <div className="flex gap-2">
                            <input type="number" placeholder="Price" value={newItem.price} onChange={e => setNewItem({...newItem, price: e.target.value})} required
                                className="flex-1 px-4 py-2.5 bg-surface-container-low border-none rounded-lg text-sm focus:ring-2 focus:ring-primary" />
                            <button type="submit"
                                className="px-6 bg-gradient-to-br from-primary to-primary-dim text-white font-semibold rounded-lg hover:opacity-90 transition-all">
                                Save
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Table */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden ring-1 ring-slate-100">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-surface-container-low/50">
                                <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-widest text-on-surface-variant">Product Name</th>
                                <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-widest text-on-surface-variant">Category</th>
                                <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-widest text-on-surface-variant">Stock Level</th>
                                <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-widest text-on-surface-variant text-right">Unit Price</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {items.map((item, i) => (
                                <tr key={i} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="text-sm font-semibold text-on-surface">{item.name}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-xs px-2 py-1 bg-surface-container text-secondary rounded-full font-medium">{item.category}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`text-sm font-medium ${item.quantity_on_hand < 10 ? 'text-error' : 'text-primary'}`}>
                                            {item.quantity_on_hand} Units
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="text-sm font-semibold text-on-surface">${item.unit_price}</div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="px-6 py-4 bg-slate-50/30 flex items-center justify-between border-t border-slate-100">
                    <p className="text-sm text-on-surface-variant">Showing {items.length} products</p>
                </div>
            </div>

            {/* Footer Stats */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                <FooterStat icon="account_balance_wallet" iconColor="text-primary" label="Total Assets"
                    value={`$${items.reduce((sum, i) => sum + (i.unit_price * i.quantity_on_hand), 0).toFixed(0)}`}
                    sub="+12% from last month" subColor="text-primary" />
                <FooterStat icon="pending_actions" iconColor="text-secondary" label="Total Products"
                    value={items.length} sub="Across all categories" subColor="text-on-surface-variant" />
                <FooterStat icon="grid_view" iconColor="text-tertiary" label="Low Stock Items"
                    value={items.filter(i => i.quantity_on_hand < 10).length} sub="Require restocking" subColor="text-error" />
            </div>
        </>
    );
}

function FooterStat({ icon, iconColor, label, value, sub, subColor }) {
    return (
        <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm ring-1 ring-slate-100">
            <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">{label}</span>
                <span className={`material-symbols-outlined ${iconColor}`}>{icon}</span>
            </div>
            <p className="text-2xl font-extrabold text-on-surface">{value}</p>
            <p className={`text-[11px] ${subColor} font-medium mt-1`}>{sub}</p>
        </div>
    );
}

// ─── Suppliers ───────────────────────────────────────────────────
function Suppliers() {
    const [suppliers, setSuppliers] = React.useState([]);
    const [showForm, setShowForm] = React.useState(false);
    const [newSupplier, setNewSupplier] = React.useState({ name: '', contact: '' });

    const fetchSuppliers = () => {
        fetch(`${API}/suppliers`).then(r => r.json()).then(setSuppliers).catch(console.error);
    };
    React.useEffect(fetchSuppliers, []);

    const handleAdd = (e) => {
        e.preventDefault();
        fetch(`${API}/suppliers`, {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newSupplier)
        }).then(r => r.json()).then(data => {
            if (data.success) { setShowForm(false); setNewSupplier({ name: '', contact: '' }); fetchSuppliers(); }
            else alert('Error: ' + (data.error || 'Unknown'));
        }).catch(err => alert('Error: ' + err.message));
    };

    const supplierIcons = ['local_shipping', 'precision_manufacturing', 'eco', 'factory'];
    const supplierBgs = ['bg-primary-container', 'bg-tertiary-container', 'bg-secondary-container', 'bg-surface-container'];
    const supplierColors = ['text-primary', 'text-tertiary', 'text-secondary', 'text-on-surface'];

    return (
        <>
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                <div className="space-y-1">
                    <h1 className="text-3xl font-bold tracking-tight text-on-surface">Suppliers Directory</h1>
                    <p className="text-on-surface-variant">Manage your logistics network and partner contact information.</p>
                </div>
                <button onClick={() => setShowForm(!showForm)}
                    className="bg-gradient-to-br from-primary to-primary-dim text-on-primary px-6 py-2.5 rounded-lg shadow-md hover:opacity-90 transition-all flex items-center gap-2 font-medium">
                    <span className="material-symbols-outlined text-sm">{showForm ? 'close' : 'add'}</span>
                    {showForm ? 'Cancel' : 'Add Supplier'}
                </button>
            </header>

            {/* Add Form */}
            {showForm && (
                <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-outline-variant/10 mb-8">
                    <h3 className="font-bold text-on-surface mb-4">New Supplier</h3>
                    <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <input placeholder="Supplier Name" value={newSupplier.name} onChange={e => setNewSupplier({...newSupplier, name: e.target.value})} required
                            className="px-4 py-2.5 bg-surface-container-low border-none rounded-lg text-sm focus:ring-2 focus:ring-primary" />
                        <input placeholder="Contact Info (email or phone)" value={newSupplier.contact} onChange={e => setNewSupplier({...newSupplier, contact: e.target.value})} required
                            className="px-4 py-2.5 bg-surface-container-low border-none rounded-lg text-sm focus:ring-2 focus:ring-primary" />
                        <button type="submit"
                            className="bg-gradient-to-br from-primary to-primary-dim text-white font-semibold rounded-lg hover:opacity-90 transition-all">
                            Save Supplier
                        </button>
                    </form>
                </div>
            )}

            {/* Supplier Cards */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-12">
                {suppliers.map((s, i) => (
                    <div key={i} className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-outline-variant/10 hover:shadow-md transition-shadow group">
                        <div className="flex items-start justify-between mb-6">
                            <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-lg ${supplierBgs[i % supplierBgs.length]} flex items-center justify-center ${supplierColors[i % supplierColors.length]}`}>
                                    <span className="material-symbols-outlined text-2xl">{supplierIcons[i % supplierIcons.length]}</span>
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg text-on-surface">{s.name}</h3>
                                    <p className="text-xs text-on-surface-variant uppercase tracking-widest font-semibold">Supplier Partner</p>
                                </div>
                            </div>
                            <span className="px-3 py-1 bg-green-50 text-green-700 text-xs font-bold rounded-full border border-green-100 uppercase">Active</span>
                        </div>
                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div className="space-y-1">
                                <p className="text-[10px] text-outline font-bold uppercase">Contact Info</p>
                                <p className="text-sm text-primary">{s.contact_info}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] text-outline font-bold uppercase">Supplier ID</p>
                                <p className="text-sm font-mono text-on-surface-variant">{s.supplier_id}</p>
                            </div>
                        </div>
                        <div className="pt-4 border-t border-outline-variant/10 flex items-center justify-end">
                            <a href="#" className="text-primary text-sm font-semibold flex items-center gap-1 group-hover:underline">
                                View Details <span className="material-symbols-outlined text-xs">arrow_forward</span>
                            </a>
                        </div>
                    </div>
                ))}

                {/* Add Supplier Placeholder Card */}
                <div onClick={() => setShowForm(true)}
                    className="border-2 border-dashed border-outline-variant/30 rounded-xl flex flex-col items-center justify-center p-8 text-center bg-surface-container-low hover:bg-white transition-all cursor-pointer group">
                    <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-sm mb-4 group-hover:scale-110 transition-transform">
                        <span className="material-symbols-outlined text-outline text-3xl">add_business</span>
                    </div>
                    <h4 className="font-bold text-on-surface">Add New Partner</h4>
                    <p className="text-sm text-on-surface-variant max-w-[200px] mt-2">Expand your network with a new verified supplier.</p>
                </div>
            </div>

            {/* Performance Table */}
            {suppliers.length > 0 && (
                <section>
                    <h2 className="text-xl font-bold text-on-surface mb-6">Supplier Overview</h2>
                    <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/10 overflow-hidden">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-surface-container-low/50">
                                    <th className="px-6 py-4 text-[10px] uppercase font-bold text-outline tracking-wider">Supplier</th>
                                    <th className="px-6 py-4 text-[10px] uppercase font-bold text-outline tracking-wider">Contact</th>
                                    <th className="px-6 py-4 text-[10px] uppercase font-bold text-outline tracking-wider">ID</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-outline-variant/10">
                                {suppliers.map((s, i) => (
                                    <tr key={i} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-sm">{s.name}</td>
                                        <td className="px-6 py-4 text-sm text-primary">{s.contact_info}</td>
                                        <td className="px-6 py-4 text-sm font-mono text-on-surface-variant">{s.supplier_id}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>
            )}
        </>
    );
}

// ─── App Router ──────────────────────────────────────────────────
function App() {
    return (
        <ErrorBoundary>
            <Router>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/dashboard" element={<AppLayout><Dashboard /></AppLayout>} />
                    <Route path="/inventory" element={<AppLayout><Inventory /></AppLayout>} />
                    <Route path="/suppliers" element={<AppLayout><Suppliers /></AppLayout>} />
                    <Route path="/" element={<Navigate to="/login" replace />} />
                </Routes>
            </Router>
        </ErrorBoundary>
    );
}

export default App;
