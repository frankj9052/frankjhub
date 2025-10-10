import { AutocompleteSectionChildren } from '@frankjhub/shared-ui-hero-ssr';
import { attachStatics } from '@frankjhub/shared-utils';
import { AutocompleteSection } from '@heroui/react';

export interface FrankAutocompleteSectionProps {
  children: AutocompleteSectionChildren;
}

const FrankAutocompleteSectionImpl = ({ children }: FrankAutocompleteSectionProps) => {
  return <AutocompleteSection>{children}</AutocompleteSection>;
};

export const FrankAutocompleteSection = attachStatics(
  FrankAutocompleteSectionImpl,
  AutocompleteSection
);
