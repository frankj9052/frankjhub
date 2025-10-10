'use client';
import {
  getOrganizationOptionListAsync,
  useDispatch,
  userOrganizationRoleSlice,
  useSelector,
} from '@/libs/redux';
import { OrganizationRoleRef, UserOrganizationRoleUpdateRequest } from '@frankjhub/shared-schema';
import {
  FrankActionsDropdown,
  FrankCustomizedAutocomplete,
  FrankGeneralTable,
} from '@frankjhub/shared-ui-hero-client';
import {
  DefaultAutocompleteItem,
  FrankButton,
  GeneralTableColumn,
} from '@frankjhub/shared-ui-hero-ssr';
import clsx from 'clsx';
import { ReactNode, useEffect, useMemo, useState } from 'react';
import { useFormContext } from 'react-hook-form';

const columns: GeneralTableColumn[] = [
  {
    name: 'ORGANIZATION NAME',
    uid: 'name',
  },
  {
    name: 'ORGANIZATION TYPE NAME',
    uid: 'orgTypeName',
  },
  {
    name: 'DESCRIPTION',
    uid: 'description',
  },
  {
    name: 'ACTIONS',
    uid: 'actions',
    align: 'center',
  },
];

export const OrganizationSelection = () => {
  const dispatch = useDispatch();
  const organizationOptionList = useSelector(state => state.organization.options);
  const { setValue, watch } = useFormContext<UserOrganizationRoleUpdateRequest>();
  const userOrganizationRole = useSelector(state => state.userOrganizationRole.userOrgRole);
  const createOrgInput = useSelector(state => state.userOrganizationRole.createOrgInput);
  const selectedOrg = useSelector(state => state.userOrganizationRole.selectedOrg);
  const [orgList, setOrgList] = useState(userOrganizationRole?.organizations ?? []);
  const [createOrg, setCreateOrg] = useState<OrganizationRoleRef | undefined>(undefined);
  const watchedOrg = watch('organizations');

  const defaultItems = useMemo<DefaultAutocompleteItem[]>(() => {
    const data = organizationOptionList?.data ?? [];
    // avoid exist org display in add new area
    const excludeIds = new Set(orgList.map(o => o.id));
    return data
      .filter(org => !excludeIds.has(org.id))
      .map(org => ({
        label: org.name,
        key: org.id,
        textValue: org.name,
      }));
  }, [orgList, organizationOptionList?.data]);

  // uor change
  useEffect(() => {
    setOrgList(userOrganizationRole?.organizations ?? []);
  }, [userOrganizationRole?.organizations]);

  // fetch organization option list
  useEffect(() => {
    dispatch(getOrganizationOptionListAsync());
  }, [dispatch]);

  const handleDelete = (id: string) => {
    dispatch(userOrganizationRoleSlice.actions.removeOrgFromUser(id));
    setValue(
      'organizations',
      watchedOrg.filter(org => org.id !== id),
      {
        shouldDirty: true,
        shouldTouch: true,
      }
    );
  };

  return (
    <div
      className={clsx([
        'flex flex-col gap-4',
        'outline outline-1 outline-gray-400 h-full rounded-lg p-4',
      ])}
    >
      <h1 className={clsx(['text-xl font-semibold'])}>Organizations:</h1>
      {/* autocomplete */}
      <div className={clsx(['flex gap-3 items-center'])}>
        <FrankCustomizedAutocomplete
          ariaLabel="Add new organization"
          label="Add new organization"
          defaultFilter={true}
          defaultItems={defaultItems}
          variant="bordered"
          radius="md"
          size="sm"
          onSelectionChange={key => {
            if (organizationOptionList && key) {
              const org = organizationOptionList.data.find(org => org.id === key);
              if (org) {
                const newOrg: OrganizationRoleRef = {
                  ...org,
                  roles: [],
                };
                setCreateOrg(newOrg);
              }
            } else {
              setCreateOrg(undefined);
            }
          }}
          inputValue={createOrgInput}
          onInputChange={value => {
            dispatch(userOrganizationRoleSlice.actions.setCreateOrgInput(value));
          }}
          isDisabled={!orgList || orgList.length === 0}
        />
        <FrankButton
          variant="solid"
          size="md"
          color="secondary"
          onPress={() => {
            if (createOrg) {
              dispatch(userOrganizationRoleSlice.actions.addNewOrgToUser(createOrg));
              dispatch(userOrganizationRoleSlice.actions.cleanCreateOrgInput());
              setValue(
                'organizations',
                [
                  ...watchedOrg,
                  {
                    id: createOrg.id,
                    roles: [],
                  },
                ],
                {
                  shouldDirty: true,
                  shouldTouch: true,
                }
              );
            }
          }}
          isDisabled={!createOrg}
        >
          Add
        </FrankButton>
      </div>
      {/* org list */}
      <div>
        <FrankGeneralTable
          ariaLabel="use organization list"
          columns={columns}
          data={orgList}
          selectedKey={new Set([selectedOrg])}
          onSelectionChange={keys => {
            const value = Array.from(keys)[0];
            if (value) {
              dispatch(userOrganizationRoleSlice.actions.setSelectedOrg(String(value)));
            } else {
              dispatch(userOrganizationRoleSlice.actions.setSelectedOrg(''));
            }
          }}
          renderCell={(org, columnKey): ReactNode => {
            const cellValue = org[columnKey as keyof OrganizationRoleRef];
            switch (columnKey) {
              case 'actions':
                return (
                  <FrankActionsDropdown
                    actions={[
                      {
                        key: 'delete',
                        label: <div className="text-danger">Delete</div>,
                        onPress: () => {
                          handleDelete(org.id);
                        },
                        textValue: 'delete',
                      },
                    ]}
                  />
                );
              default:
                return String(cellValue);
            }
          }}
        />
      </div>
    </div>
  );
};
