import { useState } from 'react';
import { routines } from '../data/workouts';
import { exercises } from '../data/exercises';
import { Link, useNavigate } from 'react-router-dom';
import {
    Search,
    Filter,
    Clock,
    Zap,
    Dumbbell,
    ChevronRight,
    Timer,
    Plus,
    Check,
    Eye
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { useEffect } from 'react';
import { motion } from 'framer-motion';

const Workouts = () => {
    const [filter, setFilter] = useState('all');
    const [levelFilter, setLevelFilter] = useState('all');
    const [search, setSearch] = useState('');
    const { enrolledWorkouts, joinWorkout, leaveWorkout, fetchEnrolled } = useStore();
    const navigate = useNavigate();

    useEffect(() => {
        fetchEnrolled();
    }, [fetchEnrolled]);

    const isEnrolled = (id: string) => enrolledWorkouts.some(ew => ew.id === id);

    const handleJoinToggle = async (id: string) => {
        try {
            if (isEnrolled(id)) {
                await leaveWorkout(id);
            } else {
                await joinWorkout(id);
            }
        } catch (error) {
            console.error('Action failed', error);
        }
    };

    const filteredRoutines = routines.filter(r => {
        const matchesGoal = filter === 'all' || r.goal === filter;
        const matchesLevel = levelFilter === 'all' || r.level === levelFilter;
        const matchesSearch = r.name.toLowerCase().includes(search.toLowerCase());
        return matchesGoal && matchesLevel && matchesSearch;
    });

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold">Discover Workouts</h1>
                    <p className="text-slate-400">Choose a routine that fits your goals today.</p>
                </div>

                <div className="flex gap-4 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search routines..."
                            className="w-full pl-10"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <button className="p-3 bg-slate-800 rounded-xl text-slate-400 hover:text-white transition-colors">
                        <Filter size={20} />
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-4">
                <div className="flex bg-slate-800/50 p-1 rounded-2xl">
                    {['all', 'strength', 'fat-loss', 'flexibility'].map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-6 py-2 rounded-xl text-sm font-semibold capitalize transition-all ${filter === f ? 'bg-primary text-white shadow-lg shadow-primary-glow' : 'text-slate-400'
                                }`}
                        >
                            {f.replace('-', ' ')}
                        </button>
                    ))}
                </div>

                <div className="flex bg-slate-800/50 p-1 rounded-2xl">
                    {['all', 'beginner', 'intermediate', 'advanced'].map((l) => (
                        <button
                            key={l}
                            onClick={() => setLevelFilter(l)}
                            className={`px-6 py-2 rounded-xl text-sm font-semibold capitalize transition-all ${levelFilter === l ? 'bg-accent text-white shadow-lg' : 'text-slate-400'
                                }`}
                        >
                            {l}
                        </button>
                    ))}
                </div>
            </div>

            {/* Routine Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredRoutines.map((routine, idx) => (
                    <motion.div
                        key={routine.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.05 }}
                        className="glass-card group"
                    >
                        <div className="flex justify-between items-start mb-6">
                            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                                <Dumbbell size={24} />
                            </div>
                            <div className="flex gap-2">
                                <span className="text-xs bg-slate-800 px-2 py-1 rounded-lg text-slate-400 uppercase font-bold tracking-wider">
                                    {routine.level}
                                </span>
                            </div>
                        </div>

                        <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">{routine.name}</h3>
                        <div className="flex items-center gap-4 text-sm text-slate-400 mb-6">
                            <span className="flex items-center gap-1"><Clock size={14} /> {routine.duration}m</span>
                            <span className="flex items-center gap-1"><Zap size={14} /> {routine.exercises.length} Exercises</span>
                        </div>

                        <div className="space-y-2 mb-8">
                            {routine.exercises.slice(0, 3).map(id => {
                                const ex = exercises.find(e => e.id === id);
                                return (
                                    <div key={id} className="text-sm text-slate-500 flex items-center gap-2">
                                        <div className="w-1 h-1 rounded-full bg-slate-600" />
                                        {ex?.name}
                                    </div>
                                );
                            })}
                            {routine.exercises.length > 3 && (
                                <div className="text-xs text-slate-600 pl-3">+{routine.exercises.length - 3} more...</div>
                            )}
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => handleJoinToggle(routine.id)}
                                className={`flex-1 py-3 rounded-xl flex items-center justify-center gap-2 font-bold transition-all ${isEnrolled(routine.id)
                                    ? 'bg-success/20 text-success border border-success/30 hover:bg-success/30'
                                    : 'bg-primary/10 text-primary border border-primary/20 hover:bg-primary hover:text-white'
                                    }`}
                            >
                                {isEnrolled(routine.id) ? (
                                    <><Check size={18} className="animate-in zoom-in duration-300" /> Joined</>
                                ) : (
                                    <><Plus size={18} /> Join Workout</>
                                )}
                            </button>
                            <Link
                                to={`/workout/${routine.id}`}
                                className="px-5 bg-slate-800 rounded-xl flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 transition-all border border-white/5 shadow-inner"
                                title="Visit Whole Workout"
                            >
                                <Eye size={18} />
                            </Link>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Equipment-Free Section Section */}
            <div className="mt-12">
                <h2 className="text-2xl font-bold mb-6">Equipment-Free Favorites</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="glass-card p-0 overflow-hidden flex flex-col md:flex-row group cursor-pointer hover:border-primary/50 transition-all"
                        onClick={() => navigate('/workout/fat-burn-hiit')}>
                        <div className="md:w-1/3 bg-gradient-to-br from-primary to-accent p-8 flex items-center justify-center">
                            <Zap className="text-white" size={48} />
                        </div>
                        <div className="p-6 md:w-2/3">
                            <h3 className="text-xl font-bold">Bodyweight Blast</h3>
                            <p className="text-slate-400 mt-2 text-sm">Perfect for when you have zero equipment. 15 minutes of pure intensity.</p>
                            <button className="text-primary font-bold mt-4 flex items-center gap-2 group-hover:gap-3 transition-all">
                                Start Now <ChevronRight size={16} />
                            </button>
                        </div>
                    </div>

                    <div className="glass-card p-0 overflow-hidden flex flex-col md:flex-row group cursor-pointer hover:border-orange-500/50 transition-all"
                        onClick={() => navigate('/workout/yoga-flow')}>
                        <div className="md:w-1/3 bg-gradient-to-br from-orange-500 to-red-500 p-8 flex items-center justify-center">
                            <Timer className="text-white" size={48} />
                        </div>
                        <div className="p-6 md:w-2/3">
                            <h3 className="text-xl font-bold">Quick Morning Yoga</h3>
                            <p className="text-slate-400 mt-2 text-sm">Wake up your body with 10 minutes of mobility and breathing.</p>
                            <button className="text-orange-500 font-bold mt-4 flex items-center gap-2 group-hover:gap-3 transition-all">
                                Start Now <ChevronRight size={16} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Workouts;
