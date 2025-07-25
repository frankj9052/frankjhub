import { useMarkdown } from '@frankjhub/shared-hooks';
import clsx from 'clsx';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
/**
 * MarkdownViewer 组件
 *
 * 该组件用于加载并渲染远程 markdown 文件（通过 `url`）。
 * 内部使用自定义 hook `useMarkdown` 实现异步加载。
 *
 * ✅ 注意：为使 markdown 样式（标题、列表、段落等）正常显示，
 * 你必须在 Tailwind CSS 配置中启用 typography 插件：
 *
 * ```ts
 * // tailwind.config.ts
 * const typography = require('@tailwindcss/typography');
 *
 * module.exports = {
 *   content: [...],
 *   plugins: [typography], // 👈 添加此行
 * };
 * ```
 *
 * 渲染时，组件使用 `prose` 类以 Tailwind Typography 风格美化 markdown。
 */
export function MarkdownViewer({ url, className }: { url: string; className?: string }) {
  const { content, loading, error } = useMarkdown(url);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error loading markdown</div>;

  return (
    <div className={clsx('prose max-w-none', className || '')}>
      <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
        {content}
      </ReactMarkdown>
    </div>
  );
}
