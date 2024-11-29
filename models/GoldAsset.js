const mongoose = require('mongoose');

const GoldAssetSchema = new mongoose.Schema({
  goldId: {
    type: String,
    required: true,
    unique: true,
  },
  weight: {
    type: Number,
    required: true,
    max: 99999,
  },
  purity: {
    type: Number,
    required: true,
    max: 100,
  },
  type: {
    type: String,
    required: true,
  },
  bisHallmark: {
    type: String,
    required: true,
    length: 6,
  },
  registeredBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  owners: {
    type: [String],
  },
  transferDates: {
    type: [Date],
  },
  currentOwner: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('GoldAsset', GoldAssetSchema);