const express = require('express');
const router = express.Router();
const UserModel = require('../models/users');
const bcrypt = require('bcrypt');

router.get('/get-session', (req, res) => {
    const sessionId = req.cookies['connect.sid'];
    if(!sessionId) {
        return res.status(401).json({ error: 'Session not found.' });
    }
    res.json({ sessionId });
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
            req.session.userId = user._id;
            console.log(req.session);
            res.json({ sessionId: req.session.id });
        });

    } catch (error) {
        res.status(401).json({ error: error.message });
    }
});

module.exports = router;