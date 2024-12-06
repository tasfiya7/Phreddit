// Comment Document Schema
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CommentSchema = new Schema({
    content: {type: String, required: true},
    commentIDs: [{type: Schema.Types.ObjectId, ref: 'Comment'}],
    commentedBy: {type: String, required: true},
    commentedDate: {type: Date, required: true},
});

CommentSchema.virtual('url').get(function () {
    return '/comments/' + this._id;
});

module.exports = mongoose.model('CommentModel', CommentSchema);