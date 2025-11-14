// const mockBookDB = require("../mockDB/books");

// const putBook = (req, res) => {
//    const id = parseInt(req.params.id);
//   const { title, author } = req.body;

//   const bookIndex = mockBookDB.findIndex((b) => b.id === id);
//   if (bookIndex === -1) {
//     return res.status(404).json({ message: "Livre non trouvé" });
//   }

//   if (!title || !author) {
//     return res.status(400).json({ message: "Titre et auteur sont requis." });
//   }

//   mockBookDB[bookIndex] = { id, title, author };
//   res.json(mockBookDB[bookIndex]);
// };

// module.exports = putBook;
const db_books = require("../mockDB/proxy/db_books");
const { withBookLinks } = require("../middleware/links");

module.exports = async (req, res) => {
    const id = parseInt(req.params.id);
    const { title, author } = req.body;

    try {
    const updatedBook = await db_books.putById(id, title, author);
    res.json(withBookLinks(updatedBook, req, res));
    } catch (error) {
        res.status(404).json({ message: error });
    }
};
