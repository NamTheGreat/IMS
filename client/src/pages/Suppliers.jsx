import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BarChart3 } from 'lucide-react';

const Suppliers = () => {
    const [suppliers, setSuppliers] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:3000/api/suppliers')
            .then(res => setSuppliers(res.data))
            .catch(err => console.error(err));
    }, []);

    return (
        <div className="flex min-h-screen bg-gray-100">
            <aside className="w-64 bg-slate-800 text-white hidden md:block">
                <div className="p-4 text-xl font-bold flex items-center">
                    <BarChart3 className="mr-2" /> IMS
                </div>
                <nav className="mt-4">
                    <a href="/dashboard" className="block py-2.5 px-4 hover:bg-slate-700">Dashboard</a>
                    <a href="/inventory" className="block py-2.5 px-4 hover:bg-slate-700">Inventory</a>
                    <a href="/suppliers" className="block py-2.5 px-4 bg-slate-700">Suppliers</a>
                </nav>
            </aside>
            <div className="flex-1 p-8">
                <h1 className="text-2xl font-bold mb-6">Suppliers</h1>
                <div className="bg-white shadow rounded-lg overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {suppliers.map((s) => (
                                <tr key={s.supplier_id}>
                                    <td className="px-6 py-4 whitespace-nowrap">{s.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{s.contact_info}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Suppliers;
