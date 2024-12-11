const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true }, // User email (login credential)
    displayName: { type: String, required: true, unique: true }, // User's display name
    password: { type: String, required: true }, // Hashed password
    reputation: { type: Number, default: 100 }, // User reputation (affects actions like voting)
    role: { type: String, enum: ['user', 'admin'], default: 'user' }, // Role (user/admin)
}, { timestamps: true }); // Automatically add createdAt and updatedAt

module.exports = mongoose.model('UserModel', UserSchema);