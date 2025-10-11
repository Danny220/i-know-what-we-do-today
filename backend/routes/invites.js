const express = require('express');
const auth = require('../middleware/auth');
const db = require('../config/db');
const {customAlphabet} = require("nanoid");

const router = express.Router();

// GET /api/invites/:inviteCode - get invitation details
router.get('/:inviteCode', auth, async (req, res) => {
    try {
        const {inviteCode} = req.params;

        const inviteResult = await db.query(
            `SELECT g.name as group_name
            FROM invites i
            JOIN groups g ON i.group_id = g.id
            WHERE i.code = $1 AND i.expires_at > NOW() AND i.used_at IS NULL`,[inviteCode]
        );

        if (inviteResult.rows.length === 0) {
            return res.status(404).json({message: 'Invite not found or expired'});
        }

        res.json(inviteResult.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Unexpected Server Error');
    }
})

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

// POST /api/groups/:groupId/invites - create a new invite
router.post('/groups/:groupId', auth, async (req, res) => {
    const {groupId} = req.params;
    const userId = req.user.id;

    try {
        // Generate a random 8-character code
        const nanoid = customAlphabet('ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', 8);
        const code = nanoid();

        // The invite will expire in 24 hours
        const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

        await db.query('BEGIN');

        await db.query(
            'INSERT INTO invites (code, group_id, created_by, expires_at) VALUES ($1, $2, $3, $4)',
            [code, groupId, userId, expiresAt]
        );

        await db.query('COMMIT');
        res.status(201).json({message: 'Invite created successfully', inviteCode: code});
    } catch (err) {
        await db.query('ROLLBACK');
        console.error(err.message);
        res.status(500).send('Unexpected Server Error');
    }
})

module.exports = router;