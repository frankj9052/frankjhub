// 这个函数不改变 target 的 props 类型签名，只把 source 的静态挂到 target 上。
// 让hero ui 的 table可以识别自定义的table

export function attachStatics<
  T extends React.ComponentType<any>,
  S extends React.ComponentType<any>
>(target: T, source: S): T {
  // 只拷贝 HeroUI 依赖/有用的静态
  (target as any).getCollectionNode = (source as any).getCollectionNode;
  (target as any).displayName =
    (source as any).displayName ?? (target as any).displayName ?? target.name ?? 'Component';
  return target;
}
