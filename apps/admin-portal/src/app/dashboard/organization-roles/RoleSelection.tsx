import {
  getRoleOptionsAsync,
  useDispatch,
  userOrganizationRoleSlice,
  useSelector,
} from '@/libs/redux';
import {
  RoleOption,
  RoleOptionList,
  UserOrganizationRoleUpdateRequest,
} from '@frankjhub/shared-schema';
import {
  DefaultAutocompleteItemsType,
  FrankActionsDropdown,
  FrankAutocomplete,
  FrankGeneralTable,
} from '@frankjhub/shared-ui-hero-client';
import { FrankButton, GeneralTableColumn } from '@frankjhub/shared-ui-hero-ssr';
import clsx from 'clsx';
import { ReactNode, useEffect, useMemo, useState } from 'react';
import { useFormContext } from 'react-hook-form';

const columns: GeneralTableColumn[] = [
  {
    name: 'ROLE NAME',
    uid: 'name',
  },
  {
    name: 'ROLE CODE',
    uid: 'code',
  },
  {
    name: 'ROLE SOURCE',
    uid: 'roleSource',
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

export const RoleSelection = () => {
  const dispatch = useDispatch();
  const { setValue, watch } = useFormContext<UserOrganizationRoleUpdateRequest>();
  const selectedOrg = useSelector(state => state.userOrganizationRole.selectedOrg);
  const userOrgRole = useSelector(state => state.userOrganizationRole.userOrgRole);
  const roleOptionList = useSelector(state => state.role.options?.data);
  const createRoleInput = useSelector(state => state.userOrganizationRole.createRoleInput);

  const [roleList, setRoleList] = useState<RoleOptionList | undefined>(undefined);
  const [createRole, setCreateRole] = useState<RoleOption | undefined>(undefined);

  const watchedOrg = watch('organizations');

  // update roleList
  useEffect(() => {
    const org = userOrgRole?.organizations.find(org => org.id === selectedOrg);
    if (org && org.roles.length > 0) {
      setRoleList(org.roles.map(role => role));
    } else {
      setRoleList([]);
    }
  }, [selectedOrg, userOrgRole?.organizations]);

  const defaultItems = useMemo<DefaultAutocompleteItemsType[]>(() => {
    const data = roleOptionList ?? [];
    const excludeIds = new Set(roleList?.map(r => r.id));
    return data
      .filter(role => !excludeIds.has(role.id))
      .map(role => ({
        label: (
          <div>
            {role.name} - {role.code}
          </div>
        ),
        key: role.id,
        textValue: role.code,
      }));
  }, [roleList, roleOptionList]);

  // fetch role option list
  useEffect(() => {
    dispatch(getRoleOptionsAsync());
  }, [dispatch]);

  const handleDelete = (id: string) => {
    dispatch(userOrganizationRoleSlice.actions.removeRoleFromUser(id));
    const idx = watchedOrg.findIndex(o => o.id === selectedOrg);
    if (idx === -1) return;

    const nextRoles = (watchedOrg[idx].roles ?? []).filter(r => r.id !== id);
    setValue(`organizations.${idx}.roles`, nextRoles, {
      shouldDirty: true,
      shouldTouch: true,
    });
  };
  return (
    <div
      className={clsx([
        'flex flex-col gap-4',
        'outline outline-1 outline-gray-400 h-full rounded-lg p-4',
      ])}
    >
      <h1 className={clsx(['text-xl font-semibold'])}>Roles:</h1>
      <div className={clsx(['flex gap-3 items-center'])}>
        <FrankAutocomplete
          ariaLabel="Add new role"
          label="Add new role"
          defaultFilter={true}
          defaultItems={defaultItems}
          variant="bordered"
          radius="md"
          size="sm"
          onSelectionChange={key => {
            if (roleOptionList && key) {
              const role = roleOptionList.find(role => role.id === key);
              if (role) {
                setCreateRole(role);
              }
            } else {
              setCreateRole(undefined);
            }
          }}
          inputValue={createRoleInput}
          onInputChange={value => {
            dispatch(userOrganizationRoleSlice.actions.setCreateRoleInput(value));
          }}
          isDisabled={!roleList || roleList.length === 0}
        />
        <FrankButton
          variant="solid"
          size="md"
          color="secondary"
          onPress={() => {
            if (!createRole) return;

            // 找到org的index
            const idx = watchedOrg.findIndex(o => o.id === selectedOrg);
            if (idx === -1) return;

            // 先做不可变拷贝，避免原地突变
            const prevRoles = watchedOrg[idx]?.roles ?? [];

            // 去重
            const exists = prevRoles.some(r => r.id === createRole.id);
            const nextRoles = exists ? prevRoles : [...prevRoles, createRole];

            // 只把 roles 写回去
            setValue(`organizations.${idx}.roles`, nextRoles, {
              shouldDirty: true,
              shouldTouch: true,
            });

            dispatch(userOrganizationRoleSlice.actions.addNewRoleToUser(createRole));
            dispatch(userOrganizationRoleSlice.actions.cleanCreateRoleInput());
          }}
          isDisabled={!createRole}
        >
          Add
        </FrankButton>
      </div>
      <div>
        <FrankGeneralTable
          ariaLabel="use role list"
          columns={columns}
          data={roleList}
          renderCell={(role, columnKey): ReactNode => {
            const cellValue = role[columnKey as keyof RoleOption];
            switch (columnKey) {
              case 'actions':
                return (
                  <FrankActionsDropdown
                    actions={[
                      {
                        key: 'delete',
                        label: <div className="text-danger">Delete</div>,
                        onPress: () => {
                          handleDelete(role.id);
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
