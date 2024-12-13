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

router.put('/joinleave', async (req, res) => {
    try {
        const community = await CommunityModel.findById(req.body.communityID);

        if (community.members.includes(req.body.userID)) {
            community.members.pull(req.body.userID);
        } else {
            community.members.push(req.body.userID);
        }
        community.memberCount = community.members.length;
        await community.save();
        res.status(200).send(community.members);
    } catch (error) {
        res.status(500).json({ error: 'Failed to join/leave community' });
    }
});

module.exports = router;
