// Community Document Schema
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CommunitySchema = new Schema({
    name: {type: String, required: true, unique: true },
    description: {type: String, required: true},
    postIDs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
    startDate: {type: Date, required: true, default: Date.now},
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Members of the community
    memberCount: { type: Number, default: 0 }, // Number of members
}, { timestamps: true });


// CommunitySchema.virtual('memberCount').get(function () {
//     return this.members.length;
// });

CommunitySchema.virtual('url').get(function () {
    return '/communities/' + this._id;
});


module.exports = mongoose.model('CommunityModel', CommunitySchema);