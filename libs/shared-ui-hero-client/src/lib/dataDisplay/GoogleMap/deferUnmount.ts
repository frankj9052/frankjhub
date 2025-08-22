export function safeUnmountRoot(root: import('react-dom/client').Root | null) {
  if (!root) return;
  try {
    // Render null to detach React tree first.
    root.render(null);
  } catch {
    return;
  }
  // Defer the actual unmount to avoid "synchronously unmount" warnings.
  setTimeout(() => {
    try {
      root.unmount();
    } catch {
      return;
    }
  }, 0);
}
