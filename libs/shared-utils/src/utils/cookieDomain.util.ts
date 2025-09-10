export function parseCookieDomain(raw?: string): string[] {
  if (!raw) return [];
  return raw
    .split(',')
    .map(s => s.trim().toLowerCase())
    .map(s => s.replace(/^https?:\/\//, '')) // 去协议
    .map(s => s.replace(/:\d+$/, '')) // 去端口
    .map(s => (s.startsWith('.') ? s : `.${s}`)) // 强制前导点
    .filter(Boolean)
    .filter((v, i, arr) => arr.indexOf(v) === i); // 去重
}

// host 是否属于某个 cookieDomain（带前导点）
export function hostBelongsToDomain(host: string, cookieDomain: string) {
  // 允许裸根域（example.com）和其子域（a.example.com）
  const bare = cookieDomain.replace(/^\./, '');
  return host === bare || host.endsWith(cookieDomain);
}

// 提取请求 host 的“注册根域”（仅用于日志/分流可读性，不参与设置 cookie）
export function getRegistrableHint(host: string) {
  return host.split('.').slice(-2).join('.');
}
