/**
 * API versioning middleware (header-based, no URL version).
 *
 * Supported ways to request a version (in order):
 * - X-API-Version: <number>
 * - Accept: application/vnd.api-rest.v<number>+json
 *
 * Defaults to the lowest supported version when absent.
 * Returns 406 Not Acceptable when version is unsupported.
 */

const VERSION_HEADER = "x-api-version";
const ACCEPT_VENDOR_REGEX = /application\/vnd\.[^.;\s]+\.v(\d+)\+json/i; // captures vendor vN

/**
 * Resolve requested version from headers.
 * @param {import('express').Request} req
 * @param {number[]} supported - sorted ascending array of supported versions
 * @returns {number} resolved version (may be default)
 */
function resolveRequestedVersion(req, supported) {
  // 1) X-API-Version header
  const hdr = req.header(VERSION_HEADER);
  if (hdr && /^\d+$/.test(hdr)) {
    return parseInt(hdr, 10);
  }

  // 2) Accept: application/vnd.<vendor>.vN+json
  const accept = req.header("accept") || "";
  const m = accept.match(ACCEPT_VENDOR_REGEX);
  if (m && m[1]) {
    const v = parseInt(m[1], 10);
    if (!Number.isNaN(v)) return v;
  }

  // 3) Default to lowest supported (stable baseline)
  return supported[0];
}

/**
 * Create a versioned router dispatcher.
 * @param {Record<number, import('express').Router>} routers - map version -> router
 * @returns {import('express').RequestHandler}
 */
function versioned(routers) {
  const supported = Object.keys(routers)
    .map((k) => parseInt(k, 10))
    .filter((n) => !Number.isNaN(n))
    .sort((a, b) => a - b);

  if (supported.length === 0) {
    throw new Error("versioned(): no routers provided");
  }

  const supportedHeader = supported.join(",");

  return function versionedMiddleware(req, res, next) {
    const requested = resolveRequestedVersion(req, supported);
    const router = routers[requested];

    // Always advertise what we support
    res.setHeader("X-API-Supported-Versions", supportedHeader);

    if (!router) {
      return res.status(406).json({
        error: "Unsupported API version",
        requested,
        supported: supported,
      });
    }

    // Surface the resolved version
    res.setHeader("X-API-Version", String(requested));
    res.locals.apiVersion = requested;

    // Delegate to the selected router
    return router(req, res, next);
  };
}

module.exports = {
  versioned,
  resolveRequestedVersion,
};
