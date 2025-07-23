import { useEffect, useState } from 'react';

/**
 * 自定义 Hook：用于从指定 URL 异步加载 Markdown 文本内容。
 *
 * @param url - Markdown 文件的路径（可以是本地或远程路径）
 * @returns 一个包含以下字段的对象：
 *   - content: 加载到的 Markdown 文本内容
 *   - loading: 是否仍在加载中
 *   - error: 加载过程中发生的错误（如果有）
 *
 * 示例用法：
 * const { content, loading, error } = useMarkdown('/markdown/privacy-policy.md');
 */
export function useMarkdown(url: string) {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setLoading(true);
    fetch(url)
      .then(res => res.text())
      .then(text => {
        setContent(text);
        setLoading(false);
      })
      .catch(err => {
        setError(err);
        setLoading(false);
      });
  }, [url]);

  return { content, loading, error };
}
