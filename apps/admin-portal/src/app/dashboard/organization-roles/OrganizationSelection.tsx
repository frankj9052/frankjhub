'use client';
import { getOrganizationOptionListAsync, useDispatch, useSelector } from '@/libs/redux';
import { OrganizationRoleRef } from '@frankjhub/shared-schema';
import {
  ActionsDropdown,
  DefaultAutocompleteItemsType,
  FrankActionsDropdown,
  FrankAutocomplete,
  FrankGeneralTable,
} from '@frankjhub/shared-ui-hero-client';
import { FrankButton, GeneralTableColumn } from '@frankjhub/shared-ui-hero-ssr';
import clsx from 'clsx';
import { ReactNode, useEffect, useMemo, useState } from 'react';

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
  const userOrganizationRole = useSelector(state => state.userOrganizationRole.userOrgRole);
  const [orgList, setOrgList] = useState(userOrganizationRole?.organizations ?? []);
  const defaultItems = useMemo<DefaultAutocompleteItemsType[]>(() => {
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

  const handleDelete = () => {
    console.log('delete record');
  };
  // actions
  const actions: ActionsDropdown[] = [
    {
      key: 'delete',
      label: <div className="text-danger">Delete</div>,
      onPress: handleDelete,
      textValue: 'delete',
    },
  ];

  return (
    <div
      className={clsx([
        'flex flex-col gap-4',
        'outline outline-1 outline-gray-400 h-full rounded-lg p-4',
      ])}
    >
      <h1 className={clsx(['text-xl font-semibold'])}>Organization:</h1>
      {/* autocomplete */}
      <div className={clsx(['flex gap-3 items-center'])}>
        <FrankAutocomplete
          ariaLabel="Add new organization"
          label="Add new organization"
          defaultFilter={true}
          defaultItems={defaultItems}
          variant="bordered"
          radius="md"
          size="sm"
          isDisabled={!userOrganizationRole}
        />
        <FrankButton variant="solid" size="md" color="secondary">
          Add
        </FrankButton>
      </div>
      {/* org list */}
      <div>
        <FrankGeneralTable
          ariaLabel="use organization list"
          columns={columns}
          data={orgList}
          renderCell={(org, columnKey): ReactNode => {
            const cellValue = org[columnKey as keyof OrganizationRoleRef];
            switch (columnKey) {
              case 'actions':
                return <FrankActionsDropdown actions={actions} />;
              default:
                return String(cellValue);
            }
          }}
        />
      </div>
    </div>
  );
};
