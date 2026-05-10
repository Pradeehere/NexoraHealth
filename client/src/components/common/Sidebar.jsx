import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { LayoutDashboard, ActivitySquare, PieChart, UserCircle, ShieldAlert, Scale, ChevronLeft, ChevronRight } from 'lucide-react';

const Sidebar = () => {
    const { user } = useSelector((state) => state.auth);
    const [collapsed, setCollapsed] = useState(false);

    if (!user) return null;

    const getNavLinkClass = ({ isActive }) =>
        `flex flex-col md:flex-row items-center ${collapsed ? 'justify-center px-0' : 'justify-center md:justify-start px-4'} gap-1 md:gap-3 py-4 transition-all duration-200 font-tenor uppercase tracking-[0.15em] text-[10px] md:text-sm flex-1 md:flex-none
         ${isActive
            ? 'bg-brand-gold/10 text-brand-gold md:border-l-2 border-t-2 md:border-t-0 border-brand-gold'
            : 'text-[#888] hover:bg-brand-gold/5 hover:text-brand-gold md:border-l-2 border-t-2 md:border-t-0 border-transparent'
        }`;

    return (
        <aside
            className={`
                fixed bottom-0 left-0 w-full h-16
                md:relative md:bottom-auto md:left-auto
                md:min-h-[calc(100vh-73px)]
                bg-brand-dark border-t md:border-t-0 md:border-r border-brand-gold text-white
                transition-all duration-300 z-50
                ${collapsed ? 'md:w-16' : 'md:w-64'}
            `}
        >
            {/* Collapse toggle — desktop only, inside the sidebar at the bottom */}
            <div className="hidden md:flex justify-end p-2 border-b border-white/5">
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="flex items-center justify-center w-7 h-7 bg-black border border-brand-gold text-brand-gold hover:bg-brand-gold hover:text-black transition-colors"
                    title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                >
                    {collapsed
                        ? <ChevronRight size={13} strokeWidth={2} />
                        : <ChevronLeft size={13} strokeWidth={2} />
                    }
                </button>
            </div>

            <nav className="flex flex-row md:flex-col justify-around md:justify-start items-stretch h-[calc(100%-41px)] md:h-auto md:mt-4">
                <NavLink to="/dashboard" className={getNavLinkClass} title="Dashboard">
                    <LayoutDashboard size={20} strokeWidth={1} />
                    {!collapsed && <span className="hidden md:inline">Dashboard</span>}
                </NavLink>

                <NavLink to="/tracker" className={getNavLinkClass} title="Tracker">
                    <ActivitySquare size={20} strokeWidth={1} />
                    {!collapsed && <span className="hidden md:inline">Tracker</span>}
                </NavLink>

                <NavLink to="/reports" className={getNavLinkClass} title="Reports">
                    <PieChart size={20} strokeWidth={1} />
                    {!collapsed && <span className="hidden md:inline">Reports</span>}
                </NavLink>

                <NavLink to="/bmi" className={getNavLinkClass} title="BMI Calculator">
                    <Scale size={20} strokeWidth={1} />
                    {!collapsed && <span className="hidden md:inline">BMI</span>}
                </NavLink>

                <NavLink to="/profile" className={getNavLinkClass} title="Profile">
                    <UserCircle size={20} strokeWidth={1} />
                    {!collapsed && <span className="hidden md:inline">Profile</span>}
                </NavLink>

                {user.role === 'admin' && (
                    <NavLink to="/admin" className={getNavLinkClass} title="Admin">
                        <ShieldAlert size={20} strokeWidth={1} />
                        {!collapsed && <span className="hidden md:inline">Admin</span>}
                    </NavLink>
                )}
            </nav>
        </aside>
    );
};

export default Sidebar;
