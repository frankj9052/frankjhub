import { Tab, Tabs } from '@heroui/react';
import { ReactNode } from 'react';
import { useControlledState } from '../../../useHooks';

export type TabsDataType = {
  key: string;
  title: ReactNode;
  content: ReactNode;
};

/**
 * A customizable tabs component built on top of @heroui/react Tabs,
 * supporting controlled or uncontrolled selection, layout, colors, and variant styles.
 *
 * @param {string} ariaLable - ARIA label for accessibility.
 * @param {TabsDataType[]} tabsData - Array of tabs, each containing a key, title, and content.
 * @param {'sm' | 'md' | 'lg' | 'none' | 'full'} [radius] - Optional. Border radius of the tabs.
 * @param {'primary' | 'default' | 'secondary' | 'success' | 'warning' | 'danger'} [color] - Optional. Color theme of the tabs.
 * @param {boolean} [isDisabled] - Optional. Whether all tabs are disabled.
 * @param {string[]} [disabledKeys] - Optional. Keys of specific tabs to disable.
 * @param {'sm' | 'md' | 'lg'} [size] - Optional. Size of the tabs.
 * @param {'solid' | 'light' | 'underlined' | 'bordered'} [variant] - Optional. Visual style variant of the tabs.
 * @param {string | number} [selected] - Optional. Controlled selected tab key.
 * @param {(key: string | number) => void} [onSelectionChange] - Optional. Callback triggered when the selected tab changes.
 * @param {'top' | 'bottom' | 'start' | 'end'} [placement] - Optional. Placement of the tabs relative to the content.
 */
export type FrankTabsProps = {
  ariaLable: string;
  tabsData: TabsDataType[];
  radius?: 'sm' | 'md' | 'lg' | 'none' | 'full';
  color?: 'primary' | 'default' | 'secondary' | 'success' | 'warning' | 'danger';
  isDisabled?: boolean;
  disabledKeys?: string[];
  size?: 'sm' | 'md' | 'lg';
  variant?: 'solid' | 'light' | 'underlined' | 'bordered';
  selected?: string | number;
  onSelectionChange?: (key: string | number) => void;
  placement?: 'top' | 'bottom' | 'start' | 'end';
};
export function FrankTabs({
  ariaLable,
  tabsData,
  radius,
  color,
  isDisabled,
  disabledKeys,
  size,
  variant,
  selected,
  onSelectionChange,
  placement,
}: FrankTabsProps) {
  const [selectedState, setSelectedState] = useControlledState(selected, tabsData[0].key);
  return (
    <div>
      <Tabs
        aria-label={ariaLable}
        classNames={{}}
        radius={radius}
        color={color}
        isDisabled={isDisabled}
        disabledKeys={disabledKeys}
        size={size}
        variant={variant}
        selectedKey={selectedState}
        onSelectionChange={key => {
          setSelectedState?.(key);
          onSelectionChange?.(key);
        }}
        placement={placement}
      >
        {tabsData &&
          tabsData.length > 0 &&
          tabsData.map(tab => {
            return (
              <Tab key={tab.key} title={tab.title}>
                {tab.content}
              </Tab>
            );
          })}
      </Tabs>
    </div>
  );
}

export default FrankTabs;
