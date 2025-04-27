import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// Schéma des préférences utilisateur
const PreferencesSchema = new mongoose.Schema({
  notifications: {
    criticalAlerts: {
      email: { type: Boolean, default: true },
      sms: { type: Boolean, default: false },
      app: { type: Boolean, default: true }
    },
    normalAlerts: {
      email: { type: Boolean, default: false },
      sms: { type: Boolean, default: false },
      app: { type: Boolean, default: true }
    },
    reports: {
      daily: { type: Boolean, default: false },
      weekly: { type: Boolean, default: true }
    }
  },
  display: {
    theme: { type: String, enum: ['light', 'dark', 'system'], default: 'light' },
    compactView: { type: Boolean, default: false },
    showGraphs: { type: Boolean, default: true }
  },
  dashboardWidgets: {
    showRecentMeasurements: { type: Boolean, default: true },
    showRecentAlerts: { type: Boolean, default: true },
    showCriticalPatients: { type: Boolean, default: true },
    showStats: { type: Boolean, default: true }
  }
});

const UserSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: true
  },
  prenom: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  specialite: String,
  service: String,
  numeroOrdre: String,
  role: {
    type: String,
    enum: ['medecin', 'infirmier', 'admin'],
    default: 'medecin'
  },
  preferences: {
    type: PreferencesSchema,
    default: () => ({})
  },
  lastLogin: Date
}, {
  timestamps: true
});

// Hachage du mot de passe avant sauvegarde
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    
    // Mettre à jour la date de dernière connexion si c'est une nouvelle inscription
    if (this.isNew) {
      this.lastLogin = new Date();
    }
    
    next();
  } catch (error) {
    next(error);
  }
});

// Méthode pour vérifier le mot de passe
UserSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Méthode pour mettre à jour la date de dernière connexion
UserSchema.methods.updateLastLogin = async function() {
  this.lastLogin = new Date();
  return this.save();
};

export default mongoose.models.User || mongoose.model('User', UserSchema);