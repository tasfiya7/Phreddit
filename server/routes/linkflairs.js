const express = require('express');
const router = express.Router();
const LinkFlairModel = require('../models/linkflairs'); 

router.get('/linkflairs', async (req, res) => {
    try {
        const linkflairs = await LinkFlairModel.find();
        res.json(linkflairs);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch linkflairs' });
    }
});

router.post('/linkflairs', async (req, res) => {
    const linkflair = new LinkFlairModel({
        content: req.body.content,
    });

    try {
        const newLinkFlair = await linkflair.save();
        res.status(201).send(newLinkFlair._id);
    } catch (error) {
        res.status(400).json({ error: 'Failed to create linkflair' });
    }
});

module.exports = router;
