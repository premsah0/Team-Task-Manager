import React, { useState, useEffect } from 'react';
import { Calendar, User, Folder, Clock, AlertCircle } from 'lucide-react';
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
        today.setHours(0, 0, 0, 0); // Compare dates only
        const due = new Date(dueDate);
        return due < today;
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'Done':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'In Progress':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[50vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-end mb-8 border-b pb-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">My Tasks</h1>
                    <p className="mt-1 text-sm text-gray-500">Manage and track your assigned tasks</p>
                </div>
            </div>

            {error && (
                <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-md mb-6 flex items-center gap-2">
                    <AlertCircle size={20} />
                    <p>{error}</p>
                </div>
            )}

            {tasks.length === 0 && !error ? (
                <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-100">
                    <CheckSquare size={48} className="mx-auto text-gray-300 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900">No tasks assigned yet</h3>
                    <p className="text-gray-500 mt-1">Check back later or ask your admin to assign tasks.</p>
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                    {tasks.map(task => {
                        const overdue = isOverdue(task.dueDate, task.status);
                        return (
                            <div 
                                key={task._id} 
                                className={`bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border-l-4 overflow-hidden flex flex-col h-full
                                    ${overdue ? 'border-red-500 ring-1 ring-red-100' : 'border-indigo-500 border border-gray-100'}`}
                            >
                                <div className="p-5 flex-grow">
                                    <div className="flex justify-between items-start mb-3">
                                        <h3 className={`text-lg font-bold leading-tight ${overdue ? 'text-red-700' : 'text-gray-900'}`}>
                                            {task.title}
                                        </h3>
                                        {overdue && (
                                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium bg-red-100 text-red-800">
                                                <Clock size={12} /> Overdue
                                            </span>
                                        )}
                                    </div>
                                    
                                    <p className="text-sm text-gray-600 mb-5 line-clamp-3">{task.description}</p>
                                    
                                    <div className="space-y-2 mt-auto">
                                        <div className="flex items-center text-sm text-gray-500">
                                            <Folder size={16} className="mr-2 text-gray-400" />
                                            <span className="font-medium text-gray-700 truncate">{task.projectId?.name || 'Unknown Project'}</span>
                                        </div>
                                        
                                        {userInfo?.role === 'Admin' && (
                                            <div className="flex items-center text-sm text-gray-500">
                                                <User size={16} className="mr-2 text-gray-400" />
                                                <span className="truncate">{task.assignedTo?.name || 'Unassigned'}</span>
                                            </div>
                                        )}
                                        
                                        <div className="flex items-center text-sm text-gray-500">
                                            <Calendar size={16} className="mr-2 text-gray-400" />
                                            <span className={overdue ? 'text-red-600 font-medium' : ''}>
                                                {task.dueDate ? new Date(task.dueDate).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' }) : 'No deadline'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="bg-gray-50 p-4 border-t border-gray-100 flex items-center justify-between">
                                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</label>
                                    <select 
                                        value={task.status} 
                                        onChange={(e) => handleStatusUpdate(task._id, e.target.value)}
                                        className={`px-3 py-1.5 rounded-full text-xs font-bold border outline-none cursor-pointer transition-colors ${getStatusBadge(task.status)} hover:opacity-80`}
                                    >
                                        <option value="Pending">Pending</option>
                                        <option value="In Progress">In Progress</option>
                                        <option value="Done">Done</option>
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

// Need to import CheckSquare for the empty state
import { CheckSquare } from 'lucide-react';

export default Dashboard;
