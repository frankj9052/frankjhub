import clsx from 'clsx';
import Image from 'next/image';

// 用 MutationObserver 监听根节点的 data-selected 变化，然后把它映射到本地的 open 状态
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
      className={clsx(['group'])}
    >
      {/* location marker */}
      <div
        className={clsx([
          'cursor-pointer',
          'relative inline-flex items-center justify-center',
          'origin-bottom z-0 absolute',
          'scale-100',
          'transform-gpu will-change-transform transition-transform duration-500 ease-out',
          'group-data-[hovered=false]:group-data-[selected=false]:scale-[0.3]',
        ])}
      >
        {/* 主标记点 */}
        <div className="flex flex-col items-center">
          {/* circle */}
          <div className="w-[48px] h-[48px] bg-primary rounded-full flex justify-center items-center border-1 border-black shadow-large">
            {/* 图片位置 */}
            <div
              className={clsx([
                'w-[36px] h-[36px] rounded-full overflow-hidden relative',
                'pointer-events-none',
                'opacity-100 scale-100 transition-all duration-500 ease-out', // 初始显示
                'group-data-[hovered=false]:group-data-[selected=false]:opacity-0 group-data-[hovered=false]:group-data-[selected=false]:scale-0',
              ])}
            >
              <Image
                width={400}
                height={267}
                alt="clinic photo"
                src={
                  image ??
                  'https://res.cloudinary.com/dqluguvjq/image/upload/c_crop,w_400,h_267/v1755200815/no-photo_yjgz9e.jpg'
                }
                className="object-cover w-full h-full"
              />
            </div>
          </div>
          {/* stick */}
          <div className="w-[6px] h-[18px] bg-primary rounded-b-full border-black border-x-1 border-b-1 -mt-[1px]" />
        </div>
      </div>
    </div>
  );
};
