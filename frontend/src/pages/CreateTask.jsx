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
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (projects.length === 0) {
        return (
            <div className="max-w-2xl mx-auto py-10 px-4 text-center">
                <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
                    <Folder className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <h2 className="text-xl font-bold text-gray-900 mb-2">No Projects Found</h2>
                    <p className="text-gray-600 mb-6">You need to create a project before you can assign tasks.</p>
                    <button 
                        onClick={() => navigate('/create-project')}
                        className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
                    >
                        Create Project
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="border-b border-gray-100 px-8 py-6 bg-gray-50">
                    <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                        <PlusCircle className="text-indigo-600" />
                        Assign New Task
                    </h2>
                    <p className="text-gray-500 mt-1 text-sm">Create a task and assign it to a team member</p>
                </div>

                <div className="p-8">
                    {error && (
                        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-md mb-6 flex items-center gap-2">
                            <AlertCircle size={20} />
                            <p>{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                                    <FileText size={16} className="text-gray-400" /> Task Title
                                </label>
                                <input 
                                    type="text" 
                                    value={title} 
                                    onChange={(e) => setTitle(e.target.value)} 
                                    required 
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                                    placeholder="e.g. Design new landing page"
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                                <textarea 
                                    value={description} 
                                    onChange={(e) => setDescription(e.target.value)} 
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all resize-y min-h-[120px]"
                                    placeholder="Provide details about what needs to be done..."
                                ></textarea>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                                    <Folder size={16} className="text-gray-400" /> Project
                                </label>
                                <select 
                                    value={projectId} 
                                    onChange={(e) => setProjectId(e.target.value)} 
                                    required 
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all bg-white"
                                >
                                    {projects.map(project => (
                                        <option key={project._id} value={project._id}>{project.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                                    <User size={16} className="text-gray-400" /> Assign To
                                </label>
                                <select 
                                    value={assignedTo} 
                                    onChange={(e) => setAssignedTo(e.target.value)} 
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all bg-white"
                                >
                                    <option value="">-- Leave Unassigned --</option>
                                    {users.map(user => (
                                        <option key={user._id} value={user._id}>{user.name} ({user.role})</option>
                                    ))}
                                </select>
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                                    <Calendar size={16} className="text-gray-400" /> Due Date
                                </label>
                                <input 
                                    type="date" 
                                    value={dueDate} 
                                    onChange={(e) => setDueDate(e.target.value)} 
                                    className="w-full md:w-1/2 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-gray-700"
                                />
                            </div>
                        </div>

                        <div className="pt-6 border-t border-gray-100 flex justify-end gap-3 mt-8">
                            <button 
                                type="button" 
                                onClick={() => navigate('/')}
                                className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button 
                                type="submit" 
                                disabled={isLoading || !title.trim()}
                                className="px-6 py-2.5 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-200 transition-all disabled:opacity-70"
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
