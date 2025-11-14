const rateLimit = require('express-rate-limit');

// Configuration des différents limiters
const limiter = {
  // Limite à 1 requête par seconde
  ONE_SEC: rateLimit({
    windowMs: 1 * 1000, // 1 seconde
    max: 1, // limite de 1 requête par fenêtre de temps
    message: {
      error: "Trop de requêtes depuis cette IP, veuillez réessayer dans 1 seconde."
    },
    standardHeaders: true, // Retourne les headers `RateLimit-*`
    legacyHeaders: false, // Désactive les headers `X-RateLimit-*`
  }),

  // Limite à 5 requêtes par 5 secondes
  FIVE_SEC: rateLimit({
    windowMs: 5 * 1000, // 5 secondes
    max: 5, // limite de 5 requêtes par fenêtre de temps
    message: {
      error: "Trop de requêtes depuis cette IP, veuillez réessayer dans quelques secondes."
    },
    standardHeaders: true,
    legacyHeaders: false,
  }),

};

module.exports = limiter;