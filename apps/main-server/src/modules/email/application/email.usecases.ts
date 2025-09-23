import { Repository } from 'typeorm';
import { EmailRepository } from '../persistence/email.repository';
import { EmailSuppression } from '../entities/EmailSuppression';
import {
  EMAIL_CHANNEL,
  EMAIL_STATUS,
  IEmailProvider,
  ITemplateRenderer,
  SendEmailRequest,
} from '@frankjhub/shared-schema';

export class SendEmailUseCase {
  constructor(
    private emailRepo: EmailRepository,
    private suppressionRepo: Repository<EmailSuppression>,
    private provider: IEmailProvider,
    private renderer: ITemplateRenderer,
    private defaults: { from: string; replyTo?: string; enableQueue: boolean; maxRetry: number },
    private enqueue?: (emailId: string) => Promise<void> // 若启用队列
  ) {}

  async exec(dto: SendEmailRequest) {
    // 抑制拦截
    const suppressed = await this.suppressionRepo.findOne({ where: { email: dto.to } });
    if (suppressed) {
      return this.emailRepo.createAndSave({
        to: dto.to,
        subject: dto.subject,
        from: dto.from,
        replyTo: dto.replyTo ?? this.defaults.replyTo,
        templateKey: dto.templateKey,
        templateVars: dto.templateVars,
        channel: dto.channel ?? EMAIL_CHANNEL.TRANSACTIONAL,
        status: EMAIL_STATUS.SUPPRESSED,
        idempotencyKey: dto.idempotencyKey,
        traceId: dto.traceId,
      });
    }

    // 幂等
    if (dto.idempotencyKey) {
      const existing = await this.emailRepo.findByIdemKey(dto.idempotencyKey);
      if (existing) return existing;
    }

    // 渲染
    let html = dto.htmlBody;
    let text = dto.textBody;
    let subject = dto.subject;
    if (dto.templateKey) {
      const r = await this.renderer.render({
        templateKey: dto.templateKey,
        templateVars: dto.templateVars ?? {},
      });
      html = html ?? r.htmlBody;
      text = text ?? r.textBody;
      subject = subject ?? r.subject ?? dto.subject;
    }

    // 记录outbox queued
    const email = await this.emailRepo.createAndSave({
      to: dto.to,
      from: dto.from ?? this.defaults.from,
      replyTo: dto.replyTo ?? this.defaults.replyTo,
      subject,
      htmlBody: html,
      textBody: text,
      templateKey: dto.templateKey,
      templateVars: dto.templateVars,
      channel: dto.channel ?? EMAIL_CHANNEL.TRANSACTIONAL,
      status: this.defaults.enableQueue ? EMAIL_STATUS.QUEUED : EMAIL_STATUS.SENDING,
      idempotencyKey: dto.idempotencyKey,
      traceId: dto.traceId,
      provider: this.provider.name,
    });

    // 同步直发或入队
    if (this.defaults.enableQueue && this.enqueue) {
      await this.enqueue(email.id);
      return email;
    } else {
      try {
        await this.emailRepo.markSending(email.id);
        const res = await this.provider.send({
          to: email.to,
          from: email.from,
          replyTo: email.replyTo ?? undefined,
          subject: email.subject,
          htmlBody: email.htmlBody ?? undefined,
          textBody: email.textBody ?? undefined,
        });
        await this.emailRepo.markFinal(email.id, EMAIL_STATUS.SENT, res.providerMessageId);
      } catch (error) {
        await this.emailRepo.markFinal(
          email.id,
          EMAIL_STATUS.FAILED,
          undefined,
          String((error as any)?.message ?? error)
        );
      }
      return this.emailRepo.findById(email.id);
    }
  }
}
