import clsx from 'clsx';
import Image from 'next/image';
import { RiMapPin3Fill } from 'react-icons/ri';
import { FrankModal } from '../../feedback';

export interface CustomLocationMarkerProps {
  image?: string;
  // 仅仅测试用
  hovered?: boolean;
  selected?: boolean;
}
// 不用 React state 控制，直接依赖外层改 data-attrs（性能/同步最好）
export const CustomLocationMarker = ({
  image,
  hovered = false,
  selected = false,
}: CustomLocationMarkerProps) => {
  return (
    // 根节点加上data-marker-root更好找
    <div
      data-marker-root
      data-hovered={hovered ? 'true' : 'false'}
      data-selected={selected ? 'true' : 'false'}
      className={clsx(['group select-none'])}
    >
      {/* location marker */}
      <div
        className={clsx([
          'relative inline-flex items-center justify-center',
          'origin-bottom -translate-y-1/2',
          'transform-gpu will-change-transform transition-transform duration-500 ease-out',
          'group-data-[hovered=true]:scale-[3]',
          'group-data-[selected=true]:scale-[3]',
        ])}
      >
        {/* 主标记点 */}
        <RiMapPin3Fill size={21} className="text-primary drop-shadow-sm" />
        {/* 显示图片 */}
        <div
          className={clsx([
            'absolute -translate-y-[0.7px]',
            'w-[12px] h-[12px] rounded-full overflow-hidden',
            'pointer-events-none', // 不挡点击
            'opacity-0 scale-0 transition-all duration-500 ease-out', // 初始隐藏
            'group-data-[hovered=true]:opacity-100 group-data-[hovered=true]:scale-100',
            'group-data-[selected=true]:opacity-100 group-data-[selected=true]:scale-100',
          ])}
        >
          <div className="relative w-full h-full">
            <Image
              fill
              priority
              alt="clinic photo"
              src={
                image ??
                'https://res.cloudinary.com/dqluguvjq/image/upload/v1755200815/no-photo_yjgz9e.jpg'
              }
              className="object-cover w-full h-full"
            />
          </div>
        </div>
      </div>

      {/* popup window */}
      <FrankModal
        isOpen={false}
        onClose={() => {
          console.log('close');
        }}
        body={'this is modal'}
      />
    </div>
  );
};
