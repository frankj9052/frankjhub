import FrankAutocomplete, { DefaultAutocompleteItemsType } from './FrankAutocomplete';
import { IoIosSearch } from 'react-icons/io';
import { GoLocation } from 'react-icons/go';
import { Key } from 'react';
import { FaArrowRight } from 'react-icons/fa6';
import { FrankButtonBase } from '@frankjhub/shared-ui-hero-ssr';
// import FrankButtonBase from "../Button/FrankButtonBase";

export type NoqPublicSearchBarProps = {
  height?: number;
  searchMainInput?: {
    defaultItems?: DefaultAutocompleteItemsType[];
    onInputChange?: (value: string) => void;
    onSelectionChange?: (key: Key | null) => void;
  };
  searchAddressInput?: {
    defaultItems?: DefaultAutocompleteItemsType[];
    onInputChange?: (value: string) => void;
    onSelectionChange?: (key: Key | null) => void;
    addressPlaceholder?: string;
  };
  handleSearchSubmit?: () => void;
};

/**
 * A public search bar component combining two autocomplete inputs
 * for specialty search and location search, with a submit button.
 *
 * @param {number} [height] - Optional. Height of the search bar in pixels.
 * @param {object} [searchMainInput] - Optional. Configuration for the main specialty search input.
 * @param {DefaultAutocompleteItemsType[]} [searchMainInput.defaultItems] - Optional. Default specialty search suggestions.
 * @param {(value: string) => void} [searchMainInput.onInputChange] - Optional. Callback triggered when specialty input value changes.
 * @param {(key: Key | null) => void} [searchMainInput.onSelectionChange] - Optional. Callback triggered when specialty selection changes.
 * @param {object} [searchAddressInput] - Optional. Configuration for the address search input.
 * @param {DefaultAutocompleteItemsType[]} [searchAddressInput.defaultItems] - Optional. Default address search suggestions.
 * @param {(value: string) => void} [searchAddressInput.onInputChange] - Optional. Callback triggered when address input value changes.
 * @param {(key: Key | null) => void} [searchAddressInput.onSelectionChange] - Optional. Callback triggered when address selection changes.
 * @param {string} [searchAddressInput.addressPlaceholder] - Optional. Custom placeholder text for the address input.
 * @param {() => void} [handleSearchSubmit] - Optional. Callback triggered when the search button is pressed.
 */
export function NoqPublicSearchBar({
  height,
  searchMainInput,
  searchAddressInput,
  handleSearchSubmit,
}: NoqPublicSearchBarProps) {
  return (
    <div className="">
      <div className="lg:flex">
        {/* Main Search */}
        <div
          className="bg-[rgba(255,255,255,0.9)] py-[15px] px-0 rounded-tl-2xl rounded-tr-2xl border-l-1 border-t-1 border-r-1 border-[#E3E3E3] lg:rounded-tl-full lg:rounded-tr-none lg:rounded-bl-full lg:border-b-1 lg:border-r-0 lg:flex-[0.6]"
          style={{
            height: height ? `${height}px` : '100%',
          }}
        >
          <FrankAutocomplete
            placeholder="Specialty, condition, or procedure"
            customizeStyles={{
              inputTextStyle: 'font-inter',
              contentStyle: 'mt-3 bg-[rgba(255,255,255,0.9)] rounded-mx',
            }}
            startContent={<IoIosSearch size={24} className="text-[#4A4A4A]" />}
            variant="ghost"
            defaultItems={searchMainInput?.defaultItems}
            onInputChange={searchMainInput?.onInputChange}
            onSelectionChange={searchMainInput?.onSelectionChange}
            defaultFilter={false}
            ariaLabel="Specialty, condition, or procedure search"
          />
        </div>
        {/* Divider */}
        <div className="border-t-1 border-[#E3E3E3] lg:hidden" />
        <div
          className="hidden lg:block border-l-1 border-[#E3E3E3]"
          style={{
            height: height ? `${height}px` : '100%',
          }}
        />
        {/* Location Search */}
        <div
          className="bg-[rgba(255,255,255,0.9)] py-[15px] px-0 rounded-bl-2xl rounded-br-2xl border-l-1 border-b-1 border-r-1 border-[#E3E3E3] lg:rounded-bl-none lg:rounded-tr-full lg:rounded-br-full lg:border-t-1 lg:border-l-0 lg:flex-[0.4] lg:flex lg:items-center"
          style={{
            height: height ? `${height}px` : '100%',
          }}
        >
          <FrankAutocomplete
            placeholder={searchAddressInput?.addressPlaceholder ?? 'Enter Address'}
            customizeStyles={{
              inputTextStyle: 'font-inter',
              contentStyle: 'mt-3 bg-[rgba(255,255,255,0.9)] rounded-mx',
            }}
            startContent={<GoLocation size={22} className="text-[#4A4A4A]" />}
            variant="ghost"
            defaultItems={searchAddressInput?.defaultItems}
            onInputChange={searchAddressInput?.onInputChange}
            onSelectionChange={searchAddressInput?.onSelectionChange}
            defaultFilter={false}
            ariaLabel="Location search"
          />
          <div className="hidden lg:block mr-[10px]">
            <FrankButtonBase
              height={44}
              width={44}
              backgroundColor="#0C534F"
              disableRipple
              radius="full"
              onPress={handleSearchSubmit}
              customizeContent={
                <div className="flex h-full items-center justify-center gap-[10px] font-inter text-white">
                  <span>
                    <FaArrowRight />
                  </span>
                </div>
              }
            />
          </div>
        </div>
      </div>
      <div className="mt-4 lg:hidden">
        <FrankButtonBase
          height={48}
          backgroundColor="#0C534F"
          disableRipple
          onPress={handleSearchSubmit}
          customizeContent={
            <div className="flex h-full items-center justify-center gap-[10px] font-inter text-white">
              <span>Search Now</span>
              <span>
                <FaArrowRight />
              </span>
            </div>
          }
        />
      </div>
    </div>
  );
}

export default NoqPublicSearchBar;
