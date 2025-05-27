const mongoose = require('mongoose');

const CitySchema = new mongoose.Schema({
  name: { type: String, required: true },
  state: { type: mongoose.Schema.Types.ObjectId, ref: 'State', required: true },
  country: { type: mongoose.Schema.Types.ObjectId, ref: 'Country', required: true },
});

module.exports = mongoose.model('City', CitySchema); 