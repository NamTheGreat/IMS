import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart3, Lock, Mail } from 'lucide-react';
import axios from 'axios';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3000/api/login', { email, password });
            if (response.data.success) {
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('user', JSON.stringify(response.data.user));
                navigate('/dashboard');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
        }
    };

    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Left Side - Brand (Optional, based on split screen in design) */}
            <div className="hidden w-1/2 bg-gray-100 lg:flex items-center justify-center">
                <div className="text-center">
                    <div className="flex items-center justify-center mb-4">
                        <BarChart3 className="h-16 w-16 text-blue-600" />
                        <span className="ml-4 text-4xl font-bold text-gray-800">IMS</span>
                    </div>
                </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="flex w-full flex-col justify-center px-4 py-12 lg:w-1/2 sm:px-6 lg:px-8 bg-white">
                <div className="mx-auto w-full max-w-md">
                    <div className="flex flex-col items-center">
                        <div className="flex items-center mb-6 lg:hidden">
                            <BarChart3 className="h-10 w-10 text-blue-600" />
                            <span className="ml-2 text-2xl font-bold text-gray-800">IMS</span>
                        </div>
                        <div className="mb-8 flex items-center">
                            <BarChart3 className="h-8 w-8 text-blue-600 mr-2" />
                            <h2 className="text-2xl font-semibold text-gray-900">Inventory Management System</h2>
                        </div>

                        <h2 className="mt-2 text-2xl font-bold leading-9 tracking-tight text-gray-900 text-left w-full">
                            Login
                        </h2>
                    </div>

                    <div className="mt-6">
                        <form onSubmit={handleLogin} className="space-y-6">

                            {error && (
                                <div className="bg-red-50 text-red-500 p-3 rounded text-sm">
                                    {error}
                                </div>
                            )}

                            <div>
                                <div className="relative mt-2 rounded-md shadow-sm">
                                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                        <Mail className="h-5 w-5 text-gray-400" aria-hidden="true" />
                                    </div>
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        autoComplete="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="block w-full rounded-md border-0 py-3 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                                        placeholder="admin@example.com"
                                    />
                                </div>
                            </div>

                            <div>
                                <div className="relative mt-2 rounded-md shadow-sm">
                                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                        <Lock className="h-5 w-5 text-gray-400" aria-hidden="true" />
                                    </div>
                                    <input
                                        id="password"
                                        name="password"
                                        type="password"
                                        autoComplete="current-password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="block w-full rounded-md border-0 py-3 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                                        placeholder="********"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <input
                                        id="remember-me"
                                        name="remember-me"
                                        type="checkbox"
                                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600"
                                    />
                                    <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                                        Remember me
                                    </label>
                                </div>
                            </div>

                            <div>
                                <button
                                    type="submit"
                                    className="flex w-full justify-center rounded-md bg-blue-700 px-3 py-3 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                                >
                                    Login
                                </button>
                            </div>
                        </form>

                        <p className="mt-10 text-center text-xs text-gray-500">
                            © 2024 Inventory Management System
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
