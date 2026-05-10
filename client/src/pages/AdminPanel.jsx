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
        <div className="space-y-8 animate-fade-in-up pb-12">
            <header className="bg-white border-b border-black pb-4">
                <h1 className="text-4xl md:text-5xl font-cormorant italic font-bold text-black uppercase tracking-wide">
                    Admin Dashboard
                </h1>
            </header>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: "Total Users", value: stats?.totalUsers || 0, icon: Users },
                    { label: "Total Records", value: stats?.totalRecords || 0, icon: Activity },
                    { label: "Active Today", value: stats?.activeToday || 0, icon: Activity },
                    { label: "Goals Created", value: stats?.goalsCreated || 0, icon: Target }
                ].map((stat, i) => (
                    <div key={i} className="bg-white border border-black p-6 flex flex-col relative group hover:bg-black transition-colors duration-300">
                        <div className="flex justify-between items-start mb-6">
                            <h3 className="font-tenor uppercase tracking-[0.2em] text-xs text-brand-gold">{stat.label}</h3>
                            <stat.icon className="text-black group-hover:text-white transition-colors w-5 h-5" strokeWidth={1} />
                        </div>
                        <p className="font-cormorant font-bold text-5xl text-black group-hover:text-white transition-colors">{stat.value}</p>

                        <div className="absolute bottom-0 left-0 w-full h-[1px] bg-brand-gold"></div>
                    </div>
                ))}
            </div>

            <div className="bg-white border border-black p-8">
                <h3 className="font-tenor uppercase tracking-widest text-lg mb-8 text-black">User Management</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-left font-jost">
                        <thead>
                            <tr className="border-b border-black text-[#555] text-xs font-tenor uppercase tracking-widest">
                                <th className="pb-4 font-normal">Name</th>
                                <th className="pb-4 font-normal">Email</th>
                                <th className="pb-4 font-normal">Role</th>
                                <th className="pb-4 font-normal">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(u => (
                                <tr key={u._id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                    <td className="py-4 font-bold text-black">{u.name}</td>
                                    <td className="text-[#555]">{u.email}</td>
                                    <td>
                                        <span className={`px-3 py-1 font-tenor text-[10px] tracking-widest uppercase border ${u.role === 'admin' ? 'border-brand-gold text-brand-gold' : 'border-black text-black'}`}>
                                            {u.role}
                                        </span>
                                    </td>
                                    <td>
                                        {u.role !== 'admin' && (
                                            <button onClick={() => handleDelete(u._id)} className="text-red-500 hover:text-black transition-colors p-2">
                                                <Trash2 size={18} strokeWidth={1} />
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
