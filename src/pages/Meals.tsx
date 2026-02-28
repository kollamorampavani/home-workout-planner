import { useEffect } from 'react';
import { useStore } from '../store/useStore';
import { meals } from '../data/meals';
import toast from 'react-hot-toast';
import {
    Utensils,
    Flame,
    ChevronRight,
    CheckCircle2,
    BookOpen,
    PieChart as PieIcon,
    History
} from 'lucide-react';
import { motion } from 'framer-motion';

const Meals = () => {
    const { user, addMealToDiary, mealDiary, fetchMealDiary } = useStore();

    useEffect(() => {
        fetchMealDiary();
    }, [fetchMealDiary]);

    const recommendedMeals = meals.filter(m => m.goal === user?.goal);

    const handleAddMeal = async (meal: any) => {
        try {
            await addMealToDiary(meal);
            toast.success('Added to your diary!');
        } catch (error) {
            toast.error('Failed to add meal');
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold">Nutrition Plan</h1>
                    <p className="text-slate-400">Personalized meals based on your "{user?.goal}" goal.</p>
                </div>
                <div className="hidden md:flex gap-6">
                    <div className="text-right">
                        <p className="text-xs text-slate-500 uppercase font-bold">Daily Target</p>
                        <p className="text-xl font-bold">2,400 kcal</p>
                    </div>
                    <div className="text-right">
                        <p className="text-xs text-slate-500 uppercase font-bold">Protein</p>
                        <p className="text-xl font-bold text-primary">160g</p>
                    </div>
                </div>
            </div>

            {/* Recommended Meals Grid */}
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Utensils className="text-primary" /> Recommended for You
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recommendedMeals.length > 0 ? recommendedMeals.map((meal, idx) => (
                    <motion.div
                        key={meal.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.1 }}
                        className="glass-card group"
                    >
                        <div className="flex justify-between items-start mb-6">
                            <div className="w-14 h-14 bg-slate-800 rounded-2xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                                <Utensils size={28} />
                            </div>
                            <div className="text-right">
                                <span className="text-2xl font-black gradient-text">{meal.calories}</span>
                                <p className="text-xs text-slate-500 uppercase font-bold">kcal</p>
                            </div>
                        </div>

                        <h3 className="text-xl font-bold mb-4">{meal.name}</h3>

                        <div className="grid grid-cols-3 gap-2 mb-6">
                            <div className="bg-slate-800/50 p-2 rounded-xl text-center">
                                <p className="text-[10px] text-slate-500 font-bold">PRO</p>
                                <p className="text-sm font-bold">{meal.protein}g</p>
                            </div>
                            <div className="bg-slate-800/50 p-2 rounded-xl text-center">
                                <p className="text-[10px] text-slate-500 font-bold">CARB</p>
                                <p className="text-sm font-bold">{meal.carbs}g</p>
                            </div>
                            <div className="bg-slate-800/50 p-2 rounded-xl text-center">
                                <p className="text-[10px] text-slate-500 font-bold">FAT</p>
                                <p className="text-sm font-bold">{meal.fat}g</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h4 className="text-sm font-bold text-slate-300 flex items-center gap-2">
                                <BookOpen size={14} /> Quick Recipe
                            </h4>
                            <ul className="space-y-2">
                                {meal.recipe.map((step, i) => (
                                    <li key={i} className="text-xs text-slate-400 flex items-start gap-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1 shrink-0" />
                                        {step}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <button
                            onClick={() => handleAddMeal(meal)}
                            className="w-full mt-8 py-3 bg-slate-800 hover:bg-primary rounded-xl font-bold transition-all flex items-center justify-center gap-2"
                        >
                            Add to Diary <ChevronRight size={18} />
                        </button>
                    </motion.div>
                )) : (
                    <div className="glass-card col-span-full">
                        <p className="text-center text-slate-400">No specific meals found for your goal. Defaulting to general healthy options.</p>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Diary */}
                <div className="lg:col-span-2 glass-card">
                    <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <History className="text-primary" /> Recent Diary
                    </h3>
                    {mealDiary.length > 0 ? (
                        <div className="space-y-4">
                            {mealDiary.slice(0, 5).map((entry, i) => (
                                <div key={i} className="flex items-center justify-between p-4 bg-slate-800/30 rounded-2xl">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                            <Utensils size={20} />
                                        </div>
                                        <div>
                                            <p className="font-bold">{entry.meal_name}</p>
                                            <p className="text-xs text-slate-500">{new Date(entry.date).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold">{entry.calories} kcal</p>
                                        <p className="text-xs text-slate-500">{entry.protein}g P • {entry.carbs}g C • {entry.fat}g F</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-center text-slate-500 py-8">Your diary is empty. Start adding meals!</p>
                    )}
                </div>
                <div className="glass-card">
                    <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <PieIcon className="text-accent" /> Macro Breakdown
                    </h3>
                    <div className="space-y-6">
                        {[
                            { label: 'Proteins', value: 40, color: 'bg-primary' },
                            { label: 'Carbs', value: 40, color: 'bg-accent' },
                            { label: 'Fats', value: 20, color: 'bg-orange-500' }
                        ].map((m) => (
                            <div key={m.label}>
                                <div className="flex justify-between text-sm mb-2">
                                    <span className="font-bold">{m.label}</span>
                                    <span className="text-slate-400">{m.value}%</span>
                                </div>
                                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                                    <div className={`h-full ${m.color}`} style={{ width: `${m.value}%` }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Healthy Tips */}
                <div className="glass-card bg-primary/10 border-primary/20">
                    <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <Flame className="text-primary" /> Nutrition Tips
                    </h3>
                    <div className="space-y-4">
                        <div className="flex gap-4">
                            <div className="shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                                <CheckCircle2 size={18} />
                            </div>
                            <div>
                                <p className="font-bold text-sm">Hydration is Key</p>
                                <p className="text-xs text-slate-400 mt-1">Drink at least 3 liters of water daily to support muscle recovery and metabolism.</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                                <CheckCircle2 size={18} />
                            </div>
                            <div>
                                <p className="font-bold text-sm">Meal Timing</p>
                                <p className="text-xs text-slate-400 mt-1">Consume protein-rich meals within 2 hours post-workout to maximize muscle protein synthesis.</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                                <CheckCircle2 size={18} />
                            </div>
                            <div>
                                <p className="font-bold text-sm">Whole Foods</p>
                                <p className="text-xs text-slate-400 mt-1">Prioritize whole, unprocessed foods over supplements whenever possible.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Meals;
