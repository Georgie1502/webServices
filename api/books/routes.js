const express = require("express");
const router = express.Router();
const { getAllBooks, getBookById } = require("./get_books");
const postBook = require("./post_book");
const putBook = require("./put_book");
const deleteBook = require("./delete_book");
const limiter = require("../middleware/rateLimiter");
const { requireWriteAccess, generateToken } = require("../middleware/auth");

// GET - Récupérer tous les livres (avec limitation à 5 requêtes par 5 secondes)
router.get("/", limiter.FIVE_SEC, getAllBooks);

// GET (par ID) - Récupérer un livre spécifique
router.get("/:id", getBookById);

// POST - Ajouter un nouveau livre
router.post("/", requireWriteAccess, postBook);

// PUT - Mettre à jour un livre existant
router.put("/:id", requireWriteAccess, putBook);

// DELETE - Supprimer un livre
router.delete("/:id", requireWriteAccess, deleteBook);

// Route pour générer un token de test (à supprimer en production)
router.get("/generate-token", (req, res) => {
  const token = generateToken({ userId: 1, writeAccess: true }, '1h');
  res.json({ 
    token: token,
    message: "Token généré avec succès. Utilisez-le dans l'header: Authorization: Bearer " + token
  });
});

module.exports = router;
