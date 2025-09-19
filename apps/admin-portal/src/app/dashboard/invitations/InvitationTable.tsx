import { FrankTable, FrankTableColumn, FrankTableHeader } from '@frankjhub/shared-ui-hero-client';

export const InvitationTable = () => {
  return (
    <div>
      <FrankTable
        isCompact
        removeWrapper
        ariaLabel="async paginated invitation data"
        selectionMode="single"
        color="secondary"
        topContent={<TopContent />}
        topContentPlacement="outside"
        bottomContent={<BottomContent />}
        bottomContentPlacement="outside"
        classNames={classNames}
        onSortChange={handleSortChange}
      >
        <FrankTableHeader></FrankTableHeader>
      </FrankTable>
    </div>
  );
};
