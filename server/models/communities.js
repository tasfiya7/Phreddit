// Community Document Schema
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CommunitySchema = new Schema({
    name: {type: String, required: true},
    description: {type: String, required: true},
    postIDs: [{type: Schema.Types.ObjectId, ref: 'Post'}],
    startDate: {type: Date, required: true},
    members: [{type: String, required: true}],
});

CommunitySchema.virtual('memberCount').get(function () {
    return this.members.length;
});

CommunitySchema.virtual('url').get(function () {
    return '/communities/' + this._id;
});


module.exports = mongoose.model('CommunityModel', CommunitySchema);