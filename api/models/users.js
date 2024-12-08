const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    minlength: 4,
    maxlength: 20,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/.+@.+\..+/, 'Please enter a valid email address'],
  },
  phoneNumber: {
    type: String,
    required: true,
    match: [/^\d{10}$/, 'Please enter a valid phone number'],
  },
  address: {
    line1: {
      type: String,
      required: true,
    },
    line2: {
      type: String,
    },
    city: {
      type: String,
    },
    state: {
      type: String,
    },
    zip: {
      type: String,
    },
  },
  birthDate: {
    month: {
      type: String,
      required: true,
    },
    day: {
      type: Number,
      required: true,
    },
    year: {
      type: Number,
      required: true,
    },
  },
  referral: {
    type: [String],
    enum: ['Friend', 'Google', 'Blog Post', 'News Article', 'Other'],
  },
  membership: {
    type: String,
    required: true,
    enum: ['Junior', 'Senior', 'Supporter'],
  },
  contactPreference: {
    type: String,
    required: true,
    enum: ['Email', 'Phone', 'Any'],
  },
  rulesAccepted: {
    type: Boolean,
    required: true,
    default: false,
  },
  privacyPolicyAccepted: {
    type: Boolean,
    required: true,
    default: false,
  },
  uniqueKey: {
    type: String,
    required: true,
    unique: true,
  },
}, { timestamps: true });


const User = new mongoose.model('User', userSchema);

module.exports = User;
