import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { Users, Activity, Target, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import LoadingSkeleton from '../components/common/LoadingSkeleton';
import { Navigate } from 'react-router-dom';

const AdminPanel = () => {
    const { user } = useSelector(state => state.auth);
    const [stats, setStats] = useState(null);
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    if (user?.role !== 'admin') {
        return <Navigate to="/dashboard" replace />;
    }

    const fetchData = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const [statsRes, usersRes] = await Promise.all([
                axios.get('/api/admin/stats', config),
                axios.get('/api/admin/users', config)
            ]);
            setStats(statsRes.data);
            setUsers(usersRes.data);
            setIsLoading(false);
        } catch (error) {
            toast.error("Error loading admin data");
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [user]);

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this user?")) {
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                await axios.delete(`/api/admin/users/${id}`, config);
                setUsers(users.filter(u => u._id !== id));
                toast.success('User deleted');
            } catch (error) {
                toast.error('Deletion failed');
            }
        }
    };

    if (isLoading) return <LoadingSkeleton count={4} className="h-40" />;

    return (
        <div className="space-y-6 animate-fade-in-up">
            <h1 className="text-3xl font-heading font-bold mb-6 text-brand-green">Admin Dashboard</h1>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="glass-card p-6 border-l-4 border-brand-cyan">
                    <Users className="text-brand-cyan mb-2" />
                    <h4 className="text-brand-muted text-sm">Total Users</h4>
                    <p className="text-2xl font-bold">{stats?.totalUsers || 0}</p>
                </div>
                <div className="glass-card p-6 border-l-4 border-purple-400">
                    <Activity className="text-purple-400 mb-2" />
                    <h4 className="text-brand-muted text-sm">Total Records</h4>
                    <p className="text-2xl font-bold">{stats?.totalRecords || 0}</p>
                </div>
                <div className="glass-card p-6 border-l-4 border-brand-warning">
                    <Activity className="text-brand-warning mb-2" />
                    <h4 className="text-brand-muted text-sm">Active Today</h4>
                    <p className="text-2xl font-bold">{stats?.activeToday || 0}</p>
                </div>
                <div className="glass-card p-6 border-l-4 border-brand-green">
                    <Target className="text-brand-green mb-2" />
                    <h4 className="text-brand-muted text-sm">Goals Created</h4>
                    <p className="text-2xl font-bold">{stats?.goalsCreated || 0}</p>
                </div>
            </div>

            <div className="glass-card p-6">
                <h3 className="font-heading font-bold mb-4">User Management</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-brand-card text-brand-muted text-sm">
                                <th className="pb-2">Name</th>
                                <th className="pb-2">Email</th>
                                <th className="pb-2">Role</th>
                                <th className="pb-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(u => (
                                <tr key={u._id} className="border-b border-brand-card/50 hover:bg-brand-card/50 transition-colors">
                                    <td className="py-3 font-medium">{u.name}</td>
                                    <td>{u.email}</td>
                                    <td>
                                        <span className={`px-2 py-1 rounded text-xs ${u.role === 'admin' ? 'bg-brand-warning/20 text-brand-warning' : 'bg-brand-cyan/20 text-brand-cyan'}`}>
                                            {u.role}
                                        </span>
                                    </td>
                                    <td>
                                        {u.role !== 'admin' && (
                                            <button onClick={() => handleDelete(u._id)} className="text-brand-danger hover:text-red-400 p-1 rounded hover:bg-red-400/10 transition-colors">
                                                <Trash2 size={18} />
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminPanel;
