import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FolderPlus, Users as UsersIcon, AlertCircle } from 'lucide-react';
import api from '../api';

const CreateProject = () => {
    const [name, setName] = useState('');
    const [users, setUsers] = useState([]);
    const [selectedMembers, setSelectedMembers] = useState([]);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const { data } = await api.get('/users');
                setUsers(data);
            } catch (err) {
                console.error('Failed to fetch users', err);
            }
        };
        fetchUsers();
    }, []);

    const handleMemberSelect = (e) => {
        const value = Array.from(e.target.selectedOptions, option => option.value);
        setSelectedMembers(value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        try {
            await api.post('/projects', { name, members: selectedMembers });
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create project. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto py-10 px-4 sm:px-6">
            <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
                <div className="bg-indigo-600 px-6 py-8 text-center sm:text-left sm:flex sm:items-center sm:justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-white flex items-center justify-center sm:justify-start gap-2">
                            <FolderPlus size={24} />
                            Create New Project
                        </h2>
                        <p className="text-indigo-100 mt-2 text-sm">Set up a workspace and invite team members</p>
                    </div>
                </div>

                <div className="p-6 sm:p-8">
                    {error && (
                        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-md mb-6 flex items-center gap-2">
                            <AlertCircle size={20} />
                            <p>{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Project Name</label>
                            <input 
                                type="text" 
                                value={name} 
                                onChange={(e) => setName(e.target.value)} 
                                required 
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                                placeholder="e.g. Website Redesign Q3"
                            />
                        </div>
                        
                        <div>
                            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                                <UsersIcon size={16} className="text-gray-500" />
                                Assign Members
                            </label>
                            <p className="text-xs text-gray-500 mb-3">Hold Ctrl (Windows) or Cmd (Mac) to select multiple members</p>
                            
                            <select 
                                multiple 
                                value={selectedMembers} 
                                onChange={handleMemberSelect} 
                                className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all h-48 bg-white shadow-sm"
                            >
                                {users.length === 0 && <option disabled>Loading users...</option>}
                                {users.map(user => (
                                    <option key={user._id} value={user._id} className="p-2 mb-1 hover:bg-indigo-50 rounded">
                                        {user.name} ({user.email}) - {user.role}
                                    </option>
                                ))}
                            </select>
                        </div>
                        
                        <div className="pt-4 border-t border-gray-100 flex justify-end gap-3">
                            <button 
                                type="button" 
                                onClick={() => navigate('/')}
                                className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button 
                                type="submit" 
                                disabled={isLoading || !name.trim()}
                                className="px-6 py-2.5 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-200 transition-all disabled:opacity-70 flex items-center gap-2"
                            >
                                {isLoading ? 'Creating...' : 'Create Project'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreateProject;
