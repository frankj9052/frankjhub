import { useDispatch, usersSlice, useSelector } from '@/libs/redux';
import { Pagination } from '@heroui/react';

export const BottomContent = () => {
  const dispatch = useDispatch();
  const paginatedUsers = useSelector(state => state.users.usersAllProfile);
  const pageSize = paginatedUsers?.data.pageSize;
  const currentPage = paginatedUsers?.data.currentPage;
  const pageCount = paginatedUsers?.data.pageCount;
  return (
    <div className="py-2 px-2 flex justify-center items-center">
      <Pagination
        showControls
        classNames={{
          cursor: 'bg-foreground text-background',
        }}
        color="default"
        page={currentPage}
        total={pageCount ?? 0}
        variant="light"
        onChange={page => {
          const offset = (page - 1) * (pageSize ?? 0);
          dispatch(usersSlice.actions.setOffset(offset));
        }}
      />
    </div>
  );
};
