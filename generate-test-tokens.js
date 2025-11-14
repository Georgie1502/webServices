// Fichier pour générer des tokens de test
const { generateToken } = require('./api/middleware/auth');

// Générer un token avec droits d'écriture
const token = generateToken({ userId: 1, writeAccess: true }, '1h');
console.log('Token avec droits d\'écriture:', token);

// Générer un token sans droits d'écriture (pour tester le refus)
const tokenReadOnly = generateToken({ userId: 2, writeAccess: false }, '1h');
console.log('Token sans droits d\'écriture:', tokenReadOnly);

console.log('\nUtilisez ces tokens dans Postman avec l\'header:');
console.log('Authorization: Bearer <votre-token>');