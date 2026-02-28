import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    Dumbbell,
    LineChart,
    Utensils,
    Users,
    LogOut,
    Bell,
    Settings,
    Calendar,
    Heart
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { motion } from 'framer-motion';

const MainLayout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { logout, user } = useStore();

    const menuItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
        { icon: Dumbbell, label: 'Workouts', path: '/workouts' },
        { icon: LineChart, label: 'Progress', path: '/tracker' },
        { icon: Utensils, label: 'Meal Plan', path: '/meals' },
        { icon: Calendar, label: 'Schedule', path: '/schedule' },
        { icon: Heart, label: 'Recovery', path: '/recovery' },
        { icon: Users, label: 'Community', path: '/community' },
    ];

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="flex min-h-screen bg-[#0f172a] text-white">
            {/* Sidebar */}
            <aside className="w-64 glass border-r border-[rgba(255,255,255,0.05)] flex flex-col fixed h-full z-50">
                <div className="p-6">
                    <h1 className="text-2xl font-black gradient-text tracking-tighter">FitVibe</h1>
                </div>

                <nav className="flex-1 px-4 flex flex-col gap-2">
                    {menuItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive
                                    ? 'bg-primary text-white shadow-lg shadow-primary-glow'
                                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                                    }`}
                            >
                                <item.icon size={20} />
                                <span className="font-medium text-base">{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-[rgba(255,255,255,0.05)] mt-auto">
                    <div className="flex items-center gap-3 px-4 py-3 mb-4">
                        <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center font-bold">
                            {user?.name?.[0]?.toUpperCase()}
                        </div>
                        <div className="overflow-hidden">
                            <p className="font-semibold truncate">{user?.name}</p>
                            <p className="text-xs text-slate-400 truncate">{user?.email}</p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-3 w-full text-slate-400 hover:text-danger hover:bg-danger/10 rounded-xl transition-all"
                    >
                        <LogOut size={20} />
                        <span className="font-medium text-base">Sign Out</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 ml-64 p-8">
                <header className="flex justify-between items-center mb-8 h-16">
                    <div>
                        {location.pathname !== '/' && (
                            <>
                                <h2 className="text-sm text-slate-400 font-medium uppercase tracking-wider">
                                    {menuItems.find(m => m.path === location.pathname)?.label || 'Overview'}
                                </h2>
                                <h1 className="text-2xl font-bold">Manage Your Journey</h1>
                            </>
                        )}
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="hidden md:flex flex-col items-end mr-2">
                            <span className="text-sm font-bold text-white">{user?.name}</span>
                            <span className="text-[10px] font-black text-primary uppercase">Elite Member</span>
                        </div>
                        <button className="p-3 bg-slate-800/50 hover:bg-slate-800 rounded-2xl text-slate-400 hover:text-white transition-all border border-white/5">
                            <Bell size={20} />
                        </button>
                        <button className="p-3 bg-slate-800/50 hover:bg-slate-800 rounded-2xl text-slate-400 hover:text-white transition-all border border-white/5">
                            <Settings size={20} />
                        </button>
                    </div>
                </header>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <Outlet />
                </motion.div>
            </main>
        </div>
    );
};

export default MainLayout;
