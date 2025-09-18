/**
 * 把标准的Base64编码转换成 Base64URL 安全编码
 * 标准 Base64 里可能会有 +、/、=
 * URL 里这几个字符不安全（会当成特殊符号）
 * 所以替换成 - 和 _，并去掉 =，就成了 URL 安全的 Base64
 * 应用场景：
 * JWT (JSON Web Token) 的 header 和 payload 部分就是用 base64url 编码的。
 * OAuth token、URL 参数里的 token 都常用这种格式。
 */
export const base64url = (buf: Buffer) => {
  return buf
    .toString('base64') // 把二进制 Buffer 转成标准 Base64
    .replace(/\+/g, '-') // 把 '+' 替换成 '-'  （URL 中 '+' 有歧义）
    .replace(/\//g, '_') // 把 '/' 替换成 '_'  （URL 中 '/' 是路径分隔符）
    .replace(/=+$/, ''); // 去掉末尾的 '='  填充符（URL 更简洁）
};
