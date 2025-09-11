import {
  AriaLabel,
  BottomContent,
  BottomContentPlacement,
  IsCompact,
  OnSelectionChange,
  OnSortChange,
  RemoveWrapper,
  SelectionMode,
  TableChildren,
  TableClassNames,
  TableColor,
  SelectedKey,
  TopContent,
  TopContentPlacement,
} from '@frankjhub/shared-ui-hero-ssr';
import { Table } from '@heroui/react';

export interface FrankTableProps {
  children: TableChildren;
  // 紧凑
  isCompact?: IsCompact;
  // 取消外层布局
  removeWrapper?: RemoveWrapper;
  ariaLabel: AriaLabel;
  selectionMode?: SelectionMode;
  color?: TableColor;
  topContent?: TopContent;
  topContentPlacement?: TopContentPlacement;
  bottomContent?: BottomContent;
  bottomContentPlacement?: BottomContentPlacement;
  classNames?: TableClassNames;
  onSortChange?: OnSortChange;
  selectedKey?: SelectedKey;
  onSelectionChange?: OnSelectionChange;
}

export const FrankTable = ({
  children,
  isCompact,
  removeWrapper,
  ariaLabel,
  selectionMode,
  color,
  topContent,
  topContentPlacement,
  bottomContent,
  bottomContentPlacement,
  classNames,
  onSortChange,
  selectedKey,
  onSelectionChange,
}: FrankTableProps) => {
  return (
    <Table
      isCompact={isCompact}
      removeWrapper={removeWrapper}
      aria-label={ariaLabel}
      selectionMode={selectionMode}
      color={color}
      topContent={topContent}
      topContentPlacement={topContentPlacement}
      bottomContent={bottomContent}
      bottomContentPlacement={bottomContentPlacement}
      classNames={classNames}
      onSortChange={onSortChange}
      selectedKeys={selectedKey}
      onSelectionChange={onSelectionChange}
    >
      {children}
    </Table>
  );
};
