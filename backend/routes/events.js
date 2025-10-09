const express = require('express');
const auth = require('../middleware/auth');
const db = require('../config/db');

const router = express.Router({mergeParams: true});

// GET /api/groups/:groupId/events
router.get('/', auth, async (req, res) => {
    const { groupId } = req.params;
    const userId = req.user.id;

    try {
        const memberCheck = await db.query(
            'SELECT * FROM group_members WHERE group_id = $1 AND user_id = $2',
            [groupId, userId]
        );
        if (memberCheck.rows.length === 0) {
            return res.status(403).json({message: 'Access denied'});
        }

        const events = await db.query(
            `SELECT 
                    e.id,
                    e.title,
                    e.description,
                    e.start_time,
                    l.name as location_name,
                    a.name as activity_name
                   FROM events e
                   LEFT JOIN locations l ON e.location_id = l.id
                   LEFT JOIN activities a ON e.activity_id = a.id
                   WHERE e.group_id = $1
                   ORDER BY e.start_time ASC`, [groupId]
        );

        res.json(events.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Unexpected Server Error');
    }
})

module.exports = router;