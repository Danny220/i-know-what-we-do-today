const express = require('express');
const auth = require('../middleware/auth');
const db = require('../config/db');
const router = express.Router();

// GET /api/profiles/:userId - Retrieves a user's profile
router.get('/:userId', auth, async (req, res) => {
    try {
        const result = await db.query(
            `SELECT u.username, p.bio, p.avatar_url
                  FROM users u
                  JOIN profiles p ON u.id = p.user_id
                  WHERE u.id = $1`,
            [req.params.userId]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({message: 'User not found' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Unexpected Server error');
    }
})

// PUT /api/profiles/me - Updates logged user's profile
router.put('/me', auth, async (req, res) => {
    try {
        const {bio} = req.body;

        await db.query('BEGIN');
        await db.query(
            'UPDATE profiles SET bio = $1 WHERE user_id = $2',
            [bio, req.user.id]
        );
        await db.query('COMMIT');
        res.status(200).json({message: 'Profile updated successfully'});
    }
    catch (err) {
        await db.query('ROLLBACK');
        console.error(err.message);
        res.status(500).send('Unexpected Server error');
    }
})

module.exports = router;