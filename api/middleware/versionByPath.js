/**
 * Versioning par chemin dynamique: /api/:version/... sans version "en dur".
 *
 * Usage côté serveur:
 *   const { versionByPath, defaultVersionHeader } = require('./api/middleware/versionByPath');
 *   const routers = { 1: booksRoutesV1, 2: booksRoutesV2 }; // v2 optionnelle
 *   app.use('/api/:version/books', versionByPath(routers));
 *   app.use('/api/books', defaultVersionHeader(1), routers[1]); // alias vers la version par défaut
 *
 * Conventions:
 *  - :version est de la forme "v1", "v2"...
 *  - Réponse 406 si version non supportée
 *  - Ajoute le header X-API-Version et X-API-Supported-Versions
 */

/**
 * Extrait le numéro de version depuis une string type "v1".
 * @param {string} raw
 * @returns {number|undefined}
 */
function parseVersion(raw) {
  if (!raw || typeof raw !== 'string') return undefined;
  const m = raw.match(/^v?(\d+)$/i);
  if (!m) return undefined;
  const n = parseInt(m[1], 10);
  return Number.isNaN(n) ? undefined : n;
}

/**
 * Middleware: délègue au router correspondant à la version dans req.params.version.
 * @param {Record<number, import('express').Router>} routers
 * @param {{ paramName?: string, onUnsupported?: '404'|'406' }} [opts]
 */
function versionByPath(routers, opts = {}) {
  const paramName = opts.paramName || 'version';
  const onUnsupported = opts.onUnsupported || '406';
  const supported = Object.keys(routers)
    .map((k) => parseInt(k, 10))
    .filter((n) => !Number.isNaN(n))
    .sort((a, b) => a - b);
  const supportedHeader = supported.join(',');

  if (supported.length === 0) {
    throw new Error('versionByPath(): aucun router fourni');
  }

  return function versionByPathMiddleware(req, res, next) {
    const raw = req.params[paramName]; // ex: 'v1'
    const v = parseVersion(raw);

    // Toujours annoncer les versions supportées
    res.setHeader('X-API-Supported-Versions', supportedHeader);

    if (!v || !routers[v]) {
      const body = { error: 'Unsupported API version', requested: raw, supported };
      if (onUnsupported === '404') return res.status(404).json(body);
      return res.status(406).json(body);
    }

    // Expose la version résolue et délègue
    res.setHeader('X-API-Version', String(v));
    res.locals.apiVersion = v;
    return routers[v](req, res, next);
  };
}

/**
 * Middleware: force l'entête X-API-Version pour l'alias non versionné.
 * @param {number} v
 */
function defaultVersionHeader(v) {
  return (req, res, next) => {
    res.setHeader('X-API-Version', String(v));
    res.locals.apiVersion = v; // expose la version pour la génération des liens
    next();
  };
}

module.exports = { versionByPath, defaultVersionHeader };
