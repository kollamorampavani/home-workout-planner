import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { motion } from 'framer-motion';
import { Target, TrendingUp, Zap, Clock, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';

const Onboarding = () => {
    const [step, setStep] = useState(1);
    const { user, updateUser } = useStore();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        goal: user?.goal || 'strength',
        level: user?.level || 'beginner',
        time: user?.time || 30
    });

    const goals = [
        { id: 'strength', label: 'Strength Building', icon: Zap, desc: 'Build muscle and increase power' },
        { id: 'fat-loss', label: 'Fat Loss', icon: TrendingUp, desc: 'Burn calories and get lean' },
        { id: 'flexibility', label: 'Flexibility', icon: Target, desc: 'Improve mobility and posture' },
    ];

    const levels = [
        { id: 'beginner', label: 'Beginner', desc: 'New to working out' },
        { id: 'intermediate', label: 'Intermediate', desc: 'Consistent for 6+ months' },
        { id: 'advanced', label: 'Advanced', desc: 'Experienced athlete' },
    ];

    const times = [20, 30, 45, 60];

    const handleComplete = () => {
        updateUser({
            ...formData,
            onboarded: true
        } as any);
        toast.success('Profile setup complete!');
        navigate('/');
    };

    return (
        <div className="max-w-4xl mx-auto py-12 px-4">
            <div className="mb-12 text-center">
                <h1 className="text-4xl font-bold mb-6">Personalize Your Journey</h1>
                <p className="text-xl text-slate-400">Let's tailor your workout plan to your specific needs.</p>

                <div className="flex justify-center gap-4 mt-12">
                    {[1, 2, 3].map((s) => (
                        <div
                            key={s}
                            className={`h-3 rounded-full transition-all duration-300 ${s === step ? 'w-20 bg-primary' : 'w-3 bg-slate-700'
                                }`}
                        />
                    ))}
                </div>
            </div>

            <motion.div
                key={step}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="glass-card p-10"
            >
                {step === 1 && (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold mb-6">What is your main goal?</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {goals.map((g) => (
                                <button
                                    key={g.id}
                                    onClick={() => setFormData({ ...formData, goal: g.id as any })}
                                    className={`p-8 rounded-3xl text-left border-3 transition-all ${formData.goal === g.id
                                        ? 'border-primary bg-primary/10'
                                        : 'border-transparent bg-slate-800/50 hover:bg-slate-800'
                                        }`}
                                >
                                    <g.icon className={formData.goal === g.id ? 'text-primary' : 'text-slate-400'} size={48} />
                                    <h3 className="text-xl font-bold mt-6">{g.label}</h3>
                                    <p className="text-base text-slate-400 mt-2">{g.desc}</p>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold mb-6">Choose your fitness level</h2>
                        <div className="grid grid-cols-1 gap-4">
                            {levels.map((l) => (
                                <button
                                    key={l.id}
                                    onClick={() => setFormData({ ...formData, level: l.id as any })}
                                    className={`p-6 rounded-2xl text-left border-2 transition-all flex justify-between items-center ${formData.level === l.id
                                        ? 'border-primary bg-primary/10'
                                        : 'border-transparent bg-slate-800/50 hover:bg-slate-800'
                                        }`}
                                >
                                    <div>
                                        <h3 className="text-lg font-bold">{l.label}</h3>
                                        <p className="text-sm text-slate-400 mt-1">{l.desc}</p>
                                    </div>
                                    {formData.level === l.id && <Zap className="text-primary fill-primary" size={24} />}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                            <Clock className="text-primary" /> How much time do you have?
                        </h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {times.map((t) => (
                                <button
                                    key={t}
                                    onClick={() => setFormData({ ...formData, time: t })}
                                    className={`p-8 rounded-2xl text-center border-2 transition-all ${formData.time === t
                                        ? 'border-primary bg-primary/10'
                                        : 'border-transparent bg-slate-800/50 hover:bg-slate-800'
                                        }`}
                                >
                                    <span className="text-2xl font-bold">{t}</span>
                                    <p className="text-sm text-slate-400">min</p>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                <div className="mt-12 flex justify-between">
                    <button
                        onClick={() => setStep(step - 1)}
                        disabled={step === 1}
                        className={`px-8 py-3 rounded-xl font-semibold transition-all ${step === 1 ? 'opacity-0' : 'hover:bg-slate-800'
                            }`}
                    >
                        Back
                    </button>

                    <button
                        onClick={() => step < 3 ? setStep(step + 1) : handleComplete()}
                        className="btn-primary flex items-center gap-2 px-10"
                    >
                        {step === 3 ? 'Complete Setup' : 'Continue'}
                        <ChevronRight size={20} />
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default Onboarding;
