 const mongoose = require('mongoose');
 
 const visitSchema = new mongoose.Schema({
  visitor:     { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  hostName:    { type: String, required: true },
  purpose:     { type: String, required: true },
  department:  { type: String, required: true },
  visitDate:   { type: Date,   required: true },
  status:      { type: String, enum: ['pending','approved','rejected','checked-in','checked-out'], default: 'pending' },
  approvedBy:  { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  checkInTime: { type: Date },
  checkOutTime:{ type: Date },
  remarks:     { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Visit', visitSchema);