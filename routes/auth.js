const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const bcrypt = require('bcrypt');

const saltRounds = 10;

router.post('/signup', async (req, res) => {
    try {
        const { name, email, password, photo, parentInviteCode, teacherInviteCode, roles } = req.body;

        // Check if the user with the given email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'Email already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Create a new user
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            photo,
            parentInviteCode,
            teacherInviteCode,
            roles: roles,
        });

        // Check and assign roles based on invite codes
        // if (parentInviteCode) {
        //     newUser.roles.push('parent');
        // }

        // if (teacherInviteCode) {
        //     newUser.roles.push('teacher');
        // }

        await newUser.save();

        // Generate JWT token
        const token = jwt.sign({ user: newUser }, 'cipher-secret-key', { expiresIn: '1h' });

        res.json({ success: true, token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});

router.post('/login', async (req, res) => {

    try {
        const { email, password } = req.body;

        // Find the user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid email or password' });
        }

        // Compare the password
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ success: false, message: 'Invalid email or password' });
        }

        // Generate JWT token
        const token = jwt.sign({ user }, 'cipher-secret-key', { expiresIn: '1h' });

        res.json({ success: true, token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }

});

const generateToken = (user) => {
    return jwt.sign({ user }, secretKey, { expiresIn: '1h' });
};

const secretKey = 'cipher-secret-key';

// Authentication Middleware
const authenticate = (req, res, next) => {
    let token = req.header('Authorization');
     token = token?.split("Bearer")[1]?.trim()
    if (!token) return res.status(401).json({ message: 'Unauthorized' });

    try {
        console.log(token.trim())
        const decoded = jwt.verify(token, secretKey);
        req.user = decoded.user;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Invalid token' });
    }
};

module.exports = { router, generateToken, authenticate };
