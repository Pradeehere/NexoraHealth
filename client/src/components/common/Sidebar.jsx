import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { LayoutDashboard, ActivitySquare, PieChart, UserCircle, ShieldAlert } from 'lucide-react';

const Sidebar = () => {
    const { user } = useSelector((state) => state.auth);

    if (!user) return null;

    const getNavLinkClass = ({ isActive }) => {
        return `flex items-center gap-3 p-3 mb-2 rounded-lg transition-all duration-300 ${isActive
                ? 'bg-brand-cyan/10 border-l-4 border-brand-cyan text-brand-cyan'
                : 'text-brand-muted hover:bg-brand-card hover:text-brand-text border-l-4 border-transparent'
            }`;
    };

    return (
        <aside className="w-20 md:w-64 min-h-[calc(100vh-73px)] glass-card rounded-none border-t-0 border-l-0 border-b-0 p-4 transition-all duration-300">
            <nav className="flex flex-col mt-4">
                <NavLink to="/dashboard" className={getNavLinkClass}>
                    <LayoutDashboard size={24} />
                    <span className="hidden md:inline font-medium">Dashboard</span>
                </NavLink>

                <NavLink to="/tracker" className={getNavLinkClass}>
                    <ActivitySquare size={24} />
                    <span className="hidden md:inline font-medium">Health Tracker</span>
                </NavLink>

                <NavLink to="/reports" className={getNavLinkClass}>
                    <PieChart size={24} />
                    <span className="hidden md:inline font-medium">Reports</span>
                </NavLink>

                <NavLink to="/profile" className={getNavLinkClass}>
                    <UserCircle size={24} />
                    <span className="hidden md:inline font-medium">Profile</span>
                </NavLink>

                {user.role === 'admin' && (
                    <NavLink to="/admin" className={getNavLinkClass}>
                        <ShieldAlert size={24} />
                        <span className="hidden md:inline font-medium">Admin Panel</span>
                    </NavLink>
                )}
            </nav>
        </aside>
    );
};

export default Sidebar;
