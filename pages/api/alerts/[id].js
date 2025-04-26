import dbConnect from '../../../lib/mongodb';
import Alert from '../../../lib/models/Alert';
import authMiddleware from '../../../lib/middleware/authMiddleware';

async function handler(req, res) {
  const { id } = req.query;
  
  await dbConnect();

  switch (req.method) {
    case 'GET':
      try {
        const alert = await Alert.findById(id).populate('patientId', 'nom prenom numeroPatient');
        
        if (!alert) {
          return res.status(404).json({ message: 'Alerte non trouvée' });
        }
        
        res.status(200).json(alert);
      } catch (error) {
        console.error('Erreur lors de la récupération de l\'alerte:', error);
        res.status(500).json({ message: 'Erreur lors de la récupération de l\'alerte' });
      }
      break;
      
    case 'PUT':
      try {
        const alert = await Alert.findByIdAndUpdate(id, req.body, {
          new: true,
          runValidators: true
        });
        
        if (!alert) {
          return res.status(404).json({ message: 'Alerte non trouvée' });
        }
        
        res.status(200).json(alert);
      } catch (error) {
        console.error('Erreur lors de la mise à jour de l\'alerte:', error);
        res.status(500).json({ message: 'Erreur lors de la mise à jour de l\'alerte' });
      }
      break;
      
    default:
      res.status(405).json({ message: 'Méthode non autorisée' });
  }
}

export default authMiddleware(handler);