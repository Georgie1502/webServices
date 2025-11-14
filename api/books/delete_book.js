//const mockBookDB = require("../mockDB/books"); 
const db_books = require("../mockDB/proxy/db_books");
const { booksCollectionHref } = require("../middleware/links");



// const deleteBook = (req, res) => {
//    const id = parseInt(req.params.id);
//   const bookIndex = mockBookDB.findIndex((b) => b.id === id);

//   if (bookIndex === -1) {
//     return res.status(404).json({ message: "Livre non trouvé" });
//   }

//   const deletedBook = mockBookDB.splice(bookIndex, 1);
//   res.json({ message: "Livre supprimé", deleted: deletedBook[0] });
// };

// module.exports = async deleteBook;


module.exports = async (req, res) => {
    const id = parseInt(req.params.id);
    await db_books.deleteById(id);
    res.json({
        message: "Livre supprimé",
        _links: {
            collection: { href: booksCollectionHref(req, res) }
        }
    });
};
