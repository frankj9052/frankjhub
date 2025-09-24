import { EMAIL_PROVIDER, IEmailProvider, SendEmailRequest } from '@frankjhub/shared-schema';
import { Resend } from 'resend';
import { createLoggerWithContext } from '../../common/libs/logger';
import { ValidationError } from '../../common/errors/ValidationError';
import { InvocationError } from '../../common/errors/InvocationError';

export class ResendProvider implements IEmailProvider {
  name = EMAIL_PROVIDER.RESEND;
  private client: Resend;
  private logger = createLoggerWithContext('ResendProvider');

  constructor(apiKey: string) {
    this.client = new Resend(apiKey);
  }

  async send(dto: SendEmailRequest) {
    if (!dto.from) {
      this.logger.warning('From value cannot be undefined!');
      throw new ValidationError({ from: 'value cannot be undefined!' });
    }
    if (!dto.textBody) {
      this.logger.warning('Textbody value cannot be undefined!');
      throw new ValidationError({ textBody: 'value cannot be undefined!' });
    }
    const res = await this.client.emails.send({
      from: dto.from,
      to: dto.to,
      cc: dto.cc,
      bcc: dto.bcc,
      subject: dto.subject,
      html: dto.htmlBody,
      text: dto.textBody,
      replyTo: dto.replyTo,
    });
    if (res.error?.message) {
      throw new InvocationError('ResendProvider.send', res.error);
    }
    return { providerMessageId: res.data?.id };
  }
}
