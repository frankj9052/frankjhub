'use client';

import { useDispatch, usersSlice, useSelector } from '@/libs/redux';
import { getUserOptionListAsync } from '@/libs/redux/slices/usersSlice/thunk';
import { useDebouncedCallback } from '@frankjhub/shared-hooks';
import { DefaultAutocompleteItemsType, FrankAutocomplete } from '@frankjhub/shared-ui-hero-client';
import { UserListItem } from '@frankjhub/shared-ui-hero-ssr';
import { useEffect, useState } from 'react';

export const UserSelection = () => {
  const dispatch = useDispatch();
  const userOptionList = useSelector(state => state.users.userOptionList);
  const selectedKey = useSelector(state => state.users.selectedKey);
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    console.log('check ===> initial');
    dispatch(getUserOptionListAsync({ data: { keyword: '' } }));
  }, [dispatch]);

  const defaultItems: DefaultAutocompleteItemsType[] =
    userOptionList?.map(user => ({
      label: (
        <UserListItem
          user={{
            name: user.userName,
            image: user.avatarImage ?? '',
            email: user.email ?? '',
          }}
        />
      ),
      key: user.id,
      textValue: user.userName,
    })) ?? [];

  const debouncedSearchChange = useDebouncedCallback((value?: string) => {
    if (value && value.length > 1) {
      dispatch(getUserOptionListAsync({ data: { keyword: value } }));
    } else {
      dispatch(getUserOptionListAsync({ data: { keyword: '' } }));
    }
  }, 500);

  // user search
  useEffect(() => {
    debouncedSearchChange(inputValue);
  }, [inputValue, debouncedSearchChange]);

  return (
    <div>
      <div className="w-1/2">
        <FrankAutocomplete
          ariaLabel="select a user"
          allowsCustomValue={false}
          label="Select a user"
          defaultItems={defaultItems}
          variant="bordered"
          radius="md"
          onSelectionChange={key => {
            if (typeof key === 'string') {
              dispatch(usersSlice.actions.setSelectedKey(key));
            }
          }}
          inputValue={inputValue}
          onInputChange={setInputValue}
        />
      </div>
    </div>
  );
};
