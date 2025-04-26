import dbConnect from '../../../lib/mongodb';
import Alert from '../../../lib/models/Alert';
import authMiddleware from '../../../lib/middleware/authMiddleware';

async function handler(req, res) {
  await dbConnect();

  switch (req.method) {
    case 'GET':
      try {
        const { status, patientId, limit = 50 } = req.query;
        
        const query = {};
        if (status) query.status = status;
        if (patientId) query.patientId = patientId;
        
        const alerts = await Alert.find(query)
          .sort({ timestamp: -1 })
          .limit(parseInt(limit))
          .populate('patientId', 'nom prenom numeroPatient');
          
        res.status(200).json(alerts);
      } catch (error) {
        console.error('Erreur lors de la récupération des alertes:', error);
        res.status(500).json({ message: 'Erreur lors de la récupération des alertes' });
      }
      break;
    
    case 'POST':
      try {
        const alert = new Alert(req.body);
        await alert.save();
        res.status(201).json(alert);
      } catch (error) {
        console.error('Erreur lors de la création de l\'alerte:', error);
        res.status(500).json({ message: 'Erreur lors de la création de l\'alerte', error: error.message });
      }
      break;

    default:
      res.status(405).json({ message: 'Méthode non autorisée' });
  }
}

export default authMiddleware(handler);