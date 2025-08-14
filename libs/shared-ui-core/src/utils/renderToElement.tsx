import { ReactNode } from 'react';
import { flushSync } from 'react-dom';
import { createRoot } from 'react-dom/client';

export type RenderHandle = {
  el: HTMLElement;
  unmount: () => void;
};

/**
 * Renders a given React node into a newly created detached DOM element.
 *
 * This utility is useful when you want to programmatically render a React component
 * outside of the normal React tree—for example, when rendering a tooltip, context menu,
 * modal, or a custom Google Maps marker where you need the raw DOM element for further manipulation.
 *
 * @param {ReactNode} node - The React element or component to render.
 *
 * @returns {RenderHandle} An object containing:
 * - `el`: The created DOM element containing the rendered React content.
 * - `unmount`: A cleanup function to unmount the React component and free resources.
 *
 * @example
 * ```ts
 * const { el, unmount } = renderReactToElement(<MyTooltip />);
 * someContainer.appendChild(el);
 *
 * // Later, when done:
 * unmount();
 * ```
 */
export function renderReactToElement(node: ReactNode): RenderHandle {
  const el = document.createElement('div');
  const root = createRoot(el);
  // 确保本次 render 同步完成
  flushSync(() => {
    root.render(node);
  });
  return {
    el,
    unmount: () => root.unmount(),
  };
}
