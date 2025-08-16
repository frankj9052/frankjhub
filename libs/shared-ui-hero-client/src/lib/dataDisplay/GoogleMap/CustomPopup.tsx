import { FrankCard } from '@frankjhub/shared-ui-hero-ssr';
import clsx from 'clsx';

export const CustomPopup = () => {
  return (
    <div
      className={clsx([
        'w-[200px]',
        'opacity-0 transition-all duration-500 ease-out h-[100px]', // 初始隐藏
        'data-[selected=true]:opacity-100 group-data-[selected=true]:h-[100px]',
      ])}
    >
      test popup
      {/* <FrankCard
        cardCover={<div className="bg-red-200">test body</div>}
        radius="sm"
        // cardWidth={200}
        // cardHeight={100}
      /> */}
    </div>
  );
};
