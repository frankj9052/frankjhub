import { resendWebhookBodyExample, resendWebhookBodySchema } from '@frankjhub/shared-schema';
import { registry } from '../../../config/openapiRegistry';

registry.registerPath({
  method: 'post',
  path: '/email/webhoos/resend',
  tags: ['Email'],
  summary: 'Resend webhook endpoint for email events',
  description:
    'Receives delivery/bounce/complaint/open/click events from Resend. Optionally verifies signature, stores a receipt for analytics, updates outbox status, and writes suppression on bounce/complaint.',
  request: {
    body: {
      content: {
        'application/json': {
          schema: resendWebhookBodySchema.openapi({
            example: resendWebhookBodyExample,
          }),
        },
      },
    },
  },
  responses: {
    204: { description: 'Event processed' },
    400: { description: 'Invalid payload' },
    401: { description: 'Invalid signature' },
  },
});
