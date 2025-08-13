import { GoDotFill } from 'react-icons/go';
import { GoDot } from 'react-icons/go';

export interface CarouselPaginationProps {
  size: number;
  currentIndex: number;
  onClick: (index: number) => void;
}

export const CarouselPagination = ({ size, currentIndex, onClick }: CarouselPaginationProps) => {
  return (
    <div className="flex">
      {Array.from({ length: size }).map((_, index) => {
        return (
          <div key={`carousel-pagination-${index}`}>
            {currentIndex === index ? (
              <GoDotFill className="text-primary" />
            ) : (
              <GoDot
                className="cursor-pointer text-primary"
                onClick={() => {
                  onClick(index);
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};
