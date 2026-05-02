import React, { useState, useEffect } from 'react';
import { Calendar, User, Folder, Clock, AlertCircle, CheckSquare, ListTodo } from 'lucide-react';
import api from '../api';

const Dashboard = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const userInfoString = localStorage.getItem('userInfo');
    const userInfo = userInfoString ? JSON.parse(userInfoString) : null;

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            setError('');
            const { data } = await api.get('/tasks');
            setTasks(data);
        } catch (error) {
            console.error('Failed to fetch tasks', error);
            setError('Failed to load tasks. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (taskId, newStatus) => {
        try {
            await api.put(`/tasks/${taskId}/status`, { status: newStatus });
            // Optimistic update for better UX
            setTasks(tasks.map(t => t._id === taskId ? { ...t, status: newStatus } : t));
        } catch (error) {
            console.error('Failed to update status', error);
            fetchTasks(); // Revert on failure
        }
    };

    const isOverdue = (dueDate, status) => {
        if (!dueDate || status === 'Done') return false;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const due = new Date(dueDate);
        return due < today;
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'Done':
                return 'bg-green-500/20 text-green-400 border-green-500/30';
            case 'In Progress':
                return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
            default:
                return 'bg-slate-600/30 text-slate-400 border-slate-500/30';
        }
    };

    // Stats summary
    const totalTasks = tasks.length;
    const doneTasks = tasks.filter(t => t.status === 'Done').length;
    const inProgressTasks = tasks.filter(t => t.status === 'In Progress').length;
    const pendingTasks = tasks.filter(t => t.status === 'Pending').length;

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[50vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto py-8 px-6">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-white">
                    {userInfo?.role === 'Admin' ? 'Dashboard' : 'My Tasks'}
                </h1>
                <p className="mt-1 text-sm text-slate-400">
                    {userInfo?.role === 'Admin' 
                        ? 'Overview of your projects and tasks' 
                        : 'View and update your assigned tasks'}
                </p>
            </div>

            {/* Stats Cards */}
            {tasks.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-slate-800 rounded-lg p-4 border border-slate-700/50">
                        <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Total</p>
                        <p className="text-2xl font-bold text-white mt-1">{totalTasks}</p>
                    </div>
                    <div className="bg-slate-800 rounded-lg p-4 border border-slate-700/50">
                        <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Pending</p>
                        <p className="text-2xl font-bold text-slate-400 mt-1">{pendingTasks}</p>
                    </div>
                    <div className="bg-slate-800 rounded-lg p-4 border border-slate-700/50">
                        <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">In Progress</p>
                        <p className="text-2xl font-bold text-yellow-400 mt-1">{inProgressTasks}</p>
                    </div>
                    <div className="bg-slate-800 rounded-lg p-4 border border-slate-700/50">
                        <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Done</p>
                        <p className="text-2xl font-bold text-green-400 mt-1">{doneTasks}</p>
                    </div>
                </div>
            )}

            {error && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-lg mb-6 flex items-center gap-2">
                    <AlertCircle size={20} />
                    <p>{error}</p>
                </div>
            )}

            {tasks.length === 0 && !error ? (
                <div className="text-center py-16 bg-slate-800 rounded-xl border border-slate-700/50">
                    <ListTodo size={48} className="mx-auto text-slate-600 mb-4" />
                    <h3 className="text-lg font-medium text-white">No tasks assigned yet</h3>
                    <p className="text-slate-500 mt-1">Check back later or ask your admin to assign tasks.</p>
                </div>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {tasks.map(task => {
                        const overdue = isOverdue(task.dueDate, task.status);
                        return (
                            <div 
                                key={task._id} 
                                className={`bg-slate-800 rounded-lg shadow-md border overflow-hidden flex flex-col h-full hover:scale-[1.02] transition-all duration-200 cursor-default
                                    ${overdue ? 'border-red-500/50' : 'border-slate-700/50 hover:border-indigo-500/40'}`}
                            >
                                <div className="p-5 flex-grow">
                                    <div className="flex justify-between items-start mb-3">
                                        <h3 className={`text-base font-bold leading-tight ${overdue ? 'text-red-400' : 'text-white'}`}>
                                            {task.title}
                                        </h3>
                                        {overdue && (
                                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium bg-red-500/20 text-red-400 border border-red-500/30 shrink-0 ml-2">
                                                <Clock size={12} /> Overdue
                                            </span>
                                        )}
                                    </div>
                                    
                                    <p className="text-sm text-slate-400 mb-4 line-clamp-2">{task.description}</p>
                                    
                                    <div className="space-y-2 mt-auto">
                                        <div className="flex items-center text-sm text-slate-500">
                                            <Folder size={15} className="mr-2 text-slate-600" />
                                            <span className="font-medium text-slate-300 truncate">{task.projectId?.name || 'Unknown Project'}</span>
                                        </div>
                                        
                                        {userInfo?.role === 'Admin' && (
                                            <div className="flex items-center text-sm text-slate-500">
                                                <User size={15} className="mr-2 text-slate-600" />
                                                <span className="truncate text-slate-400">{task.assignedTo?.name || 'Unassigned'}</span>
                                            </div>
                                        )}
                                        
                                        <div className="flex items-center text-sm text-slate-500">
                                            <Calendar size={15} className="mr-2 text-slate-600" />
                                            <span className={overdue ? 'text-red-400 font-medium' : 'text-slate-400'}>
                                                {task.dueDate ? new Date(task.dueDate).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' }) : 'No deadline'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="bg-slate-800/50 p-4 border-t border-slate-700/50 flex items-center justify-between">
                                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</label>
                                    <select 
                                        value={task.status} 
                                        onChange={(e) => handleStatusUpdate(task._id, e.target.value)}
                                        className={`px-3 py-1.5 rounded-full text-xs font-bold border outline-none cursor-pointer transition-colors bg-transparent ${getStatusBadge(task.status)} hover:opacity-80`}
                                    >
                                        <option value="Pending" className="bg-slate-800 text-white">Pending</option>
                                        <option value="In Progress" className="bg-slate-800 text-white">In Progress</option>
                                        <option value="Done" className="bg-slate-800 text-white">Done</option>
                                    </select>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default Dashboard;
