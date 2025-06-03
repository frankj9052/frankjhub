import { ReactNode, useRef } from 'react';
import { useDrop } from 'react-dnd';
import { DraggableItemType } from './DraggableShift';
import { ShiftType } from '../FrankBigCalendar';

export type DropContainerProps = {
  doctorUserId: string;
  rowHeight: number;
  startHour: number;
  intervalPerHour: number;
  onDrop: (item: ShiftType, newStart: Date, newEnd: Date) => void;
  children: ReactNode;
};

export const DropContainer = ({
  doctorUserId,
  rowHeight,
  startHour,
  intervalPerHour,
  onDrop,
  children,
}: DropContainerProps) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [, drop] = useDrop({
    accept: 'SHIFT',
    drop: (item: DraggableItemType, monitor) => {
      const offset = monitor.getClientOffset();
      if (!offset || item.doctorUserId !== doctorUserId || !ref.current) return;

      const containerTop = ref.current.getBoundingClientRect().top;
      const y = offset.y - containerTop;

      const minutePerPixel = 60 / intervalPerHour / rowHeight;
      const minutesFromStart = y * minutePerPixel;

      // 向下吸附到最近的 30 分钟
      const snappedMinutes = Math.round(minutesFromStart / 30) * 30;

      const newStart = new Date(item.shift.startTime);
      newStart.setHours(startHour);
      newStart.setMinutes(0);
      newStart.setSeconds(0);
      newStart.setMilliseconds(0);
      newStart.setMinutes(newStart.getMinutes() + snappedMinutes);

      const duration = item.shift.endTime.getTime() - item.shift.startTime.getTime();
      const newEnd = new Date(newStart.getTime() + duration);

      onDrop(item.shift, newStart, newEnd);
    },
  });
  drop(ref);
  return (
    <div
      ref={ref}
      style={{
        width: '100%',
        height: '100%',
      }}
      className="relative"
    >
      {children}
    </div>
  );
};
