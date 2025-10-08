import { FrankPagination } from '../../pagination/FrankPagination';

export interface BottomContentProps {
  currentPage: number;
  pageCount: number;
  handlePageChange: (page: number) => void;
}

export const BottomContent = ({ currentPage, pageCount, handlePageChange }: BottomContentProps) => {
  return (
    <div className="py-2 px-2 flex justify-center items-center">
      <FrankPagination
        showControls
        classNames={{
          cursor: 'bg-foreground text-background',
        }}
        color="default"
        page={currentPage}
        total={pageCount}
        variant="light"
        onChange={handlePageChange}
      />
    </div>
  );
};
