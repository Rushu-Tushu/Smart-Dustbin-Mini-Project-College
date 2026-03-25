const mongoose = require('mongoose');

const binSchema = new mongoose.Schema({
  binId: {
    type: String,
    required: [true, 'Bin ID is required'],
    unique: true,
    trim: true,
    uppercase: true,
  },
  location: {
    type: String,
    required: [true, 'Location is required'],
    trim: true,
  },
  fillLevel: {
    type: Number,
    required: [true, 'Fill level is required'],
    min: [0, 'Fill level cannot be negative'],
    max: [100, 'Fill level cannot exceed 100'],
    default: 0,
  },
  status: {
    type: String,
    enum: ['low', 'medium', 'full'],
    default: 'low',
  },
  assignedWorker: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, { timestamps: true });

// Auto-compute status before saving
binSchema.pre('save', function (next) {
  if (this.fillLevel < 40) {
    this.status = 'low';
  } else if (this.fillLevel < 75) {
    this.status = 'medium';
  } else {
    this.status = 'full';
  }
  next();
});

// Also compute status on update
binSchema.pre('findOneAndUpdate', function (next) {
  const update = this.getUpdate();
  if (update.fillLevel !== undefined) {
    if (update.fillLevel < 40) {
      update.status = 'low';
    } else if (update.fillLevel < 75) {
      update.status = 'medium';
    } else {
      update.status = 'full';
    }
  }
  next();
});

module.exports = mongoose.model('Bin', binSchema);
