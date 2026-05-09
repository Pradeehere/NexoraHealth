import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { LogOut } from 'lucide-react';
import { logout, reset } from '../features/auth/authSlice';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
    const { user } = useSelector(state => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const onLogout = () => {
        dispatch(logout());
        dispatch(reset());
        navigate('/');
    };

    const initials = user?.name ? user.name.split(' ').map(n => n[0]).join('') : '?';

    return (
        <div className="space-y-6 animate-fade-in-up max-w-4xl mx-auto">
            <h1 className="text-3xl font-heading font-bold mb-6">User Profile</h1>

            <div className="glass-card p-8 flex flex-col md:flex-row gap-8 items-center md:items-start">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-32 h-32 rounded-full bg-brand-cyan flex items-center justify-center text-4xl font-bold text-brand-dark">
                        {initials}
                    </div>
                </div>

                <div className="flex-1 space-y-4 text-center md:text-left">
                    <div>
                        <h2 className="text-2xl font-bold text-brand-text">{user?.name}</h2>
                        <p className="text-brand-muted">{user?.email}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-brand-card">
                        <div>
                            <span className="text-sm text-brand-muted block">Role</span>
                            <span className="capitalize font-medium">{user?.role}</span>
                        </div>
                        <div>
                            <span className="text-sm text-brand-muted block">Height</span>
                            <span className="font-medium">{user?.height || 'N/A'} cm</span>
                        </div>
                        <div>
                            <span className="text-sm text-brand-muted block">Weight</span>
                            <span className="font-medium">{user?.weight || 'N/A'} kg</span>
                        </div>
                        <div>
                            <span className="text-sm text-brand-muted block">Age</span>
                            <span className="font-medium">{user?.age || 'N/A'}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="glass-card p-6 flex justify-end">
                <button onClick={onLogout} className="flex items-center gap-2 bg-brand-danger/20 text-brand-danger px-6 py-3 rounded-lg hover:bg-brand-danger/30 transition-colors font-bold">
                    <LogOut size={20} />
                    Logout
                </button>
            </div>
        </div>
    );
};

export default Profile;
