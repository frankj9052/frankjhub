import { Children, ClassName, TextValue } from '@frankjhub/shared-ui-hero-ssr';
import { attachStatics } from '@frankjhub/shared-utils';
import { AutocompleteItem } from '@heroui/react';

export interface FrankAutocompleteItemProps {
  children: Children;
  className?: ClassName;
  textValue?: TextValue;
}

const FrankAutocompleteItemImpl = ({
  children,
  className,
  textValue,
}: FrankAutocompleteItemProps) => {
  return (
    <AutocompleteItem className={className} textValue={textValue}>
      {children}
    </AutocompleteItem>
  );
};

export const FrankAutocompleteItem = attachStatics(FrankAutocompleteItemImpl, AutocompleteItem);
