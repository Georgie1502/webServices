const jwt = require('jsonwebtoken');

// Clé secrète JWT (en production, utilisez une variable d'environnement sécurisée)
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';

/**
 * Middleware d'authentification JWT pour vérifier les droits d'écriture
 * @param {Object} req - Objet de requête Express
 * @param {Object} res - Objet de réponse Express  
 * @param {Function} next - Fonction middleware suivante
 */
const requireWriteAccess = (req, res, next) => {
  try {
    // 1. Récupérer le token depuis l'header Authorization
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return res.status(401).json({ error: 'auth failed' });
    }

    // 2. Vérifier le format Bearer
    if (!authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'auth failed' });
    }

    // 3. Extraire le token
    const token = authHeader.substring(7);

    if (!token) {
      return res.status(401).json({ error: 'auth failed' });
    }

    // 4. Vérifier et décoder le token JWT
    const decoded = jwt.verify(token, JWT_SECRET);

    // 5. Vérifier les permissions d'écriture
    if (!decoded.writeAccess) {
      return res.status(401).json({ error: 'auth failed' });
    }

    // 6. Ajouter les informations utilisateur à la requête
    req.user = decoded;
    
    // 7. Passer au middleware suivant
    next();

  } catch (error) {
    // Gestion des erreurs JWT (token expiré, invalide, etc.)
    return res.status(401).json({ error: 'auth failed' });
  }
};

/**
 * Fonction utilitaire pour générer un token JWT (pour les tests)
 * @param {Object} payload - Données à inclure dans le token
 * @param {string} expiresIn - Durée d'expiration (ex: '1h', '7d')
 * @returns {string} Token JWT signé
 */
const generateToken = (payload, expiresIn = '1h') => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn });
};

module.exports = {
  requireWriteAccess,
  generateToken
};