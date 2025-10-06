const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

const router = express.Router();
const saltRounds = 10; // Number of salt rounds for bcrypt

// Route for user registration
// POST /api/auth/register
router.post('/register', async (req, res) => {
   try {
       // Get data from request body
       const { username, email, password } = req.body;

       // Crypt password
       const passwordHash = await bcrypt.hash(password, saltRounds);

       // Insert new user into DB
       // Use placeholder to prevent SQL Injection
       const newUser = await db.query('INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING id, username, email', [username, email, passwordHash]);

       // Send response
       res.status(201).json({
           message: 'User successfully registered!',
           user: newUser.rows[0]
       });
   } catch (err) {
       console.error('AUTH ERROR:', err.message);
       res.status(500).send('Unexpected Server Error');
   }
});

// Route for login
// POST /api/auth/login
router.post('/login', async (req, res) => {
    const invalidCredentials = () => res.status(400).json({message: 'Invalid credentials'});

    try {
        // Get data from request body
        const { email, password } = req.body;

        // Search user by mail
        const user = await db.query('SELECT * FROM users WHERE email = $1', [email]);

        // If not found return error
        if (user.rows.length === 0) {
            return invalidCredentials();
        }

        // Check hash
        const isPasswordValid = await bcrypt.compare(password, user.rows[0].password_hash);

        if (!isPasswordValid) {
            return invalidCredentials();
        }

        // Create JWT
        const payload = {
            user: {
                id: user.rows[0].id
            }
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: '1h'
        });

        res.json({token});
    } catch (err) {
        console.error('AUTH ERROR:', err.message);
        res.status(500).send('Unexpected Server Error');
    }
});

module.exports = router;