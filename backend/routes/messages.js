const express = require("express");
const auth = require("../middleware/auth");
const db = require("../config/db");
const router = express.Router({ mergeParams: true });

// GET /api/groups/:groupId/messages - Gets last 50 messages
router.get("/", auth, async (req, res) => {
  const { groupId } = req.params;
  try {
    const memberCheck = await db.query(
      "SELECT 1 FROM group_members WHERE group_id = $1 AND user_id = $2",
      [groupId, req.user.id],
    );
    if (memberCheck.rows.length === 0)
      return res.status(403).json({ message: "Access denied." });

    const messages = await db.query(
      `SELECT m.id, m.content, m.created_at, u.username, p.avatar_url
             FROM group_messages m
             JOIN users u ON m.user_id = u.id
             LEFT JOIN profiles p ON u.id = p.user_id
             WHERE m.group_id = $1
             ORDER BY m.created_at DESC
             LIMIT 50`,
      [groupId],
    );
    res.json(messages.rows.reverse());
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// POST /api/groups/:groupId/messages - Send a new message
router.post("/", auth, async (req, res) => {
  const { groupId } = req.params;
  const { content } = req.body;
  if (!content) return res.status(400).json({ message: "Content is required" });

  try {
    const memberCheck = await db.query(
      "SELECT 1 FROM group_members WHERE group_id = $1 AND user_id = $2",
      [groupId, req.user.id],
    );
    if (memberCheck.rows.length === 0)
      return res.status(403).json({ message: "Access denied." });

    await db.query(
      "INSERT INTO group_messages (group_id, user_id, content) VALUES ($1, $2, $3)",
      [groupId, req.user.id, content],
    );
    res.status(201).json({ message: "Message posted." });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
