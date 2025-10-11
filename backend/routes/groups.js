const express = require('express');
const auth = require('../middleware/auth');
const db = require('../config/db');
const router = express.Router();

// POST /api/groups - create a new group
router.post('/', auth, async (req, res) => {
    try {
        const {name, description} = req.body;

        const userId = req.user.id;

        await db.query('BEGIN');

        const newGroup = (await db.query(
            'INSERT INTO groups (name, description, created_by) VALUES ($1, $2, $3) RETURNING id, name',
            [name, description, userId]
        )).rows[0]

        const groupId = newGroup.id;

        await db.query(
            "INSERT INTO group_members (group_id, user_id, role) VALUES ($1, $2, 'admin')",
            [groupId, userId]
        );

        await db.query('COMMIT');

        res.status(201).json(newGroup)
    } catch (err) {
        await db.query('ROLLBACK');
        console.error(err.message);
        res.status(500).send('Unexpected Server Error');
    }
});

// GET /api/groups - gets user's groups
router.get('/', auth, async (req, res) => {
    try {
        const userId = req.user.id;

        const groups = await db.query(
            `SELECT g.id, g.name, g.description
                  FROM groups g
                  JOIN group_members gm ON g.id = gm.group_id
                  WHERE gm.user_id = $1`,
            [userId]
        );

        res.json(groups.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Unexpected Server Error');
    }
});

// GET /api/groups/:groupId - Gets group details
router.get('/:groupId', auth, async (req, res) => {
    const { groupId } = req.params;
    const userId = req.user.id;

    try {
        const memberCheck = await db.query(
            'SELECT 1 FROM group_members WHERE group_id = $1 AND user_id = $2',
            [groupId, userId]
        );
        if (memberCheck.rows.length === 0) {
            return res.status(403).json({ message: "Access denied." });
        }

        const groupResult = await db.query(
            `SELECT g.id, g.name, g.description, g.created_at, u.username as created_by
             FROM groups g
             JOIN users u ON g.created_by = u.id
             WHERE g.id = $1`,
            [groupId]
        );

        if (groupResult.rows.length === 0) {
            return res.status(404).json({ message: "Group not found." });
        }

        res.json(groupResult.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;