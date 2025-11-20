const request = require("supertest");
const { generateToken } = require("../api/middleware/auth");

jest.mock("../api/mockDB/books", () => [
  { id: 1, title: "Dune", author: "Frank Herbert" },
  { id: 2, title: "1984", author: "George Orwell" },
  { id: 3, title: "Le Petit Prince", author: "Antoine de Saint-Exupéry" },
]);

// Import de l'app
const app = require("../serverbis");

describe("API Livres - Tests d'intégration", () => {
  let token;

  beforeAll(() => {
    token = generateToken({ userId: 1, writeAccess: true }, "1h");
  });

  // TESTS GET 

  test("GET /api/v1/books retourne tous les livres", async () => {
    const res = await request(app).get("/api/v1/books");

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test("GET /api/v1/books/:id retourne un livre spécifique", async () => {
    const res = await request(app).get("/api/v1/books/1");

    expect(res.statusCode).toBe(200);
    expect(res.body.id).toBe(1);
    expect(res.body.title).toBe("Dune");
    expect(res.body.author).toBe("Frank Herbert");
  });

  test("GET /api/v1/books/:id retourne 404 pour ID inexistant", async () => {
    const res = await request(app).get("/api/v1/books/999");

    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty("message");
  });

  // TESTS POST

  test("POST /api/v1/books crée un livre avec token", async () => {
    const newBook = {
      title: "Fondation",
      author: "Isaac Asimov",
    };

    const res = await request(app)
      .post("/api/v1/books")
      .set("Authorization", `Bearer ${token}`)
      .send(newBook);

    expect(res.statusCode).toBe(201);
    expect(res.body.title).toBe("Fondation");
    expect(res.body.author).toBe("Isaac Asimov");
  });

  test("POST /api/v1/books retourne 401 sans token", async () => {
    const res = await request(app)
      .post("/api/v1/books")
      .send({ title: "Test", author: "Test" });

    expect(res.statusCode).toBe(401);
  });

  test("POST /api/v1/books retourne 400 si title manquant", async () => {
    const res = await request(app)
      .post("/api/v1/books")
      .set("Authorization", `Bearer ${token}`)
      .send({ author: "Auteur uniquement" });

    expect(res.statusCode).toBe(400);
  });

  test("POST /api/v1/books retourne 400 si author manquant", async () => {
    const res = await request(app)
      .post("/api/v1/books")
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "Titre uniquement" });

    expect(res.statusCode).toBe(400);
  });

  // TESTS PUT

  test("PUT /api/v1/books/:id met à jour un livre", async () => {
    const res = await request(app)
      .put("/api/v1/books/1")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Le Seigneur des Anneaux - Édition révisée",
        author: "J.R.R. Tolkien",
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.title).toBe("Le Seigneur des Anneaux - Édition révisée");
  });

  test("PUT /api/v1/books/:id retourne 401 sans token", async () => {
    const res = await request(app)
      .put("/api/v1/books/1")
      .send({ title: "Test", author: "Test" });

    expect(res.statusCode).toBe(401);
  });

  test("PUT /api/v1/books/:id retourne 404 pour ID inexistant", async () => {
    const res = await request(app)
      .put("/api/v1/books/999")
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "Test", author: "Test" });

    expect(res.statusCode).toBe(404);
  });

  // TESTS DELETE

  test("DELETE /api/v1/books/:id supprime un livre", async () => {
    const res = await request(app)
      .delete("/api/v1/books/2")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toContain("supprimé");
  });

  test("DELETE /api/v1/books/:id retourne 401 sans token", async () => {
    const res = await request(app).delete("/api/v1/books/3");

    expect(res.statusCode).toBe(401);
  });
});
