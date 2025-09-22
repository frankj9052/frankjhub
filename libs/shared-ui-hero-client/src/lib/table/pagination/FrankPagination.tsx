import {
  GeneralColor,
  Page,
  PaginationClassNames,
  PaginationOnChange,
  PaginationVariant,
  ShowControls,
  Total,
} from '@frankjhub/shared-ui-hero-ssr';
import { Pagination } from '@heroui/react';

export interface FrankPaginationProps {
  total: Total;
  showControls?: ShowControls;
  classNames?: PaginationClassNames;
  color?: GeneralColor;
  page?: Page;
  variant?: PaginationVariant;
  onChange?: PaginationOnChange;
}

export const FrankPagination = ({
  total,
  showControls,
  classNames,
  color,
  page,
  variant,
  onChange,
}: FrankPaginationProps) => {
  return (
    <Pagination
      total={total}
      showControls={showControls}
      classNames={classNames}
      color={color}
      page={page}
      variant={variant}
      onChange={onChange}
    />
  );
};
