import mongoose from 'mongoose';

const PatientSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: true,
    trim: true
  },
  prenom: {
    type: String,
    required: true,
    trim: true
  },
  dateNaissance: {
    type: Date,
    required: true
  },
  numeroPatient: {
    type: String,
    required: true,
    unique: true
  },
  service: String,
  chambre: String,
  contact: {
    telephone: String,
    adresse: String,
    personneUrgence: String
  },
  pathologies: [String],
  medicaments: [String],
  suivi: {
    frequence: String,
    dateDebut: Date,
    alertesActives: Boolean
  }
}, {
  timestamps: true
});

export default mongoose.models.Patient || mongoose.model('Patient', PatientSchema);