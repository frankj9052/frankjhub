import { ReactNode, useCallback, useEffect, useRef } from 'react';
import { ShiftType } from '../FrankBigCalendar';
import { useDrag, useDragLayer } from 'react-dnd';
import { getEmptyImage } from 'react-dnd-html5-backend';

export type DraggableItemType = {
  shift: ShiftType;
  doctorUserId: string;
  id: string;
  offset: { x: number; y: number };
};

export type DraggableShiftProps = {
  shift: ShiftType;
  children: ReactNode;
  rowHeight: number;
  intervalPerHour: number;
};

export const DraggableShift = ({
  shift,
  children,
  rowHeight,
  intervalPerHour,
}: DraggableShiftProps) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const ghostRef = useRef<HTMLDivElement>(null);
  // 记录点击偏移量，用于拖拽时定位
  const offset = useRef({ x: 0, y: 0 });

  const [{ isDragging }, drag, preview] = useDrag<DraggableItemType, void, { isDragging: boolean }>(
    () => ({
      type: 'SHIFT',
      item: () => {
        ref.current?.classList.add('dragging-pointer');
        document.body.classList.add('dragging-pointer');
        return {
          shift,
          doctorUserId: shift.providerUserId,
          id: `${shift.providerUserId}-${shift.startTime.getTime()}`,
          offset: offset.current,
        };
      },
      collect: monitor => ({
        isDragging: !!monitor.isDragging(),
      }),
      end: () => {
        // 拖拽结束时移除指针样式
        ref.current?.classList.remove('dragging-pointer');
        document.body.classList.remove('dragging-pointer');
      },
    }),
    [shift]
  );

  // 将ref元素连接到 drag ref
  drag(ref);

  const {
    isDragging: isDraggingLayer,
    clientOffset,
    item: draggingItem,
  } = useDragLayer(monitor => ({
    isDragging: monitor.isDragging(),
    clientOffset: monitor.getClientOffset(),
    item: monitor.getItem(),
  }));

  const getSnappedTop = useCallback(
    (offsetY: number, containerTop: number) => {
      const minutePerPixel = 60 / intervalPerHour / rowHeight;
      const rawMinutes = (offsetY - containerTop) * minutePerPixel;
      const snappedMinutes = Math.round(rawMinutes / 30) * 30;
      const snappedPixel = snappedMinutes / minutePerPixel;
      return snappedPixel;
    },
    [intervalPerHour, rowHeight]
  );

  useEffect(() => {
    if (!isDraggingLayer || !clientOffset || !ghostRef.current || !ref.current) return;

    const containerTop = ref.current?.closest('.relative')?.getBoundingClientRect().top ?? 0;
    const snappedTop = getSnappedTop(clientOffset.y, containerTop);
    ghostRef.current.style.top = `${snappedTop}px`;

    const rect = ref.current.getBoundingClientRect();
    offset.current.y = clientOffset.y - rect.top;
  }, [isDraggingLayer, clientOffset, getSnappedTop]);

  // 取消默认阴影, 目前无效
  useEffect(() => {
    preview(getEmptyImage(), { captureDraggingState: true });
  }, [preview]);

  // 然后只在拖动当前元素时才显示 ghost
  const isDraggingThisItem =
    draggingItem?.id === `${shift.providerUserId}-${shift.startTime.getTime()}`;

  return (
    <div className="relative h-full">
      <div
        ref={ref}
        style={{
          opacity: isDragging ? 0.2 : 1,
          position: 'relative',
          zIndex: isDragging ? 0 : 10,
          cursor: 'pointer',
        }}
        className="h-full"
        draggable={false}
        // onDragStart={(e) => e.preventDefault()}
      >
        {/* 拖拽主元素，用 framer motion 包裹 */}
        {children}
      </div>
      {/* 拖动时的 ghost 显示吸附效果 */}
      {isDraggingLayer && isDraggingThisItem && (
        <div
          ref={ghostRef}
          className="absolute w-full z-50 h-full"
          style={{
            top: 0,
            left: 0,
            opacity: 0.5,
            cursor: 'pointer',
          }}
          draggable={false}
          onDragStart={e => e.preventDefault()}
        >
          {children}
        </div>
      )}
    </div>
  );
};

export default DraggableShift;
