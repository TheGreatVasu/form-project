const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profession: String,
  companyName: String,
  address1: String,
  country: String,
  state: String,
  city: String,
  plan: String,
  newsletter: Boolean,
  photo: String, // Store as URL or base64 string, or use Buffer for binary
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema); 