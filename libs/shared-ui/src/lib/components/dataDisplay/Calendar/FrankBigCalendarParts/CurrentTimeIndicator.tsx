type CurrentTimeIndicatorProps = {
  width?: number;
  top?: number;
};

export function CurrentTimeIndicator({ width, top }: CurrentTimeIndicatorProps) {
  return (
    <div
      className="absolute flex items-center z-10"
      style={{
        width: width ? `${width}px` : 'calc(100% + 8px)',
        top: top ?? 0 - 3,
        left: -8,
      }}
    >
      <div className="w-[7px] h-auto aspect-square bg-[#D9281C] rounded-full" />
      <div className="h-px bg-[#D9281C] flex-1" />
    </div>
  );
}

export default CurrentTimeIndicator;
