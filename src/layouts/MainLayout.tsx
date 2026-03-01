import { useState, useEffect } from 'react';
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
    Heart,
    Menu,
    X
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { motion, AnimatePresence } from 'framer-motion';

const MainLayout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { logout, user } = useStore();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Close menu when route changes
    useEffect(() => {
        setIsMenuOpen(false);
    }, [location.pathname]);

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

    const SidebarContent = () => (
        <>
            <div className="p-6 flex items-center justify-between">
                <h1 className="text-2xl font-black gradient-text tracking-tighter m-0">FitVibe</h1>
                <button
                    onClick={() => setIsMenuOpen(false)}
                    className="lg:hidden p-2 text-slate-400"
                >
                    <X size={20} />
                </button>
            </div>

            <nav className="flex-1 px-4 flex flex-col gap-2 overflow-y-auto">
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
                <div className="flex items-center gap-3 px-4 py-3 mb-4 bg-slate-800/20 rounded-2xl">
                    <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center font-bold shrink-0">
                        {user?.name?.[0]?.toUpperCase()}
                    </div>
                    <div className="overflow-hidden">
                        <p className="font-semibold truncate text-sm m-0">{user?.name}</p>
                        <p className="text-[10px] text-slate-400 truncate m-0">{user?.email}</p>
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
        </>
    );

    return (
        <div className="flex min-h-screen bg-[#0f172a] text-white overflow-x-hidden">
            {/* Mobile Toggle Button */}
            <div className="lg:hidden fixed top-6 left-6 z-[60]">
                {!isMenuOpen && (
                    <motion.button
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        onClick={() => setIsMenuOpen(true)}
                        className="p-3 bg-primary rounded-2xl text-white shadow-lg shadow-primary-glow border border-primary/50"
                    >
                        <Menu size={24} />
                    </motion.button>
                )}
            </div>

            {/* Mobile Sidebar Overlay */}
            <AnimatePresence>
                {isMenuOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMenuOpen(false)}
                            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 lg:hidden"
                        />
                        <motion.aside
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="w-64 glass border-r border-[rgba(255,255,255,0.05)] flex flex-col fixed h-full z-50 lg:hidden"
                        >
                            <SidebarContent />
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>

            {/* Desktop Sidebar */}
            <aside className="w-64 glass border-r border-[rgba(255,255,255,0.05)] flex-col fixed h-full z-50 hidden lg:flex">
                <SidebarContent />
            </aside>

            {/* Main Content */}
            <main className="flex-1 lg:ml-64 p-4 md:p-8 w-full max-w-full overflow-x-hidden">
                <header className="flex justify-between items-center mb-8 h-16 pt-2 lg:pt-0">
                    <div className="pl-16 lg:pl-0">
                        {location.pathname !== '/' ? (
                            <>
                                <h2 className="text-[10px] md:text-xs text-slate-400 font-bold uppercase tracking-widest m-0">
                                    {menuItems.find(m => m.path === location.pathname)?.label || 'Overview'}
                                </h2>
                                <h1 className="text-lg md:text-2xl font-bold m-0 border-none">Manage Journey</h1>
                            </>
                        ) : (
                            <div className="lg:hidden">
                                <h1 className="text-lg font-black gradient-text tracking-tighter m-0">FitVibe</h1>
                            </div>
                        )}
                    </div>

                    <div className="flex items-center gap-2 md:gap-4">
                        <div className="hidden sm:flex flex-col items-end mr-2 text-right">
                            <span className="text-xs md:text-sm font-bold text-white leading-none mb-1">{user?.name}</span>
                            <span className="text-[8px] md:text-[10px] font-black text-primary uppercase tracking-tighter">Elite Member</span>
                        </div>
                        <button className="p-2 md:p-3 bg-slate-800/50 hover:bg-slate-800 rounded-xl md:rounded-2xl text-slate-400 hover:text-white transition-all border border-white/5">
                            <Bell size={18} />
                        </button>
                        <button className="p-2 md:p-3 bg-slate-800/50 hover:bg-slate-800 rounded-xl md:rounded-2xl text-slate-400 hover:text-white transition-all border border-white/5">
                            <Settings size={18} />
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
