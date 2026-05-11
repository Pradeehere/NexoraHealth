import React from 'react';
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
        <div className="space-y-8 animate-fade-in-up pb-16">
            <header className="bg-white border-b border-black pb-4">
                <h1 className="text-4xl md:text-5xl font-jost font-medium text-black tracking-tight">
                    User Profile
                </h1>
            </header>

            {/* Profile Card */}
            <div className="bg-white border border-black p-10 flex flex-col md:flex-row gap-12 items-center md:items-start max-w-4xl mx-auto">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-32 h-32 bg-black flex items-center justify-center text-5xl font-cormorant font-bold text-white border border-brand-gold p-1">
                        <div className="w-full h-full border border-brand-gold flex items-center justify-center rounded-sm">
                            {initials}
                        </div>
                    </div>
                </div>

                <div className="flex-1 space-y-8 text-center md:text-left font-jost w-full">
                    <div>
                        <h2 className="text-4xl font-cormorant font-bold text-black uppercase tracking-wide">{user?.name}</h2>
                        <p className="text-[#555] font-tenor text-sm tracking-widest mt-2">{user?.email}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-8 pt-8 border-t border-black">
                        <div>
                            <span className="font-tenor uppercase tracking-[0.2em] text-xs text-brand-gold block mb-2">Role</span>
                            <span className="capitalize font-bold text-lg">{user?.role}</span>
                        </div>
                        <div>
                            <span className="font-tenor uppercase tracking-[0.2em] text-xs text-brand-gold block mb-2">Height</span>
                            <span className="font-bold text-lg">{user?.height || 'N/A'} cm</span>
                        </div>
                        <div>
                            <span className="font-tenor uppercase tracking-[0.2em] text-xs text-brand-gold block mb-2">Weight</span>
                            <span className="font-bold text-lg">{user?.weight || 'N/A'} kg</span>
                        </div>
                        <div>
                            <span className="font-tenor uppercase tracking-[0.2em] text-xs text-brand-gold block mb-2">Age</span>
                            <span className="font-bold text-lg">{user?.age || 'N/A'}</span>
                        </div>
                    </div>

                    <div className="pt-8 flex justify-center md:justify-start">
                        <button onClick={onLogout} className="flex items-center gap-4 border border-black text-black px-10 py-3 hover:bg-black hover:text-white transition-colors font-tenor uppercase tracking-widest text-xs">
                            <LogOut size={16} strokeWidth={1} />
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
