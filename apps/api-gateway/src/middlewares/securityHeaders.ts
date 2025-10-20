import helmet from 'helmet';

export const securityHeaders = helmet({
  // CSP 这里自己配置，原来的规则：默认自域 + 脚本自域
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      // 如果你后续有样式、图片等外部资源，可以加 e.g. styleSrc, imgSrc
    },
  },

  // 禁用 COEP，如果你不需要 cross-origin-isolated，可以保持 false
  crossOriginEmbedderPolicy: false,

  // 阻止 Clickjacking
  frameguard: { action: 'deny' },

  // 阻止浏览器 MIME 类型嗅探
  noSniff: true,

  // 禁用老旧浏览器 XSS 保护机制（现代浏览器 CSP 已够用）
  xssFilter: false, // helmet 默认是启用的，可选择关闭

  // 不发送 Referer
  referrerPolicy: { policy: 'no-referrer' },

  // HSTS: 生产环境下建议启用 HTTPS 强制
  //   hsts: process.env.NODE_ENV === 'production' ? { maxAge: 31536000, includeSubDomains: true } : undefined,
});
