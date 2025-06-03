import { Accordion, AccordionItem } from '@heroui/react';
import { ReactNode } from 'react';
import { useControlledState } from '../../../useHooks';

export type AccordionItemType = {
  key?: string | number;
  ariaLabel: string;
  title: ReactNode;
  content: ReactNode;
  subtitle?: string;
  indicator?: {
    isOpen: ReactNode;
    isClose: ReactNode;
  };
};

export type FrankAccordionProps = {
  items: AccordionItemType[];
  selectionMode?: 'multiple' | 'single' | 'none';
  variant?: 'splitted' | 'light' | 'shadow' | 'bordered';
  defaultExpandedKeys?: Iterable<string | number>;
  disabledKeys?: Iterable<string | number>;
  selectedKeys?: Iterable<string | number>;
  setSelectedKeys?: (keys: Iterable<string | number>) => void;
  hideShadow?: boolean;
  width?: number;
  disableIndicatorAnimation?: boolean;
};

/**
 * FrankAccordion Component
 *
 * Renders a flexible and customizable accordion using the `@heroui/react` library.
 * Supports controlled and uncontrolled states, multiple visual variants, and various interaction options.
 *
 * @param {Object} props - The properties for the FrankAccordion component.
 * @param {AccordionItemType[]} props.items - List of accordion items to render, each containing a title, content, ARIA label, and optional subtitle and indicators.
 * @param {'multiple' | 'single' | 'none'} [props.selectionMode] - Selection behavior: allows multiple, single, or no item to be expanded at a time.
 * @param {'splitted' | 'light' | 'shadow' | 'bordered'} [props.variant] - Visual style variant of the accordion.
 * @param {Iterable<string | number>} [props.defaultExpandedKeys] - Set of item keys that should be expanded by default on initial render.
 * @param {Iterable<string | number>} [props.disabledKeys] - Set of item keys that should be disabled from interaction.
 * @param {Iterable<string | number>} [props.selectedKeys] - Controlled selected keys; overrides internal state if provided.
 * @param {(keys: Iterable<string | number>) => void} [props.setSelectedKeys] - Callback to update the controlled selected keys externally.
 * @param {boolean} [props.hideShadow] - Whether to remove shadow styling from accordion items.
 * @param {number} [props.width] - Width of the accordion container in pixels; defaults to 100% if not specified.
 * @param {boolean} [props.disableIndicatorAnimation] - Disables the indicator animation if set to true.
 *
 * @returns {JSX.Element} A responsive accordion component displaying the provided items.
 */
export function FrankAccordion({
  items,
  selectionMode,
  variant,
  defaultExpandedKeys,
  disabledKeys,
  selectedKeys,
  setSelectedKeys,
  hideShadow,
  width,
  disableIndicatorAnimation,
}: FrankAccordionProps) {
  const [selectedKeysState, setSelectedKeysState] = useControlledState(
    selectedKeys,
    new Set(defaultExpandedKeys ?? [])
  );
  return (
    <div
      style={{
        width: width ? `${width}px` : '100%',
      }}
    >
      <Accordion
        selectionMode={selectionMode}
        variant={variant}
        defaultExpandedKeys={defaultExpandedKeys}
        disabledKeys={disabledKeys}
        selectedKeys={selectedKeysState}
        onSelectionChange={(keys: Iterable<string | number>) => {
          setSelectedKeysState?.(keys);
          setSelectedKeys?.(keys);
        }}
        className={`${hideShadow && 'shadow-none'} px-0`}
        fullWidth
        disableIndicatorAnimation={disableIndicatorAnimation}
      >
        {items &&
          items.map(item => {
            return (
              <AccordionItem
                key={item.key}
                aria-label={item.ariaLabel}
                title={item.title}
                subtitle={item.subtitle}
                indicator={isOpen => {
                  if (item.indicator && item.indicator.isOpen && item.indicator.isClose) {
                    return isOpen.isOpen ? item.indicator.isOpen : item.indicator.isClose;
                  }
                }}
                classNames={{
                  base: `${hideShadow && 'shadow-none'} px-0 bg-transparent`,
                  trigger: 'py-0',
                  content: 'py-0',
                }}
              >
                {item.content}
              </AccordionItem>
            );
          })}
      </Accordion>
    </div>
  );
}

export default FrankAccordion;
