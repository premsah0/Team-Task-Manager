import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LogOut, CheckSquare, PlusCircle, Users } from 'lucide-react';

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const userInfoString = localStorage.getItem('userInfo');
    const userInfo = userInfoString ? JSON.parse(userInfoString) : null;

    const handleLogout = () => {
        localStorage.removeItem('userInfo');
        navigate('/login');
    };

    const isActive = (path) => location.pathname === path;

    return (
        <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10">
            <div className="container mx-auto px-4 lg:px-8 py-3 flex justify-between items-center">
                <Link to="/" className="flex items-center gap-2 text-indigo-600 font-bold text-xl tracking-tight">
                    <CheckSquare size={24} />
                    <span>Team Task Manager</span>
                </Link>
                <div>
                    {userInfo ? (
                        <div className="flex items-center gap-6">
                            <div className="hidden md:flex items-center gap-4 text-sm font-medium text-gray-600">
                                {userInfo.role === 'Admin' && (
                                    <>
                                        <Link 
                                            to="/" 
                                            className={`hover:text-indigo-600 transition-colors ${isActive('/') ? 'text-indigo-600 font-semibold' : ''}`}
                                        >
                                            Dashboard
                                        </Link>
                                        <Link 
                                            to="/create-project" 
                                            className={`hover:text-indigo-600 transition-colors flex items-center gap-1 ${isActive('/create-project') ? 'text-indigo-600 font-semibold' : ''}`}
                                        >
                                            <Users size={16} /> New Project
                                        </Link>
                                        <Link 
                                            to="/create-task" 
                                            className={`hover:text-indigo-600 transition-colors flex items-center gap-1 ${isActive('/create-task') ? 'text-indigo-600 font-semibold' : ''}`}
                                        >
                                            <PlusCircle size={16} /> Assign Task
                                        </Link>
                                    </>
                                )}
                            </div>
                            <div className="flex items-center gap-4 border-l pl-4 border-gray-200">
                                <div className="text-sm">
                                    <p className="font-semibold text-gray-800 leading-none">{userInfo.name}</p>
                                    <p className="text-xs text-gray-500 mt-1">{userInfo.role}</p>
                                </div>
                                <button 
                                    onClick={handleLogout} 
                                    className="flex items-center gap-1 text-sm text-gray-600 hover:text-red-600 transition-colors p-2 rounded-md hover:bg-red-50"
                                    title="Logout"
                                >
                                    <LogOut size={18} />
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center gap-4 text-sm font-medium">
                            <Link to="/login" className="text-gray-600 hover:text-indigo-600 transition-colors">Login</Link>
                            <Link to="/signup" className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm">Sign Up</Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
