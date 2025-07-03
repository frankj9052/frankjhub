import {
  getAllOrganizationsAsync,
  organizationSlice,
  useDispatch,
  useSelector,
} from '@/libs/redux';
import { getDefaultTableClassNames } from '@/utils/tableClassnames';
import { OrganizationWithOrgTypeNameSchema } from '@frankjhub/shared-schema';
import { formatShortDateTime } from '@frankjhub/shared-utils';
import {
  Button,
  Chip,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Table,
} from '@heroui/react';
import { useRouter } from 'next/navigation';
import { Key, useCallback, useEffect, useMemo } from 'react';
import { HiDotsVertical } from 'react-icons/hi';

export const OrganizationTable = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const all = useSelector(state => state.organization.all);
  const pagination = useSelector(state => state.organization.pagination);
  const status = useSelector(state => state.organization.status);
  const visibleColumns = useSelector(state => state.organization.visibleColumns);
  const columns = useSelector(state => state.organization.columns);
  const loadingStatus = status === 'loading' ? 'loading' : 'idle';
  const message = useSelector(state => state.organization.message);
  const { data } = all;
  const classNames = useMemo(() => getDefaultTableClassNames(), []);

  const headerColumns = useMemo(() => {
    if (visibleColumns === 'all') return columns;
    return columns.filter(column => Array.from(visibleColumns).includes(column.uid));
  }, [visibleColumns, columns]);

  // 渲染每个record
  const renderCell = useCallback(
    (org: OrganizationWithOrgTypeNameSchema, columnKey: Key) => {
      const cellValue = org[columnKey as keyof OrganizationWithOrgTypeNameSchema];

      switch (columnKey) {
        case 'isActive':
          if (cellValue) {
            return <Chip color="success">Active</Chip>;
          }
          return <Chip color="default">Inactive</Chip>;
        case 'createdAt':
        case 'updatedAt':
        case 'deletedAt':
          if (cellValue) {
            return <div>{formatShortDateTime(new Date(String(cellValue)))}</div>;
          }
          return cellValue;
        case 'actions':
          return (
            <div>
              <div className="relative flex justify-end items-center gap-2">
                <Dropdown className="bg-background border-1 border-default-200">
                  <DropdownTrigger>
                    <Button isIconOnly radius="full" size="sm" variant="light">
                      <HiDotsVertical className="text-default-400" />
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu>
                    <DropdownItem
                      key="edit"
                      onPress={() => {
                        router.push(`/dashboard/organization/edit/${org.id}`);
                      }}
                    >
                      Edit
                    </DropdownItem>
                    <DropdownItem
                      key="delete"
                      onPress={() => {
                        dispatch(
                          organizationSlice.actions.setTarget({
                            name: org.name,
                            id: org.id,
                          })
                        );
                        dispatch(
                          organizationSlice.actions.setMessage(
                            `Are you sure you want to delete organization: ${org.name}?`
                          )
                        );
                      }}
                    >
                      Delete
                    </DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </div>
            </div>
          );
        default:
          return cellValue;
      }
    },
    [router, dispatch]
  );

  useEffect(() => {
    dispatch(getAllOrganizationsAsync({ pagination }));
  }, [pagination, dispatch]);

  return (
    <div>
      <Table
        isCompact
        removeWrapper
        aria-label="async paginated organization data"
        selectionMode="single"
        color="secondary"
        topContent={<TopContent />}
        topContentPlacement="outside"
      ></Table>
    </div>
  );
};
