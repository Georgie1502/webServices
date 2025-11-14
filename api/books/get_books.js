const db_books = require("../mockDB/proxy/db_books");
const { withBooksLinks, withBookLinks } = require("../middleware/links");

// GET - Récupérer tous les livres
const getAllBooks = async (req, res) => {
    try {
    const books = await db_books.getAll();
    res.json(withBooksLinks(books, req, res));
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération des livres" });
    }
};

// GET (par ID) - Récupérer un livre spécifique
const getBookById = async (req, res) => {
    const id = parseInt(req.params.id);
    const book = await db_books.getById(id);

    if (!book) {
      return res.status(404).json({ message: "Livre non trouvé" });
    }

    res.json(withBookLinks(book, req, res));
};

module.exports = {
    getAllBooks,
    getBookById
};

// // GET (par ID) - Récupérer un livre spécifique
// const getBookById = (req, res) => {
//   const id = parseInt(req.params.id);
//   const book = mockBookDB.find((b) => b.id === id);

//   if (!book) {
//     return res.status(404).json({ message: "Livre non trouvé" });
//   }

//   res.json(book);
// };

// module.exports = {
//   getAllBooks,
//   getBookById
// };
