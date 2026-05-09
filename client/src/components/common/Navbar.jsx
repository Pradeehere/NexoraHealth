import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout, reset } from '../../features/auth/authSlice';
import { Activity, LogOut, User } from 'lucide-react';

const Navbar = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);

    const onLogout = () => {
        dispatch(logout());
        dispatch(reset());
        navigate('/');
    };

    return (
        <nav className="glass-card flex items-center justify-between p-4 sticky top-0 z-50 rounded-none border-t-0 border-l-0 border-r-0">
            <div className="flex items-center gap-2">
                <Activity className="text-brand-cyan h-8 w-8" />
                <Link to="/" className="text-2xl font-heading font-bold text-brand-text">
                    Nexora <span className="text-brand-cyan">Health</span>
                </Link>
            </div>

            <div className="flex items-center gap-4">
                {user ? (
                    <>
                        <span className="text-brand-muted hidden sm:inline">Welcome, {user.name}</span>
                        <button onClick={onLogout} className="flex items-center gap-2 bg-brand-card hover:bg-white/10 px-4 py-2 rounded-lg transition-colors border border-brand-card hover:border-brand-danger/50 text-brand-danger">
                            <LogOut size={18} />
                            <span className="hidden sm:inline">Logout</span>
                        </button>
                    </>
                ) : (
                    <>
                        <Link to="/login" className="text-brand-text hover:text-brand-cyan transition-colors">Login</Link>
                        <Link to="/register" className="bg-brand-cyan text-brand-dark px-4 py-2 rounded-lg font-bold hover:bg-brand-cyan/80 transition-colors">
                            Register
                        </Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
