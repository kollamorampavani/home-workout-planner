const pool = require('./config/db');

const exercises = [
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
        defaultSets: 3,
        defaultDuration: 0
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
        defaultSets: 3,
        defaultDuration: 0
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
        defaultReps: 0,
        defaultSets: 0,
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
        defaultReps: 0,
        defaultSets: 0,
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
        defaultSets: 3,
        defaultDuration: 0
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
        defaultReps: 0,
        defaultSets: 0,
        defaultDuration: 30
    }
];

const routines = [
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

const seed = async () => {
    try {
        console.log('Seeding database...');

        // Seed Exercises
        for (const ex of exercises) {
            await pool.query(
                'INSERT INTO exercises (id, name, description, category, muscle_groups, equipment, video_url, intensity, default_reps, default_sets, default_duration) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
                [ex.id, ex.name, ex.description, ex.category, JSON.stringify(ex.muscleGroups), ex.equipment, ex.videoUrl, ex.intensity, ex.defaultReps, ex.defaultSets, ex.defaultDuration]
            );
        }

        // Seed Routines
        for (const routine of routines) {
            await pool.query(
                'INSERT INTO routines (id, name, goal, level, duration) VALUES (?, ?, ?, ?, ?)',
                [routine.id, routine.name, routine.goal, routine.level, routine.duration]
            );

            // Seed Routine Exercises
            for (let i = 0; i < routine.exercises.length; i++) {
                await pool.query(
                    'INSERT INTO routine_exercises (routine_id, exercise_id, position) VALUES (?, ?, ?)',
                    [routine.id, routine.exercises[i], i + 1]
                );
            }
        }

        console.log('Seeding complete!');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seed();
