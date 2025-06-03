// import 'react-resizable/css/styles.css';
import { ReactNode } from 'react';
import { Resizable } from 'react-resizable';

export type ResizableShiftProps = {
  width: number;
  height: number;
  rowHeight: number;
  intervalPerHour?: number;
  onResizeStop: (deltaMinutes: number) => void;
  children: ReactNode;
};

export const ResizableShift = ({
  width,
  height,
  rowHeight,
  intervalPerHour = 2,
  onResizeStop,
  children,
}: ResizableShiftProps) => {
  const minutePerRow = 60 / intervalPerHour;
  const minutePerPixel = minutePerRow / rowHeight;

  return (
    <Resizable
      axis="y"
      height={height}
      width={width}
      minConstraints={[width, 25]}
      onResizeStop={(e, data) => {
        const deltaPx = data.size.height - height;
        const daltaMinutes = deltaPx * minutePerPixel;
        onResizeStop(daltaMinutes);
      }}
    >
      <div
        style={{
          height,
          position: 'relative',
        }}
      >
        {children}
        <div className="react-resizable-handle absolute bottom-0 left-1/2 transform -translate-x-1/2 w-full h-1 cursor-row-resize bg-transparent bg-red-300" />
      </div>
    </Resizable>
  );
};
