import dbConnect from '../../../../lib/mongodb';
import User from '../../../../lib/models/User';
import authMiddleware from '../../../../lib/middleware/authMiddleware';
import bcrypt from 'bcryptjs';

async function handler(req, res) {
  const { id } = req.query;
  
  await dbConnect();

  // Vérifier que l'utilisateur modifie son propre mot de passe
  if (req.user.id !== id) {
    return res.status(403).json({ message: 'Non autorisé à modifier ce mot de passe' });
  }

  if (req.method !== 'PUT') {
    return res.status(405).json({ message: 'Méthode non autorisée' });
  }

  try {
    const { currentPassword, newPassword } = req.body;
    
    // Vérifier que les deux mots de passe sont fournis
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Les deux mots de passe sont requis' });
    }
    
    // Récupérer l'utilisateur avec son mot de passe
    const user = await User.findById(id);
    
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    
    // Vérifier que le mot de passe actuel est correct
    const isMatch = await user.comparePassword(currentPassword);
    
    if (!isMatch) {
      return res.status(400).json({ message: 'Le mot de passe actuel est incorrect' });
    }
    
    // Mettre à jour le mot de passe
    user.password = newPassword;
    await user.save();
    
    res.status(200).json({ message: 'Mot de passe mis à jour avec succès' });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du mot de passe:', error);
    res.status(500).json({ message: 'Erreur lors de la mise à jour du mot de passe' });
  }
}

export default authMiddleware(handler);