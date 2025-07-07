import { actionSlice, useDispatch, useSelector } from '@/libs/redux';
import { Pagination } from '@heroui/react';

export const BottomContent = () => {
  const dispatch = useDispatch();
  const all = useSelector(state => state.action.all);
  const { pageSize, currentPage, pageCount } = all;

  const handlePageChange = (page: number) => {
    const offset = (page - 1) * pageSize;
    dispatch(actionSlice.actions.setOffset(offset));
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
