import { resourceSlice, useDispatch, useSelector } from '@/libs/redux';
import { Pagination } from '@heroui/react';

export const BottomContent = () => {
  const dispatch = useDispatch();
  const all = useSelector(state => state.resource.all?.data);
  const pageSize = all?.pageSize ?? 0;
  const currentPage = all?.currentPage;
  const pageCount = all?.pageCount ?? 0;

  const handlePageChange = (page: number) => {
    const offset = (page - 1) * pageSize;
    dispatch(resourceSlice.actions.setOffset(offset));
  };

  return (
    <div className="py-2 px-2 flex justify-center items-center">
      <Pagination
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
