import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const LandingNavbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();

    const navLinks = [
        { label: 'Login', path: '/login', type: 'outline' },
        { label: 'Register', path: '/register', type: 'filled' },
    ];

    return (
        <nav className="fixed top-0 left-0 w-full z-50 h-16 bg-[#000] flex items-center justify-between px-8 border-b border-white/10">
            {/* Logo */}
            <Link to="/" className="font-cormorant italic font-bold text-2xl text-white tracking-widest">
                NEXORA HEALTH
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-6">
                <Link
                    to="/login"
                    className="px-8 py-2 border border-white text-white font-tenor text-[10px] uppercase tracking-[0.2em] hover:bg-white hover:text-black transition-all duration-300"
                >
                    Login
                </Link>
                <Link
                    to="/register"
                    className="px-8 py-2 bg-white text-black font-tenor text-[10px] uppercase tracking-[0.2em] border border-white hover:bg-brand-gold hover:border-brand-gold hover:text-white transition-all duration-300"
                >
                    Register
                </Link>
            </div>

            {/* Mobile Menu Toggle */}
            <button
                className="md:hidden text-white hover:text-brand-gold transition-colors"
                onClick={() => setIsOpen(!isOpen)}
            >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Mobile Dropdown */}
            {isOpen && (
                <div className="absolute top-16 left-0 w-full bg-black border-b border-white/10 py-6 flex flex-col items-center gap-6 animate-fade-in md:hidden">
                    <Link
                        to="/login"
                        className="font-tenor text-xs uppercase tracking-[0.2em] text-white hover:text-brand-gold"
                        onClick={() => setIsOpen(false)}
                    >
                        Login
                    </Link>
                    <Link
                        to="/register"
                        className="px-10 py-3 bg-white text-black font-tenor text-xs uppercase tracking-[0.2em] hover:bg-brand-gold hover:text-white transition-all duration-300"
                        onClick={() => setIsOpen(false)}
                    >
                        Register
                    </Link>
                </div>
            )}
        </nav>
    );
};

export default LandingNavbar;
