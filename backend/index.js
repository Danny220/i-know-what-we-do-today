const express = require("express");
const cors = require("cors");
const db = require("./config/db");

// Imported routes
const authRoutes = require("./routes/auth");
const groupRoutes = require("./routes/groups");
const pollRoutes = require("./routes/polls");
const eventRoutes = require("./routes/events");
const inviteRoutes = require("./routes/invites");
const memberRoutes = require("./routes/members");
const notificationRoutes = require("./routes/notifications");
const profileRoutes = require("./routes/profiles");
const uploadRoutes = require("./routes/upload");

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// =================================================================
// ROUTES REGISTRATION
// =================================================================
app.get("/", (req, res) => res.send("Hello World!"));
app.use("/api/auth", authRoutes);
app.use("/api/invites", inviteRoutes);
app.use("/api/groups/:groupId/polls", pollRoutes);
app.use("/api/groups/:groupId/events", eventRoutes);
app.use("/api/groups/:groupId/members", memberRoutes);
app.use("/api/groups", groupRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/profiles", profileRoutes);
app.use("/api/upload", uploadRoutes);
// =================================================================

// Start the server
app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
  try {
    await db.query("SELECT NOW()");
    console.log("Successfully connected to PostgreSQL");
  } catch (err) {
    console.error("Error connecting to PostgreSQL:", err);
  }
});
