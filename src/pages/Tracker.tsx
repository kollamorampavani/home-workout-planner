import { useEffect } from 'react';
import { useStore } from '../store/useStore';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell
} from 'recharts';
import {
    Trophy,
    Flame,
    Calendar,
    ArrowUpRight,
    Award,
    Clock,
    Dumbbell
} from 'lucide-react';

const Tracker = () => {
    const { sessions, fetchHistory, isLoading } = useStore();

    useEffect(() => {
        fetchHistory();
    }, [fetchHistory]);

    // Aggregate data for charts from actual sessions
    const caloriesData = (sessions || []).slice(0, 7).reverse().map(s => ({
        day: s.date ? new Date(s.date).toLocaleDateString(undefined, { weekday: 'short' }) : '---',
        cal: Number(s.caloriesBurned) || 0
    }));

    // Fallback data if no sessions
    const displayCaloriesData = caloriesData.length > 0 ? caloriesData : [
        { day: 'Mon', cal: 0 },
        { day: 'Tue', cal: 0 },
        { day: 'Wed', cal: 0 },
        { day: 'Thu', cal: 0 },
        { day: 'Fri', cal: 0 },
        { day: 'Sat', cal: 0 },
        { day: 'Sun', cal: 0 },
    ];

    if (isLoading && sessions.length === 0) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 border-4 border-primary/20 rounded-full animate-spin border-t-primary" />
                    <p className="text-slate-400 font-medium animate-pulse">Fetching your progress history...</p>
                </div>
            </div>
        );
    }

    const muscleData = [
        { name: 'Chest', value: 40, color: '#8b5cf6' },
        { name: 'Legs', value: 30, color: '#f97316' },
        { name: 'Back', value: 15, color: '#0ea5e9' },
        { name: 'Core', value: 15, color: '#10b981' },
    ];

    const summary = [
        { label: 'Total Workouts', value: sessions.length, icon: Dumbbell, trend: '+12%' },
        { label: 'Avg Intensity', value: 'High', icon: Flame, trend: 'Level 5' },
        { label: 'Time Spent', value: `${Math.floor(sessions.reduce((a, b) => a + (Number(b.duration) || 0), 0) / 60)}h ${sessions.reduce((a, b) => a + (Number(b.duration) || 0), 0) % 60}m`, icon: Clock, trend: '+2h this week' },
        { label: 'Milestones', value: '8', icon: Award, trend: '2 new' },
    ];

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold">Progress Tracker</h1>
                <p className="text-slate-400">Your journey, visualized.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {summary.map((item) => (
                    <div key={item.label} className="glass-card">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-slate-800 rounded-xl text-primary">
                                <item.icon size={24} />
                            </div>
                            <span className="text-xs font-bold text-success flex items-center gap-1">
                                <ArrowUpRight size={14} /> {item.trend}
                            </span>
                        </div>
                        <p className="text-slate-400 text-sm font-medium">{item.label}</p>
                        <h3 className="text-2xl font-bold mt-1">{item.value}</h3>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Burn Trend Chart */}
                <div className="glass-card">
                    <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <Flame className="text-orange-500" /> Calories Burned (Weekly)
                    </h3>
                    <div className="h-64 mt-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={displayCaloriesData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 14 }} dy={10} />
                                <YAxis hide />
                                <Tooltip
                                    cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                    contentStyle={{ backgroundColor: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                                />
                                <Bar dataKey="cal" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Muscle Group Distribution */}
                <div className="glass-card">
                    <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <Trophy className="text-yellow-500" /> Focus Distribution
                    </h3>
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-8">
                        <div className="h-64 w-full sm:w-1/2">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={muscleData}
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {muscleData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="w-full sm:w-1/2 space-y-4">
                            {muscleData.map((item) => (
                                <div key={item.name} className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                                        <span className="text-sm font-medium text-slate-300">{item.name}</span>
                                    </div>
                                    <span className="text-sm font-bold">{item.value}%</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Workout History Table */}
            <div className="glass-card overflow-hidden">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold flex items-center gap-2">
                        <Calendar className="text-accent" /> History
                    </h3>
                    <button className="text-sm text-primary font-bold">View All</button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-white/5">
                                <th className="pb-4 font-semibold text-slate-400">Workout</th>
                                <th className="pb-4 font-semibold text-slate-400">Date</th>
                                <th className="pb-4 font-semibold text-slate-400">Duration</th>
                                <th className="pb-4 font-semibold text-slate-400">Calories</th>
                                <th className="pb-4 font-semibold text-slate-400">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {sessions.length > 0 ? sessions.map((session) => (
                                <tr key={session.id} className="group hover:bg-white/5 transition-colors">
                                    <td className="py-4 font-bold">{session.routine_name || 'Individual Session'}</td>
                                    <td className="py-4 text-slate-400">{new Date(session.date).toLocaleDateString()}</td>
                                    <td className="py-4 text-slate-400">{session.duration}m</td>
                                    <td className="py-4 text-slate-400">{session.caloriesBurned} kcal</td>
                                    <td className="py-4">
                                        <span className="px-2 py-1 bg-success/20 text-success text-xs font-bold rounded-full">Completed</span>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={5} className="py-12 text-center text-slate-500">
                                        No workouts completed yet. Start your first session!
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Tracker;
