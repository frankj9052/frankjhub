import { FrankChip } from '../Base';

export interface ActiveChipProps {
  isActive?: boolean;
}

export const ActiveChip = ({ isActive }: ActiveChipProps) => {
  return (
    <div>
      {isActive ? (
        <FrankChip
          size="sm"
          color="success"
          variant="solid"
          classNames={{ content: 'text-white font-semibold' }}
        >
          Active
        </FrankChip>
      ) : (
        <FrankChip
          size="sm"
          color="warning"
          variant="solid"
          classNames={{ content: 'text-white font-semibold' }}
        >
          Inactive
        </FrankChip>
      )}
    </div>
  );
};
