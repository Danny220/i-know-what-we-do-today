const express = require('express');
const auth = require('../middleware/auth');
const db = require('../config/db');
const router = express.Router();

// GET /api/notifications - Get all unread notifications for the authenticated user
router.get('/', auth, async (req, res) => {
    try {
        const result = await db.query(
            'SELECT * FROM notifications WHERE user_id = $1 AND is_read = FALSE ORDER BY created_at DESC',
            [req.user.id]
        );
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// POST /api/notifications/mark-as-read - Mark all notification as read
router.post('/mark-as-read', auth, async (req, res) => {
    try {
        await db.query(
            'UPDATE notifications SET is_read = TRUE WHERE user_id = $1',
            [req.user.id]
        );
        res.status(200).json({message: 'Notifications marked as read.'});
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
})

module.exports = router;