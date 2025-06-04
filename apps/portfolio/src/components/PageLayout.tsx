import { ReactNode } from 'react';

export const PageLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex items-center justify-center">
      <div className="container mx-auto">
        <div className="w-[90%] md:w-[80%] mx-auto ">
          <div className="h-vertical-center flex items-center">{children}</div>
        </div>
      </div>
    </div>
  );
};
