const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const leadSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, trim: true },
    source: {
      type: String,
      enum: ['Website', 'Referral', 'Social Media', 'Cold Outreach', 'Other'],
      default: 'Website'
    },
    status: {
      type: String,
      enum: ['new', 'contacted', 'converted', 'lost'],
      default: 'new'
    },
    notes: [noteSchema],
    followUpDate: { type: Date }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Lead', leadSchema);
