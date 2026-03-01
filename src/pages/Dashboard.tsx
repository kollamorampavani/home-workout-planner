import { useEffect, useMemo } from 'react';
import { useStore } from '../store/useStore';
import { routines } from '../data/workouts';
import { Link } from 'react-router-dom';
import {
    Play,
    Flame,
    Timer,
    TrendingUp,
    ChevronRight,
    Dumbbell,
    Trophy,
    Target,
    Zap,
    Plus,
    Star,
    Users,
    Watch,
    Bluetooth
} from 'lucide-react';
import {
    AreaChart,
    Area,
    ResponsiveContainer
} from 'recharts';
import { motion } from 'framer-motion';

const Dashboard = () => {
    const { user, sessions, enrolledWorkouts, fetchProfile, fetchHistory, fetchEnrolled, isLoading } = useStore();

    useEffect(() => {
        fetchProfile();
        fetchHistory();
        fetchEnrolled();
    }, [fetchProfile, fetchHistory, fetchEnrolled]);

    const greeting = useMemo(() => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good Morning';
        if (hour < 18) return 'Good Afternoon';
        return 'Good Evening';
    }, []);

    const recommendation = routines.find(r => r.goal === user?.goal) || routines[0];

    // Stats calculation
    const totalWorkoutTime = (sessions || []).reduce((acc, s) => acc + (Number(s.duration) || 0), 0);
    const totalCalories = (sessions || []).reduce((acc, s) => acc + (Number(s.caloriesBurned) || 0), 0);

    const chartData = (sessions || []).slice(0, 7).reverse().map(s => ({
        name: s.date ? new Date(s.date).toLocaleDateString(undefined, { weekday: 'short' }) : '---',
        calories: Number(s.caloriesBurned) || 0
    }));

    if (isLoading && !user) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 border-4 border-primary/20 rounded-full animate-spin border-t-primary" />
                    <p className="text-slate-400 font-medium animate-pulse">Building your dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-10 pb-10">
            {/* Personalized Hero */}
            <header className="relative py-6 md:py-10 px-4 md:px-8 rounded-2xl md:rounded-[2rem] overflow-hidden bg-gradient-to-br from-slate-900 via-slate-900 to-primary/20 border border-white/5 shadow-2xl">
                <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-[100px] -mr-48 -mt-48" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/10 rounded-full blur-[80px] -ml-32 -mb-32" />

                <div className="relative z-10 lg:flex items-center gap-12 lg:gap-20">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex-1 space-y-6"
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/20 text-primary text-[10px] font-black uppercase rounded-full tracking-widest border border-primary/20">
                            <Star size={12} className="fill-current" /> Daily Update
                        </div>
                        <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-white leading-tight">
                            {greeting}, <br /><span className="gradient-text">{user?.name?.split(' ')[0]}</span>! 👋
                        </h1>
                        <p className="text-base md:text-lg text-slate-400 max-w-xl leading-relaxed">
                            You're currently focusing on <span className="text-primary font-bold">{user?.goal || 'General Fitness'}</span>.
                            You have completed <span className="text-white font-bold">{sessions.length}</span> workouts this week. Keep the momentum going!
                        </p>
                        <div className="flex flex-wrap gap-4 pt-4">
                            <div className="flex items-center gap-2 px-5 py-3 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 text-sm font-bold hover:bg-white/10 transition-colors">
                                <Zap className="text-yellow-500" size={18} />
                                <span>{user?.level?.toUpperCase()} LEVEL</span>
                            </div>
                            <div className="flex items-center gap-2 px-5 py-3 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 text-sm font-bold hover:bg-white/10 transition-colors">
                                <Target className="text-primary" size={18} />
                                <span>{totalWorkoutTime} MINS TOTAL</span>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="mt-12 lg:mt-0 shrink-0"
                    >
                        <div className="glass-card p-8 border-primary/30 bg-primary/10 min-w-[320px] shadow-2xl shadow-primary/20 relative group">
                            <div className="absolute -top-4 -right-4 w-12 h-12 bg-accent rounded-full blur-xl opacity-50 group-hover:opacity-80 transition-opacity" />
                            <div className="flex justify-between items-start mb-8">
                                <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center shadow-xl shadow-primary/30">
                                    <Trophy size={28} className="text-white" />
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Weekly Rank</p>
                                    <p className="text-3xl font-black text-white">#5</p>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Community Experience</p>
                                <div className="flex items-end gap-2">
                                    <span className="text-4xl font-black text-primary leading-none">{user?.points || 0}</span>
                                    <span className="text-xs text-slate-500 font-bold mb-1">EXP</span>
                                </div>
                                <div className="w-full h-1.5 bg-slate-800 rounded-full mt-4 overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: '65%' }}
                                        className="h-full bg-primary"
                                    />
                                </div>
                            </div>
                            <div className="mt-8 pt-8 border-t border-white/10 flex items-center justify-between">
                                <div className="flex gap-6">
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">Workouts</p>
                                        <p className="text-lg font-black">{sessions.length}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">Calories</p>
                                        <p className="text-lg font-black">{totalCalories}</p>
                                    </div>
                                </div>
                                <div className="p-3 bg-white/5 rounded-xl text-slate-400">
                                    <TrendingUp size={20} />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Mission Area */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="flex items-center justify-between px-2">
                        <h2 className="text-2xl font-bold flex items-center gap-3">
                            <Star className="text-yellow-500 fill-yellow-500" /> Mission of the Day
                        </h2>
                        <Link to="/schedule" className="text-sm font-bold text-primary hover:underline">View Schedule</Link>
                    </div>

                    <div className="group relative glass-card p-0 overflow-hidden border-white/10 hover:border-primary/50 transition-all duration-500 min-h-[300px] flex flex-col sm:flex-row">
                        <div className="sm:w-1/2 p-6 md:p-8 flex flex-col justify-between">
                            <div>
                                <span className="px-3 py-1 bg-primary/20 text-primary text-[10px] font-black uppercase rounded-full tracking-tighter">
                                    Next for you
                                </span>
                                <h3 className="text-2xl font-black mt-4 group-hover:text-primary transition-colors">{recommendation.name}</h3>
                                <div className="flex gap-4 mt-4">
                                    <div className="flex items-center gap-1.5 text-slate-400 text-sm font-medium">
                                        <Timer size={16} /> {recommendation.duration} min
                                    </div>
                                    <div className="flex items-center gap-1.5 text-slate-400 text-sm font-medium">
                                        <Flame size={16} /> ~250 kcal
                                    </div>
                                </div>
                            </div>

                            <Link
                                to={`/workout/${recommendation.id}`}
                                className="mt-8 btn-primary flex items-center justify-center gap-2 py-3 text-base font-black group-hover:scale-105 transition-transform"
                            >
                                <Play size={18} fill="white" />
                                START SESSION
                            </Link>
                        </div>
                        <div className="sm:w-1/2 bg-slate-800/50 relative overflow-hidden flex items-center justify-center p-8 border-l border-white/5">
                            <Dumbbell size={120} className="text-slate-700/30 -rotate-12 absolute scale-150" />
                            <div className="relative z-10 text-center space-y-4">
                                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Target Focus</p>
                                <div className="flex flex-wrap justify-center gap-2">
                                    {recommendation.exercises.slice(0, 3).map(exId => (
                                        <span key={exId} className="px-4 py-2 bg-slate-900 text-primary text-xs font-bold rounded-xl border border-primary/20">{exId.replace('-', ' ')}</span>
                                    ))}
                                </div>
                                <p className="text-sm text-slate-400 italic font-medium px-4">"Great things come to those who weight."</p>
                            </div>
                        </div>
                    </div>

                    {/* Enrolled Workouts Section */}
                    <div className="space-y-6 mt-10">
                        <div className="flex items-center justify-between px-2">
                            <h2 className="text-2xl font-bold flex items-center gap-3">
                                <Target className="text-primary" /> Enrolled Routines
                            </h2>
                            <Link to="/workouts" className="text-sm font-bold text-primary hover:underline">Explore More</Link>
                        </div>
                        {enrolledWorkouts.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {enrolledWorkouts.map((routine) => (
                                    <Link
                                        key={routine.id}
                                        to={`/workout/${routine.id}`}
                                        className="glass-card group hover:border-primary/50 transition-all flex items-center gap-4"
                                    >
                                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                                            <Dumbbell size={20} />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-bold text-base group-hover:text-primary transition-colors">{routine.name}</h4>
                                            <p className="text-xs text-slate-500">{routine.duration} mins • {routine.level}</p>
                                        </div>
                                        <ChevronRight className="text-slate-600 group-hover:text-white transition-colors" />
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <Link to="/workouts" className="block p-8 border-2 border-dashed border-white/5 rounded-[2rem] text-center hover:border-primary/30 transition-all group">
                                <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-4 text-slate-500 group-hover:bg-primary/10 group-hover:text-primary transition-all">
                                    <Plus size={32} />
                                </div>
                                <h4 className="text-slate-400 font-bold">No routines joined yet</h4>
                                <p className="text-xs text-slate-500 mt-1">Start your journey by joining a workout plan</p>
                            </Link>
                        )}
                    </div>
                </div>

                {/* Right Column */}
                <div className="space-y-8">
                    <div className="glass-card">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold flex items-center gap-2">
                                <TrendingUp className="text-primary" /> Active Progress
                            </h3>
                        </div>

                        <div className="h-48 w-full mt-4">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={chartData.length > 0 ? chartData : [{ name: 'M', calories: 0 }, { name: 'T', calories: 200 }, { name: 'W', calories: 150 }]}>
                                    <defs>
                                        <linearGradient id="colorCal" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <Area
                                        type="monotone"
                                        dataKey="calories"
                                        stroke="#8b5cf6"
                                        fillOpacity={1}
                                        fill="url(#colorCal)"
                                        strokeWidth={3}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>

                        <div className="mt-6 flex items-center justify-between p-4 bg-primary/5 rounded-2xl border border-primary/10">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white">
                                    <Flame size={20} />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-slate-500 uppercase">Streak</p>
                                    <p className="text-lg font-black tracking-tighter">🔥 5 DAYS</p>
                                </div>
                            </div>
                            <Link to="/tracker" className="p-2 hover:bg-slate-800 rounded-lg"><ChevronRight /></Link>
                        </div>
                    </div>

                    <div className="glass-card border-orange-500/20 bg-orange-500/5 relative overflow-hidden">
                        <div className="relative z-10 flex items-center gap-4">
                            <div className="w-12 h-12 bg-orange-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-orange-500/30">
                                <Star fill="white" size={20} />
                            </div>
                            <div>
                                <h4 className="font-bold">Pro Tip</h4>
                                <p className="text-xs text-slate-400 mt-1 italic">
                                    "Your body can stand almost anything. It’s your mind that you have to convince."
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="glass-card bg-slate-900/50 border-white/5">
                        <div className="flex justify-between items-center mb-4">
                            <p className="text-xs font-bold text-slate-500 uppercase">Device Connectivity</p>
                            <Watch size={16} className="text-primary" />
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-primary/10 rounded-lg">
                                    <Bluetooth size={18} className="text-primary" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold">Smartwatch</p>
                                    <p className="text-[10px] text-success font-medium">Auto-sync active</p>
                                </div>
                            </div>
                            <div className="w-2 h-2 rounded-full bg-success shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                        </div>
                    </div>

                    <Link to="/community" className="glass-card group hover:border-primary/50 transition-colors block">
                        <div className="flex items-center justify-between mb-4">
                            <p className="text-xs font-bold text-slate-500 uppercase">Community Pulse</p>
                            <Users size={16} className="text-slate-400" />
                        </div>
                        <div className="flex -space-x-3 mb-4">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="w-8 h-8 rounded-full border-2 border-[#0f172a] bg-slate-700 flex items-center justify-center text-[10px] font-bold">U{i}</div>
                            ))}
                            <div className="w-8 h-8 rounded-full border-2 border-[#0f172a] bg-primary flex items-center justify-center text-[10px] font-bold">+2k</div>
                        </div>
                        <p className="text-sm font-medium text-slate-300">Alex just completed a 500pt challenge!</p>
                    </Link>
                </div>
            </div>
        </div >
    );
};

export default Dashboard;
