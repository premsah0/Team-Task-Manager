import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LogIn, CheckSquare } from 'lucide-react';
import api from '../api';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        try {
            const { data } = await api.post('/auth/login', { email, password });
            localStorage.setItem('userInfo', JSON.stringify(data));
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-slate-900">
            <div className="w-full max-w-sm bg-slate-800 p-8 rounded-xl shadow-xl border border-slate-700/50">
                <div className="text-center mb-8">
                    <div className="flex items-center justify-center gap-2 mb-4">
                        <div className="bg-indigo-500 p-2 rounded-lg">
                            <CheckSquare size={22} className="text-white" />
                        </div>
                    </div>
                    <h2 className="text-2xl font-bold text-white">Welcome Back</h2>
                    <p className="text-slate-400 mt-2 text-sm">Sign in to Team Task Manager</p>
                </div>
                
                {error && (
                    <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-lg mb-6 text-sm">
                        {error}
                    </div>
                )}
                
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1.5">Email Address</label>
                        <input 
                            type="email" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            required 
                            className="w-full px-4 py-2.5 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                            placeholder="you@example.com"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1.5">Password</label>
                        <input 
                            type="password" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            required 
                            className="w-full px-4 py-2.5 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                            placeholder="••••••••"
                        />
                    </div>
                    <button 
                        type="submit" 
                        disabled={isLoading}
                        className="w-full flex items-center justify-center gap-2 bg-indigo-500 text-white font-medium py-2.5 rounded-lg hover:bg-indigo-600 focus:ring-4 focus:ring-indigo-500/30 transition-all disabled:opacity-70"
                    >
                        {isLoading ? 'Signing in...' : (
                            <>
                                <LogIn size={18} /> Sign In
                            </>
                        )}
                    </button>
                </form>
                
                <p className="mt-8 text-center text-sm text-slate-500">
                    Don't have an account? <Link to="/signup" className="text-indigo-400 font-semibold hover:text-indigo-300">Sign up</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
