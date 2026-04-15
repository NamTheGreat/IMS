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
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="glass-card p-8 rounded-xl text-center max-w-md ring-1 ring-white/5">
                    <span className="material-symbols-outlined text-5xl text-error mb-4">error</span>
                    <h1 className="text-xl font-bold text-white mb-2">System Error</h1>
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
        setLoading(true); setError('');
        try {
            const res = await fetch(`${API}/login`, {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await res.json();
            if (data.success) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                window.location.href = '/dashboard';
            } else { setError(data.message || 'Invalid credentials'); }
        } catch { setError('Connection failed. Is the server running?'); }
        finally { setLoading(false); }
    };

    return (
        <div className="flex min-h-screen bg-background relative overflow-hidden">
            {/* Ambient glow */}
            <div className="fixed top-[-10%] right-[-10%] w-[40vw] h-[40vw] bg-primary/5 blur-[150px] pointer-events-none rounded-full"></div>
            <div className="fixed bottom-[-5%] left-[20%] w-[30vw] h-[30vw] bg-tertiary/5 blur-[120px] pointer-events-none rounded-full"></div>

            {/* Left branding */}
            <div className="hidden lg:flex w-1/2 items-center justify-center relative">
                <div className="text-center space-y-6 relative z-10">
                    <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-primary to-primary-container mx-auto flex items-center justify-center">
                        <span className="material-symbols-outlined text-4xl text-on-primary-container" style={{ fontVariationSettings: "'FILL' 1" }}>account_balance</span>
                    </div>
                    <h1 className="text-5xl font-extrabold tracking-tighter text-white">Precision<br/>Curator</h1>
                    <p className="text-on-surface-variant text-lg max-w-sm">Archives Division — Inventory Management System</p>
                </div>
            </div>

            {/* Right form */}
            <div className="flex-1 flex items-center justify-center p-8">
                <div className="w-full max-w-sm space-y-8">
                    <div className="lg:hidden text-center space-y-3">
                        <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-primary to-primary-container mx-auto flex items-center justify-center">
                            <span className="material-symbols-outlined text-2xl text-on-primary-container" style={{ fontVariationSettings: "'FILL' 1" }}>account_balance</span>
                        </div>
                        <h1 className="text-2xl font-bold text-primary tracking-tighter">Precision Curator</h1>
                    </div>

                    <div>
                        <h2 className="text-2xl font-bold text-white">Access Vault</h2>
                        <p className="text-on-surface-variant text-sm mt-1">Authenticate to enter the archives</p>
                    </div>

                    {error && (
                        <div className="flex items-center gap-2 bg-error-container/30 text-on-error-container p-3 rounded-lg text-sm ring-1 ring-error/20">
                            <span className="material-symbols-outlined text-sm">error</span>{error}
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="space-y-5">
                        <div>
                            <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant mb-2">Email</label>
                            <div className="relative">
                                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-sm">mail</span>
                                <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                                    placeholder="admin@example.com"
                                    className="w-full pl-10 pr-4 py-3 bg-surface-container-highest border-none rounded-lg text-sm text-on-surface focus:ring-1 ring-tertiary/30" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant mb-2">Password</label>
                            <div className="relative">
                                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-sm">lock</span>
                                <input type="password" value={password} onChange={e => setPassword(e.target.value)} required
                                    placeholder="••••••••"
                                    className="w-full pl-10 pr-4 py-3 bg-surface-container-highest border-none rounded-lg text-sm text-on-surface focus:ring-1 ring-tertiary/30" />
                            </div>
                        </div>
                        <button type="submit" disabled={loading}
                            className="w-full py-3 bg-gradient-to-br from-primary to-primary-container text-on-primary-container font-bold rounded-lg hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50">
                            {loading ? 'Authenticating...' : 'Enter Archives'}
                        </button>
                    </form>
                    <p className="text-center text-[10px] text-outline uppercase tracking-widest">© 2024 Precision Curator — Archives Division</p>
                </div>
            </div>
        </div>
    );
}

// ─── Shared Layout ───────────────────────────────────────────────
function TopNav() {
    return (
        <header className="flex justify-between items-center px-10 w-full h-16 border-b border-outline-variant/15 bg-background/60 backdrop-blur-xl z-20 shrink-0">
            <div className="flex items-center gap-8">
                <h1 className="text-lg font-black text-white uppercase tracking-tighter">Archives</h1>
                <div className="relative group hidden lg:block">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline-variant text-sm">search</span>
                    <input type="text" placeholder="Search the Vault..."
                        className="bg-surface-container-highest border-none rounded-full pl-10 pr-4 py-1.5 text-sm w-64 focus:ring-1 ring-tertiary/30 text-on-surface transition-all" />
                </div>
            </div>
            <div className="flex items-center gap-6">
                <button className="text-slate-400 hover:text-tertiary transition-colors relative">
                    <span className="material-symbols-outlined">notifications</span>
                    <span className="absolute top-0 right-0 w-2 h-2 bg-tertiary rounded-full"></span>
                </button>
                <button className="text-slate-400 hover:text-tertiary transition-colors">
                    <span className="material-symbols-outlined">history</span>
                </button>
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary-container flex items-center justify-center text-on-primary-container text-xs font-bold">A</div>
            </div>
        </header>
    );
}

function SideNav() {
    const location = useLocation();
    const path = location.pathname;

    const navItems = [
        { href: '/dashboard', icon: 'dashboard', label: 'Dashboard' },
        { href: '/inventory', icon: 'inventory_2', label: 'Vault' },
        { href: '/suppliers', icon: 'handshake', label: 'Suppliers' },
    ];

    return (
        <aside className="hidden md:flex flex-col h-screen w-64 border-r border-outline-variant/15 bg-background py-8 px-6 shrink-0">
            <div className="mb-10">
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded bg-gradient-to-br from-primary to-primary-container flex items-center justify-center">
                        <span className="material-symbols-outlined text-on-primary-container text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>account_balance</span>
                    </div>
                    <span className="text-xl font-bold tracking-tighter text-primary">Precision Curator</span>
                </div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-on-surface-variant/50 ml-11">Archives Division</p>
            </div>

            <nav className="flex-1 space-y-2">
                {navItems.map(item => {
                    const active = path === item.href;
                    return (
                        <a key={item.href} href={item.href}
                            className={`flex items-center gap-3 px-4 py-3 transition-all duration-300 text-sm font-semibold tracking-tighter uppercase
                                ${active
                                    ? 'text-tertiary border-r-2 border-tertiary bg-surface-container'
                                    : 'text-slate-400 opacity-70 hover:bg-surface-container-highest'
                                }`}>
                            <span className="material-symbols-outlined"
                                style={active ? { fontVariationSettings: "'FILL' 1" } : {}}>{item.icon}</span>
                            {item.label}
                        </a>
                    );
                })}
            </nav>

            <div className="mt-auto pt-6 space-y-2">
                <button onClick={() => window.location.href = '/inventory'}
                    className="w-full mb-6 bg-gradient-to-br from-primary to-primary-container text-on-primary-container py-3 rounded-md font-bold text-sm tracking-widest uppercase transition-transform active:scale-95 duration-200 flex items-center justify-center gap-2">
                    <span className="material-symbols-outlined text-[20px]">add</span>
                    New Entry
                </button>
                <a href="#" className="flex items-center gap-3 px-4 py-2 text-slate-400 opacity-70 hover:bg-surface-container-highest transition-all duration-300">
                    <span className="material-symbols-outlined">settings</span>
                    <span className="text-sm font-semibold uppercase tracking-tighter">Settings</span>
                </a>
                <a href="#" className="flex items-center gap-3 px-4 py-2 text-slate-400 opacity-70 hover:bg-surface-container-highest transition-all duration-300">
                    <span className="material-symbols-outlined">help_outline</span>
                    <span className="text-sm font-semibold uppercase tracking-tighter">Support</span>
                </a>
            </div>
        </aside>
    );
}

function AppLayout({ children }) {
    return (
        <div className="min-h-screen bg-background flex overflow-hidden relative">
            {/* Ambient glows */}
            <div className="fixed top-[-10%] right-[-10%] w-[40vw] h-[40vw] bg-primary/5 blur-[150px] pointer-events-none rounded-full"></div>
            <div className="fixed bottom-[-5%] left-[20%] w-[30vw] h-[30vw] bg-tertiary/5 blur-[120px] pointer-events-none rounded-full"></div>

            <SideNav />
            <main className="flex-1 flex flex-col h-screen overflow-hidden">
                <TopNav />
                <div className="flex-1 overflow-y-auto p-10 hide-scrollbar">
                    {children}
                    <div className="h-10"></div>
                </div>
            </main>
        </div>
    );
}

// ─── Dashboard ───────────────────────────────────────────────────
function Dashboard() {
    const [stats, setStats] = React.useState({ totalProducts: 0, lowStock: 0, suppliers: 0, stockValue: 0, categories: [], recentItems: [] });

    React.useEffect(() => {
        fetch(`${API}/dashboard`).then(r => r.json()).then(setStats).catch(console.error);
    }, []);

    const barColors = ['bg-primary', 'bg-tertiary', 'bg-primary-container', 'bg-secondary', 'bg-tertiary-container'];
    const healthPct = stats.totalProducts > 0 ? Math.round(((stats.totalProducts - stats.lowStock) / stats.totalProducts) * 100) : 0;

    return (
        <>
            {/* Hero */}
            <div className="mb-12 flex items-end justify-between">
                <div>
                    <h2 className="text-6xl font-black tracking-tighter uppercase leading-none text-white mb-2">Vault Overview</h2>
                    <p className="text-on-surface-variant max-w-md font-medium">Real-time telemetry and archival verification for the Precision Curator ecosystem.</p>
                </div>
                <div className="flex gap-4">
                    <button className="px-6 py-2 border border-outline-variant/30 rounded-md text-sm font-bold tracking-widest text-primary uppercase hover:bg-surface-container-high transition-colors">Export Ledger</button>
                    <button className="px-6 py-2 bg-tertiary text-on-tertiary rounded-md text-sm font-bold tracking-widest uppercase hover:brightness-110 transition-all">Finalize Audit</button>
                </div>
            </div>

            {/* Bento Grid */}
            <div className="grid grid-cols-12 gap-8">
                {/* Metrics */}
                <div className="col-span-12 md:col-span-4 grid gap-6">
                    <GlassMetric icon="inventory" iconColor="text-primary" label="Total Items"
                        value={stats.totalProducts}
                        sub={<><span className="material-symbols-outlined text-sm">groups</span> {stats.suppliers} supplier{stats.suppliers !== 1 ? 's' : ''} connected</>}
                        subColor="text-tertiary" hoverRing="hover:ring-tertiary/30" />
                    <GlassMetric icon="warning" iconColor="text-error" label="Low Stock Alerts"
                        value={stats.lowStock} sub={stats.lowStock > 0 ? "Items below reorder level" : "All stock levels healthy"}
                        subColor="text-on-surface-variant" hoverRing="hover:ring-error/30"
                        iconFill />
                    <GlassMetric icon="payments" iconColor="text-primary" label="Archival Value"
                        value={`$${Number(stats.stockValue).toLocaleString()}`}
                        sub={<><span className="material-symbols-outlined text-sm">verified_user</span> Insured & Audited</>}
                        subColor="text-on-surface-variant" hoverRing="hover:ring-primary/30" />
                </div>

                {/* Category Distribution — REAL DATA */}
                <div className="col-span-12 md:col-span-8">
                    <div className="glass-card p-8 rounded-xl ring-1 ring-white/5 h-full flex flex-col">
                        <div className="flex justify-between items-center mb-10">
                            <h3 className="text-xl font-bold tracking-tighter uppercase">Category Distribution</h3>
                            <div className="px-3 py-1 bg-surface-container-high rounded text-[10px] font-bold uppercase tracking-widest text-tertiary">
                                {stats.categories.length} categor{stats.categories.length === 1 ? 'y' : 'ies'}
                            </div>
                        </div>
                        <div className="flex-1 flex flex-col justify-around">
                            <div className="space-y-6">
                                {stats.categories.length > 0 ? stats.categories.map((cat, i) => (
                                    <ProgressBar key={cat.name} label={cat.name} value={`${cat.percentage}%`}
                                        pct={cat.percentage} color={barColors[i % barColors.length]} />
                                )) : (
                                    <p className="text-on-surface-variant text-sm italic">No inventory data yet — add items via the Vault.</p>
                                )}
                            </div>
                            <div className="mt-8 grid grid-cols-2 gap-4">
                                <div className="bg-surface-container-low p-4 rounded-lg flex items-center gap-4">
                                    <div className="w-2 h-2 rounded-full bg-tertiary"></div>
                                    <div>
                                        <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Stock Health</p>
                                        <p className="text-lg font-bold text-white tracking-tighter">{healthPct}%</p>
                                    </div>
                                </div>
                                <div className="bg-surface-container-low p-4 rounded-lg flex items-center gap-4">
                                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                                    <div>
                                        <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Data Integrity</p>
                                        <p className="text-lg font-bold text-white tracking-tighter">Verified</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recent Vault Entries — REAL DATA */}
                <div className="col-span-12">
                    <div className="bg-surface-container rounded-xl p-8 ring-1 ring-white/5">
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="text-xl font-bold tracking-tighter uppercase">Recent Vault Entries</h3>
                            <button onClick={() => window.location.href = '/inventory'} className="text-sm font-bold text-primary hover:text-tertiary transition-colors uppercase tracking-widest">View All</button>
                        </div>
                        <div className="space-y-2">
                            <div className="grid grid-cols-5 px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant/60">
                                <div className="col-span-2">Asset / Category</div>
                                <div>Supplier</div>
                                <div>Stock Status</div>
                                <div className="text-right">Valuation</div>
                            </div>
                            {stats.recentItems.length > 0 ? stats.recentItems.map(item => {
                                const isCritical = item.quantity_on_hand < item.reorder_level;
                                const pct = Math.min(100, (item.quantity_on_hand / Math.max(item.reorder_level * 3, 1)) * 100);
                                const statusLabel = isCritical ? 'Critical' : item.quantity_on_hand < item.reorder_level * 1.5 ? 'Low' : 'Healthy';
                                const statusColor = isCritical ? 'bg-error/10 text-error ring-error/20' : statusLabel === 'Low' ? 'bg-amber-500/10 text-amber-400 ring-amber-500/20' : 'bg-tertiary/10 text-tertiary ring-tertiary/20';
                                const categoryIcons = { 'Electronics': 'memory', 'Food': 'restaurant', 'Clothing': 'checkroom', 'Hardware': 'hardware', 'default': 'inventory_2' };
                                const icon = categoryIcons[item.category] || categoryIcons['default'];
                                return (
                                    <div key={item.inventory_id} className="grid grid-cols-5 items-center px-4 py-4 bg-surface-container-low hover:bg-surface-container-high rounded-md transition-colors group">
                                        <div className="col-span-2 flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-md bg-surface-variant flex items-center justify-center text-primary group-hover:scale-105 transition-transform">
                                                <span className="material-symbols-outlined">{icon}</span>
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-white uppercase tracking-tighter">{item.name}</p>
                                                <p className="text-[11px] text-on-surface-variant uppercase tracking-widest font-medium">{item.category}</p>
                                            </div>
                                        </div>
                                        <div className="text-sm font-medium text-on-surface">{item.supplier_name}</div>
                                        <div className="flex items-center gap-3">
                                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest ring-1 ${statusColor}`}>
                                                {statusLabel} ({item.quantity_on_hand})
                                            </span>
                                        </div>
                                        <div className="text-right text-sm font-bold text-white">${Number(item.unit_price).toLocaleString()}</div>
                                    </div>
                                );
                            }) : (
                                <div className="px-4 py-8 text-center text-on-surface-variant text-sm italic">No inventory entries yet — add items via the Vault.</div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

function GlassMetric({ icon, iconColor, label, value, sub, subColor, hoverRing, iconFill }) {
    return (
        <div className={`glass-card p-6 rounded-xl ring-1 ring-white/5 flex flex-col justify-between h-48 group transition-all ${hoverRing}`}>
            <div className="flex justify-between items-start">
                <span className="text-xs font-bold text-on-surface-variant uppercase tracking-[0.2em]">{label}</span>
                <span className={`material-symbols-outlined ${iconColor} group-hover:scale-110 transition-transform`}
                    style={iconFill ? { fontVariationSettings: "'FILL' 1" } : {}}>{icon}</span>
            </div>
            <div>
                <div className="text-4xl font-bold text-white tracking-tighter">{value}</div>
                <div className={`text-xs ${subColor} mt-2 flex items-center gap-1`}>{sub}</div>
            </div>
        </div>
    );
}

function ProgressBar({ label, value, pct, width, color }) {
    // Support both dynamic pct (number) and static width (Tailwind class)
    const barStyle = pct !== undefined ? { width: `${pct}%` } : undefined;
    const barClass = pct !== undefined ? '' : (width || '');
    return (
        <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold uppercase tracking-widest">
                <span className="text-white">{label}</span>
                <span className="text-on-surface-variant">{value}</span>
            </div>
            <div className="h-1 w-full bg-outline-variant/20 rounded-full overflow-hidden">
                <div className={`h-full ${color} rounded-full ${barClass}`} style={barStyle}></div>
            </div>
        </div>
    );
}

// ─── Inventory ───────────────────────────────────────────────────
function Inventory() {
    const [items, setItems] = React.useState([]);
    const [showForm, setShowForm] = React.useState(false);
    const [newItem, setNewItem] = React.useState({ name: '', category: '', quantity: '', price: '' });
    const [editingId, setEditingId] = React.useState(null);
    const [editQty, setEditQty] = React.useState('');

    const fetchItems = () => { fetch(`${API}/inventory`).then(r => r.json()).then(setItems).catch(console.error); };
    React.useEffect(fetchItems, []);

    const handleAdd = (e) => {
        e.preventDefault();
        fetch(`${API}/inventory`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(newItem) })
            .then(r => r.json()).then(data => {
                if (data.success) { setShowForm(false); setNewItem({ name: '', category: '', quantity: '', price: '' }); fetchItems(); }
                else alert('Error: ' + (data.error || 'Unknown'));
            }).catch(err => alert('Error: ' + err.message));
    };

    const updateQty = (inventoryId, delta) => {
        fetch(`${API}/inventory/${inventoryId}`, {
            method: 'PUT', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ delta })
        }).then(r => r.json()).then(data => {
            if (data.success) fetchItems();
            else alert('Error: ' + (data.error || 'Unknown'));
        }).catch(err => alert('Error: ' + err.message));
    };

    const setQty = (inventoryId) => {
        const qty = parseInt(editQty, 10);
        if (isNaN(qty) || qty < 0) { alert('Enter a valid quantity'); return; }
        fetch(`${API}/inventory/${inventoryId}`, {
            method: 'PUT', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ quantity: qty })
        }).then(r => r.json()).then(data => {
            if (data.success) { setEditingId(null); setEditQty(''); fetchItems(); }
            else alert('Error: ' + (data.error || 'Unknown'));
        }).catch(err => alert('Error: ' + err.message));
    };

    const totalValue = items.reduce((sum, i) => sum + (i.unit_price * i.quantity_on_hand), 0);

    return (
        <>
            {/* Hero */}
            <div className="flex justify-between items-end mb-12">
                <div className="max-w-2xl">
                    <h2 className="text-5xl font-extrabold tracking-tighter text-white mb-4">Inventory Vault</h2>
                    <p className="text-on-surface-variant font-light text-lg leading-relaxed">
                        Precision tracking of high-value archival assets. Every entry is cryptographically secured and verified within the curatorial ecosystem.
                    </p>
                </div>
                <div className="flex gap-4 items-center">
                    <div className="text-right mr-4">
                        <p className="text-[10px] uppercase tracking-[0.2em] opacity-40">Total Valuation</p>
                        <p className="text-2xl font-bold text-tertiary">${totalValue.toLocaleString()}</p>
                    </div>
                    <button onClick={() => setShowForm(!showForm)}
                        className="px-6 py-2.5 bg-gradient-to-br from-primary to-primary-container text-on-primary-container font-bold rounded-lg hover:opacity-90 active:scale-[0.98] transition-all flex items-center gap-2">
                        <span className="material-symbols-outlined text-[20px]">{showForm ? 'close' : 'add'}</span>
                        {showForm ? 'Cancel' : 'New Entry'}
                    </button>
                </div>
            </div>

            {/* Add Form */}
            {showForm && (
                <div className="glass-card p-6 rounded-xl ring-1 ring-white/5 mb-8">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-on-surface-variant mb-4">New Archive Entry</h3>
                    <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <input placeholder="Asset Name" value={newItem.name} onChange={e => setNewItem({...newItem, name: e.target.value})} required
                            className="px-4 py-3 bg-surface-container-highest border-none rounded-lg text-sm text-on-surface focus:ring-1 ring-tertiary/30" />
                        <input placeholder="Classification" value={newItem.category} onChange={e => setNewItem({...newItem, category: e.target.value})} required
                            className="px-4 py-3 bg-surface-container-highest border-none rounded-lg text-sm text-on-surface focus:ring-1 ring-tertiary/30" />
                        <input type="number" placeholder="Stock Level" value={newItem.quantity} onChange={e => setNewItem({...newItem, quantity: e.target.value})} required
                            className="px-4 py-3 bg-surface-container-highest border-none rounded-lg text-sm text-on-surface focus:ring-1 ring-tertiary/30" />
                        <div className="flex gap-2">
                            <input type="number" placeholder="Valuation" value={newItem.price} onChange={e => setNewItem({...newItem, price: e.target.value})} required
                                className="flex-1 px-4 py-3 bg-surface-container-highest border-none rounded-lg text-sm text-on-surface focus:ring-1 ring-tertiary/30" />
                            <button type="submit" className="px-6 bg-tertiary text-on-tertiary font-bold rounded-lg hover:brightness-110 transition-all">Save</button>
                        </div>
                    </form>
                </div>
            )}

            {/* Filter Bar */}
            <div className="flex flex-wrap items-center justify-between gap-6 mb-8">
                <div className="flex items-center gap-2">
                    <button className="px-5 py-2.5 rounded-full bg-surface-container-highest text-primary text-sm font-medium">All Assets</button>
                    <button className="px-5 py-2.5 rounded-full text-slate-400 text-sm font-medium hover:text-on-surface transition-all">Low Stock</button>
                    <button className="px-5 py-2.5 rounded-full text-slate-400 text-sm font-medium hover:text-on-surface transition-all">High Value</button>
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 border border-outline-variant/15 rounded-lg text-sm text-slate-300 hover:bg-surface-container transition-all">
                        <span className="material-symbols-outlined text-[18px]">tune</span>Filter
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 border border-outline-variant/15 rounded-lg text-sm text-slate-300 hover:bg-surface-container transition-all">
                        <span className="material-symbols-outlined text-[18px]">ios_share</span>Export
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="bg-surface-container rounded-xl overflow-hidden ring-1 ring-white/5">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-surface-container-low/50">
                            <th className="py-5 px-8 text-[11px] font-bold uppercase tracking-widest text-on-surface-variant/60">Asset Name</th>
                            <th className="py-5 px-6 text-[11px] font-bold uppercase tracking-widest text-on-surface-variant/60">Classification</th>
                            <th className="py-5 px-6 text-[11px] font-bold uppercase tracking-widest text-on-surface-variant/60">Stock Level</th>
                            <th className="py-5 px-6 text-[11px] font-bold uppercase tracking-widest text-on-surface-variant/60 text-right">Valuation</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-outline-variant/10">
                        {items.map((item, i) => {
                            const pct = Math.min(100, (item.quantity_on_hand / 50) * 100);
                            const isCritical = item.quantity_on_hand < 10;
                            const isEditing = editingId === item.inventory_id;
                            return (
                                <tr key={i} className="group hover:bg-surface-container-high transition-colors">
                                    <td className="py-6 px-8">
                                        <p className="font-bold text-white text-base">{item.name}</p>
                                    </td>
                                    <td className="py-6 px-6">
                                        <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider">{item.category}</span>
                                    </td>
                                    <td className="py-6 px-6">
                                        <div className="flex items-center gap-3">
                                            {/* Decrease button */}
                                            <button onClick={() => updateQty(item.inventory_id, -1)}
                                                disabled={item.quantity_on_hand <= 0}
                                                className="w-7 h-7 rounded-md bg-surface-container-highest flex items-center justify-center text-on-surface-variant hover:bg-error/20 hover:text-error transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                                                title="Decrease by 1">
                                                <span className="material-symbols-outlined text-[16px]">remove</span>
                                            </button>

                                            {/* Quantity display / inline edit */}
                                            {isEditing ? (
                                                <form onSubmit={(e) => { e.preventDefault(); setQty(item.inventory_id); }} className="flex items-center gap-1">
                                                    <input type="number" autoFocus value={editQty}
                                                        onChange={e => setEditQty(e.target.value)}
                                                        onBlur={() => { setEditingId(null); setEditQty(''); }}
                                                        className="w-16 px-2 py-1 bg-surface-container-highest border-none rounded text-sm text-center text-on-surface focus:ring-1 ring-tertiary/30" />
                                                </form>
                                            ) : (
                                                <button onClick={() => { setEditingId(item.inventory_id); setEditQty(String(item.quantity_on_hand)); }}
                                                    className="min-w-[3rem] text-center cursor-pointer" title="Click to set exact quantity">
                                                    <div className="w-20 h-1 bg-outline-variant/20 rounded-full relative overflow-hidden mb-1">
                                                        <div className={`absolute inset-y-0 left-0 rounded-full ${isCritical ? 'bg-error' : 'bg-tertiary'}`} style={{ width: `${pct}%` }}></div>
                                                    </div>
                                                    <span className={`text-xs font-bold ${isCritical ? 'text-error' : 'text-tertiary'}`}>
                                                        {item.quantity_on_hand}
                                                    </span>
                                                </button>
                                            )}

                                            {/* Increase button */}
                                            <button onClick={() => updateQty(item.inventory_id, 1)}
                                                className="w-7 h-7 rounded-md bg-surface-container-highest flex items-center justify-center text-on-surface-variant hover:bg-tertiary/20 hover:text-tertiary transition-all"
                                                title="Increase by 1">
                                                <span className="material-symbols-outlined text-[16px]">add</span>
                                            </button>
                                        </div>
                                    </td>
                                    <td className="py-6 px-6 text-right font-bold text-white">${Number(item.unit_price).toLocaleString()}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
                <div className="px-8 py-4 flex items-center justify-between border-t border-outline-variant/10">
                    <p className="text-sm text-on-surface-variant">Displaying {items.length} Archive Entries</p>
                </div>
            </div>
        </>
    );
}

// ─── Suppliers ───────────────────────────────────────────────────
function Suppliers() {
    const [suppliers, setSuppliers] = React.useState([]);
    const [showForm, setShowForm] = React.useState(false);
    const [newSupplier, setNewSupplier] = React.useState({ name: '', contact: '' });

    const fetchSuppliers = () => { fetch(`${API}/suppliers`).then(r => r.json()).then(setSuppliers).catch(console.error); };
    React.useEffect(fetchSuppliers, []);

    const handleAdd = (e) => {
        e.preventDefault();
        fetch(`${API}/suppliers`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(newSupplier) })
            .then(r => r.json()).then(data => {
                if (data.success) { setShowForm(false); setNewSupplier({ name: '', contact: '' }); fetchSuppliers(); }
                else alert('Error: ' + (data.error || 'Unknown'));
            }).catch(err => alert('Error: ' + err.message));
    };

    const supplierIcons = ['local_shipping', 'diamond', 'architecture', 'precision_manufacturing'];
    const statusColors = ['bg-tertiary/10 text-tertiary', 'bg-amber-500/10 text-amber-500', 'bg-primary/10 text-primary', 'bg-tertiary/10 text-tertiary'];
    const statusLabels = ['Active', 'Reviewing', 'Verified', 'Active'];

    return (
        <>
            {/* Hero */}
            <div className="flex justify-between items-end mb-12">
                <div className="max-w-2xl">
                    <h1 className="text-5xl font-extrabold tracking-tighter text-on-surface mb-4">Supplier Directory</h1>
                    <p className="text-on-surface-variant text-lg">Maintaining the integrity of the archival chain through meticulous provider verification and performance monitoring.</p>
                </div>
                <div className="flex gap-3">
                    <button className="px-6 py-2.5 rounded-xl border border-outline-variant/30 text-primary hover:bg-surface-container-high transition-all font-bold text-sm uppercase tracking-widest">Export</button>
                    <button onClick={() => setShowForm(!showForm)}
                        className="px-6 py-2.5 rounded-xl bg-tertiary text-on-tertiary font-bold hover:brightness-110 transition-all flex items-center gap-2 text-sm uppercase tracking-widest">
                        <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>{showForm ? 'close' : 'add_business'}</span>
                        {showForm ? 'Cancel' : 'Add Supplier'}
                    </button>
                </div>
            </div>

            {/* Add Form */}
            {showForm && (
                <div className="glass-card p-6 rounded-xl ring-1 ring-white/5 mb-8">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-on-surface-variant mb-4">New Supplier Entry</h3>
                    <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <input placeholder="Supplier Name" value={newSupplier.name} onChange={e => setNewSupplier({...newSupplier, name: e.target.value})} required
                            className="px-4 py-3 bg-surface-container-highest border-none rounded-lg text-sm text-on-surface focus:ring-1 ring-tertiary/30" />
                        <input placeholder="Contact (email/phone)" value={newSupplier.contact} onChange={e => setNewSupplier({...newSupplier, contact: e.target.value})} required
                            className="px-4 py-3 bg-surface-container-highest border-none rounded-lg text-sm text-on-surface focus:ring-1 ring-tertiary/30" />
                        <button type="submit" className="bg-tertiary text-on-tertiary font-bold rounded-lg hover:brightness-110 transition-all uppercase tracking-widest text-sm">
                            Register Supplier
                        </button>
                    </form>
                </div>
            )}

            {/* Supplier Bento Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
                {suppliers.map((s, i) => (
                    <div key={i} className="bg-surface-container p-8 rounded-xl flex flex-col hover:bg-surface-container-high transition-all group ring-1 ring-white/5">
                        <div className="flex justify-between items-start mb-6">
                            <div className="w-12 h-12 rounded-lg bg-surface-container-highest flex items-center justify-center">
                                <span className="material-symbols-outlined text-primary text-2xl">{supplierIcons[i % supplierIcons.length]}</span>
                            </div>
                            <span className={`px-3 py-1 text-[10px] font-bold tracking-widest uppercase rounded-full ${statusColors[i % statusColors.length]}`}>
                                {statusLabels[i % statusLabels.length]}
                            </span>
                        </div>
                        <div className="mb-auto">
                            <h3 className="text-xl font-bold text-white mb-1 group-hover:text-primary transition-colors">{s.name}</h3>
                            <p className="text-on-surface-variant text-sm mb-4">{s.contact_info}</p>
                            <div className="space-y-3">
                                <div className="flex justify-between text-sm py-2 border-b border-outline-variant/10">
                                    <span className="text-outline">Supplier ID</span>
                                    <span className="text-on-surface font-mono">{s.supplier_id}</span>
                                </div>
                                <div className="flex justify-between text-sm py-2 border-b border-outline-variant/10">
                                    <span className="text-outline">Status</span>
                                    <span className="text-tertiary">Verified</span>
                                </div>
                            </div>
                        </div>
                        <button className="mt-6 text-primary font-bold text-sm flex items-center gap-2 group/btn">
                            Full Analytics
                            <span className="material-symbols-outlined text-sm group-hover/btn:translate-x-1 transition-transform">arrow_forward</span>
                        </button>
                    </div>
                ))}

                {/* Add Card */}
                <div onClick={() => setShowForm(true)}
                    className="border-2 border-dashed border-outline-variant/20 rounded-xl flex flex-col items-center justify-center p-8 text-center hover:bg-surface-container transition-all cursor-pointer group min-h-[300px]">
                    <div className="w-16 h-16 rounded-full bg-surface-container-highest flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <span className="material-symbols-outlined text-outline text-3xl">add_business</span>
                    </div>
                    <h4 className="font-bold text-white">Add New Partner</h4>
                    <p className="text-sm text-on-surface-variant max-w-[200px] mt-2">Expand the archival network with a new verified supplier.</p>
                </div>
            </div>

            {/* Performance Table */}
            {suppliers.length > 0 && (
                <section>
                    <h2 className="text-xl font-bold tracking-tighter uppercase mb-6">Fulfillment Performance</h2>
                    <div className="bg-surface-container rounded-xl ring-1 ring-white/5 overflow-hidden">
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
                                    <tr key={i} className="hover:bg-surface-container-high transition-colors">
                                        <td className="px-6 py-4 font-medium text-sm text-white">{s.name}</td>
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
