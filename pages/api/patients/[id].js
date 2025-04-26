import dbConnect from '../../../lib/mongodb';
import Patient from '../../../lib/models/Patient';
import authMiddleware from '../../../lib/middleware/authMiddleware';

async function handler(req, res) {
  const { id } = req.query;
  
  await dbConnect();

  switch (req.method) {
    case 'GET':
      try {
        const patient = await Patient.findById(id);
        
        if (!patient) {
          return res.status(404).json({ message: 'Patient non trouvé' });
        }
        
        res.status(200).json(patient);
      } catch (error) {
        console.error('Erreur lors de la récupération du patient:', error);
        res.status(500).json({ message: 'Erreur lors de la récupération du patient' });
      }
      break;
      
    case 'PUT':
      try {
        const patient = await Patient.findByIdAndUpdate(id, req.body, {
          new: true,
          runValidators: true
        });
        
        if (!patient) {
          return res.status(404).json({ message: 'Patient non trouvé' });
        }
        
        res.status(200).json(patient);
      } catch (error) {
        console.error('Erreur lors de la mise à jour du patient:', error);
        res.status(500).json({ message: 'Erreur lors de la mise à jour du patient' });
      }
      break;
      
    case 'DELETE':
      try {
        const patient = await Patient.findByIdAndDelete(id);
        
        if (!patient) {
          return res.status(404).json({ message: 'Patient non trouvé' });
        }
        
        res.status(200).json({ message: 'Patient supprimé avec succès' });
      } catch (error) {
        console.error('Erreur lors de la suppression du patient:', error);
        res.status(500).json({ message: 'Erreur lors de la suppression du patient' });
      }
      break;
      
    default:
      res.status(405).json({ message: 'Méthode non autorisée' });
  }
}

export default authMiddleware(handler);