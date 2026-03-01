import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    ChevronLeft,
    ChevronRight,
    Plus,
    Clock,
    Dumbbell,
    Utensils,
    Zap,
    ExternalLink,
    X,
    FileText,
    Calendar
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import toast from 'react-hot-toast';

type ScheduledEvent = {
    id: number;
    title: string;
    time: string;
    type: string;
    color: string;
};

const Schedule = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());
    const today = new Date();

    // Custom Activities State
    const [customActivities, setCustomActivities] = useState<Record<string, ScheduledEvent[]>>(() => {
        const saved = localStorage.getItem('custom_activities');
        return saved ? JSON.parse(saved) : {};
    });

    // Add Activity Modal State
    const [isAddingActivity, setIsAddingActivity] = useState(false);
    const [newActivity, setNewActivity] = useState({
        title: '',
        time: '08:00 AM',
        type: 'workout',
        color: 'bg-primary'
    });

    const saveCustomActivity = () => {
        if (!newActivity.title) {
            toast.error('Please enter an activity name');
            return;
        }

        const dateKey = selectedDate.toDateString();
        const activity: ScheduledEvent = {
            id: Date.now(),
            ...newActivity
        };

        const updated = {
            ...customActivities,
            [dateKey]: [...(customActivities[dateKey] || []), activity]
        };

        setCustomActivities(updated);
        localStorage.setItem('custom_activities', JSON.stringify(updated));
        toast.success(`Scheduled ${newActivity.title}`);
        setIsAddingActivity(false);
        setNewActivity({ title: '', time: '08:00 AM', type: 'workout', color: 'bg-primary' });
    };

    const deleteActivity = (id: number) => {
        const dateKey = selectedDate.toDateString();
        const updated = {
            ...customActivities,
            [dateKey]: customActivities[dateKey].filter(a => a.id !== id)
        };
        setCustomActivities(updated);
        localStorage.setItem('custom_activities', JSON.stringify(updated));
        toast.success('Activity removed');
    };

    // Notes Modal State
    const [activeEvent, setActiveEvent] = useState<ScheduledEvent | null>(null);
    const [notes, setNotes] = useState<Record<number, string>>(() => {
        const saved = localStorage.getItem('schedule_notes');
        return saved ? JSON.parse(saved) : {};
    });
    const [tempNote, setTempNote] = useState('');

    const saveNote = () => {
        if (activeEvent) {
            const updatedNotes = { ...notes, [activeEvent.id]: tempNote };
            setNotes(updatedNotes);
            localStorage.setItem('schedule_notes', JSON.stringify(updatedNotes));
            toast.success(`Note saved for ${activeEvent.title}`);
            setActiveEvent(null);
        }
    };

    const addToCalendar = (event?: ScheduledEvent) => {
        const formatGCalDate = (date: Date) => {
            const pad = (n: number) => n.toString().padStart(2, '0');
            return `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}T${pad(date.getHours())}${pad(date.getMinutes())}${pad(date.getSeconds())}`;
        };

        let start = new Date(selectedDate);
        let end = new Date(selectedDate);

        if (event) {
            // Parse "HH:MM AM/PM"
            const [time, period] = event.time.split(' ');
            let [hours, minutes] = time.split(':').map(Number);
            if (period === 'PM' && hours < 12) hours += 12;
            if (period === 'AM' && hours === 12) hours = 0;

            start.setHours(hours, minutes, 0, 0);
            end = new Date(start);
            end.setHours(start.getHours() + 1); // 1-hour duration
        } else {
            // Default time for group sync if no specific event
            start.setHours(today.getHours(), 0, 0, 0);
            end.setHours(today.getHours() + 1, 0, 0, 0);
        }

        const dates = `${formatGCalDate(start)}/${formatGCalDate(end)}`;
        const title = event ? event.title : "";

        let url = `https://calendar.google.com/calendar/render?action=TEMPLATE&dates=${dates}&details=Workout session scheduled via Home Workout Planner`;
        if (title) {
            url += `&text=${encodeURIComponent(title)}`;
        }

        window.open(url, '_blank');
        toast.success('Opening Google Calendar to save your schedule');
    };

    const prevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
    };
    const nextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
    };

    const handleDayClick = (dayNumber: number) => {
        const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), dayNumber);
        setSelectedDate(newDate);
    };

    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    // Structured weekly timetable logic
    const getEventsForDate = (date: Date) => {
        const dayOfWeek = date.getDay(); // 0 (Sun) to 6 (Sat)

        const plans = {
            strength: [
                { id: 101, title: 'Protein Breakfast', time: '07:00 AM', type: 'meal', color: 'bg-orange-500' },
                { id: 102, title: 'Upper Body Strength', time: '08:30 AM', type: 'workout', color: 'bg-primary' },
                { id: 103, title: 'Post-Workout Shake', time: '10:30 AM', type: 'meal', color: 'bg-orange-400' },
                { id: 104, title: 'Recovery Lunch', time: '01:30 PM', type: 'meal', color: 'bg-orange-500' },
                { id: 105, title: 'Evening Mobility', time: '06:00 PM', type: 'workout', color: 'bg-accent' },
            ],
            cardio: [
                { id: 201, title: 'Fasted Cardio HIIT', time: '06:30 AM', type: 'workout', color: 'bg-accent' },
                { id: 202, title: 'High Energy Oats', time: '08:30 AM', type: 'meal', color: 'bg-orange-500' },
                { id: 203, title: 'Power Bowl Lunch', time: '12:30 PM', type: 'meal', color: 'bg-orange-500' },
                { id: 204, title: 'Core & Abs Session', time: '05:30 PM', type: 'workout', color: 'bg-primary' },
            ],
            recovery: [
                { id: 301, title: 'Morning Yoga Flow', time: '09:00 AM', type: 'workout', color: 'bg-primary' },
                { id: 302, title: 'Bulk Meal Prep', time: '11:00 AM', type: 'meal', color: 'bg-indigo-500' },
                { id: 303, title: 'Healthy Snack Prep', time: '03:00 PM', type: 'meal', color: 'bg-orange-400' },
                { id: 304, title: 'Deep Stretching', time: '08:00 PM', type: 'workout', color: 'bg-accent' },
            ]
        };

        const staticEvents = (() => {
            switch (dayOfWeek) {
                case 1: // Mon
                case 3: // Wed
                case 5: // Fri
                    return plans.strength;
                case 2: // Tue
                case 4: // Thu
                    return plans.cardio;
                case 6: // Sat
                    return plans.recovery;
                default: // Sun (Rest)
                    return [];
            }
        })();

        const userEvents = customActivities[date.toDateString()] || [];
        return [...staticEvents, ...userEvents].sort((a, b) => {
            const timeA = new Date(`1970/01/01 ${a.time}`).getTime();
            const timeB = new Date(`1970/01/01 ${b.time}`).getTime();
            return timeA - timeB;
        });
    };

    const currentEvents = getEventsForDate(selectedDate);

    const getDaysInMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    const getFirstDayOfMonth = (date: Date) => {
        const day = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
        return day === 0 ? 6 : day - 1; // Adjust for Monday start
    };

    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);

    const isToday = (day: number) => {
        return today.getDate() === day &&
            today.getMonth() === currentDate.getMonth() &&
            today.getFullYear() === currentDate.getFullYear();
    };

    const isSelected = (day: number) => {
        return selectedDate.getDate() === day &&
            selectedDate.getMonth() === currentDate.getMonth() &&
            selectedDate.getFullYear() === currentDate.getFullYear();
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
        >
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold">Workout Schedule</h1>
                    <p className="text-slate-400">Sync with your calendar and manage your routine.</p>
                </div>
                <div className="flex gap-4">
                    <button
                        onClick={() => addToCalendar()}
                        className="btn-primary flex items-center gap-2"
                    >
                        <Calendar size={18} />
                        Add to Calendar
                    </button>
                    <button
                        onClick={() => window.open('https://calendar.google.com', '_blank')}
                        className="btn-secondary flex items-center gap-2"
                    >
                        <ExternalLink size={18} />
                        View Calendar
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Calendar View */}
                <div className="lg:col-span-3 space-y-6">
                    <div className="glass-card">
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="text-xl font-bold">
                                {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                            </h3>
                            <div className="flex gap-2">
                                <button onClick={prevMonth} className="p-2 hover:bg-slate-800 rounded-lg"><ChevronLeft size={20} /></button>
                                <button onClick={nextMonth} className="p-2 hover:bg-slate-800 rounded-lg"><ChevronRight size={20} /></button>
                            </div>
                        </div>

                        <div className="grid grid-cols-7 gap-2">
                            {days.map(d => (
                                <div key={d} className="text-center text-xs font-bold text-slate-500 uppercase pb-4">{d}</div>
                            ))}

                            {/* Empty cells for padding */}
                            {Array.from({ length: firstDay }).map((_, i) => (
                                <div key={`empty-${i}`} className="aspect-square" />
                            ))}

                            {/* Actual days */}
                            {Array.from({ length: daysInMonth }).map((_, i) => {
                                const dayNumber = i + 1;
                                const active = isToday(dayNumber);
                                const selected = isSelected(dayNumber);
                                return (
                                    <div
                                        key={dayNumber}
                                        onClick={() => handleDayClick(dayNumber)}
                                        className={`aspect-square rounded-xl flex flex-col items-center justify-center relative hover:bg-slate-800/50 cursor-pointer transition-all ${selected ? 'bg-primary shadow-lg shadow-primary-glow border border-primary/50 scale-105' : active ? 'bg-primary/10 border border-primary/30' : 'bg-slate-800/10'
                                            }`}
                                    >
                                        <span className={`text-sm font-bold ${selected ? 'text-white' : active ? 'text-primary' : 'text-slate-400'}`}>{dayNumber}</span>
                                        <div className="flex gap-1 mt-1">
                                            {dayNumber % 3 === 0 && <div className={`w-1.5 h-1.5 rounded-full ${selected ? 'bg-white' : 'bg-primary'}`} />}
                                            {dayNumber % 4 === 0 && <div className={`w-1.5 h-1.5 rounded-full ${selected ? 'bg-white' : 'bg-orange-500'}`} />}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="glass-card">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold">Time Blocking Plan</h3>
                            <button
                                onClick={() => setIsAddingActivity(true)}
                                className="text-sm font-bold text-primary flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 rounded-xl hover:bg-primary/20 transition-all"
                            >
                                <Plus size={16} /> Schedule Activity
                            </button>
                        </div>
                        <div className="flex items-center gap-2 mb-6">
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Selected Date:</span>
                            <span className="text-sm font-bold text-white px-3 py-1 bg-slate-800 rounded-full border border-white/5">
                                {selectedDate.toLocaleDateString('default', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </span>
                        </div>
                        <div className="space-y-4">
                            {currentEvents.length > 0 ? currentEvents.map(event => (
                                <div key={event.id} className="flex gap-6 p-6 bg-slate-800/20 rounded-2xl hover:bg-slate-800/40 transition-all cursor-pointer group">
                                    <div className="w-16 flex flex-col items-center justify-center border-r border-white/5 pr-6">
                                        <span className="text-xs font-bold text-slate-500 uppercase">{event.time.split(' ')[1]}</span>
                                        <span className="text-lg font-bold">{event.time.split(' ')[0]}</span>
                                    </div>
                                    <div className="flex-1 flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white ${event.color}`}>
                                                {event.type === 'workout' ? <Dumbbell size={20} /> : <Utensils size={20} />}
                                            </div>
                                            <div>
                                                <h4 className="font-bold">{event.title}</h4>
                                                <p className="text-xs text-slate-500">Scheduled for {isSelected(selectedDate.getDate()) ? 'Today' : 'this date'}</p>
                                            </div>
                                        </div>
                                        <div className="flex h-full items-center gap-2">
                                            {notes[event.id] && (
                                                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                                                    <FileText size={16} />
                                                </div>
                                            )}
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    if (confirm('Remove this activity from your schedule?')) {
                                                        deleteActivity(event.id);
                                                    }
                                                }}
                                                className="p-2 hover:bg-danger/10 rounded-lg transition-colors group/del"
                                                title="Remove Activity"
                                            >
                                                <X size={18} className="text-slate-600 group-hover/del:text-danger transition-colors" />
                                            </button>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    addToCalendar(event as ScheduledEvent);
                                                }}
                                                className="p-2 hover:bg-primary/10 rounded-lg transition-colors group/cal"
                                                title="Add to Google Calendar"
                                            >
                                                <Calendar size={20} className="text-slate-600 group-hover/cal:text-primary transition-colors" />
                                            </button>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setActiveEvent(event as ScheduledEvent);
                                                    setTempNote(notes[event.id] || '');
                                                }}
                                                className="p-2 hover:bg-primary/10 rounded-lg transition-colors group/btn"
                                                title="Add Notes"
                                            >
                                                <FileText size={20} className="text-slate-600 group-hover/btn:text-primary transition-colors" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )) : (
                                <div className="text-center py-12">
                                    <p className="text-slate-500 mb-6">No activities scheduled for this day.</p>
                                    <button
                                        onClick={() => setIsAddingActivity(true)}
                                        className="btn-primary flex items-center gap-2 mx-auto"
                                    >
                                        <Plus size={18} /> Schedule Custom Activity
                                    </button>
                                    <div className="mt-4">
                                        <Link to="/workouts" className="text-sm font-bold text-primary hover:underline">Or explore routines</Link>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Sidebar Controls */}
                <div className="space-y-6">
                    <div className="glass-card bg-primary/10 border-primary/20">
                        <h4 className="font-bold flex items-center gap-2 mb-4">
                            <Zap className="text-primary" size={18} /> Smart Reminders
                        </h4>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-slate-300">Daily Workout</span>
                                <div className="w-10 h-5 bg-primary rounded-full relative">
                                    <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full" />
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-slate-300">Stretching Alert</span>
                                <div className="w-10 h-5 bg-primary rounded-full relative">
                                    <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full" />
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-slate-300">Meal Prep</span>
                                <div className="w-10 h-5 bg-slate-700 rounded-full relative">
                                    <div className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="glass-card">
                        <h4 className="font-bold mb-4">Weekly Focus</h4>
                        <div className="space-y-4">
                            <div className="p-4 bg-slate-800/50 rounded-xl">
                                <p className="text-xs text-slate-500 font-bold uppercase mb-2">Primary Goal</p>
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center text-accent">
                                        <Clock size={16} />
                                    </div>
                                    <span className="font-bold text-sm">Consistent Cardio</span>
                                </div>
                            </div>
                            <div className="p-4 bg-slate-800/50 rounded-xl">
                                <p className="text-xs text-slate-500 font-bold uppercase mb-2">Rest Days</p>
                                <div className="flex gap-2">
                                    <span className="px-3 py-1 bg-slate-700 rounded-lg text-xs font-bold text-slate-300">Sat</span>
                                    <span className="px-3 py-1 bg-slate-700 rounded-lg text-xs font-bold text-slate-300">Sun</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Notes Modal */}
            <AnimatePresence>
                {activeEvent && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="glass-card w-full max-w-lg p-0 overflow-hidden shadow-2xl border-white/10"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="p-6 border-b border-white/5 flex justify-between items-center bg-slate-900/50">
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white ${activeEvent.color}`}>
                                        {activeEvent.type === 'workout' ? <Dumbbell size={20} /> : <Utensils size={20} />}
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold">{activeEvent.title}</h3>
                                        <p className="text-sm text-slate-400">{activeEvent.time}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setActiveEvent(null)}
                                    className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="p-6 space-y-4">
                                <div>
                                    <label className="block text-sm font-bold text-slate-400 uppercase mb-2">Activity Notes</label>
                                    <textarea
                                        value={tempNote}
                                        onChange={(e) => setTempNote(e.target.value)}
                                        placeholder="Add details like weights, reps, or meal components..."
                                        className="w-full h-40 bg-slate-900/50 border border-white/10 rounded-2xl p-4 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-primary/50 transition-colors resize-none"
                                        autoFocus
                                    />
                                </div>
                                <div className="flex gap-4">
                                    <button
                                        onClick={() => setActiveEvent(null)}
                                        className="flex-1 px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold transition-all"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={saveNote}
                                        className="flex-1 px-6 py-3 rounded-xl bg-primary hover:bg-primary-hover text-white font-bold shadow-lg shadow-primary-glow transition-all"
                                    >
                                        Save Note
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
            {/* Add Activity Modal */}
            <AnimatePresence>
                {isAddingActivity && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="glass-card w-full max-w-md p-0 overflow-hidden shadow-2xl border-white/10"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="p-6 border-b border-white/5 flex justify-between items-center bg-slate-900/50">
                                <h3 className="text-xl font-bold flex items-center gap-2">
                                    <Calendar className="text-primary" size={20} /> Schedule Activity
                                </h3>
                                <button
                                    onClick={() => setIsAddingActivity(false)}
                                    className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="p-6 space-y-5">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2 tracking-widest">Activity Name</label>
                                    <input
                                        type="text"
                                        placeholder="e.g., Morning Run, Leg Day..."
                                        value={newActivity.title}
                                        onChange={(e) => setNewActivity({ ...newActivity, title: e.target.value })}
                                        className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50 transition-colors"
                                        autoFocus
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase mb-2 tracking-widest">Time</label>
                                        <select
                                            value={newActivity.time}
                                            onChange={(e) => setNewActivity({ ...newActivity, time: e.target.value })}
                                            className="w-full bg-slate-900 text-white rounded-xl px-4 py-3 border border-white/10 focus:outline-none focus:border-primary/50"
                                        >
                                            {Array.from({ length: 24 }).map((_, i) => {
                                                const hour = i % 12 || 12;
                                                const ampm = i < 12 ? 'AM' : 'PM';
                                                const timeStr = `${hour.toString().padStart(2, '0')}:00 ${ampm}`;
                                                return <option key={i} value={timeStr}>{timeStr}</option>;
                                            })}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase mb-2 tracking-widest">Category</label>
                                        <div className="grid grid-cols-2 gap-2">
                                            <button
                                                onClick={() => setNewActivity({ ...newActivity, type: 'workout', color: 'bg-primary' })}
                                                className={`py-2 rounded-lg text-xs font-bold border ${newActivity.type === 'workout' ? 'bg-primary border-primary' : 'bg-slate-800 border-transparent hover:border-slate-600'}`}
                                            >
                                                Workout
                                            </button>
                                            <button
                                                onClick={() => setNewActivity({ ...newActivity, type: 'meal', color: 'bg-orange-500' })}
                                                className={`py-2 rounded-lg text-xs font-bold border ${newActivity.type === 'meal' ? 'bg-orange-500 border-orange-500' : 'bg-slate-800 border-transparent hover:border-slate-600'}`}
                                            >
                                                Meal
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-4 flex gap-4">
                                    <button
                                        onClick={() => setIsAddingActivity(false)}
                                        className="flex-1 px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold transition-all"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={saveCustomActivity}
                                        className="flex-1 px-6 py-3 rounded-xl bg-primary hover:bg-primary-hover text-white font-bold shadow-lg shadow-primary-glow transition-all"
                                    >
                                        Schedule
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default Schedule;
