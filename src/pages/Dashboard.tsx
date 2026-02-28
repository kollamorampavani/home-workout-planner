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
    Users
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
            <header className="relative py-10 px-8 rounded-[2rem] overflow-hidden bg-gradient-to-br from-slate-900 via-slate-900 to-primary/20 border border-white/5 shadow-2xl">
                <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-[100px] -mr-48 -mt-48" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/10 rounded-full blur-[80px] -ml-32 -mb-32" />

                <div className="relative z-10 md:flex justify-between items-center gap-8">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-4"
                    >
                        <h1 className="text-4xl md:text-5xl font-black text-white">
                            {greeting}, <span className="gradient-text">{user?.name?.split(' ')[0]}</span>! 👋
                        </h1>
                        <p className="text-xl text-slate-400 max-w-lg leading-relaxed">
                            You're currently focusing on <span className="text-primary font-bold">{user?.goal || 'General Fitness'}</span>.
                            Ready to push your limits today?
                        </p>
                        <div className="flex flex-wrap gap-4 pt-4">
                            <div className="flex items-center gap-2 px-4 py-2 bg-slate-800/80 rounded-full border border-white/5 text-sm font-bold">
                                <Zap className="text-yellow-500" size={16} />
                                <span>{user?.level?.toUpperCase()} LEVEL</span>
                            </div>
                            <div className="flex items-center gap-2 px-4 py-2 bg-slate-800/80 rounded-full border border-white/5 text-sm font-bold">
                                <Target className="text-primary" size={16} />
                                <span>{totalWorkoutTime} MINS TOTAL</span>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="mt-8 md:mt-0 glass-card p-6 border-primary/20 bg-primary/5 min-w-[280px]"
                    >
                        <div className="flex justify-between items-start mb-6">
                            <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
                                <Trophy size={24} className="text-white" />
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Global Rank</p>
                                <p className="text-2xl font-black text-white">#5</p>
                            </div>
                        </div>
                        <div className="space-y-1">
                            <p className="text-xs font-bold text-slate-400 uppercase">Community Points</p>
                            <div className="flex items-end gap-2">
                                <span className="text-4xl font-black text-primary">{user?.points || 0}</span>
                                <span className="text-xs text-slate-500 font-bold mb-2">PTS</span>
                            </div>
                        </div>
                        <div className="mt-6 pt-6 border-t border-white/5 flex gap-4">
                            <div>
                                <p className="text-[10px] font-bold text-slate-500 uppercase">Workouts</p>
                                <p className="text-sm font-bold">{sessions.length}</p>
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-slate-500 uppercase">Calories</p>
                                <p className="text-sm font-bold">{totalCalories}</p>
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

                    <div className="group relative glass-card p-0 overflow-hidden border-white/10 hover:border-primary/50 transition-all duration-500 min-h-[300px] flex flex-col md:flex-row">
                        <div className="md:w-1/2 p-8 flex flex-col justify-between">
                            <div>
                                <span className="px-3 py-1 bg-primary/20 text-primary text-[10px] font-black uppercase rounded-full tracking-tighter">
                                    Next for you
                                </span>
                                <h3 className="text-3xl font-black mt-4 group-hover:text-primary transition-colors">{recommendation.name}</h3>
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
                                className="mt-8 btn-primary flex items-center justify-center gap-3 py-4 text-lg font-black group-hover:scale-105 transition-transform"
                            >
                                <Play size={22} fill="white" />
                                START SESSION
                            </Link>
                        </div>
                        <div className="md:w-1/2 bg-slate-800/50 relative overflow-hidden flex items-center justify-center p-8 border-l border-white/5">
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
