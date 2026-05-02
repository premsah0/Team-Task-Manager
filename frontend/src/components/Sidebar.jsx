import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LogOut, CheckSquare, LayoutDashboard, FolderKanban, ListTodo, PlusCircle, Users } from 'lucide-react';

const Sidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const userInfoString = localStorage.getItem('userInfo');
    const userInfo = userInfoString ? JSON.parse(userInfoString) : null;

    const handleLogout = () => {
        localStorage.removeItem('userInfo');
        navigate('/login');
    };

    const isActive = (path) => location.pathname === path;

    const linkClass = (path) =>
        `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
            isActive(path)
                ? 'bg-indigo-500/20 text-indigo-400'
                : 'text-slate-400 hover:bg-slate-700/50 hover:text-white'
        }`;

    if (!userInfo) return null;

    return (
        <aside className="w-64 bg-slate-800 border-r border-slate-700/50 flex flex-col h-screen fixed top-0 left-0 overflow-hidden">
            {/* App Branding */}
            <div className="px-5 py-5 border-b border-slate-700/50">
                <Link to="/" className="flex items-center gap-2.5 text-white">
                    <div className="bg-indigo-500 p-1.5 rounded-lg">
                        <CheckSquare size={20} />
                    </div>
                    <span className="text-lg font-bold tracking-tight">TaskManager</span>
                </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-3 py-4 space-y-1">
                {userInfo.role === 'Admin' && (
                    <Link to="/" className={linkClass('/')}>
                        <LayoutDashboard size={18} />
                        Dashboard
                    </Link>
                )}

                {userInfo.role === 'Admin' && (
                    <>
                        <Link to="/create-project" className={linkClass('/create-project')}>
                            <FolderKanban size={18} />
                            New Project
                        </Link>
                        <Link to="/create-task" className={linkClass('/create-task')}>
                            <PlusCircle size={18} />
                            Assign Task
                        </Link>
                    </>
                )}

                {userInfo.role === 'Member' && (
                    <Link to="/" className={linkClass('/')}>
                        <ListTodo size={18} />
                        My Tasks
                    </Link>
                )}
            </nav>

            {/* User Info + Logout */}
            <div className="px-3 py-4 border-t border-slate-700/50">
                <div className="flex items-center gap-3 px-3 mb-3">
                    <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 text-sm font-bold">
                        {userInfo.name?.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">{userInfo.name}</p>
                        <p className="text-xs text-slate-500">{userInfo.role}</p>
                    </div>
                </div>
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full px-4 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-all duration-200"
                >
                    <LogOut size={18} />
                    Logout
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
