import { useState, useEffect } from 'react';
import {
    Heart,
    Moon,
    Wind,
    RefreshCcw,
    CheckCircle2,
    Play,
    ArrowRight,
    RotateCcw,
    ChevronLeft
} from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const Recovery = () => {
    const [activeSession, setActiveSession] = useState<any>(null);
    const [timeLeft, setTimeLeft] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

    const recoveryTips = [
        { id: 'stretch', title: 'Post-Workout Stretch', desc: 'Hold each stretch for 30 seconds to release muscle tension.', duration: '10 min', icon: RefreshCcw, color: 'text-primary' },
        { id: 'sleep', title: 'Sleep Optimization', desc: 'Aim for 7-9 hours of quality sleep to maximize muscle repair.', duration: '8 hours', icon: Moon, color: 'text-accent' },
        { id: 'breath', title: 'Guided Breathing', desc: 'Reduce cortisol levels with a 5-minute box breathing session.', duration: '5 min', icon: Wind, color: 'text-orange-500' },
    ];

    useEffect(() => {
        let interval: any;
        if (activeSession && timeLeft > 0 && !isPaused) {
            interval = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        } else if (timeLeft === 0 && activeSession) {
            handleComplete();
        }
        return () => clearInterval(interval);
    }, [activeSession, timeLeft, isPaused]);

    const startSession = (session: any) => {
        if (session.id === 'sleep') {
            toast.success('Goodnight! Sleep tracking activated.');
            return;
        }

        const durationSec = parseInt(session.duration) * 60;
        setActiveSession(session);
        setTimeLeft(durationSec);
        setIsPaused(false);
        toast.success(`Starting ${session.title}`);
    };

    const handleComplete = () => {
        toast.success(`${activeSession.title} Completed!`, {
            icon: '🎉',
            duration: 4000
        });
        setActiveSession(null);
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    if (activeSession) {
        return (
            <div className="max-w-4xl mx-auto py-12">
                <button
                    onClick={() => setActiveSession(null)}
                    className="flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition-colors"
                >
                    <ChevronLeft size={20} /> End Session
                </button>

                <div className="glass-card flex flex-col items-center justify-center p-16 text-center space-y-8">
                    <div className={`p-6 bg-slate-800/50 rounded-full ${activeSession.color}`}>
                        <activeSession.icon size={64} className={activeSession.id === 'breath' ? 'animate-pulse' : ''} />
                    </div>

                    <div>
                        <h2 className="text-4xl font-bold mb-2">{activeSession.title}</h2>
                        <p className="text-slate-400 max-w-md mx-auto">{activeSession.desc}</p>
                    </div>

                    <div className="text-8xl font-black font-mono tracking-tighter tabular-nums gradient-text">
                        {formatTime(timeLeft)}
                    </div>

                    <div className="flex gap-4">
                        <button
                            onClick={() => setIsPaused(!isPaused)}
                            className="btn-primary px-12 py-4 text-xl"
                        >
                            {isPaused ? 'Resume' : 'Pause'}
                        </button>
                        <button
                            onClick={() => setTimeLeft(parseInt(activeSession.duration) * 60)}
                            className="btn-secondary p-4"
                        >
                            <RotateCcw size={24} />
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <h1 className="text-3xl font-bold">Wellness & Recovery</h1>
                <p className="text-slate-400">Optimize your performance with proper rest and recovery.</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {recoveryTips.map((tip, idx) => (
                    <motion.div
                        key={tip.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="glass-card flex flex-col items-center text-center space-y-4 group"
                    >
                        <div className={`p-4 bg-slate-800/50 rounded-2xl ${tip.color} group-hover:scale-110 transition-transform`}>
                            <tip.icon size={32} />
                        </div>
                        <h3 className="text-xl font-bold">{tip.title}</h3>
                        <p className="text-sm text-slate-400">{tip.desc}</p>
                        <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">{tip.duration}</div>
                        <button
                            onClick={() => startSession(tip)}
                            className="text-primary font-bold flex items-center gap-2 hover:gap-3 transition-all mt-4"
                        >
                            Start Now <ArrowRight size={16} />
                        </button>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Guided Breathing Section */}
                <div className="glass-card flex flex-col items-center justify-center p-12 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-primary/5 transition-colors group-hover:bg-primary/10 -z-10" />
                    <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                        className="w-32 h-32 rounded-full border-4 border-primary/30 flex items-center justify-center mb-8"
                    >
                        <Wind size={48} className="text-primary" />
                    </motion.div>
                    <h3 className="text-2xl font-bold mb-2">Box Breathing</h3>
                    <p className="text-slate-400 text-center mb-8 max-w-sm">Focus on the circle. Inhale as it expands, exhale as it contracts.</p>
                    <button
                        onClick={() => startSession({ id: 'breath', title: 'Box Breathing', duration: '5 min', icon: Wind, color: 'text-primary', desc: 'Slow, deep rhythmic breathing.' })}
                        className="btn-primary flex items-center gap-2 px-10"
                    >
                        <Play size={18} fill="white" /> Begin Session
                    </button>
                </div>

                {/* Nutrition & Sleep Tips */}
                <div className="glass-card">
                    <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <Heart className="text-danger" /> Recovery Checklist
                    </h3>
                    <div className="space-y-4">
                        {[
                            'Active stretching (10 mins)',
                            'Protein intake within 1h',
                            'Hydrate with electrolytes',
                            'Magnesium supplement (optional)',
                            'Foam rolling sore muscles',
                            'Cold shower / Ice bath'
                        ].map((item, i) => (
                            <div key={i} className="flex items-center gap-3 p-3 bg-slate-800/30 rounded-xl transition-all hover:bg-slate-800/50 cursor-pointer">
                                <CheckCircle2 className="text-success" size={20} />
                                <span className="text-slate-300 font-medium">{item}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Recovery;
