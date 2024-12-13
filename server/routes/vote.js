const express = require('express');
const router = express.Router();
const UserModel = require('../models/users');

router.put('/vote', async (req, res) => {
    const { type, id, voterID, targetID, vote } = req.body;

    var votable; // Post or Comment
    var net = 0;

    const voter = await UserModel.findById(voterID);
    if(voter.reputation < 50){
        return res.status(204).json({ message: 'You need atleast 50 reputation to vote!' });
    }

    if(type === 'post'){
        const PostModel = require('../models/posts');
        votable = await PostModel.findById(id);
    } else if (type === 'comment'){
        const CommentModel = require('../models/comments');
        votable = await CommentModel.findById(id);
    } else {
        return res.status(400).json({ message: 'Invalid type.' });
    }

    if(vote === 1){
        if(votable.downvoters.includes(voterID)){
            votable.downvoters.pull(voterID);
            net += 10;
        }
        if(votable.upvoters.includes(voterID)){
            votable.upvoters.pull(voterID);
            net += -5;
        } else {
            votable.upvoters.push(voterID);
            net += 5;
        }
    } else if (vote === -1){
        if(votable.upvoters.includes(voterID)){
            votable.upvoters.pull(voterID);
            net += -5;
        }
        if(votable.downvoters.includes(voterID)){
            votable.downvoters.pull(voterID);
            net += 10;
        } else {
            votable.downvoters.push(voterID);
            net += -10;
        }
    } else {
        return res.status(400).json({ message: 'Invalid vote.' });
    }

    await votable.save();

    const target = await UserModel.findById(targetID);
    target.reputation += net;
    await target.save();

    return res.status(200).json({ message: 'Voted successful.' }); 
});


module.exports = router;