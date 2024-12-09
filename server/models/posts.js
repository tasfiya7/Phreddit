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
    upvotes: { type: Number, default: 0 }, // Number of upvotes
    downvotes: { type: Number, default: 0 }, // Number of downvotes
    reputationImpact: { type: Number, default: 0 }, // Reputation impact for the poster
    commentIDs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }], // References to comments
}, { timestamps: true });

PostSchema.virtual('url').get(function () {
    return '/posts/' + this._id;
});

module.exports = mongoose.model('PostModel', PostSchema);

