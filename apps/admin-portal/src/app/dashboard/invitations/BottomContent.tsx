import { invitationSlice, useDispatch, useSelector } from '@/libs/redux';
import { FrankPagination } from '@frankjhub/shared-ui-hero-client';

export const BottomContent = () => {
  const dispatch = useDispatch();
  const all = useSelector(state => state.invitation.all);
  const pageSize = all?.pageSize ?? 0;
  const currentPage = all?.currentPage;
  const pageCount = all?.pageCount ?? 0;

  const handlePageChange = (page: number) => {
    const offset = (page - 1) * pageSize;
    dispatch(invitationSlice.actions.setOffset(offset));
  };
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
