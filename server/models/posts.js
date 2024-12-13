// Post Document Schema
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PostSchema = new Schema({
    title: { type: String, required: true }, // Post title
    content: { type: String, required: true }, // Post content
    postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // User who posted
    postedDate: { type: Date, default: Date.now }, // Date the post was created
    community: { type: mongoose.Schema.Types.ObjectId, ref: 'Community', required: true }, // Community the post belongs to
    linkFlairID: { type: mongoose.Schema.Types.ObjectId, ref: 'LinkFlair' }, // Optional flair for categorization
    views: { type: Number, default: 0 }, // View count
    upvoters: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Users who upvoted
    downvoters: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Users who downvoted
    commentIDs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }], // References to comments
}, { timestamps: true });

PostSchema.virtual('upvotes').get(function () {
    return this.upvoters.length;
});

PostSchema.virtual('downvotes').get(function () {
    return this.downvoters.length;
});

module.exports = mongoose.model('PostModel', PostSchema);

