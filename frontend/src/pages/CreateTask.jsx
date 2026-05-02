import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, FileText, User, Folder, Calendar, AlertCircle } from 'lucide-react';
import api from '../api';

const CreateTask = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [assignedTo, setAssignedTo] = useState('');
    const [projectId, setProjectId] = useState('');
    const [dueDate, setDueDate] = useState('');
    
    const [projects, setProjects] = useState([]);
    const [users, setUsers] = useState([]);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const projectsRes = await api.get('/projects');
                setProjects(projectsRes.data);
                if (projectsRes.data.length > 0) {
                    setProjectId(projectsRes.data[0]._id);
                } else {
                    setIsFetching(false);
                }
            } catch (err) {
                console.error(err);
                setError('Failed to load projects. Please try again.');
                setIsFetching(false);
            }
        };
        fetchProjects();
    }, []);

    useEffect(() => {
        const fetchUsers = async () => {
            if (!projectId && projects.length > 0) return;
            try {
                // Fetch users based on selected project, or all users if no project
                const query = projectId ? `?projectId=${projectId}` : '';
                const usersRes = await api.get(`/users${query}`);
                setUsers(usersRes.data);
                
                // Clear assignedTo if the selected user is no longer in the list
                setAssignedTo(prev => {
                    if (prev && !usersRes.data.some(u => u._id === prev)) return '';
                    return prev;
                });
            } catch (err) {
                console.error(err);
                setError('Failed to load users. Please try again.');
            } finally {
                setIsFetching(false);
            }
        };
        fetchUsers();
    }, [projectId, projects.length]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!projectId) {
            setError('Please select a project');
            return;
        }

        setIsLoading(true);
        setError('');
        try {
            await api.post('/tasks', { 
                title, 
                description, 
                assignedTo: assignedTo || null, 
                projectId, 
                dueDate 
            });
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create task');
        } finally {
            setIsLoading(false);
        }
    };

    if (isFetching) {
        return (
            <div className="flex justify-center items-center min-h-[50vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
            </div>
        );
    }

    if (projects.length === 0) {
        return (
            <div className="max-w-2xl mx-auto py-10 px-4 text-center">
                <div className="bg-slate-800 p-8 rounded-xl border border-slate-700/50">
                    <Folder className="mx-auto h-12 w-12 text-slate-600 mb-4" />
                    <h2 className="text-xl font-bold text-white mb-2">No Projects Found</h2>
                    <p className="text-slate-400 mb-6">You need to create a project before you can assign tasks.</p>
                    <button 
                        onClick={() => navigate('/create-project')}
                        className="bg-indigo-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-600 transition-colors"
                    >
                        Create Project
                    </button>
                </div>
            </div>
        );
    }

    const inputClass = "w-full px-4 py-2.5 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all";

    return (
        <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6">
            <div className="bg-slate-800 rounded-xl shadow-lg border border-slate-700/50 overflow-hidden">
                <div className="border-b border-slate-700/50 px-8 py-6">
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                        <PlusCircle className="text-indigo-400" />
                        Assign New Task
                    </h2>
                    <p className="text-slate-400 mt-1 text-sm">Create a task and assign it to a team member</p>
                </div>

                <div className="p-8">
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-lg mb-6 flex items-center gap-2">
                            <AlertCircle size={20} />
                            <p>{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-semibold text-slate-300 mb-2 flex items-center gap-2">
                                    <FileText size={16} className="text-slate-500" /> Task Title
                                </label>
                                <input 
                                    type="text" 
                                    value={title} 
                                    onChange={(e) => setTitle(e.target.value)} 
                                    required 
                                    className={inputClass}
                                    placeholder="e.g. Design new landing page"
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-semibold text-slate-300 mb-2">Description</label>
                                <textarea 
                                    value={description} 
                                    onChange={(e) => setDescription(e.target.value)} 
                                    className={`${inputClass} resize-y min-h-[120px]`}
                                    placeholder="Provide details about what needs to be done..."
                                ></textarea>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-300 mb-2 flex items-center gap-2">
                                    <Folder size={16} className="text-slate-500" /> Project
                                </label>
                                <select 
                                    value={projectId} 
                                    onChange={(e) => setProjectId(e.target.value)} 
                                    required 
                                    className={inputClass}
                                >
                                    {projects.map(project => (
                                        <option key={project._id} value={project._id} className="bg-slate-700">{project.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-300 mb-2 flex items-center gap-2">
                                    <User size={16} className="text-slate-500" /> Assign To
                                </label>
                                <select 
                                    value={assignedTo} 
                                    onChange={(e) => setAssignedTo(e.target.value)} 
                                    className={inputClass}
                                >
                                    <option value="" className="bg-slate-700">-- Leave Unassigned --</option>
                                    {users.map(user => (
                                        <option key={user._id} value={user._id} className="bg-slate-700">{user.name} ({user.role})</option>
                                    ))}
                                </select>
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-semibold text-slate-300 mb-2 flex items-center gap-2">
                                    <Calendar size={16} className="text-slate-500" /> Due Date
                                </label>
                                <input 
                                    type="date" 
                                    value={dueDate} 
                                    onChange={(e) => setDueDate(e.target.value)} 
                                    className={`${inputClass} md:w-1/2`}
                                />
                            </div>
                        </div>

                        <div className="pt-6 border-t border-slate-700/50 flex justify-end gap-3 mt-8">
                            <button 
                                type="button" 
                                onClick={() => navigate('/')}
                                className="px-5 py-2.5 text-sm font-medium text-slate-400 bg-slate-700/50 border border-slate-600 rounded-lg hover:bg-slate-700 transition-colors"
                            >
                                Cancel
                            </button>
                            <button 
                                type="submit" 
                                disabled={isLoading || !title.trim()}
                                className="px-6 py-2.5 text-sm font-medium text-white bg-indigo-500 rounded-lg hover:bg-indigo-600 focus:ring-4 focus:ring-indigo-500/30 transition-all disabled:opacity-70"
                            >
                                {isLoading ? 'Creating Task...' : 'Create Task'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreateTask;
