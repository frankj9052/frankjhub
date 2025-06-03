import { ReactNode } from 'react';

export type HeroTileProps = {
  children: ReactNode;
};

/**
 * A styled hero title component displaying a large background-styled heading (h1)
 * and a bold foreground heading (h2) with an underline effect.
 *
 * @param {ReactNode} children - Text or elements to render as the hero title content.
 */
export const HeroTitle = ({ children }: HeroTileProps) => {
  return (
    <div className="flex flex-col items-center justify-end relative text-center mt-3">
      <h1 className="text-[3rem] md:text-[4.5em] font-extrabold mb-8 opacity-10 bg-gradient-to-t from-transparent to-[#0e2431] bg-clip-text text-transparent select-none">
        {children}
      </h1>
      <h2 className="text-[2rem] md:text-[2.5em] font-bold -mt-20 relative inline-block after:content-[''] after:absolute after:w-[70px] after:h-[5px] after:right-0 after:bottom-0 after:bg-primary select-none">
        {children}
      </h2>
    </div>
  );
};

export default HeroTitle;
