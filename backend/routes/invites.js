const express = require('express');
const auth = require('../middleware/auth');
const db = require('../config/db');

const router = express.Router();

// POST /api/invites/:inviteCode/join - join a group using an invitation code
router.post('/:inviteCode/join', auth, async (req, res) => {
    const {inviteCode} = req.params;
    const userId = req.user.id;

    try {
        const inviteResult = await db.query(
            'SELECT * FROM invites WHERE code = $1 AND expires_at > NOW() AND used_at IS NULL',
            [inviteCode]
        );

        if (inviteResult.rows.length === 0) {
            return res.status(404).json({message: 'Invite not found or expired'});
        }

        const groupId = inviteResult.rows[0].group_id;

        await db.query('BEGIN');

        await db.query(
            'INSERT INTO group_members (group_id, user_id, role) VALUES ($1, $2, \'member\') ON CONFLICT DO NOTHING',
            [groupId, userId]
        );

        await db.query('UPDATE invites SET used_at = NOW() WHERE code = $1', [inviteCode]);

        await db.query('COMMIT');

        console.log('User joined group:', groupId, ' user: ', userId);

        res.status(200).json({message: 'You have successfully joined the group', groupId});
    } catch (err) {
        await db.query('ROLLBACK');
        console.error(err.message);
        res.status(500).send('Unexpected Server Error');
    }
})

module.exports = router;