import { ReactNode } from 'react';

type Props = {
  icon: ReactNode;
  title: string;
};

export const AccordionTitleCard = ({ icon, title }: Props) => {
  return (
    <div className="flex items-center pl-4 gap-4 font-bold h-[54px] text-xl">
      {/* icon */}
      <div>{icon}</div>
      {/* Text */}
      <div>
        <h1>{title}</h1>
      </div>
    </div>
  );
};
