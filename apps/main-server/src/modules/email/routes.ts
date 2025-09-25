import { Router } from 'express';
import './docs/openapi';
import { resendWebhookController } from './infra/resend.webhook.controller';

const router = Router();

router.post('/email/webhooks/resend', resendWebhookController);

// Exported register function
export function register(parent: Router) {
  parent.use('/', router);
}
