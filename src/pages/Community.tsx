import { useState } from 'react';
import {
    Trophy,
    Zap,
    Flame,
    Plus,
    X,
    Heart,
    MessageCircle,
    Share2,
    Users,
    CheckCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { useStore } from '../store/useStore';

const Community = () => {
    const [challenges, setChallenges] = useState([
        {
            id: 1,
            title: '30-Day Shred',
            participants: 1240,
            type: 'Fat Loss',
            color: 'text-primary',
            joined: false,
            dailyTasks: ['20 Burpees', '30 Plank Seconds', '15 Mountain Climbers']
        },
        {
            id: 2,
            title: 'Morning Mobility',
            participants: 850,
            type: 'Flexibility',
            color: 'text-accent',
            joined: true,
            dailyTasks: ['Cat-Cow Stretch (2 min)', 'Downward Dog (1 min)', 'Childs Pose (3 min)']
        },
        {
            id: 3,
            title: 'Push-up King',
            participants: 2100,
            type: 'Strength',
            color: 'text-orange-500',
            joined: false,
            dailyTasks: ['10 Diamond Push-ups', '20 Wide Push-ups', '15 Archer Push-ups']
        },
    ]);

    const { user, addPoints } = useStore();
    const [leaderboard, setLeaderboard] = useState([
        { rank: 1, name: 'Alex Johnson', points: 4500, avatar: 'A' },
        { rank: 2, name: 'Sarah Miller', points: 4120, avatar: 'S' },
        { rank: 3, name: 'David Chen', points: 3950, avatar: 'D' },
        { rank: 4, name: 'Emma Wilson', points: 3800, avatar: 'E' },
        { rank: 5, name: 'You (Athlete)', points: user?.points || 1250, avatar: 'Y' },
    ]);

    const [selectedDetailChallenge, setSelectedDetailChallenge] = useState<any>(null);
    const [completedTasks, setCompletedTasks] = useState<Record<string, boolean>>({});

    const joinedChallenges = challenges.filter(c => c.joined);
    const availableChallenges = challenges.filter(c => !c.joined);

    const [posts, setPosts] = useState([
        { id: 1, user: 'User_1', content: 'Just completed "Bodyweight Blast" in 14 minutes! New personal record! 🔥', likes: 24, comments: 3, liked: false, time: '2h ago' },
        { id: 2, user: 'User_2', content: 'Tried the new HIIT routine. My legs are officially jelly. Worth it though! 🦵✨', likes: 18, comments: 5, liked: true, time: '4h ago' },
    ]);

    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [newChallenge, setNewChallenge] = useState({ title: '', type: 'Strength', activities: [] as string[] });
    const [currentActivity, setCurrentActivity] = useState('');

    const addActivity = () => {
        if (currentActivity.trim()) {
            setNewChallenge(prev => ({
                ...prev,
                activities: [...prev.activities, currentActivity.trim()]
            }));
            setCurrentActivity('');
        }
    };

    const removeActivity = (index: number) => {
        setNewChallenge(prev => ({
            ...prev,
            activities: prev.activities.filter((_, i) => i !== index)
        }));
    };

    const handleJoin = (id: number) => {
        setChallenges(prev => prev.map(c =>
            c.id === id ? { ...c, joined: !c.joined, participants: c.joined ? c.participants - 1 : c.participants + 1 } : c
        ));
        const challenge = challenges.find(c => c.id === id);
        if (challenge?.joined) {
            toast.error(`Left ${challenge.title}`);
        } else {
            toast.success(`Joined ${challenge?.title}! You can now view daily tasks.`);
        }
    };

    const updatePoints = (earned: number) => {
        addPoints(earned);
        const newTotal = (user?.points || 0) + earned;
        setLeaderboard(prev => {
            const updated = prev.map(u => u.name.includes('You') ? { ...u, points: newTotal } : u);
            return updated.sort((a, b) => b.points - a.points).map((u, i) => ({ ...u, rank: i + 1 }));
        });
    };

    const completeDailyTask = (challengeId: number, taskIndex: number) => {
        const taskId = `${challengeId}-${taskIndex}`;
        if (completedTasks[taskId]) return;

        setCompletedTasks({ ...completedTasks, [taskId]: true });
        toast.success('Task finished! +25 Points', { icon: '⭐' });
        updatePoints(25);
    };

    const handleLike = (id: number) => {
        setPosts(prev => prev.map(p =>
            p.id === id ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 } : p
        ));
    };

    const handleCreateChallenge = (e: React.FormEvent) => {
        e.preventDefault();

        let finalActivities = [...newChallenge.activities];
        if (currentActivity.trim()) {
            finalActivities.push(currentActivity.trim());
        }

        if (finalActivities.length === 0) {
            toast.error('Please add at least one activity');
            return;
        }

        const newId = Date.now();
        const createdChallenge = {
            id: newId,
            title: newChallenge.title,
            participants: 1,
            type: newChallenge.type,
            color: 'text-primary',
            joined: true,
            dailyTasks: finalActivities
        };
        setChallenges([...challenges, createdChallenge]);
        setIsCreateModalOpen(false);
        setNewChallenge({ title: '', type: 'Strength', activities: [] });
        setCurrentActivity('');
        toast.success(`"${newChallenge.title}" is now live! You earned 100 points.`);
        updatePoints(100);
    };


    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
        >
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold">Community</h1>
                    <p className="text-slate-400">Compete, share, and grow together.</p>
                </div>
                <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="btn-primary flex items-center gap-2 group"
                >
                    <Plus size={20} className="group-hover:rotate-90 transition-transform" />
                    Create Challenge
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Active Challenges Area */}
                <div className="lg:col-span-2 space-y-10">
                    {/* My Joined Challenges Section */}
                    {joinedChallenges.length > 0 && (
                        <div className="space-y-6">
                            <h2 className="text-2xl font-bold flex items-center gap-2">
                                <CheckCircle className="text-primary" /> My Joined Challenges
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {joinedChallenges.map((c) => (
                                    <motion.div
                                        layout
                                        key={c.id}
                                        className="glass-card border-primary/30 bg-primary/5 hover:border-primary/50 transition-all"
                                    >
                                        <div
                                            onClick={() => setSelectedDetailChallenge(c)}
                                            className="flex justify-between items-start mb-4 cursor-pointer cursor-zoom-in"
                                        >
                                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${c.color} bg-slate-800`}>
                                                <Trophy size={24} />
                                            </div>
                                            <span className="text-[10px] font-bold px-2 py-1 rounded-full uppercase bg-primary text-white">
                                                Active
                                            </span>
                                        </div>
                                        <h3
                                            onClick={() => setSelectedDetailChallenge(c)}
                                            className="text-xl font-bold mb-1 cursor-pointer"
                                        >
                                            {c.title}
                                        </h3>
                                        <p className="text-sm text-slate-400 mb-6">{c.type} • {c.participants.toLocaleString()} participants</p>
                                        <div className="flex items-end justify-between">
                                            <div className="flex flex-col gap-2">
                                                <div className="flex -space-x-2 mb-1">
                                                    {[1, 2, 3].map(i => (
                                                        <div key={i} className="w-6 h-6 rounded-full border border-[#0f172a] bg-slate-700 text-[8px] flex items-center justify-center font-bold">U{i}</div>
                                                    ))}
                                                </div>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setSelectedDetailChallenge(c);
                                                    }}
                                                    className="text-xs text-primary font-bold hover:underline text-left"
                                                >
                                                    View Daily Tasks →
                                                </button>
                                            </div>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleJoin(c.id);
                                                }}
                                                className="px-4 py-2 text-sm font-bold rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 transition-all"
                                            >
                                                Leave
                                            </button>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Discover Challenges Section */}
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold flex items-center gap-2">
                            <Zap className="text-primary" /> Discover New Challenges
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {availableChallenges.map((c) => (
                                <motion.div
                                    layout
                                    key={c.id}
                                    className="glass-card group hover:border-primary/50 transition-all"
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <div
                                            onClick={() => setSelectedDetailChallenge(c)}
                                            className="w-12 h-12 rounded-xl flex items-center justify-center bg-slate-800 cursor-pointer hover:bg-slate-700 transition-colors"
                                        >
                                            <Trophy size={24} className={c.color} />
                                        </div>
                                        <span className="text-[10px] font-bold px-2 py-1 rounded-full uppercase text-slate-500 bg-slate-800">
                                            Featured
                                        </span>
                                    </div>
                                    <h3
                                        onClick={() => setSelectedDetailChallenge(c)}
                                        className="text-xl font-bold mb-1 cursor-pointer hover:text-primary transition-colors"
                                    >
                                        {c.title}
                                    </h3>
                                    <p className="text-sm text-slate-400 mb-6">{c.type} • {c.participants.toLocaleString()} participants</p>
                                    <div className="flex items-end justify-between">
                                        <div className="flex flex-col gap-2">
                                            <div className="flex -space-x-3 mb-1">
                                                {[1, 2, 3, 4].map(i => (
                                                    <div key={i} className="w-8 h-8 rounded-full border-2 border-[#0f172a] bg-slate-700 flex items-center justify-center text-[10px] font-bold">U{i}</div>
                                                ))}
                                                <div className="w-8 h-8 rounded-full border-2 border-[#0f172a] bg-primary flex items-center justify-center text-[10px] font-bold">+{Math.floor(c.participants / 1000)}k</div>
                                            </div>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setSelectedDetailChallenge(c);
                                                }}
                                                className="text-xs text-primary font-bold hover:underline text-left"
                                            >
                                                Preview Tasks →
                                            </button>
                                        </div>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleJoin(c.id);
                                            }}
                                            className="px-4 py-2 text-sm font-bold rounded-lg bg-primary text-white hover:shadow-lg hover:shadow-primary/30 transition-all whitespace-nowrap"
                                        >
                                            Join Challenge
                                        </button>
                                    </div>
                                </motion.div>
                            ))}

                            <button
                                onClick={() => setIsCreateModalOpen(true)}
                                className="glass-card flex flex-col items-center justify-center text-center border-dashed border-2 border-slate-700 bg-transparent hover:border-primary transition-all group min-h-[220px]"
                            >
                                <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-slate-500 mb-4 group-hover:bg-primary/20 group-hover:text-primary transition-all">
                                    <Plus size={24} />
                                </div>
                                <h4 className="font-bold text-slate-400 group-hover:text-primary">Start Your Own</h4>
                                <p className="text-xs text-slate-600 px-8 mt-1">Challenge your friends to a workout duel</p>
                            </button>
                        </div>
                    </div>

                    {/* Social Feed */}
                    <div className="glass-card">
                        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                            <Users className="text-accent" size={24} /> Recent Activity
                        </h3>
                        <div className="space-y-6">
                            {posts.map(post => (
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    key={post.id}
                                    className="flex gap-4 p-5 bg-slate-800/20 rounded-2xl hover:bg-slate-800/30 transition-all border border-transparent hover:border-white/5"
                                >
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-slate-700 to-slate-800 shrink-0 flex items-center justify-center font-bold text-slate-400 border border-white/5">
                                        {post.user.charAt(post.user.length - 1)}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h4 className="font-bold text-sm hover:text-primary cursor-pointer transition-colors">{post.user}</h4>
                                                <span className="text-[10px] text-slate-500 font-bold uppercase">{post.time}</span>
                                            </div>
                                            <button className="text-slate-600 hover:text-white transition-colors">
                                                <Share2 size={16} />
                                            </button>
                                        </div>
                                        <p className="text-sm text-slate-300 mt-2 leading-relaxed">{post.content}</p>
                                        <div className="flex gap-6 mt-4 text-xs font-bold">
                                            <button
                                                onClick={() => handleLike(post.id)}
                                                className={`flex items-center gap-1.5 transition-colors ${post.liked ? 'text-primary' : 'text-slate-500 hover:text-primary'}`}
                                            >
                                                <Heart size={16} fill={post.liked ? "currentColor" : "none"} />
                                                {post.likes}
                                            </button>
                                            <button className="flex items-center gap-1.5 text-slate-500 hover:text-accent transition-colors">
                                                <MessageCircle size={16} />
                                                {post.comments}
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Leaderboard */}
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold flex items-center gap-2">
                            <Trophy className="text-yellow-500" /> Leaderboard
                        </h2>
                        <div className="glass-card p-0 overflow-hidden border-white/5">
                            <div className="p-6 bg-gradient-to-br from-primary to-accent relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-4 opacity-20 rotate-12">
                                    <Trophy size={80} />
                                </div>
                                <p className="text-xs font-bold text-white/70 uppercase tracking-wider">Weekly Ranking</p>
                                <div className="flex items-center justify-between mt-1">
                                    <h3 className="text-2xl font-bold text-white">Top Contributors</h3>
                                    <div className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
                                        <span className="text-xs font-bold text-white">Your Points: {user?.points || 0}</span>
                                    </div>
                                </div>
                                <div className="mt-4 flex -space-x-2">
                                    {[1, 2, 3].map(i => (
                                        <div key={i} className="w-8 h-8 rounded-full border-2 border-white/20 bg-white/10 backdrop-blur-sm" />
                                    ))}
                                    <div className="pl-4 text-[10px] text-white/60 font-medium flex items-center">Join thousands others</div>
                                </div>
                            </div>
                            <div className="p-4 space-y-2">
                                {leaderboard.map((user) => (
                                    <motion.div
                                        whileHover={{ x: 5 }}
                                        key={user.rank}
                                        className={`flex items-center justify-between p-3 rounded-xl transition-all cursor-pointer ${user.rank === 1 ? 'bg-primary/10 border border-primary/20' : 'hover:bg-slate-800/50 border border-transparent'}`}
                                    >
                                        <div className="flex items-center gap-4">
                                            <span className={`w-6 text-sm font-bold ${user.rank === 1 ? 'text-primary' : 'text-slate-500'}`}>{user.rank}</span>
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold overflow-hidden border-2 ${user.rank === 1 ? 'bg-primary border-primary shadow-lg shadow-primary/20' : 'bg-slate-800 border-white/5'}`}>
                                                {user.avatar}
                                            </div>
                                            <span className="font-bold text-sm">{user.name}</span>
                                        </div>
                                        <div className="text-right">
                                            <span className="font-bold text-sm">{user.points.toLocaleString()}</span>
                                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">Points</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                            <button className="w-full p-4 text-center text-sm font-bold text-slate-400 hover:text-white border-t border-white/5 transition-all bg-slate-900/20 hover:bg-slate-900/40">
                                View Full Ranking
                            </button>
                        </div>

                        <div className="glass-card bg-orange-500/10 border-orange-500/20 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-16 h-16 bg-orange-500/10 rounded-full -mr-8 -mt-8 group-hover:scale-150 transition-transform duration-500" />
                            <div className="flex items-center gap-2 text-orange-500 mb-2 relative">
                                <Flame size={20} className="animate-pulse" />
                                <h4 className="font-bold text-sm">Winning Streak!</h4>
                            </div>
                            <p className="text-xs text-slate-400 relative">
                                Maintain your 5-day streak to earn the "Consistent Warrior" badge and 500 bonus points!
                            </p>
                            <div className="mt-4 h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                                <div className="h-full w-[80%] bg-orange-500 rounded-full shadow-lg shadow-orange-500/50" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modals Container */}
            <AnimatePresence mode="wait">
                {isCreateModalOpen && (
                    <motion.div
                        key="create-challenge-modal"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                        onClick={() => setIsCreateModalOpen(false)}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="glass-card w-full max-w-lg p-0 overflow-hidden shadow-2xl border-white/10"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="p-6 border-b border-white/5 flex justify-between items-center bg-slate-900/50">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary">
                                        <Plus size={24} />
                                    </div>
                                    <h3 className="text-xl font-bold">New Community Challenge</h3>
                                </div>
                                <button
                                    onClick={() => setIsCreateModalOpen(false)}
                                    className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <form onSubmit={handleCreateChallenge} className="p-6 space-y-4">
                                <div>
                                    <label className="block text-sm font-bold text-slate-400 uppercase mb-2 tracking-wider">Challenge Title</label>
                                    <input
                                        required
                                        type="text"
                                        value={newChallenge.title}
                                        onChange={(e) => setNewChallenge({ ...newChallenge, title: e.target.value })}
                                        placeholder="e.g., 50 Squat Daily Challenge"
                                        className="w-full bg-slate-900/50 border border-white/10 rounded-2xl p-4 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-primary/50 transition-colors"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-400 uppercase mb-2 tracking-wider">Focus Category</label>
                                    <select
                                        value={newChallenge.type}
                                        onChange={(e) => setNewChallenge({ ...newChallenge, type: e.target.value })}
                                        className="w-full bg-slate-900/50 border border-white/10 rounded-2xl p-4 text-slate-200 focus:outline-none focus:border-primary/50 transition-colors appearance-none"
                                    >
                                        <option value="Strength">Strength</option>
                                        <option value="Fat Loss">Fat Loss</option>
                                        <option value="Flexibility">Flexibility</option>
                                        <option value="Endurance">Endurance</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-400 uppercase mb-2 tracking-wider">Add Activity</label>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={currentActivity}
                                            onChange={(e) => setCurrentActivity(e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                    e.preventDefault();
                                                    addActivity();
                                                }
                                            }}
                                            placeholder="e.g., 50 Burpees"
                                            className="flex-1 bg-slate-900/50 border border-white/10 rounded-xl p-4 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-primary/50 transition-colors"
                                        />
                                        <button
                                            type="button"
                                            onClick={addActivity}
                                            className="px-6 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl transition-all border border-white/5"
                                        >
                                            Add
                                        </button>
                                    </div>

                                    {newChallenge.activities.length > 0 && (
                                        <div className="mt-4 flex flex-wrap gap-2">
                                            {newChallenge.activities.map((activity, index) => (
                                                <div
                                                    key={index}
                                                    className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 border border-primary/20 rounded-lg text-sm text-primary group"
                                                >
                                                    <span>{activity}</span>
                                                    <button
                                                        type="button"
                                                        onClick={() => removeActivity(index)}
                                                        className="hover:text-white transition-colors"
                                                    >
                                                        <X size={14} />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10">
                                    <p className="text-xs text-slate-400 leading-relaxed">
                                        Starting a challenge earns you <span className="text-primary font-bold">+100 Community Points</span>. Your challenge will be featured in the global feed.
                                    </p>
                                </div>
                                <div className="flex gap-4 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setIsCreateModalOpen(false)}
                                        className="flex-1 px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold transition-all"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 px-6 py-3 rounded-xl bg-primary hover:bg-primary-hover text-white font-bold shadow-lg shadow-primary/30 transition-all transform hover:-translate-y-1"
                                    >
                                        Create & Start
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}

                {selectedDetailChallenge && (
                    <motion.div
                        key="detail-tasks-modal"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                        onClick={() => setSelectedDetailChallenge(null)}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="glass-card w-full max-w-lg p-0 overflow-hidden shadow-2xl border-white/10"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="p-6 border-b border-white/5 flex justify-between items-center bg-slate-900/50">
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white ${selectedDetailChallenge.color?.includes('text-') ? selectedDetailChallenge.color.replace('text-', 'bg-') : 'bg-primary'} bg-slate-800`}>
                                        <Trophy size={20} />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold">{selectedDetailChallenge.title}</h3>
                                        <p className="text-sm text-slate-400">Daily To-Do List</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setSelectedDetailChallenge(null)}
                                    className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="p-6 space-y-4 max-h-70vh overflow-y-auto custom-scrollbar">
                                {selectedDetailChallenge.dailyTasks?.map((task: string, idx: number) => {
                                    const taskId = `${selectedDetailChallenge.id}-${idx}`;
                                    const isDone = completedTasks[taskId];
                                    return (
                                        <div
                                            key={idx}
                                            className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${isDone
                                                ? 'bg-primary/10 border-primary/30 opacity-60'
                                                : 'bg-slate-800/30 border-white/5 hover:border-white/10'
                                                }`}
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${isDone ? 'bg-primary text-white' : 'bg-slate-700 text-slate-400'}`}>
                                                    {isDone ? <CheckCircle size={16} /> : idx + 1}
                                                </div>
                                                <span className={`font-medium ${isDone ? 'line-through text-slate-500' : 'text-slate-200'}`}>{task}</span>
                                            </div>
                                            {!isDone && (
                                                <button
                                                    onClick={() => completeDailyTask(selectedDetailChallenge.id, idx)}
                                                    className="px-3 py-1.5 bg-primary/20 hover:bg-primary text-primary hover:text-white text-xs font-bold rounded-lg transition-all"
                                                >
                                                    Done
                                                </button>
                                            )}
                                        </div>
                                    );
                                })}

                                {(!selectedDetailChallenge.dailyTasks || selectedDetailChallenge.dailyTasks.length === 0) && (
                                    <p className="text-center text-slate-500 py-8">No tasks available for this challenge.</p>
                                )}

                                <div className="p-4 bg-slate-900/50 rounded-2xl border border-white/5">
                                    <p className="text-xs text-slate-400 text-center uppercase font-bold tracking-widest">
                                        Each task earns <span className="text-primary">+25 Points</span>
                                    </p>
                                </div>

                                <button
                                    onClick={() => setSelectedDetailChallenge(null)}
                                    className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold transition-all"
                                >
                                    Close Tasks
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default Community;
