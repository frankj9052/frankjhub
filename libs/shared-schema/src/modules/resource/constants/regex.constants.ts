export const CAMEL_RE = /^[a-z][a-zA-Z0-9]*$/; // simple camel (no dots/underscores)
export const NAMESPACE_RE = /^[a-z0-9_-]{1,100}$/; // serviceId-like (matches your Service.serviceId rule)
export const QUALIFIER_VALUES = ['*', ':id'] as const;
