import dbConnect from '../../../lib/mongodb';
import User from '../../../lib/models/User';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Méthode non autorisée' });
  }

  await dbConnect();

  try {
    const { nom, prenom, email, password, specialite, service, numeroOrdre } = req.body;

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Cet email est déjà utilisé' });
    }

    // Créer un nouvel utilisateur
    const user = new User({
      nom,
      prenom,
      email,
      password, // Le hachage est fait dans le middleware pre-save du modèle
      specialite,
      service,
      numeroOrdre
    });

    await user.save();

    res.status(201).json({ message: 'Compte créé avec succès' });
  } catch (error) {
    console.error('Erreur lors de l\'inscription:', error);
    res.status(500).json({ message: 'Erreur lors de l\'inscription' });
  }
}