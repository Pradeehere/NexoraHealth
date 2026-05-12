import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { LayoutDashboard, ActivitySquare, PieChart, UserCircle, ShieldAlert, Scale, Wind, ChevronLeft, ChevronRight, Heart, UtensilsCrossed } from 'lucide-react';

const Sidebar = ({ isCollapsed, setIsCollapsed }) => {
    const { user } = useSelector((state) => state.auth);

    if (!user) return null;

    const navItems = [
        { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { path: '/tracker', label: 'Tracker', icon: ActivitySquare },
        { path: '/meal-planner', label: 'Meal Planner', icon: UtensilsCrossed },
        { path: '/reports', label: 'Reports', icon: PieChart },
        { path: '/air-quality', label: 'Air Quality', icon: Wind },
        { path: '/bmi', label: 'BMI', icon: Scale },
        { path: '/profile', label: 'Profile', icon: UserCircle },
    ];

    if (user.role === 'admin') {
        navItems.push({ path: '/admin', label: 'Admin', icon: ShieldAlert });
    }

    const getNavLinkClass = ({ isActive }) =>
        `flex items-center gap-3 py-4 transition-all duration-300 font-tenor uppercase tracking-[0.12em] text-[13px]
         ${isCollapsed ? 'px-0 justify-center' : 'px-6'}
         ${isActive
            ? 'text-brand-gold border-l-[3px] border-brand-gold bg-brand-gold/5'
            : 'text-black hover:text-brand-gold border-l-[3px] border-transparent hover:bg-brand-gold/5'
        }`;


    const getMobileNavLinkClass = ({ isActive }) =>
        `flex flex-col items-center justify-center flex-1 py-1 transition-all duration-300
         ${isActive ? 'text-brand-gold' : 'text-gray-400'}`;

    const initials = user.name ? user.name.split(' ').map(n => n[0]).join('') : '?';

    return (
        <>
            {/* Desktop Sidebar */}
            <aside
                className={`hidden md:flex flex-col fixed top-0 left-0 h-screen bg-white border-r border-black z-40 overflow-y-auto overflow-x-hidden transition-all duration-300 ${isCollapsed ? 'w-18 w-[72px]' : 'w-64'
                    }`}
            >
                {/* Logo Section */}
                <div className={`p-8 sticky top-0 bg-white z-10 w-full mb-4 flex items-center ${isCollapsed ? 'justify-center' : 'justify-start'}`}>
                    {isCollapsed ? (
                        <Heart className="text-brand-gold animate-pulse" size={24} />
                    ) : (
                        <div className="w-full">
                            <h1 className="text-2xl font-tenor tracking-widest text-black truncate">NEXORA HEALTH</h1>
                            <div className="h-[1px] w-full bg-brand-gold mt-2 opacity-50"></div>
                        </div>
                    )}
                </div>

                {/* Nav Links */}
                <nav className="flex-1 flex flex-col pt-4">
                    {navItems.map((item) => (
                        <NavLink key={item.path} to={item.path} className={getNavLinkClass} title={isCollapsed ? item.label : ''}>
                            <item.icon size={20} strokeWidth={1.5} />
                            {!isCollapsed && <span className="truncate">{item.label}</span>}
                        </NavLink>
                    ))}
                </nav>

                {/* Toggle Button */}
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="flex items-center justify-center py-4 border-t border-brand-gold/20 text-brand-gold hover:bg-brand-gold/5 transition-colors cursor-pointer"
                    title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
                >
                    {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
                </button>

                {/* User Info Section */}
                <div className={`p-6 border-t border-gray-100 flex items-center gap-4 bg-gray-50/50 ${isCollapsed ? 'justify-center' : ''}`}>
                    <div className="w-10 h-10 min-w-10 rounded-full bg-black flex items-center justify-center text-white text-xs font-bold border border-brand-gold">
                        {initials}
                    </div>
                    {!isCollapsed && (
                        <div className="flex flex-col min-w-0">
                            <p className="text-xs font-bold text-black truncate uppercase tracking-wider">{user.name}</p>
                            <span className="text-[10px] text-brand-gold font-tenor uppercase tracking-widest bg-brand-gold/10 px-2 py-0.5 rounded-full w-fit">
                                {user.role}
                            </span>
                        </div>
                    )}
                </div>
            </aside>

            {/* Mobile Bottom Tab Bar */}
            <nav className="md:hidden fixed bottom-0 left-0 w-full h-16 bg-white border-t border-black z-50 flex items-center justify-around px-2">
                {navItems.slice(0, 5).map((item) => (
                    <NavLink key={item.path} to={item.path} className={getMobileNavLinkClass}>
                        <item.icon size={22} strokeWidth={1.5} />
                        <span className="text-[10px] font-tenor uppercase tracking-widest mt-1">{item.label}</span>
                    </NavLink>
                ))}
            </nav>
        </>
    );
};

export default Sidebar;
