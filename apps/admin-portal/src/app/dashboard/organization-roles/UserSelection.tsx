'use client';

import {
  getUserOrganizationRoleByUserIdAsync,
  useDispatch,
  userOrganizationRoleSlice,
  usersSlice,
  useSelector,
} from '@/libs/redux';
import { getUserOptionListAsync } from '@/libs/redux/slices/usersSlice/thunk';
import { useDebouncedCallback } from '@frankjhub/shared-hooks';
import { UserOrganizationRoleUpdateRequest } from '@frankjhub/shared-schema';
import { FrankCustomizedAutocomplete } from '@frankjhub/shared-ui-hero-client';
import { DefaultAutocompleteItem, UserListItem } from '@frankjhub/shared-ui-hero-ssr';
import { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';

export const UserSelection = () => {
  const dispatch = useDispatch();
  const userOptionList = useSelector(state => state.users.userOptionList);
  const selectedKey = useSelector(state => state.users.selectedKey);
  const userOrganizationRole = useSelector(state => state.userOrganizationRole.userOrgRole);
  const [inputValue, setInputValue] = useState('');
  const { setValue, reset } = useFormContext<UserOrganizationRoleUpdateRequest>();

  useEffect(() => {
    dispatch(getUserOptionListAsync({ data: { keyword: '' } }));
  }, [dispatch]);

  const defaultItems: DefaultAutocompleteItem[] =
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
      dispatch(usersSlice.actions.setSelectedKey(''));
    }
  }, 500);

  // user search
  useEffect(() => {
    debouncedSearchChange(inputValue);
  }, [inputValue, debouncedSearchChange]);

  // get user organization role data
  useEffect(() => {
    if (selectedKey) {
      dispatch(getUserOrganizationRoleByUserIdAsync({ id: selectedKey }));
    } else {
      dispatch(userOrganizationRoleSlice.actions.cleanUserOrgRole());
      dispatch(userOrganizationRoleSlice.actions.cleanCreateOrgInput());
    }
  }, [selectedKey, dispatch]);

  // fill form value
  useEffect(() => {
    if (userOrganizationRole) {
      setValue('id', userOrganizationRole.id, {
        shouldValidate: false,
        shouldDirty: false,
        shouldTouch: false,
      });
      const organizationRoles = userOrganizationRole.organizations.map(org => ({
        id: org.id,
        roles: org.roles.map(role => ({
          id: role.id,
        })),
      }));
      setValue('organizations', organizationRoles, {
        shouldValidate: false,
        shouldDirty: false,
        shouldTouch: false,
      });
    } else {
      reset({
        id: undefined,
        organizations: undefined,
      });
    }
  }, [setValue, reset, userOrganizationRole]);

  return (
    <div>
      <div className="w-1/2">
        <FrankCustomizedAutocomplete
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
