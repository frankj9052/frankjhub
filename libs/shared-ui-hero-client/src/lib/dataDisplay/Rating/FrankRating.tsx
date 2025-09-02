import { FaRegStar, FaStar } from 'react-icons/fa';

export interface FrankRatingProps {
  rating: number; // 当前评分
  maxRating: number; // 满分
  size: number; // 外层尺寸
}

export const FrankRating = ({ rating, maxRating, size }: FrankRatingProps) => {
  const percentage = Math.max(0, Math.min(1, rating / maxRating)); // 0~1

  return (
    <div className="relative inline-block" style={{ width: size, height: size }}>
      {/* 灰色外框 */}
      <FaRegStar
        size={size}
        className="text-[#E5E7EB] absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
      />

      {/* 白色内芯（让边框变薄） */}
      <FaStar
        size={size - 3}
        className="text-white absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
      />

      {/* 黄色填充，用裁切容器控制显示比例 */}
      <div
        className="ml-[1.25px] mt-[1.5px] overflow-hidden relative"
        style={{
          width: (size - 3) * percentage,
          height: size - 3,
        }}
      >
        <FaStar
          size={size - 3}
          className="text-[#F3A504] absolute left-0 top-1/2 -translate-y-1/2"
        />
      </div>
    </div>
  );
};
