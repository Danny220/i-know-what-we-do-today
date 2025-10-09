const express = require('express');
const auth = require('../middleware/auth');
const db = require('../config/db');

const router = express.Router({mergeParams: true});

// POST /api/groups/:groupId/polls
router.post('/', auth, async (req, res) => {
   const { groupId } = req.params;
   const userId = req.user.id;
   const { title, description, timeOptions, locationOptions, activityOptions } = req.body;

   try {
       const memberCheck = await db.query(
           'SELECT * FROM group_members WHERE group_id = $1 AND user_id = $2',
           [groupId, userId]
       );

       if (memberCheck.rows.length === 0) {
           return res.status(403).json({message: 'You are not a member of this group'});
       }

       await db.query('BEGIN');


       const newPoll = (await db.query(
           'INSERT INTO polls (title, description, group_id, created_by) VALUES ($1, $2, $3, $4) RETURNING id',
           [title, description, groupId, userId]
       )).rows[0];
       const pollId = newPoll.id;

       const insertOption = async (type, value) => {
           await db.query(
               'INSERT INTO poll_options (poll_id, type, value) VALUES ($1, $2, $3)',
               [pollId, type, value]
           );
       };

       for (const option of timeOptions) await insertOption('TIME', option);
       for (const option of locationOptions) await insertOption('LOCATION', option);
       for (const option of activityOptions) await insertOption('ACTIVITY', option);

       await db.query('COMMIT');

       res.status(201).json({message: 'Poll created successfully!', pollId});
   } catch (err) {
       await db.query('ROLLBACK');
       console.error(err.message);
       res.status(500).send('Unexpected Server Error');
   }
});

// POST /api/groups/:groupId/polls/:pollId/vote
router.post('/:pollId/vote', auth, async (req, res) => {
    const { pollId } = req.params;
    const userId = req.user.id;
    const {optionId} = req.body;

    try {
        await db.query('BEGIN');

        // Check if poll's option exists
        const optionResult = await db.query('SELECT type FROM poll_options WHERE id = $1', [optionId]);
        if (optionResult.rows.length ===0) {
            return res.status(404).json({message: 'Option not found'});
        }

        // Delete existing poll's vote, if necessary
        const optionType = optionResult.rows[0].type;
        await db.query('DELETE FROM votes WHERE user_id = $1 AND poll_option_id IN (SELECT id FROM poll_options WHERE poll_id = $2 AND type = $3)', [userId, pollId, optionType]);

        // Insert new poll's vote
        await db.query('INSERT INTO votes (poll_option_id, user_id) VALUES ($1, $2)', [optionId, userId]);

        await db.query('COMMIT');

        res.status(200).json({message: 'Vote successfully registered'});
    } catch (err) {
        await db.query('ROLLBACK');
        console.error(err.message);
        res.status(500).send('Unexpected Server Error');
    }
});

// POST /api/groups/:groupId/polls/:pollId/finalize
router.post('/:pollId/finalize', auth, async (req, res) => {
    const { pollId } = req.params;
    const userId = req.user.id;

    try {
        const pollResult = await db.query('SELECT * FROM polls WHERE id = $1', [pollId]);
        if (pollResult.rows.length === 0) return res.status(404).json({ message: 'Poll not found' });

        const poll = pollResult.rows[0];
        if (poll.created_by !== userId) return res.status(403).json({ message: 'Only the creator can finalize the poll' });

        const votesCount = await db.query(`
            SELECT po.id, po.type, po.value, COUNT(v.id) as vote_count
            FROM poll_options po
            LEFT JOIN votes v ON po.id = v.poll_option_id
            WHERE po.poll_id = $1
            GROUP BY po.id, po.type, po.value
            ORDER BY po.type, vote_count DESC
        `, [pollId]);

        const winners = {};
        votesCount.rows.forEach(option => {
            if (!winners[option.type]) winners[option.type] = option;
        });

        // --- Find or Create logic ---
        const findOrCreateId = async (tableName, name) => {
            if (!name) return null;
            // Check if already exists
            let result = await db.query(`SELECT id FROM ${tableName} WHERE name = $1`, [name]);
            if (result.rows.length > 0) {
                return result.rows[0].id; // If exsist, returns ID
            } else {
                // If an element does not exists, create new record and returns ID
                result = await db.query(`INSERT INTO ${tableName} (name) VALUES ($1) RETURNING id`, [name]);
                return result.rows[0].id;
            }
        };

        const winningTime = winners['TIME']?.value || 'Non specificato';
        const winningLocationName = winners['LOCATION']?.value;
        const winningActivityName = winners['ACTIVITY']?.value;

        const locationId = await findOrCreateId('locations', winningLocationName);
        const activityId = await findOrCreateId('activities', winningActivityName);

        // --- Transaction for creating event and updating poll status  ---
        await db.query('BEGIN');

        await db.query(
            `INSERT INTO events (title, description, start_time, location_id, activity_id, group_id)
             VALUES ($1, $2, $3, $4, $5, $6)`,
            [poll.title, poll.description, winningTime, locationId, activityId, poll.group_id]
        );

        await db.query("UPDATE polls SET status = 'closed' WHERE id = $1", [pollId]);

        await db.query('COMMIT');

        res.status(200).json({ message: 'Event created successfully' });

    } catch (err) {
        await db.query('ROLLBACK');
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// GET /api/groups/:groupId/polls
router.get('/', auth, async (req, res) => {
   const { groupId } = req.params;
   const userId = req.user.id;
   try {
       const memberCheck = await db.query('SELECT * FROM group_members WHERE group_id = $1 AND user_id = $2', [groupId, userId]);

       if (memberCheck.rows.length === 0) {
           return res.status(403).json({message: 'Access denied'});
       }

       // Get group's polls
       const polls = await db.query('SELECT * FROM polls WHERE group_id = $1 ORDER BY created_at DESC', [groupId]);

       // For each poll, get it's options
       for (const poll of polls.rows) {
           const options = await db.query('SELECT * FROM poll_options WHERE poll_id = $1', [poll.id]);
           poll.options = options.rows;
       }

       res.json(polls.rows);
   } catch (err) {
       console.error(err.message);
       res.status(500).send('Unexpected Server Error');
   }
});

module.exports = router;