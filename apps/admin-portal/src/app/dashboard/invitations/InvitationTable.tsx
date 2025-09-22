'use client';
import {
  FrankDropdown,
  FrankDropdownItem,
  FrankDropdownMenu,
  FrankDropdownTrigger,
  FrankModal,
  FrankTable,
  FrankTableBody,
  FrankTableCell,
  FrankTableColumn,
  FrankTableHeader,
  FrankTableRow,
} from '@frankjhub/shared-ui-hero-client';
import { TopContent } from './TopContent';
import { BottomContent } from './BottomContent';
import { Key, ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import { getDefaultTableClassNames } from '@/utils/tableClassnames';
import { invitationSlice, useDispatch, useSelector } from '@/libs/redux';
import { FrankButton, FrankSpinner, OnSortChange } from '@frankjhub/shared-ui-hero-ssr';
import { InvitationDto, InvitationOrderByFIelds, OrderEnum } from '@frankjhub/shared-schema';
import { formatShortDateTime } from '@frankjhub/shared-utils';
import { HiDotsVertical } from 'react-icons/hi';
import { getInvitationListAsync } from '@/libs/redux/slices/invitationSlice/thunk';
import { hardDeleteInvitation } from '@/services/invitation.service';
import { toast } from 'react-toastify';

export const InvitationTable = () => {
  const dispatch = useDispatch();
  const all = useSelector(state => state.invitation.all);
  const pagination = useSelector(state => state.invitation.pagination);
  const status = useSelector(state => state.invitation.status);
  const loadingStatus = status === 'loading' ? 'loading' : 'idle';
  const visibleColumns = useSelector(state => state.invitation.visibleColumns);
  const columns = useSelector(state => state.invitation.columns);
  const classNames = useMemo(() => getDefaultTableClassNames(), []);
  const [openModal, setOpenModal] = useState<
    | {
        name: string;
        id: string;
        header: string;
        body: string;
      }
    | undefined
  >(undefined);

  // 表头
  const headerColumns = useMemo(() => {
    if (visibleColumns === 'all') return columns;
    return columns.filter(column => Array.from(visibleColumns).includes(column.uid));
  }, [visibleColumns, columns]);

  // 排序
  const handleSortChange: OnSortChange = sortDescriptor => {
    const { column, direction } = sortDescriptor;
    if (direction === 'ascending') {
      dispatch(invitationSlice.actions.setOrder(OrderEnum.ASC));
    } else if (direction === 'descending') {
      dispatch(invitationSlice.actions.setOrder(OrderEnum.DESC));
    }
    dispatch(invitationSlice.actions.setOrderBy(String(column) as InvitationOrderByFIelds));
  };

  // 删除
  const handleSoftDeleteClick = async () => {
    if (openModal) {
      const result = await hardDeleteInvitation(openModal.id);
      if (result.status === 'success') {
        toast.success(result.message);
        setOpenModal(undefined);
        dispatch(getInvitationListAsync({ data: pagination }));
      } else {
        toast.error(String(result.message));
      }
    }
  };
  // 渲染
  const renderCell = useCallback((inv: InvitationDto, columnKey: Key): ReactNode => {
    const cellValue = inv[columnKey as keyof InvitationDto];

    switch (columnKey) {
      case 'createdAt':
      case 'updatedAt':
      case 'deletedAt':
      case 'expiresAt':
        if (cellValue) {
          return <div>{formatShortDateTime(new Date(String(cellValue)))}</div>;
        }
        return cellValue;
      case 'meta':
        return JSON.stringify(cellValue);
      case 'actions':
        return (
          <div>
            <div className="relative flex justify-end items-center gap-2">
              <FrankDropdown className="bg-background border-1 border-default-200">
                <FrankDropdownTrigger>
                  <FrankButton isIconOnly radius="full" size="sm" variant="light">
                    <HiDotsVertical className="text-default-400" />
                  </FrankButton>
                </FrankDropdownTrigger>
                <FrankDropdownMenu>
                  <FrankDropdownItem
                    key="delete"
                    textValue="delete"
                    onPress={() => {
                      setOpenModal({
                        name: inv.email,
                        id: inv.id,
                        header: 'Delete',
                        body: `Are you sure you want to delete invitation to: ${inv.email}?`,
                      });
                    }}
                  >
                    Delete
                  </FrankDropdownItem>
                </FrankDropdownMenu>
              </FrankDropdown>
            </div>
          </div>
        );
      default:
        if (typeof cellValue === 'object' && cellValue !== null) {
          return <span>{JSON.stringify(cellValue)}</span>;
        }
        return <span>{String(cellValue ?? '')}</span>;
    }
  }, []);

  // 初次拿数据
  useEffect(() => {
    dispatch(getInvitationListAsync({ data: pagination }));
  }, [pagination, dispatch]);

  return (
    <div>
      <FrankTable
        isCompact
        removeWrapper
        ariaLabel="async paginated invitation data"
        selectionMode="single"
        color="secondary"
        topContent={<TopContent />}
        topContentPlacement="outside"
        bottomContent={<BottomContent />}
        bottomContentPlacement="outside"
        classNames={classNames}
        onSortChange={handleSortChange}
      >
        <FrankTableHeader columns={headerColumns}>
          {column => (
            <FrankTableColumn
              key={column.uid}
              align={column.uid === 'action' ? 'center' : 'start'}
              allowsSorting={column.sortable}
            >
              {column.name}
            </FrankTableColumn>
          )}
        </FrankTableHeader>
        <FrankTableBody
          items={all?.data ?? []}
          loadingContent={<FrankSpinner color="secondary" />}
          loadingState={loadingStatus}
          emptyContent={'No invitation found'}
        >
          {item => (
            <FrankTableRow key={item.id}>
              {columnKey => <FrankTableCell>{renderCell(item, columnKey)}</FrankTableCell>}
            </FrankTableRow>
          )}
        </FrankTableBody>
      </FrankTable>
      <FrankModal
        isOpen={!!openModal}
        onClose={() => {
          setOpenModal(undefined);
        }}
        header={openModal?.header}
        body={<p>{openModal?.body}</p>}
        footerButtons={[
          {
            color: 'default',
            variant: 'light',
            customizeContent: <div className="h-8 flex items-center justify-center">Cancel</div>,
            onPress: () => {
              setOpenModal(undefined);
            },
          },
          {
            color: 'danger',
            variant: 'solid',
            customizeContent: <div className="h-8 flex items-center justify-center">Delete</div>,
            onPress: handleSoftDeleteClick,
          },
        ]}
      />
    </div>
  );
};
