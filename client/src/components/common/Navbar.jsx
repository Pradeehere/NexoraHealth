import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout, reset } from '../../features/auth/authSlice';
import { LogOut } from 'lucide-react';

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
        <nav className="bg-brand-dark flex items-center justify-between p-4 sticky top-0 z-50 border-b border-brand-gold text-white">
            <div className="flex items-center gap-2">
                <Link to="/" className="text-3xl font-cormorant font-bold text-white tracking-widest">
                    NEXORA
                </Link>
            </div>

            <div className="flex items-center gap-6 font-tenor uppercase tracking-[0.15em] text-sm">
                {user ? (
                    <>
                        <span className="hidden sm:inline">Welcome, {user.name}</span>
                        <button onClick={onLogout} className="flex items-center gap-2 px-4 py-2 border border-brand-gold hover:bg-white hover:text-black transition-colors">
                            <LogOut size={16} strokeWidth={1} />
                            <span className="hidden sm:inline">Logout</span>
                        </button>
                    </>
                ) : (
                    <>
                        <Link to="/login" className="hover:text-brand-gold transition-colors">Login</Link>
                        <Link to="/register" className="bg-white text-black px-6 py-2 hover:bg-brand-gold hover:text-white transition-colors">
                            Register
                        </Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
