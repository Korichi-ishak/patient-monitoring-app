import jwt from 'jsonwebtoken';

export default function authMiddleware(handler) {
  return async (req, res) => {
    try {
      // Vérifier le header d'autorisation
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Non autorisé - Token manquant' });
      }

      // Extraire et vérifier le token
      const token = authHeader.split(' ')[1];
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret_temporaire');
        req.user = decoded;
        return handler(req, res);
      } catch (error) {
        return res.status(401).json({ message: 'Non autorisé - Token invalide' });
      }
    } catch (error) {
      console.error('Erreur d\'authentification:', error);
      return res.status(500).json({ message: 'Erreur de serveur' });
    }
  };
}