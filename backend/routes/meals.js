const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const db = require('../config/db');

// @route   POST api/meals/diary
// @desc    Add a meal to user diary
router.post('/diary', auth, async (req, res) => {
    const { meal_name, calories, protein, carbs, fat } = req.body;
    try {
        const result = await db.query(
            'INSERT INTO meal_diary (user_id, meal_name, calories, protein, carbs, fat) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id',
            [req.user.id, meal_name, calories, protein, carbs, fat]
        );
        res.json({ id: result.rows[0].id, message: 'Meal added to diary' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   GET api/meals/diary
// @desc    Get user meal diary
router.get('/diary', auth, async (req, res) => {
    try {
        const result = await db.query(
            'SELECT * FROM meal_diary WHERE user_id = $1 ORDER BY date DESC',
            [req.user.id]
        );
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
