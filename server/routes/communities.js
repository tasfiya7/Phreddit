const express = require('express');
const router = express.Router();
const CommunityModel = require('../models/communities'); 

router.get('/communities', async (req, res) => {
    try {
        const communities = await CommunityModel.find();
        res.json(communities);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch communities' });
    }
});

router.post('/communities', async (req, res) => {
    const community = new CommunityModel({
        name: req.body.name,
        description: req.body.description,
        madeBy: req.body.madeBy,
        startDate: req.body.startDate,
    });

    try {
        const newCommunity = await community.save();
        res.status(201).send(newCommunity._id);
    } catch (error) {
        res.status(400).json({ error: 'Failed to create community' });
    }
});

module.exports = router;
