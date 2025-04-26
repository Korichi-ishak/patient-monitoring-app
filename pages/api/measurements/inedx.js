import dbConnect from '../../../lib/mongodb';
import Measurement from '../../../lib/models/Measurement';
import Alert from '../../../lib/models/Alert';
import authMiddleware from '../../../lib/middleware/authMiddleware';

// Seuils pour déterminer les anomalies (à ajuster selon les besoins cliniques)
const thresholds = {
  temperature: { min: 36, max: 38 },
  frequenceCardiaque: { min: 60, max: 100 },
  saturationOxygene: { min: 95, max: 100 },
  tensionArterielle: { 
    systolique: { min: 90, max: 140 },
    diastolique: { min: 60, max: 90 }
  },
  respiratoire: { min: 12, max: 20 },
  glucose: { min: 4, max: 8 }
};

// Vérifier si une mesure est anormale
function checkAnomaly(type, value) {
  if (type === 'tensionArterielle') {
    const [systolique, diastolique] = value.split('/').map(v => parseInt(v));
    
    return (
      systolique < thresholds.tensionArterielle.systolique.min ||
      systolique > thresholds.tensionArterielle.systolique.max ||
      diastolique < thresholds.tensionArterielle.diastolique.min ||
      diastolique > thresholds.tensionArterielle.diastolique.max
    );
  }
  
  // Pour les autres types de mesures
  return (
    value < thresholds[type]?.min ||
    value > thresholds[type]?.max
  );
}

// Déterminer la sévérité d'une anomalie
function getSeverity(type, value) {
  // Logique simplifiée - à ajuster selon les besoins cliniques
  if (type === 'temperature') {
    if (value > 39) return 'haute';
    if (value > 38) return 'moyenne';
    if (value < 35) return 'haute';
    if (value < 36) return 'moyenne';
    return 'basse';
  }
  
  if (type === 'saturationOxygene') {
    if (value < 90) return 'haute';
    if (value < 95) return 'moyenne';
    return 'basse';
  }
  
  // Valeur par défaut
  return 'moyenne';
}

async function handler(req, res) {
  await dbConnect();

  switch (req.method) {
    case 'GET':
      try {
        const { patientId, type, limit = 50 } = req.query;
        
        const query = {};
        if (patientId) query.patientId = patientId;
        if (type) query.type = type;
        
        const measurements = await Measurement.find(query)
          .sort({ timestamp: -1 })
          .limit(parseInt(limit));
          
        res.status(200).json(measurements);
      } catch (error) {
        console.error('Erreur lors de la récupération des mesures:', error);
        res.status(500).json({ message: 'Erreur lors de la récupération des mesures' });
      }
      break;
    
    case 'POST':
      try {
        const measurementData = req.body;
        
        // Vérifier si la mesure est anormale
        const isAnomaly = checkAnomaly(measurementData.type, measurementData.valeur);
        measurementData.anomalie = isAnomaly;
        
        // Créer la mesure
        const measurement = new Measurement(measurementData);
        await measurement.save();
        
        // Créer une alerte si nécessaire
        if (isAnomaly) {
          const severity = getSeverity(measurementData.type, measurementData.valeur);
          const alert = new Alert({
            patientId: measurementData.patientId,
            measurementId: measurement._id,
            type: `${measurementData.type} anormale`,
            severite: severity,
            description: `Valeur anormale: ${measurementData.valeur} ${measurementData.unite || ''}`,
            status: 'nouvelle'
          });
          
          await alert.save();
        }
        
        res.status(201).json(measurement);
      } catch (error) {
        console.error('Erreur lors de la création de la mesure:', error);
        res.status(500).json({ message: 'Erreur lors de la création de la mesure', error: error.message });
      }
      break;

    default:
      res.status(405).json({ message: 'Méthode non autorisée' });
  }
}

export default authMiddleware(handler);