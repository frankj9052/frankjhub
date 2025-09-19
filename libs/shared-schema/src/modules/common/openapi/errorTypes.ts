export type ErrorClassNames =
  | 'BadRequestError' // 400
  | 'UnauthorizedError' // 401
  | 'ForbiddenError' // 403
  | 'NotFoundError' // 404
  | 'TooManyRequestsError' // 429
  | 'ValidationError' // 422
  | 'InternalServerError' // 500
  | 'DatabaseConnectionError'
  | 'FileNotFoundError'
  | 'InvocationError'
  | 'NotAuthorizedError';
