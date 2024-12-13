const express = require('express');
const router = express.Router();

router.put('/incrementViews', async (req, res) => {
    const postID = req.query.id;
    const PostModel = require('../models/posts');
    const post = await PostModel.findById(postID);
    post.views++;
    await post.save();
    res.json(post);
})

module.exports = router;