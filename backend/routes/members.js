const express = require('express');
const auth = require('../middleware/auth');
const db = require('../config/db');

const router = express.Router({mergeParams: true});

// GET /api/groups/:groupId/members - get members of a group
router.get('/', auth, async (req, res) => {
    const { groupId } = req.params;
    const userId = req.user.id;

    try {
        const memberCheck = await db.query(
            'SELECT 1 FROM group_members WHERE group_id = $1 AND user_id = $2',
            [groupId, userId]
        );
        if (memberCheck.rows.length === 0) {
            return res.status(403).json({message: 'Access denied'});
        }

        const membersResult = await db.query(
            `SELECT u.id, u.username, gm.role
                   FROM group_members gm
                   JOIN users u ON gm.user_id = u.id
                   WHERE gm.group_id = $1`,
            [groupId]
        );

        res.json(membersResult.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Unexpected Server Error');
    }
})

// DELETE /api/groups/:groupId/members/:memberId - remove a member from a group
router.delete('/:memberId', auth, async (req, res) => {
    const { groupId, memberId } = req.params;
    const adminId = req.user.id;

    try {
        // Check if the user is an admin of the group
        const adminCheck = await db.query(
            'SELECT 1 FROM group_members WHERE group_id = $1 AND user_id = $2 AND role = \'admin\'',
            [groupId, adminId]
        );
        if (adminCheck.rows.length === 0) {
            return res.status(403).json({message: 'Access denied'});
        }

        // Check if the user is trying to remove himself
        if (memberId === adminId) {
            return res.status(400).json({message: 'You cannot remove yourself from the group'});
        }

        await db.query('BEGIN');

        const deleteResult = await db.query(
            'DELETE FROM group_members WHERE group_id = $1 AND user_id = $2 RETURNING user_id',
            [groupId, memberId]
        );

        if (deleteResult.rowCount === 0) {
            return res.status(404).json({message: 'Member not found in this group.'});
        }

        await db.query('COMMIT');

        res.status(200).json({message: 'Member removed successfully'});
    } catch (err) {
        await db.query('ROLLBACK');
        console.error(err.message);
        res.status(500).send('Unexpected Server Error');
    }
})

module.exports = router;