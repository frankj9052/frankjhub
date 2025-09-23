import { EmailProvider } from '../constants';
import { RenderEmailTemplateRequest, SendEmailRequest } from '../request';
import { RenderEmailTemplateResult, SendEmailResult } from '../response';

export interface IEmailProvider {
  name: EmailProvider;
  send(dto: SendEmailRequest): Promise<SendEmailResult>;
}

export interface ITemplateRenderer {
  render(data: RenderEmailTemplateRequest): Promise<RenderEmailTemplateResult>;
}
