import { organizationTypeSlice, useDispatch, useSelector } from '@/libs/redux';
import { Pagination } from '@heroui/react';

export const BottomContent = () => {
  const dispatch = useDispatch();
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
        page={currentPage}
        total={pageCount}
        variant="light"
        onChange={page => {
          const offset = (page - 1) * pageSize;
          dispatch(organizationTypeSlice.actions.setOffset(offset));
        }}
      />
    </div>
  );
};
