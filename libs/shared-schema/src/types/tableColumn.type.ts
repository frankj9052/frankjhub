import { LabeledEnumItem } from './labeledEnumItem.type';

export interface TableColumn extends LabeledEnumItem {
  sortable?: boolean;
}
