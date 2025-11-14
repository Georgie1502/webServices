
const books = require("../books");

module.exports = {
  getAll: async () => {
    return books;
  },

  getById: async (id) => {
    return books.find(e => e.id === id);
  },

  deleteById: async (id) => {
    const index = books.findIndex((b) => b.id === id);
    if (index === -1) {
      throw "book" + id + " not found";
    }
    return books.splice(index, 1);
  },

  putById: async (id, title, author) => {
    const index = books.findIndex((b) => b.id === id);
    if (index === -1) {
      throw "book" + id + " not found";
    }
    books[index] = { id, title, author };
    return books[index];
  },    

  post: async (title, author) => {
    const newBook = {
      id: books.length ? books[books.length - 1].id + 1 : 1,
      title,
      author,
    };
    books.push(newBook);
    return newBook;
  }

};
