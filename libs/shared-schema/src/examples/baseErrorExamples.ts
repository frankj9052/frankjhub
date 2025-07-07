export const baseErrorExample = {
  timestamp: new Date().toISOString(),
  status: 400,
  code: 'INVALID_INPUT',
  message: 'Invalid email address',
  requestId: 'req_123456',
  details: { path: ['email'], message: 'Invalid format' },
  cause: 'ZodError: Invalid email',
};