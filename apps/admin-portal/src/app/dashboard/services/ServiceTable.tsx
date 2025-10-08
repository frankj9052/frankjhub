'use client';

import { CreateServiceForm } from '@/components/forms/CreateServiceForm';
import { useDispatch, useSelector } from '@/libs/redux';
import {
  getServiceByIdAsync,
  getServiceListAsync,
  serviceSlice,
} from '@/libs/redux/slices/serviceSlice';
import { softDeleteService } from '@/services/service.service';
import { useDebouncedCallback } from '@frankjhub/shared-hooks';
import {
  makeFiltersToolkit,
  OrderEnum,
  SERVICE_FILTER,
  ServiceDto,
  ServiceOrderByField,
  ServiceStatus,
} from '@frankjhub/shared-schema';
import {
  FrankActionsDropdown,
  SimpleModal,
  TableTopDropdownProps,
  TableTopSearchbarProps,
  TableWithSearchAndFilter,
} from '@frankjhub/shared-ui-hero-client';
import { DropdownSelection, OnSortChange } from '@frankjhub/shared-ui-hero-ssr';
import { formatShortDateTime } from '@frankjhub/shared-utils';
import { useRouter } from 'next/navigation';
import { ChangeEvent, Key, ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';

export const ServiceTable = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const all = useSelector(state => state.service.all);
  const pagination = useSelector(state => state.service.pagination);
  const statusOptions = useSelector(state => state.service.statusOptions);
  const visibleColumns = useSelector(state => state.service.visibleColumns);
  const columns = useSelector(state => state.service.columns);
  const status = useSelector(state => state.service.status);

  const { limit, filters } = pagination;
  const total = all?.total ?? 0;
  const currentPage = all?.currentPage ?? 0;
  const pageSize = all?.pageSize ?? 0;
  const pageCount = all?.pageCount ?? 0;

  const handlePageSizeChange = (e: ChangeEvent<HTMLSelectElement>) => {
    dispatch(serviceSlice.actions.setLimit(Number(e.target.value)));
    dispatch(serviceSlice.actions.cleanOffset());
  };
  /** Search Logic */
  const [searchValue, setSearchValue] = useState('');
  const handleClearSearchValue = () => {
    setSearchValue('');
  };
  const searchbar: TableTopSearchbarProps = {
    placeholder: 'Search by serviceId',
    searchValue,
    onClear: handleClearSearchValue,
    onValueChange: setSearchValue,
  };

  const debouncedSearchChange = useDebouncedCallback((value?: string) => {
    if (value) {
      dispatch(serviceSlice.actions.setSearchValue(value));
      dispatch(serviceSlice.actions.cleanOffset());
    } else {
      dispatch(serviceSlice.actions.cleanSearchValue());
    }
  }, 500);
  useEffect(() => {
    debouncedSearchChange(searchValue);
  }, [dispatch, searchValue, debouncedSearchChange]);

  /** Filter Logic */
  const serviceFiltersToolkit = makeFiltersToolkit({
    status: SERVICE_FILTER,
  });
  const structured = serviceFiltersToolkit.ensureStructured(filters, { onUnknown: 'ignore' });
  const selectedStatus = new Set(structured.any?.find(c => c.key === 'status')?.values ?? []);
  const handleStatusSelectionChange = (selection: DropdownSelection) => {
    const selectionArray = Array.from(selection);
    dispatch(serviceSlice.actions.setStatusFilter(selectionArray as ServiceStatus[]));
  };
  const statusFilter: TableTopDropdownProps = {
    trigger: 'Status',
    ariaLabel: 'Status selection',
    selectedKey: selectedStatus,
    selectionMode: 'multiple',
    onSelectionChange: handleStatusSelectionChange,
    dropdownItems: statusOptions,
  };
  const filterList: TableTopDropdownProps[] = [statusFilter];

  /** Column filter logic */
  const handleColumnSelectionChange = (selection: DropdownSelection) => {
    const selectionArray = Array.from(selection);
    dispatch(serviceSlice.actions.setVisibleColumn(selectionArray));
  };
  const columnSelection: TableTopDropdownProps = {
    trigger: 'Columns',
    ariaLabel: 'Table Columns',
    selectedKey: new Set(String(visibleColumns)),
    selectionMode: 'multiple',
    onSelectionChange: handleColumnSelectionChange,
    dropdownItems: columns,
  };

  /** Bottom Content */
  const handlePageChange = (page: number) => {
    const offset = (page - 1) * pageSize;
    dispatch(serviceSlice.actions.setOffset(offset));
  };

  /** Main Content */
  const [openModal, setOpenModal] = useState<SimpleModal | undefined>(undefined);
  const headerColumns = useMemo(() => {
    if (visibleColumns === 'all') return columns;
    return columns.filter(column => Array.from(visibleColumns).includes(column.uid));
  }, [visibleColumns, columns]);

  const handleSortChange: OnSortChange = sortDescriptor => {
    const { column, direction } = sortDescriptor;
    if (direction === 'ascending') {
      dispatch(serviceSlice.actions.setOrder(OrderEnum.ASC));
    } else if (direction === 'descending') {
      dispatch(serviceSlice.actions.setOrder(OrderEnum.DESC));
    }
    dispatch(serviceSlice.actions.setOrderBy(String(column) as ServiceOrderByField));
  };

  const renderCell = useCallback(
    (srv: ServiceDto, columnKey: Key): ReactNode => {
      const cellValue = srv[columnKey as keyof ServiceDto];

      switch (columnKey) {
        case 'createdAt':
        case 'updatedAt':
        case 'deletedAt':
        case 'lastRotatedAt':
          if (cellValue) {
            return <div>{formatShortDateTime(new Date(String(cellValue)))}</div>;
          }
          return cellValue;
        case 'actions':
          return (
            <FrankActionsDropdown
              actions={[
                {
                  key: 'edit',
                  onPress: () => {
                    dispatch(getServiceByIdAsync({ id: srv.id }));
                    router.push(`/dashboard/services/edit/${srv.id}`);
                  },
                  label: 'Edit',
                  textValue: 'edit',
                },
                {
                  key: 'delete',
                  onPress: () => {
                    setOpenModal({
                      name: srv.serviceId,
                      id: srv.id,
                      header: 'Delete',
                      body: `Are you sure you want to delete service: ${srv.serviceId}`,
                      onPress: async () => {
                        if (!openModal) return;
                        const result = await softDeleteService(srv.id);
                        if (result.status === 'success') {
                          toast.success(result.message);
                          setOpenModal(undefined);
                          dispatch(getServiceListAsync({ data: pagination }));
                        } else {
                          toast.error(String(result.message));
                        }
                      },
                    });
                  },
                  label: 'Delete',
                  textValue: 'delete',
                  className: 'text-danger',
                },
              ]}
            />
          );
        default:
          return <span>{String(cellValue ?? '')}</span>;
      }
    },
    [dispatch, router, openModal, pagination]
  );

  /** Fetch data */
  useEffect(() => {
    dispatch(getServiceListAsync({ data: pagination }));
  }, [pagination, dispatch]);

  return (
    <TableWithSearchAndFilter
      ariaLabel="service list table"
      searchbar={searchbar}
      filterList={filterList}
      columnSelection={columnSelection}
      total={total}
      handlePageSizeChange={handlePageSizeChange}
      limit={limit}
      CreateForm={CreateServiceForm}
      currentPage={currentPage}
      pageCount={pageCount}
      handlePageChange={handlePageChange}
      handleSortChange={handleSortChange}
      headerColumns={headerColumns}
      status={status}
      all={all?.data ?? []}
      openModal={openModal}
      setOpenModal={setOpenModal}
      emptyContent={'No Services Found'}
      renderCell={renderCell}
    />
  );
};
