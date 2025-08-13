import { GoDotFill } from 'react-icons/go';
import { GoDot } from 'react-icons/go';

export interface CarouselPaginationProps {
  size: number;
  currentIndex: number;
  onClick: (index: number) => void;
}

/**
 * CarouselPagination - A set of clickable dots for carousel navigation.
 *
 * Highlights the current index with a filled dot, and allows navigation
 * by clicking on other dots.
 *
 * @param {Object} props - Component props
 * @param {number} props.size - Total number of pages/dots
 * @param {number} props.currentIndex - Currently active index
 * @param {(index: number) => void} props.onClick - Handler called when a dot is clicked
 * @returns {JSX.Element} Rendered pagination dots
 */
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
