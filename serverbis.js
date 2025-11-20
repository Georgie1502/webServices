const express = require("express");
const app = express();
const PORT = 3001;

// Import des routes CRUD (v1, v2) et middleware de version par chemin
const booksRoutesV1 = require("./api/books/routes");
const booksRoutesV2 = require("./api/books-v2/routes");
const { versionByPath, defaultVersionHeader } = require("./api/middleware/versionByPath");

// Swagger UI / OpenAPI
const swaggerUi = require('swagger-ui-express');
const openapi = require('./api/docs/openapi');

// Middleware pour lire le JSON dans les requêtes
app.use(express.json());

// ==========================
//        ROUTES CRUD
// ==========================

// Configuration des versions supportées
const DEFAULT_VERSION = 1;
const routers = {
  1: booksRoutesV1,
  2: booksRoutesV2,
};

// Versionning via chemin dynamique (dans l'URL mais non "en dur")
// Exemple: /api/v1/books, /api/v2/books
app.use("/api/:version/books", versionByPath(routers));

// Alias non versionné pointant vers la version par défaut
app.use("/api/books", defaultVersionHeader(DEFAULT_VERSION), routers[DEFAULT_VERSION]);

// Auto-discovery HATEOAS racine
app.get("/api", (req, res) => {
  const proto = req.protocol;
  const host = req.get("host");
  const root = `${proto}://${host}/api`;
  res.json({
    _links: {
      self: { href: root },
      default: { href: `${root}/books` },
      v1: { href: `${root}/v1/books` },
      v2: { href: `${root}/v2/books` },
    },
  });
});

// Documentation Swagger UI
app.use('/docs', swaggerUi.serve, swaggerUi.setup(openapi));

// Démarrer le serveur uniquement si exécuté directement (pas en test)
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`📚 Serveur lancé sur http://localhost:${PORT}`);
  });
}

// Export pour les tests
module.exports = app;