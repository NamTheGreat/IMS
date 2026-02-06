import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Package, AlertTriangle, Users, DollarSign, Menu, BarChart3 } from 'lucide-react';

const Dashboard = () => {
    const [stats, setStats] = useState({
        totalProducts: 0,
        lowStock: 0,
        suppliers: 0,
        stockValue: 0
    });
    const [loading, setLoading] = useState(true);

    // Mock chart data
    const data = [
        { name: 'Jan', sales: 4000 },
        { name: 'Feb', sales: 3000 },
        { name: 'Mar', sales: 2000 },
        { name: 'Apr', sales: 2780 },
        { name: 'May', sales: 1890 },
        { name: 'Jun', sales: 2390 },
    ];

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/dashboard');
                setStats(response.data);
            } catch (error) {
                console.error("Error fetching stats", error);
                // Fallback or error state
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    return (
        <div className="flex min-h-screen bg-gray-100">
            {/* Sidebar Placeholder - will be a component later */}
            <aside className="w-64 bg-slate-800 text-white hidden md:block">
                <div className="p-4 text-xl font-bold flex items-center">
                    <BarChart3 className="mr-2" /> IMS
                </div>
                <nav className="mt-4">
                    <a href="/dashboard" className="block py-2.5 px-4 bg-slate-700">Dashboard</a>
                    <a href="#" className="block py-2.5 px-4 hover:bg-slate-700">Inventory</a>
                    <a href="#" className="block py-2.5 px-4 hover:bg-slate-700">Suppliers</a>
                    <a href="#" className="block py-2.5 px-4 hover:bg-slate-700">Reports</a>
                </nav>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                {/* Topbar */}
                <header className="bg-white shadow p-4 flex justify-between items-center">
                    <div className="flex items-center md:hidden">
                        <Menu className="mr-2" />
                        <span className="font-bold">IMS</span>
                    </div>
                    <h2 className="text-xl font-semibold hidden md:block">Admin Dashboard</h2>
                    <div className="flex items-center">
                        <span className="mr-2 text-sm text-gray-600">Welcome, Admin</span>
                        <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white">A</div>
                    </div>
                </header>

                <main className="p-6 overflow-auto">
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <StatsCard title="Total Products" value={stats.totalProducts} icon={<Package className="text-blue-500" />} color="bg-blue-50" />
                        <StatsCard title="Low Stock" value={stats.lowStock} icon={<AlertTriangle className="text-red-500" />} color="bg-red-50" />
                        <StatsCard title="Suppliers" value={stats.suppliers} icon={<Users className="text-green-500" />} color="bg-green-50" />
                        <StatsCard title="Stock Value" value={`$${stats.stockValue}`} icon={<DollarSign className="text-orange-500" />} color="bg-orange-50" />
                    </div>

                    {/* Charts & Tables Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Chart */}
                        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow">
                            <h3 className="text-lg font-medium mb-4">Stock Overview (Mock)</h3>
                            <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <RechartsBarChart data={data}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="name" />
                                        <YAxis />
                                        <Tooltip />
                                        <Bar dataKey="sales" fill="#3b82f6" />
                                    </RechartsBarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Low Stock Alerts (Mock Table) */}
                        <div className="bg-white p-6 rounded-lg shadow">
                            <h3 className="text-lg font-medium mb-4">Low Stock Alerts</h3>
                            <div className="space-y-4">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="flex items-center justify-between p-2 border rounded">
                                        <div>
                                            <div className="font-medium">Item {i}</div>
                                            <div className="text-xs text-gray-500">Category</div>
                                        </div>
                                        <button className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700">Restock</button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

const StatsCard = ({ title, value, icon, color }) => (
    <div className={`p-4 rounded-lg shadow border border-gray-100 bg-white flex items-center justify-between`}>
        <div>
            <p className="text-sm text-gray-500 mb-1">{title}</p>
            <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
        </div>
        <div className={`p-3 rounded-full ${color}`}>
            {icon}
        </div>
    </div>
);

// Lucide icon fix for import
const BarChartIcon = BarChart; // Rename if conflict, but BarChart is from recharts. 
// Actually Recharts exports BarChart, Lucide exports BarChart3 or similar. 
// I used BarChart3 in Login. Let's use BarChart3 for icon here too if needed.
// Lucide doesn't export BarChart as default, let's use BarChart3.

export default Dashboard;
