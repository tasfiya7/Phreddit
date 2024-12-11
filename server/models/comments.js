// Comment Document Schema
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CommentSchema = new Schema({
    content: { type: String, required: true }, // The text of the comment
    commentedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to User
    // post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true }, // Reference to the Post
    commentedDate: { type: Date, default: Date.now }, // Date the comment was posted
    upvotes: { type: Number, default: 0 }, // Number of upvotes
    downvotes: { type: Number, default: 0 }, // Number of downvotes
    reputationImpact: { type: Number, default: 0 }, // Net reputation impact for the commenter
    commentIDs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'CommentModel' }], // Child comments
}, { timestamps: true }); 

CommentSchema.virtual('url').get(function () {
    return '/comments/' + this._id;
});

module.exports = mongoose.model('CommentModel', CommentSchema);