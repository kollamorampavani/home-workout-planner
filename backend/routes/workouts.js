const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const db = require('../config/db');

// @route   GET api/workouts/routines
// @desc    Get routines based on user goals
router.get('/routines', auth, async (req, res) => {
    try {
        const userResult = await db.query('SELECT fitness_goal, fitness_level FROM users WHERE id = $1', [req.user.id]);
        if (userResult.rows.length === 0) return res.status(404).json({ message: 'User not found' });

        const { fitness_goal, fitness_level } = userResult.rows[0];

        const routinesResult = await db.query(
            'SELECT * FROM routines WHERE goal = $1 AND level = $2',
            [fitness_goal, fitness_level]
        );
        res.json(routinesResult.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   GET api/workouts/routines/:id
// @desc    Get routine with exercises
router.get('/routines/:id', auth, async (req, res) => {
    try {
        const routineResult = await db.query('SELECT * FROM routines WHERE id = $1', [req.params.id]);
        if (routineResult.rows.length === 0) return res.status(404).json({ message: 'Routine not found' });

        const exercisesResult = await db.query(
            'SELECT e.* FROM exercises e JOIN routine_exercises re ON e.id = re.exercise_id WHERE re.routine_id = $1 ORDER BY re.position',
            [req.params.id]
        );
        res.json({ ...routineResult.rows[0], exercises: exercisesResult.rows });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   POST api/workouts/complete
// @desc    Record a completed workout
router.post('/complete', auth, async (req, res) => {
    const { routine_id, duration_mins, calories_burned } = req.body;

    try {
        const result = await db.query(
            'INSERT INTO workout_history (user_id, routine_id, duration_mins, calories_burned) VALUES ($1, $2, $3, $4) RETURNING id',
            [req.user.id, routine_id, duration_mins, calories_burned]
        );
        res.json({ id: result.rows[0].id, message: 'Workout recorded' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   GET api/workouts/history
// @desc    Get user workout history
router.get('/history', auth, async (req, res) => {
    try {
        const result = await db.query(
            'SELECT h.*, r.name as routine_name FROM workout_history h LEFT JOIN routines r ON h.routine_id = r.id WHERE h.user_id = $1 ORDER BY h.date DESC',
            [req.user.id]
        );
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   POST api/workouts/join/:id
// @desc    Enroll in a workout routine
router.post('/join/:id', auth, async (req, res) => {
    try {
        // PostgreSQL equivalent for INSERT IGNORE is ON CONFLICT DO NOTHING
        // Assuming user_id and routine_id are a composite primary key or have a unique constraint
        await db.query(
            'INSERT INTO user_enrollments (user_id, routine_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
            [req.user.id, req.params.id]
        );
        res.json({ message: 'Enrolled successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   DELETE api/workouts/leave/:id
// @desc    Unenroll from a workout routine
router.delete('/leave/:id', auth, async (req, res) => {
    try {
        await db.query(
            'DELETE FROM user_enrollments WHERE user_id = $1 AND routine_id = $2',
            [req.user.id, req.params.id]
        );
        res.json({ message: 'Unenrolled successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   GET api/workouts/enrolled
// @desc    Get user's enrolled routines
router.get('/enrolled', auth, async (req, res) => {
    try {
        const result = await db.query(
            'SELECT r.* FROM routines r JOIN user_enrollments ue ON r.id = ue.routine_id WHERE ue.user_id = $1',
            [req.user.id]
        );
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
