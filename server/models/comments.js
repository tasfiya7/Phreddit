// Comment Document Schema
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CommentSchema = new Schema({
    content: { type: String, required: true }, // The text of the comment
    commentedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to User
    commentedDate: { type: Date, default: Date.now }, // Date the comment was posted
    upvoters: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Users who upvoted
    downvoters: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Users who downvoted
    commentIDs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'CommentModel' }], // Child comments
}, { timestamps: true }); 

CommentSchema.virtual('upvotes').get(function () {
    return this.upvoters.length;
});

CommentSchema.virtual('downvotes').get(function () {
    return this.downvoters.length;
});

CommentSchema.virtual('url').get(function () {
    return '/comments/' + this._id;
});

module.exports = mongoose.model('CommentModel', CommentSchema);