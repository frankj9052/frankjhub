import { ResendWebhookBody } from '../entity';

export const resendWebhookBodyExample: ResendWebhookBody = {
  type: 'email.clicked',
  created_at: '2025-09-25T10:30:00.000Z',
  data: {
    broadcast_id: '8b146471-e88e-4322-86af-016cd36fd216',
    created_at: '2025-09-25T10:29:55.000Z',
    email_id: '56761188-7520-42d8-8898-ff6fc54ce618',
    from: 'Acme <onboarding@resend.dev>',
    to: ['user@example.com'],
    subject: 'Please confirm your email',
    tags: {
      category: 'confirm_email',
    },
    click: {
      ipAddress: '122.115.53.11',
      link: 'https://resend.com',
      timestamp: '2025-09-25T10:30:01.123Z',
      userAgent:
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36',
    },
  },
};
