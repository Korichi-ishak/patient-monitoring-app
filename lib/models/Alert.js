import mongoose from 'mongoose';

const AlertSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true
  },
  measurementId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Measurement'
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  type: {
    type: String,
    required: true
  },
  severite: {
    type: String,
    enum: ['basse', 'moyenne', 'haute', 'critique'],
    required: true
  },
  description: String,
  status: {
    type: String,
    enum: ['nouvelle', 'vue', 'resolue'],
    default: 'nouvelle'
  },
  accuseReception: {
    personnel: String,
    timestamp: Date
  }
}, {
  timestamps: true
});

export default mongoose.models.Alert || mongoose.model('Alert', AlertSchema);