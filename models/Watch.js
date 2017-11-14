const mongoose = require('mongoose');

const searchSchema = new mongoose.Schema({
  keywords: {
    type: String,
    required: 'Please enter search keyword(s)'
  },
  categoryId: {
    type: Number,
    default: 10
  },
  locationId: {
    type: Number,
    default: 1700192
  },
  adType: {
    type: String,
    default: 'OFFER'
  },
  lastSearch: {
    type: Date
  },
  email: {
    type: String,
    required: [true, 'email address required']
  }
});

module.exports = mongoose.model('Watch', searchSchema);
