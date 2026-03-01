import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { routines } from '../data/workouts';
import { exercises } from '../data/exercises';
import type { Exercise } from '../data/exercises';
import {
    ChevronLeft,
    ChevronRight,
    Play,
    Pause,
    RotateCcw,
    CheckCircle2,
    Trophy,
    ArrowRight,
    Video,
    RefreshCcw,
    Heart,
    Bluetooth
} from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const WorkoutPlayer = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const addSession = useStore((state) => state.addSession);

    const routine = routines.find(r => r.id === id);
    const workoutExercises = routine?.exercises.map(exId => exercises.find(e => e.id === exId)).filter(Boolean) as Exercise[];

    const [currentIndex, setCurrentIndex] = useState(0);
    const [timeLeft, setTimeLeft] = useState(0);
    const [isActive, setIsActive] = useState(false);
    const [completed, setCompleted] = useState(false);
    const [feedback, setFeedback] = useState<'easy' | 'perfect' | 'hard' | null>(null);
    const [heartRate, setHeartRate] = useState(72);
    const [isDeviceConnected, setIsDeviceConnected] = useState(false);

    const currentExercise = workoutExercises?.[currentIndex];

    useEffect(() => {
        if (currentExercise) {
            setTimeLeft(currentExercise.defaultDuration || 60);
        }
    }, [currentIndex, currentExercise]);

    useEffect(() => {
        let interval: any = null;
        if (isActive && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        } else if (timeLeft === 0 && isActive) {
            setIsActive(false);
            const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
            audio.play().catch(() => { });
            toast.success(`${currentExercise?.name} Complete!`);
        }
        return () => clearInterval(interval);
    }, [isActive, timeLeft, currentExercise]);

    useEffect(() => {
        let hrInterval: any;
        if (isDeviceConnected && isActive) {
            hrInterval = setInterval(() => {
                setHeartRate(prev => {
                    const change = isActive ? (Math.floor(Math.random() * 8) - 2) : (Math.floor(Math.random() * 3) - 3);
                    const newHr = prev + change;
                    return Math.min(Math.max(newHr, 60), 180);
                });
            }, 2000);
        } else if (!isActive && isDeviceConnected) {
            hrInterval = setInterval(() => {
                setHeartRate(prev => Math.max(65, prev - 1));
            }, 3000);
        }
        return () => clearInterval(hrInterval);
    }, [isDeviceConnected, isActive]);

    const handleNext = () => {
        if (currentIndex < workoutExercises.length - 1) {
            setCurrentIndex(currentIndex + 1);
            setIsActive(false);
        } else {
            handleFinish();
        }
    };

    const handleFinish = async (difficulty?: 'easy' | 'perfect' | 'hard') => {
        setCompleted(true);
        const feedbackValue = difficulty || feedback || 'perfect';
        await addSession({
            workoutId: routine?.id || 'manual',
            duration: routine?.duration || 20,
            caloriesBurned: 150 + Math.floor(Math.random() * 100),
            completed: true,
            difficultyFeedback: feedbackValue
        });
        toast.success(`Adaptive Intensity: ${feedbackValue === 'hard' ? 'Ease up slightly next time.' : feedbackValue === 'easy' ? 'Leveling you up next time!' : 'Perfect pace maintained!'}`);
    };

    if (!routine || !currentExercise) return <div>Workout not found</div>;

    if (completed) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-md mx-auto mt-20 text-center"
            >
                <div className="glass-card py-12">
                    <div className="w-24 h-24 bg-success/20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Trophy className="text-success" size={48} />
                    </div>
                    <h1 className="text-3xl font-bold mb-2">Workout Complete!</h1>
                    <p className="text-slate-400 mb-8">Great job! You've just leveled up your fitness.</p>

                    <div className="grid grid-cols-2 gap-4 mb-8">
                        <div className="bg-slate-800 p-4 rounded-xl">
                            <p className="text-xs text-slate-400 uppercase font-bold">Calories</p>
                            <p className="text-2xl font-bold">~240 kcal</p>
                        </div>
                        <div className="bg-slate-800 p-4 rounded-xl">
                            <p className="text-xs text-slate-400 uppercase font-bold">Time</p>
                            <p className="text-2xl font-bold">{routine.duration}m</p>
                        </div>
                    </div>

                    <div className="mb-8">
                        <p className="text-sm font-bold text-slate-400 uppercase mb-4">How was the intensity?</p>
                        <div className="grid grid-cols-3 gap-3">
                            {(['easy', 'perfect', 'hard'] as const).map(lev => (
                                <button
                                    key={lev}
                                    onClick={() => setFeedback(lev)}
                                    className={`py-3 rounded-xl border font-bold capitalize transition-all ${feedback === lev ? 'bg-primary border-primary text-white shadow-lg' : 'bg-slate-800 border-white/5 text-slate-400'}`}
                                >
                                    {lev}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="bg-primary/10 p-4 rounded-xl mb-8 border border-primary/20">
                        <p className="text-primary font-semibold text-sm">Adaptive Intensity Update</p>
                        <p className="text-xs text-slate-300 mt-1">Next time, we'll suggest 2 extra reps for Push-ups based on your speed!</p>
                    </div>

                    <div className="space-y-4">
                        <button
                            onClick={() => navigate('/')}
                            className="btn-primary w-full py-4 flex items-center justify-center gap-2"
                        >
                            Back to Dashboard <ArrowRight size={20} />
                        </button>
                        <button
                            onClick={() => navigate('/recovery')}
                            className="btn-secondary w-full py-4 flex items-center justify-center gap-2"
                        >
                            Wellness & Recovery <RefreshCcw size={20} />
                        </button>
                    </div>
                </div>
            </motion.div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto space-y-8">
            <div className="flex justify-between items-center">
                <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
                    <ChevronLeft size={20} /> Exit Workout
                </button>
                <div className="text-center">
                    <p className="text-xs text-slate-400 uppercase font-bold tracking-widest">Exercise {currentIndex + 1} of {workoutExercises.length}</p>
                    <h2 className="text-xl font-bold">{routine.name}</h2>
                </div>
                <div className="flex items-center gap-4">
                    {isDeviceConnected ? (
                        <div className="flex items-center gap-2 bg-danger/10 text-danger px-4 py-2 rounded-full border border-danger/20 animate-pulse">
                            <Heart size={16} fill="currentColor" />
                            <span className="font-black tabular-nums">{heartRate} BPM</span>
                        </div>
                    ) : (
                        <button
                            onClick={() => { setIsDeviceConnected(true); toast.success('Smartwatch Connected!'); }}
                            className="flex items-center gap-2 bg-slate-800 text-slate-400 px-4 py-2 rounded-full border border-white/5 hover:text-white transition-colors"
                        >
                            <Bluetooth size={16} />
                            <span className="text-xs font-bold">Sync Tracker</span>
                        </button>
                    )}
                    <div className="w-20" /> {/* Spacer */}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Video Side */}
                <div className="space-y-6">
                    <div className="aspect-video glass rounded-3xl overflow-hidden relative border-none">
                        <iframe
                            width="100%"
                            height="100%"
                            src={`${currentExercise.videoUrl}?autoplay=1&mute=1&controls=0&loop=1`}
                            title={currentExercise.name}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        ></iframe>
                        <div className="absolute top-4 left-4 flex gap-2">
                            <span className="bg-black/60 backdrop-blur-md text-white text-xs px-3 py-1 rounded-full flex items-center gap-1">
                                <Video size={12} /> Live Tutorial
                            </span>
                        </div>
                    </div>

                    <div className="glass-card">
                        <h3 className="text-2xl font-bold mb-4">{currentExercise.name}</h3>
                        <p className="text-slate-400 leading-relaxed">
                            {currentExercise.description}
                        </p>
                        <div className="mt-6 flex flex-wrap gap-2">
                            {currentExercise.muscleGroups.map(m => (
                                <span key={m} className="px-3 py-1 bg-slate-800 rounded-lg text-xs font-semibold text-slate-300">#{m}</span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Controls Side */}
                <div className="flex flex-col gap-6">
                    <div className="glass-card flex-1 flex flex-col items-center justify-center text-center py-12">
                        {currentExercise.defaultReps ? (
                            <div className="space-y-4">
                                <h4 className="text-slate-400 uppercase font-bold tracking-widest text-sm">Target Reps</h4>
                                <div className="text-8xl font-black gradient-text">x{currentExercise.defaultReps}</div>
                                <div className="text-slate-400 font-medium">Perform {currentExercise.defaultSets} sets</div>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                <h4 className="text-slate-400 uppercase font-bold tracking-widest text-sm">Timer</h4>
                                <div className="text-8xl font-black font-mono tracking-tighter tabular-nums">
                                    {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                                </div>

                                <div className="flex gap-4">
                                    <button
                                        onClick={() => setIsActive(!isActive)}
                                        className={`w-16 h-16 rounded-full flex items-center justify-center transition-all ${isActive ? 'bg-orange-500 shadow-lg shadow-orange-500/30' : 'bg-primary shadow-lg shadow-primary/30'
                                            }`}
                                    >
                                        {isActive ? <Pause fill="white" /> : <Play fill="white" />}
                                    </button>
                                    <button
                                        onClick={() => { setTimeLeft(currentExercise.defaultDuration || 60); setIsActive(false); }}
                                        className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center hover:bg-slate-700 transition-all"
                                    >
                                        <RotateCcw size={24} />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <button
                            onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
                            disabled={currentIndex === 0}
                            className="btn-secondary py-6 flex items-center justify-center gap-2 disabled:opacity-30"
                        >
                            <ChevronLeft size={20} /> Previous
                        </button>
                        <button
                            onClick={handleNext}
                            className="btn-primary py-6 flex items-center justify-center gap-2"
                        >
                            {currentIndex === workoutExercises.length - 1 ? 'Finish Workout' : 'Next Exercise'}
                            <ChevronRight size={20} />
                        </button>
                    </div>

                    <div className="glass-card bg-primary/5 border-primary/20">
                        <h4 className="text-sm font-bold text-primary flex items-center gap-2">
                            <CheckCircle2 size={16} /> Quick Tip
                        </h4>
                        <p className="text-xs text-slate-400 mt-2">
                            Focus on your breathing. Inhale as you lower, exhale as you push up. Keep your core tight.
                        </p>
                    </div>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="fixed bottom-0 left-0 right-0 h-2 bg-slate-800 z-50">
                <motion.div
                    className="h-full bg-primary"
                    initial={{ width: 0 }}
                    animate={{ width: `${((currentIndex + 1) / workoutExercises.length) * 100}%` }}
                />
            </div>
        </div>
    );
};

export default WorkoutPlayer;
