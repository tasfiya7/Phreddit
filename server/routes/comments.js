const express = require('express');
const router = express.Router();
const CommentModel = require('../models/comments'); 

router.get('/comments', async (req, res) => {
    try {
        const comments = await CommentModel.find();
        res.json(comments);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch comments' });
    }
});

router.post('/comments/post', async (req, res) => {
    try {
        const { postID, commentedBy, content, commentedDate } = req.body;
        const comment = new CommentModel({
            content: content,
            commentedBy: commentedBy,
            commentedDate: commentedDate,
        });
        await comment.save();
        
        // Find the post that the comment belongs to 
        const PostModel = require('../models/posts');
        const post = await PostModel.findById(postID);
        await post.commentIDs.push(comment);
        await post.save();
        res.json(comment);
    } catch (error) {
        res.status(500).json({ error: 'Failed to post comment on post' });
    }
});

router.post('/comments/comment', async (req, res) => {
    try {
        const { commentID, commentedBy, content, commentedDate } = req.body;
        const comment = new CommentModel({
            content: content,
            commentedBy: commentedBy,
            commentedDate: commentedDate,
        });
        await comment.save();
        
        // Find the comment that the comment belongs to 
        const parentComment = await CommentModel.findById(commentID);
        await parentComment.commentIDs.push(comment);
        await parentComment.save();
        res.json(comment);
    } catch (error) {
        res.status(500).json({ error: 'Failed to post comment on comment' });
    }
});

module.exports = router;
