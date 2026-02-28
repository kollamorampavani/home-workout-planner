const db = require('./config/db');

const seed = async () => {
    try {
        console.log('Seeding routines...');
        await db.query(`
            INSERT INTO routines (id, name, goal, level, duration) VALUES 
            ('starter-strength', 'Starter Strength', 'strength', 'beginner', 20),
            ('fat-burn-hiit', 'Fat Burn HIIT', 'fat-loss', 'intermediate', 30),
            ('yoga-flow', 'Morning Yoga Flow', 'flexibility', 'beginner', 20)
            ON CONFLICT (id) DO NOTHING
        `);

        console.log('Seeding exercises...');
        const exercises = [
            ['pushups', 'Pushups', '3 sets of 10', JSON.stringify(['Chest', 'Triceps'])],
            ['squats', 'Squats', '3 sets of 15', JSON.stringify(['Quads', 'Glutes'])],
            ['plank', 'Plank', '3 sets of 30s', JSON.stringify(['Core'])],
            ['burpees', 'Burpees', '3 sets of 10', JSON.stringify(['Full Body'])],
            ['jumping-jacks', 'Jumping Jacks', '3 mins', JSON.stringify(['Cardio'])],
            ['downward-dog', 'Downward Dog', '1 min', JSON.stringify(['Flexibility'])]
        ];

        for (const [id, name, desc, groups] of exercises) {
            await db.query(
                'INSERT INTO exercises (id, name, description, muscle_groups) VALUES ($1, $2, $3, $4) ON CONFLICT (id) DO NOTHING',
                [id, name, desc, groups]
            );
        }

        console.log('Linking routines and exercises...');
        const links = [
            ['starter-strength', 'pushups', 1],
            ['starter-strength', 'squats', 2],
            ['starter-strength', 'plank', 3],
            ['fat-burn-hiit', 'jumping-jacks', 1],
            ['fat-burn-hiit', 'burpees', 2],
            ['fat-burn-hiit', 'pushups', 3],
            ['fat-burn-hiit', 'squats', 4],
            ['yoga-flow', 'downward-dog', 1],
            ['yoga-flow', 'plank', 2]
        ];

        for (const [rid, eid, pos] of links) {
            await db.query(
                'INSERT INTO routine_exercises (routine_id, exercise_id, position) VALUES ($1, $2, $3) ON CONFLICT DO NOTHING',
                [rid, eid, pos]
            );
        }

        console.log('Seeding complete!');
    } catch (err) {
        console.error('Seeding failed:', err);
    } finally {
        process.exit();
    }
};

seed();
