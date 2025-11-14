// OpenAPI 3 spec (programmatic) for swagger-ui-express

const pkg = require('../../package.json');

const openapi = {
  openapi: '3.0.3',
  info: {
    title: 'Books API',
    version: pkg.version || '1.0.0',
    description: 'API REST d\'exemple avec versioning dynamique et HATEOAS',
  },
  servers: [
    { url: 'http://localhost:3001', description: 'Local' },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
    schemas: {
      Book: {
        type: 'object',
        required: ['id', 'title', 'author'],
        properties: {
          id: { type: 'integer', example: 1 },
          title: { type: 'string', example: 'Dune' },
          author: { type: 'string', example: 'Frank Herbert' },
        },
      },
      BookWithLinks: {
        allOf: [
          { $ref: '#/components/schemas/Book' },
          {
            type: 'object',
            properties: {
              _links: {
                type: 'object',
                properties: {
                  self: { type: 'object', properties: { href: { type: 'string' } } },
                  collection: { type: 'object', properties: { href: { type: 'string' } } },
                },
              },
            },
          },
        ],
      },
      Error: {
        type: 'object',
        properties: {
          message: { type: 'string' },
        },
      },
    },
  },
  paths: {
    '/api': {
      get: {
        summary: 'Auto-discovery racine',
        responses: {
          200: {
            description: 'Liens disponibles',
          },
        },
      },
    },
    '/api/{version}/books': {
      parameters: [
        {
          in: 'path',
          name: 'version',
          required: true,
          schema: { type: 'string', enum: ['v1', 'v2'] },
          description: 'Version de l\'API',
        },
      ],
      get: {
        summary: 'Lister les livres',
        responses: {
          200: {
            description: 'Liste des livres',
            content: {
              'application/json': {
                schema: { type: 'array', items: { $ref: '#/components/schemas/BookWithLinks' } },
              },
            },
          },
        },
      },
      post: {
        summary: 'Créer un livre',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['title', 'author'],
                properties: {
                  title: { type: 'string' },
                  author: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: 'Livre créé',
            content: {
              'application/json': { schema: { $ref: '#/components/schemas/BookWithLinks' } },
            },
          },
          400: { description: 'Requête invalide', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
          401: { description: 'Non autorisé' },
        },
      },
    },
    '/api/{version}/books/{id}': {
      parameters: [
        { in: 'path', name: 'version', required: true, schema: { type: 'string', enum: ['v1', 'v2'] } },
        { in: 'path', name: 'id', required: true, schema: { type: 'integer' } },
      ],
      get: {
        summary: 'Obtenir un livre par id',
        responses: {
          200: { description: 'Livre', content: { 'application/json': { schema: { $ref: '#/components/schemas/BookWithLinks' } } } },
          404: { description: 'Non trouvé', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
        },
      },
      put: {
        summary: 'Mettre à jour un livre',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['title', 'author'],
                properties: {
                  title: { type: 'string' },
                  author: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          200: { description: 'Livre mis à jour', content: { 'application/json': { schema: { $ref: '#/components/schemas/BookWithLinks' } } } },
          404: { description: 'Non trouvé' },
        },
      },
      delete: {
        summary: 'Supprimer un livre',
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: 'Supprimé' },
          404: { description: 'Non trouvé' },
        },
      },
    },
    '/api/books': {
      get: {
        summary: 'Alias vers version par défaut',
        responses: { 200: { description: 'OK' } },
      },
    },
  },
};

module.exports = openapi;
