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

        // Check if poll option exist
        const optionResult = await db.query('SELECT type FROM poll_options WHERE id = $1', [optionId]);
        if (optionResult.rows.length ===0) {
            return res.status(404).json({message: 'Option not found'});
        }

        // Delete existing vote, if necessary
        const optionType = optionResult.rows[0].type;
        await db.query('DELETE FROM votes WHERE user_id = $1 AND poll_option_id IN (SELECT id FROM poll_options WHERE poll_id = $2 AND type = $3)', [userId, pollId, optionType]);

        // Insert new vote
        await db.query('INSERT INTO votes (poll_option_id, user_id) VALUES ($1, $2)', [optionId, userId]);

        await db.query('COMMIT');

        res.status(200).json({message: 'Vote successfully registered'});
    } catch (err) {
        await db.query('ROLLBACK');
        console.error(err.message);
        res.status(500).send('Unexpected Server Error');
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