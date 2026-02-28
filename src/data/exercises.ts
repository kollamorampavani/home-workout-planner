export interface Exercise {
    id: string;
    name: string;
    description: string;
    category: 'cardio' | 'strength' | 'yoga';
    muscleGroups: string[];
    equipment: 'none' | 'dumbbells' | 'bands';
    videoUrl: string;
    intensity: 'low' | 'medium' | 'high';
    defaultReps?: number;
    defaultSets?: number;
    defaultDuration?: number; // in seconds
}

export const exercises: Exercise[] = [
    {
        id: 'pushups',
        name: 'Push-Ups',
        description: 'A classic upper body exercise that works the chest, shoulders, and triceps.',
        category: 'strength',
        muscleGroups: ['chest', 'shoulders', 'triceps'],
        equipment: 'none',
        videoUrl: 'https://www.youtube.com/embed/IODxDxX7oi4',
        intensity: 'medium',
        defaultReps: 12,
        defaultSets: 3
    },
    {
        id: 'squats',
        name: 'Air Squats',
        description: 'Build leg strength and mobility with this fundamental movement.',
        category: 'strength',
        muscleGroups: ['quads', 'glutes', 'hamstrings'],
        equipment: 'none',
        videoUrl: 'https://www.youtube.com/embed/aclHkVaku9U',
        intensity: 'medium',
        defaultReps: 15,
        defaultSets: 3
    },
    {
        id: 'jumping-jacks',
        name: 'Jumping Jacks',
        description: 'Full body cardio exercise to get your heart rate up.',
        category: 'cardio',
        muscleGroups: ['full body'],
        equipment: 'none',
        videoUrl: 'https://www.youtube.com/embed/iSSAk4XCsRA',
        intensity: 'low',
        defaultDuration: 60
    },
    {
        id: 'plank',
        name: 'Forearm Plank',
        description: 'Core stability exercise that engages your entire midsection.',
        category: 'strength',
        muscleGroups: ['core', 'abs'],
        equipment: 'none',
        videoUrl: 'https://www.youtube.com/embed/pSHjTRCQxIw',
        intensity: 'medium',
        defaultDuration: 45
    },
    {
        id: 'burpees',
        name: 'Burpees',
        description: 'Explosive full-body movement for strength and aerobic conditioning.',
        category: 'cardio',
        muscleGroups: ['full body'],
        equipment: 'none',
        videoUrl: 'https://www.youtube.com/embed/dZfeV7UAx90',
        intensity: 'high',
        defaultReps: 10,
        defaultSets: 3
    },
    {
        id: 'downward-dog',
        name: 'Downward Facing Dog',
        description: 'A fundamental yoga pose that stretches and strengthens the entire body.',
        category: 'yoga',
        muscleGroups: ['shoulders', 'hamstrings', 'calves'],
        equipment: 'none',
        videoUrl: 'https://www.youtube.com/embed/j97P6mU4I_U',
        intensity: 'low',
        defaultDuration: 30
    }
];
