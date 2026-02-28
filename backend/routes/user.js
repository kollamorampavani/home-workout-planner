const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const pool = require('../config/db');

// @route   GET api/user/profile
// @desc    Get current user profile
router.get('/profile', auth, async (req, res) => {
    try {
        const [user] = await pool.query('SELECT id, email, full_name, fitness_goal, fitness_level, available_time, onboarded FROM users WHERE id = ?', [req.user.id]);
        res.json(user[0]);
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
        await pool.query(
            'UPDATE users SET fitness_goal = ?, fitness_level = ?, available_time = ?, onboarded = TRUE WHERE id = ?',
            [goal, level, time, req.user.id]
        );
        res.json({ message: 'Onboarding complete' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
