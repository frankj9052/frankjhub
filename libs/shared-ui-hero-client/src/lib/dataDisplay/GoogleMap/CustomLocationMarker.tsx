import clsx from 'clsx';
import Image from 'next/image';
import { RiMapPin3Fill } from 'react-icons/ri';
// import { FrankModal } from '../../feedback';
// import { useEffect, useRef, useState } from 'react';

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
  // 绑定到真正作为 AdvancedMarker content 的宿主元素
  // const hostRef = useRef<HTMLDivElement>(null);
  // 本地“是否打开Modal”的状态：仅在 data-selected 变化时更新
  // const [open, setOpen] = useState<boolean>(selected ?? false);
  // 监听 props.selected（如果父层愿意用 React 方式控制，保持同步）
  // useEffect(() => {
  //   setOpen(!!selected);
  // }, [selected]);
  // 监听 DOM 属性 data-selected 的变化（外部 setAttribute 时触发）
  // useEffect(() => {
  //   const el = hostRef.current;
  //   if (!el) return;

  //   // 初始化一次（以防外部先改了 attribute 再挂载 observer）
  //   const syncFromAttr = () => {
  //     const attr = el.getAttribute('data-selected');
  //     setOpen(attr === 'true');
  //   };
  //   syncFromAttr();

  //   const mo = new MutationObserver(mutations => {
  //     for (const m of mutations) {
  //       if (m.type === 'attributes' && m.attributeName === 'data-selected') {
  //         syncFromAttr();
  //       }
  //     }
  //   });

  //   mo.observe(el, { attributes: true, attributeFilter: ['data-selected'] });
  //   return () => mo.disconnect();
  // }, []);

  return (
    // 根节点加上data-marker-root更好找
    <div
      // ref={hostRef}
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

      {/* popover window */}
      {/* <FrankModal
        isOpen={open}
        onClose={() => {
          hostRef.current?.setAttribute('data-selected', 'false');
        }}
        body={<div>this is modal</div>}
        size="xs"
        placement="bottom-center"
      /> */}
      {/* <div
        className={clsx([
          'absolute z-30',
          'bg-white w-[100px] h-[100px]',
          'cursor-default',
          'opacity-0 scale-0 transition-all duration-500 ease-out',
          'group-data-[selected=true]:opacity-100 group-data-[selected=true]:scale-100'
        ])}
      >
        sample content
        <div>
          <button
            onClick={() => {
              console.log("clicked")
            }}
          >test button</button>
        </div>
      </div> */}
    </div>
  );
};
