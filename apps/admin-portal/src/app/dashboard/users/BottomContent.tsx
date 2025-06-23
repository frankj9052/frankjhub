import { useDispatch, usersSlice, useSelector } from '@/libs/redux';
import { Pagination } from '@heroui/react';

export const BottomContent = () => {
  const dispatch = useDispatch();
  const filterValue = useSelector(state => state.users.filterValue);
  const hasSearchFilter = Boolean(filterValue);
  const paginatedUsers = useSelector(state => state.users.usersAllProfile);
  const { pageSize, currentPage, pageCount } = paginatedUsers;
  return (
    <div className="py-2 px-2 flex justify-center items-center">
      <Pagination
        showControls
        classNames={{
          cursor: 'bg-foreground text-background',
        }}
        color="default"
        isDisabled={hasSearchFilter}
        page={currentPage}
        total={pageCount}
        variant="light"
        onChange={page => {
          const offset = (page - 1) * pageSize;
          dispatch(usersSlice.actions.setOffset(offset));
        }}
      />
    </div>
  );
};
