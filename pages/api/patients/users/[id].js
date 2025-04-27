import dbConnect from '../../../lib/mongodb';
import User from '../../../lib/models/User';
import authMiddleware from '../../../lib/middleware/authMiddleware';

async function handler(req, res) {
  const { id } = req.query;
  
  await dbConnect();

  // Vérifier que l'utilisateur modifie son propre profil
  if (req.user.id !== id) {
    return res.status(403).json({ message: 'Non autorisé à modifier ce profil' });
  }

  switch (req.method) {
    case 'GET':
      try {
        // Exclure le mot de passe des résultats
        const user = await User.findById(id).select('-password');
        
        if (!user) {
          return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }
        
        res.status(200).json(user);
      } catch (error) {
        console.error('Erreur lors de la récupération de l\'utilisateur:', error);
        res.status(500).json({ message: 'Erreur lors de la récupération de l\'utilisateur' });
      }
      break;
      
    case 'PUT':
      try {
        // Ne pas permettre la modification de l'email
        const { email, password, ...updateData } = req.body;
        
        const user = await User.findByIdAndUpdate(id, updateData, {
          new: true,
          runValidators: true
        }).select('-password');
        
        if (!user) {
          return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }
        
        res.status(200).json(user);
      } catch (error) {
        console.error('Erreur lors de la mise à jour de l\'utilisateur:', error);
        res.status(500).json({ message: 'Erreur lors de la mise à jour de l\'utilisateur' });
      }
      break;
      
    default:
      res.status(405).json({ message: 'Méthode non autorisée' });
  }
}

export default authMiddleware(handler);