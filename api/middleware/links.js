/**
 * Helpers HATEOAS pour générer des liens en fonction de la version et de l'hôte.
 */

function baseUrl(req) {
  const proto = req.protocol;
  const host = req.get('host');
  return `${proto}://${host}`;
}

function apiPrefix(req, res) {
  const v = res.locals.apiVersion;
  const root = `${baseUrl(req)}/api`;
  return v ? `${root}/v${v}` : root;
}

function bookSelfHref(id, req, res) {
  return `${apiPrefix(req, res)}/books/${id}`;
}

function booksCollectionHref(req, res) {
  return `${apiPrefix(req, res)}/books`;
}

function withBookLinks(book, req, res) {
  return {
    ...book,
    _links: {
      self: { href: bookSelfHref(book.id, req, res) },
      collection: { href: booksCollectionHref(req, res) },
    },
  };
}

function withBooksLinks(books, req, res) {
  return books.map((b) => withBookLinks(b, req, res));
}

module.exports = {
  withBookLinks,
  withBooksLinks,
  bookSelfHref,
  booksCollectionHref,
};
