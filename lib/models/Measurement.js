import mongoose from 'mongoose';

const MeasurementSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  type: {
    type: String,
    required: true,
    enum: ['temperature', 'frequenceCardiaque', 'saturationOxygene', 'tensionArterielle', 'respiratoire', 'glucose']
  },
  valeur: {
    type: Number,
    required: true
  },
  unite: String,
  methode: String,
  personnel: String,
  commentaire: String,
  anomalie: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

export default mongoose.models.Measurement || mongoose.model('Measurement', MeasurementSchema);