const express = require('express');
const router = express.Router();
const UserModel = require('../models/users');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

const sessionCollection = mongoose.connection.collection('sessions');

router.get('/get-session', async (req, res) => {
    // Check if session exists, if so, return user id
    try {
        const session = await sessionCollection.findOne({ _id: req.session.id });
        if (!session) {
            res.clearCookie('connect.sid');
            throw new Error('Session not found!');
        }
        return res.status(200).json({ userID: req.session.userID });
    } catch (error) {
        res.status(401).json({ message: error.message });
    }
});

router.post('/logout', async (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ error: 'Logout failed. Session could not be destroyed.' });
        }
        res.clearCookie('connect.sid');
        res.status(200).json({ message: 'Logout successful.' });
    });
});

router.post('/login', async (req, res) => {
    try {
        const user = await UserModel.findOne({ email: req.body.email });
        if (!user) {
            throw new Error('Email not found!');
        }
        const match = await bcrypt.compare(req.body.password, user.password);
        if (!match) {
            throw new Error('Incorrect password!');
        }

        req.session.regenerate((err) => {
            if (err) {
                return res.status(500).json({ error: 'Session could not be created.' });
            }
            req.session.userID = user._id;
            res.status(200).json({ sessionId: req.session.id, userID: user._id});
        });

    } catch (error) {
        res.status(401).json({ error: error.message });
    }
});

router.post('/register', async (req, res) => {
    try {
        const existingEmail = await UserModel.findOne({ email: req.body.email });
        const existingDisplayName = await UserModel.findOne({ displayName: req.body.displayName });
        if (existingEmail) {
            throw new Error('Email already in use!');
        }
        if (existingDisplayName) {
            throw new Error('Display name taken!');
        }

        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const newUser = new UserModel({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            displayName: req.body.displayName,
            password: hashedPassword,
        });

        await newUser.save();   

        res.status(200).json({ message: 'Registration successful!' });
        
    } catch (error) {
        res.status(401).json({ error: error.message });
    }
});

module.exports = router;