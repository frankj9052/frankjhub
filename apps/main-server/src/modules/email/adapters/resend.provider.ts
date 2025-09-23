import { EMAIL_PROVIDER, IEmailProvider } from '@frankjhub/shared-schema';
import { Resend } from 'resend';

export class ResendProvider implements IEmailProvider {
  name = EMAIL_PROVIDER.RESEND;
  private client: Resend;

  constructor(apiKey: string) {
    this.client = new Resend(apiKey);
  }

  async send(dto: {
    to: string;
    subject: string;
    html?: string;
    text: string;
    from: string;
    replyTo?: string;
    cc?: string;
    bcc?: string;
  }) {
    const res = await this.client.emails.send({
      from: dto.from,
      to: dto.to,
      cc: dto.cc,
      bcc: dto.bcc,
      subject: dto.subject,
      html: dto.html,
      text: dto.text,
      replyTo: dto.replyTo,
    });

    return { providerMessageId: res.data?.id };
  }
}
