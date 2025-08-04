const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  microsoftId: { type: String, required: true, unique: true },
  name: String,
  email: { type: String, required: true, unique: true },
  accessToken: String,
  refreshToken: String,
  tokenExpiresAt: Date,
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
