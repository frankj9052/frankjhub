import { FrankChip } from '../Base/FrankChip';

export interface DeletedChipPorps {
  isDeleted?: boolean;
}

export const DeletedChip = ({ isDeleted }: DeletedChipPorps) => {
  return (
    <div>
      {isDeleted && (
        <FrankChip
          size="sm"
          color="danger"
          variant="solid"
          classNames={{ content: 'text-white font-semibold' }}
        >
          Deleted
        </FrankChip>
      )}
    </div>
  );
};
