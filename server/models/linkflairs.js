// LinkFlair Document Schema
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var LinkFlairSchema = new Schema({
    content: { type: String, required: true },
});

LinkFlairSchema.virtual('url').get(function () {
    return '/linkflairs/' + this._id;
});

module.exports = mongoose.model('LinkFlairModel', LinkFlairSchema);