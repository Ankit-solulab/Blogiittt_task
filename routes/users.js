const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Signup Route - Signup Page
router.get('/signup', (req, res) => {
    res.render('signup', { error: null }); 
});

// Signup Route - and handling form subbmisison
router.post('/signup', async (req, res) => {
    const { name, email, password } = req.body;

    try {
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.render('signup', { error: 'User with this email already exists!' });
        }

        // Create a new user
        const user = new User({ name, email, password });
        await user.save();

        res.redirect('/users/login');
    } catch (err) {
        console.error(err);
        res.render('signup', { error: 'Something went wrong. Please try again!' });
    }
});

// Login Route - Render Login Page
router.get('/login', (req, res) => {
    res.render('login', { error: null }); 
});

// Login Route - Handle Form Submission
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user || user.password !== password) {
            return res.render('login', { error: 'Invalid email or password!' });
        }

        // Set user in session
        req.session.user = user;
        res.redirect('/');
    } catch (err) {
        console.error(err);
        res.render('login', { error: 'Something went wrong. Please try again!' });
    }
});

// Logout Route
router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

module.exports = router;
