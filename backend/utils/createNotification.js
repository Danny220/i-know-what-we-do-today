const db = require('../config/db');

async function createNotificationForGroup(groupId, triggeredByUserId, message, linkUrl) {
    try {
        const membersResult = await db.query(
            'SELECT user_id FROM group_members WHERE group_id = $1',
            [groupId]
        );

        await db.query('BEGIN');

        for (const member of membersResult.rows) {
            if (member.user_id !== triggeredByUserId) {
                await db.query('INSERT INTO notifications (user_id, message, link_url) VALUES ($1, $2, $3)',
                    [member.user_id, message, linkUrl]
                );
            }
        }

        await db.query('COMMIT');
    } catch (error) {
        await db.query('ROLLBACK');
        console.error('Failed to create notification:', error);
    }
}

module.exports = { createNotificationForGroup };