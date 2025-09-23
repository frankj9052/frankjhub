import { ITemplateRenderer, RenderEmailTemplateRequest } from '@frankjhub/shared-schema';
import path from 'node:path';
import fs from 'node:fs/promises';
import Handlebars from 'handlebars';
import mjml2html from 'mjml';
import { createLoggerWithContext } from '../../common/libs/logger';

export class MjmlRenderer implements ITemplateRenderer {
  constructor(private templateRoot = path.resolve(__dirname, '../template')) {}

  async render(data: RenderEmailTemplateRequest) {
    const logger = createLoggerWithContext('MjmlRenderer');
    const { templateKey, templateVars } = data;
    // 将 templateKey 映射到具体文件路径
    // e.g., transactional.invitation -> transactional/invitation.mjml
    const filePath = path.join(this.templateRoot, ...templateKey.split('.')) + '.mjml';
    const raw = await fs.readFile(filePath, 'utf8');

    // Handlerbars 预处理（支持 {{name}} 等）
    const compiled = Handlebars.compile(raw);
    const mjml = compiled(templateVars);

    const { html, errors } = mjml2html(mjml, { validationLevel: 'soft' });
    if (errors?.length) {
      // 记录但不中断
      logger.error('Error occur in mjml2html');
    }

    const text = (html || '')
      .replace(/<[^>]+>/g, '')
      .replace(/\s+/g, ' ')
      .trim();

    const subject = templateVars.subject;
    return { htmlBody: html, textBody: text, subject };
  }
}
