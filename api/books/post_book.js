// const mockBookDB = require("../mockDB/books");

// const postBook = (req, res) => {
//   const { title, author } = req.body;

//   if (!title || !author) {
//     return res.status(400).json({ message: "Titre et auteur sont requis." });
//   }

//   const newBook = {
//     id: mockBookDB.length ? mockBookDB[mockBookDB.length - 1].id + 1 : 1,
//     title,
//     author,
//   };

//   mockBookDB.push(newBook);
//   res.status(201).json(newBook);
// };

// module.exports = postBook;
const db_books = require("../mockDB/proxy/db_books");
const { withBookLinks } = require("../middleware/links");

module.exports = async (req, res) => {
    const { title, author } = req.body; 
    if (!title || !author) {
        return res.status(400).json({ message: "Titre et auteur sont requis." });
    }   
    const newBook = await db_books.post(title, author);
    res.status(201).json(withBookLinks(newBook, req, res));
};

