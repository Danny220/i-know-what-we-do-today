const express = require('express');
const cors = require('cors');

const db = require('./config/db');

// Imported routes
const authRoutes = require('./routes/auth');
const groupRoutes = require('./routes/groups');
const pollRoutes = require('./routes/polls');
const eventRoutes = require('./routes/events');
const inviteRoutes = require('./routes/invites');
const memberRoutes = require('./routes/members');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors()); // Enable CORS
app.use(express.json()); // Enable JSON reading in requests

//#region ROUTES

// Test route
app.get('/', (req, res) => {
    res.send("Hello World!");
});

// Auth routes
app.use('/api/auth', authRoutes);

// Group routes
app.use('/api/groups', groupRoutes);

// Poll routes
app.use('/api/groups/:groupId/polls', pollRoutes);

// Event routes
app.use('/api/groups/:groupId/events', eventRoutes);

// Invite routes
app.use('/api/invites', inviteRoutes);

// Member routes
app.use('/api/groups/:groupId/members', memberRoutes);

//#endregion ROUTES

// Start the server
app.listen(PORT,async () => {
    console.log(`Server is running on port ${PORT}`);

    try {
        // Test query for db connection test
        const result = await db.query('SELECT NOW()');
        console.log('Successfully connected to PostgreSQL:', result.rows[0].now);
    } catch (err) {
        console.error('Error connecting to PostgreSQL:', err);
    }
});