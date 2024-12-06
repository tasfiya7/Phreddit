const express = require('express');
const router = express.Router();

router.put('/incrementViews', async (req, res) => {
    try {
        const postID = req.query.id;
        const PostModel = require('../models/posts');
        const post = await PostModel.findById(postID);
        post.views++;
        await post.save();
        res.json(post);
    } catch (error) {
        res.status(500).json({ error: 'Failed to increment views' });
    }
})

module.exports = router;