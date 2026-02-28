

export interface Routine {
    id: string;
    name: string;
    goal: 'strength' | 'fat-loss' | 'flexibility';
    level: 'beginner' | 'intermediate' | 'advanced';
    duration: number; // minutes
    exercises: string[]; // exercise ids
}

export const routines: Routine[] = [
    {
        id: 'starter-strength',
        name: 'Starter Strength',
        goal: 'strength',
        level: 'beginner',
        duration: 20,
        exercises: ['pushups', 'squats', 'plank']
    },
    {
        id: 'fat-burn-hiit',
        name: 'Fat Burn HIIT',
        goal: 'fat-loss',
        level: 'intermediate',
        duration: 30,
        exercises: ['jumping-jacks', 'burpees', 'squats', 'pushups']
    },
    {
        id: 'yoga-flow',
        name: 'Morning Yoga Flow',
        goal: 'flexibility',
        level: 'beginner',
        duration: 20,
        exercises: ['downward-dog', 'plank']
    }
];

export const getRoutineForUser = (goal: string, level: string, time: number) => {
    return routines.find(r => r.goal === goal && r.level === level) || routines[0];
};
