// libs/shared-schema/src/modules/service-route/constants/regex.constants.ts
/** Accepts `/booking`, `/users/:id`, `/v1/things/*` etc. */
export const ROUTE_PATH_RE = /^(?:\/[A-Za-z0-9_\-.:*]+)(?:\/[A-Za-z0-9_\-.:*]+)*$/;

/** Optional rewrite should usually be a prefix (e.g., "^/booking"). */
export const REWRITE_RE = /^(\^)?\/[A-Za-z0-9_\-./:]*$/;
