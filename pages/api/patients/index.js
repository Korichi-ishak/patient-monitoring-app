import dbConnect from '../../../lib/mongodb';
import Patient from '../../../lib/models/Patient';
import authMiddleware from '../../../lib/middleware/authMiddleware';

async function handler(req, res) {
  await dbConnect();

  switch (req.method) {
    case 'GET':
      try {
        const patients = await Patient.find({}).sort({ nom: 1 });
        res.status(200).json(patients);
      } catch (error) {
        console.error('Erreur lors de la récupération des patients:', error);
        res.status(500).json({ message: 'Erreur lors de la récupération des patients' });
      }
      break;
    
    case 'POST':
      try {
        const patient = new Patient(req.body);
        await patient.save();
        res.status(201).json(patient);
      } catch (error) {
        console.error('Erreur lors de la création du patient:', error);
        res.status(500).json({ message: 'Erreur lors de la création du patient', error: error.message });
      }
      break;

    default:
      res.status(405).json({ message: 'Méthode non autorisée' });
  }
}

export default authMiddleware(handler);