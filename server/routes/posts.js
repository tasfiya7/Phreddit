const express = require('express');
const router = express.Router();
const PostModel = require('../models/posts'); 
const CommunityModel = require('../models/communities');
const LinkFlairModel = require('../models/linkflairs');

router.get('/posts', async (req, res) => {
    try {
        const posts = await PostModel.find();
        res.json(posts);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch posts' });
    }
});

router.post('/posts', async (req, res) => {
    const post = new PostModel({
        title: req.body.title,
        content: req.body.content,
        postedBy: req.body.postedBy,
        postedDate: req.body.postedDate,
        community: req.body.community,
    });

    if(req.body.linkFlairID != "") {
        if (!req.body.newFlair) {
            const linkFlair = await LinkFlairModel.findById(req.body.linkFlairID);
            post.linkFlairID = linkFlair._id;
        } else { // Creates a new flair
            const newLinkFlair = new LinkFlairModel({
                content: req.body.linkFlairID,
            });
            const savedLinkFlair = await newLinkFlair.save();
            post.linkFlairID = savedLinkFlair._id;
        }
    }

    try {
        const newPost = await post.save();
        const community = await CommunityModel.findById(req.body.community);
        community.postIDs.push(newPost._id);
        await community.save();
        res.status(201).send(post._id);
    } catch (error) {
        console.log(error);
        res.status(400).json({ error: 'Failed to create post' });
    }
});

module.exports = router;
