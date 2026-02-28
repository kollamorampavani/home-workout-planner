const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const pool = require('../config/db');

// @route   GET api/workouts/routines
// @desc    Get routines based on user goals
router.get('/routines', auth, async (req, res) => {
    try {
        const [user] = await pool.query('SELECT fitness_goal, fitness_level FROM users WHERE id = ?', [req.user.id]);
        const { fitness_goal, fitness_level } = user[0];

        const [routines] = await pool.query(
            'SELECT * FROM routines WHERE goal = ? AND level = ?',
            [fitness_goal, fitness_level]
        );
        res.json(routines);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   GET api/workouts/routines/:id
// @desc    Get routine with exercises
router.get('/routines/:id', auth, async (req, res) => {
    try {
        const [routine] = await pool.query('SELECT * FROM routines WHERE id = ?', [req.params.id]);
        const [exercises] = await pool.query(
            'SELECT e.* FROM exercises e JOIN routine_exercises re ON e.id = re.exercise_id WHERE re.routine_id = ? ORDER BY re.position',
            [req.params.id]
        );
        res.json({ ...routine[0], exercises });
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
        const [result] = await pool.query(
            'INSERT INTO workout_history (user_id, routine_id, duration_mins, calories_burned) VALUES (?, ?, ?, ?)',
            [req.user.id, routine_id, duration_mins, calories_burned]
        );
        res.json({ id: result.insertId, message: 'Workout recorded' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   GET api/workouts/history
// @desc    Get user workout history
router.get('/history', auth, async (req, res) => {
    try {
        const [history] = await pool.query(
            'SELECT h.*, r.name as routine_name FROM workout_history h LEFT JOIN routines r ON h.routine_id = r.id WHERE h.user_id = ? ORDER BY h.date DESC',
            [req.user.id]
        );
        res.json(history);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   POST api/workouts/join/:id
// @desc    Enroll in a workout routine
router.post('/join/:id', auth, async (req, res) => {
    try {
        await pool.query(
            'INSERT IGNORE INTO user_enrollments (user_id, routine_id) VALUES (?, ?)',
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
        await pool.query(
            'DELETE FROM user_enrollments WHERE user_id = ? AND routine_id = ?',
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
        const [enrolled] = await pool.query(
            'SELECT r.* FROM routines r JOIN user_enrollments ue ON r.id = ue.routine_id WHERE ue.user_id = ?',
            [req.user.id]
        );
        res.json(enrolled);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
