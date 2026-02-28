const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const pool = require('../config/db');

// @route   POST api/meals/diary
// @desc    Add a meal to user diary
router.post('/diary', auth, async (req, res) => {
    const { meal_name, calories, protein, carbs, fat } = req.body;
    try {
        const [result] = await pool.query(
            'INSERT INTO meal_diary (user_id, meal_name, calories, protein, carbs, fat) VALUES (?, ?, ?, ?, ?, ?)',
            [req.user.id, meal_name, calories, protein, carbs, fat]
        );
        res.json({ id: result.insertId, message: 'Meal added to diary' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   GET api/meals/diary
// @desc    Get user meal diary
router.get('/diary', auth, async (req, res) => {
    try {
        const [diary] = await pool.query(
            'SELECT * FROM meal_diary WHERE user_id = ? ORDER BY date DESC',
            [req.user.id]
        );
        res.json(diary);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
