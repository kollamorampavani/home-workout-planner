const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const db = require('../config/db');

// @route   GET api/user/profile
// @desc    Get current user profile
router.get('/profile', auth, async (req, res) => {
    try {
        const result = await db.query(
            'SELECT id, email, full_name, fitness_goal, fitness_level, available_time, onboarded, points FROM users WHERE id = $1',
            [req.user.id]
        );
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   PUT api/user/onboard
// @desc    Update user onboarding info
router.put('/onboard', auth, async (req, res) => {
    const { goal, level, time } = req.body;

    try {
        await db.query(
            'UPDATE users SET fitness_goal = $1, fitness_level = $2, available_time = $3, onboarded = TRUE WHERE id = $4',
            [goal, level, time, req.user.id]
        );
        res.json({ message: 'Onboarding complete' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
