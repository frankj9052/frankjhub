import { createContext, PropsWithChildren, useContext } from 'react';

// 让storybook可以安全读取环境变量
export type PublicRuntimeConfig = {
  googleMapApiKey: string;
};

const RuntimeConfigContext = createContext<PublicRuntimeConfig | null>(null);

export function RuntimeConfigProvider({
  value,
  children,
}: PropsWithChildren<{ value: PublicRuntimeConfig }>) {
  return <RuntimeConfigContext.Provider value={value}>{children}</RuntimeConfigContext.Provider>;
}

export function useRuntimeConfig() {
  const ctx = useContext(RuntimeConfigContext);
  if (!ctx) throw new Error('useRuntimeConfig must be used within RuntimeConfigProvider');
  return ctx;
}
