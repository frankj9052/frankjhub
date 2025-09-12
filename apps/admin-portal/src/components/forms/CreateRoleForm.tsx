'use client';

import {
  useDispatch,
  useSelector,
  getRoleListAsync,
  getPermissionOptionsAsync,
  getOrganizationTypeOptionsAsync,
  getOrganizationOptionListAsync,
} from '@/libs/redux';
import { createRole } from '@/services/role.service';
import {
  OrganizationOptionList,
  OrganizationTypeOptionList,
  RoleCreateRequest,
  roleCreateRequestSchema,
  RoleSource,
} from '@frankjhub/shared-schema';
import { handleFormServerErrors } from '@frankjhub/shared-utils';
import {
  DefaultAutocompleteItemsType,
  FrankAutocomplete,
  FrankSelect,
  SelectItemType,
} from '@frankjhub/shared-ui-hero-client';
import { Button, Form, Input } from '@heroui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { useEffect, useMemo } from 'react';
import { IoMdClose } from 'react-icons/io';
import { toast } from 'react-toastify';

type Props = {
  onClose: () => void;
};

export const CreateRoleForm = ({ onClose }: Props) => {
  const dispatch = useDispatch();

  // pagination for refreshing list after create
  const pagination = useSelector(state => state.role.pagination);
  // permission options for multi-select
  const permissionOptionList = useSelector(state => state.permission.options);

  const sourceItems: SelectItemType[] = Object.values(RoleSource).map(s => ({
    key: String(s),
    label: String(s),
  }));

  const {
    handleSubmit,
    control,
    reset,
    setError,
    watch,
    formState: { isDirty, isSubmitting, errors },
  } = useForm<RoleCreateRequest>({
    resolver: zodResolver(roleCreateRequestSchema),
    mode: 'onTouched',
  });

  useEffect(() => {
    // 拉权限下拉
    dispatch(getPermissionOptionsAsync());
    dispatch(getOrganizationTypeOptionsAsync());
    dispatch(getOrganizationOptionListAsync());
  }, [dispatch]);

  const onSubmit = async (value: RoleCreateRequest) => {
    const result = await createRole(value);
    if (result.status === 'success') {
      toast.success(result.message ?? 'Role created successfully');
      reset({
        name: '',
        permissionIds: [],
        description: '',
        roleSource: undefined,
        sourceId: '',
      });
      onClose();
      dispatch(getRoleListAsync({ pagination }));
    } else {
      handleFormServerErrors(result, setError);
      onClose();
    }
  };

  // 选择resource id
  const roleSource = watch('roleSource');
  const orgOptionList = useSelector(state => state.organization.options?.data);
  const orgTypeOptionList = useSelector(state => state.organizationType.options?.data);
  const defaultItems = useMemo<DefaultAutocompleteItemsType[]>(() => {
    let list: OrganizationOptionList | OrganizationTypeOptionList = [];
    if (roleSource === RoleSource.ORG && orgOptionList?.length) {
      list = orgOptionList;
    } else if (roleSource === RoleSource.TYPE && orgTypeOptionList?.length) {
      list = orgTypeOptionList;
    }
    return list.map(item => ({
      key: item.id,
      label: item.name,
      textValue: item.name,
    }));
  }, [orgOptionList, orgTypeOptionList, roleSource]);
  return (
    <div className="p-4 flex flex-col gap-3">
      {/* Top */}
      <div className="flex justify-between">
        <h1 className="text-xl font-semibold">Create Role</h1>
        <IoMdClose size={20} className="cursor-pointer" onClick={onClose} />
      </div>

      <h2 className="text-gray-400 text-xs">
        Please fill out the form — fields marked with an asterisk (*) are required.
      </h2>

      {/* Form */}
      <Form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col w-full">
          {/* Role Name */}
          <div className="h-[70px] w-full">
            <Controller
              name="name"
              control={control}
              render={({ field, fieldState }) => (
                <Input
                  label="Role Name (*)"
                  variant="bordered"
                  value={field.value ?? ''}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  isInvalid={!!fieldState.error}
                  errorMessage={fieldState.error?.message}
                  fullWidth
                  size="sm"
                />
              )}
            />
          </div>

          {/* Role Source */}
          <div className="h-[70px] w-full">
            <Controller
              name="roleSource"
              control={control}
              render={({ field, fieldState }) => (
                <FrankSelect
                  label="Role Source(*)"
                  variant="bordered"
                  onBlur={field.onBlur}
                  isInvalid={!!fieldState.error}
                  errorMessage={fieldState.error?.message}
                  size="sm"
                  items={sourceItems}
                  selectionMode="single"
                  disallowEmptySelection={true}
                  selectedKeys={
                    Array.isArray(field.value) ? field.value.map(v => String(v)) : undefined
                  }
                  onSelectionChange={sharedSelection => {
                    const selection =
                      sharedSelection === 'all'
                        ? Object.values(sharedSelection)
                        : Array.from(sharedSelection);
                    field.onChange(selection[0]);
                    if (selection[0] === RoleSource.ORG) {
                      dispatch(getOrganizationOptionListAsync());
                    }
                    if (selection[0] === RoleSource.TYPE) {
                      dispatch(getOrganizationTypeOptionsAsync());
                    }
                  }}
                />
              )}
            />
          </div>

          {/* Role Source Id */}
          <div className="h-[70px] w-full">
            <Controller
              name="sourceId"
              control={control}
              render={({ field, fieldState }) => (
                <FrankAutocomplete
                  ariaLabel="Select resource id"
                  label="Select where the role belong to"
                  defaultFilter={true}
                  defaultItems={defaultItems}
                  variant="bordered"
                  size="sm"
                  isDisabled={!roleSource || !!fieldState.error}
                  onBlur={field.onBlur}
                  errorMessage={fieldState.error?.message}
                  height={48}
                  onSelectionChange={key => {
                    field.onChange(key);
                  }}
                />
              )}
            />
          </div>
          {/* Description */}
          <div className="h-[70px] w-full">
            <Controller
              name="description"
              control={control}
              render={({ field, fieldState }) => (
                <Input
                  label="Description"
                  variant="bordered"
                  value={field.value ?? ''}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  isInvalid={!!fieldState.error}
                  errorMessage={fieldState.error?.message}
                  fullWidth
                  size="sm"
                />
              )}
            />
          </div>

          {/* Permissions */}
          <div className="h-[70px] w-full">
            <Controller
              name="permissionIds"
              control={control}
              render={({ field, fieldState }) => (
                <FrankSelect
                  label="Select Permissions"
                  ariaLabel="select permissions"
                  selectionMode="multiple"
                  selectedKeys={field.value ?? []}
                  onSelectionChange={sharedSelection => {
                    const selected: string[] =
                      sharedSelection === 'all'
                        ? permissionOptionList?.data?.map((p: any) => p.id) ?? []
                        : Array.from(sharedSelection).map(key => String(key));
                    field.onChange(selected);
                  }}
                  onBlur={field.onBlur}
                  isInvalid={!!fieldState.error}
                  errorMessage={fieldState.error?.message}
                  items={
                    permissionOptionList?.data?.map((p: any) => ({
                      label: p.name, // 如果你需要显示更友好的文本，改成 p.description 或自定义
                      key: p.id,
                    })) ?? []
                  }
                  size="sm"
                  disallowEmptySelection={false}
                  variant="bordered"
                />
              )}
            />
          </div>

          {/* Server Errors */}
          {errors?.root?.serverError && (
            <p className="text-danger text-sm">
              {typeof errors.root.serverError.message === 'string'
                ? errors.root.serverError.message
                : JSON.stringify(errors.root.serverError.message)}
            </p>
          )}
        </div>

        {/* Buttons */}
        <div className="flex gap-4">
          <Button
            type="button"
            onPress={onClose}
            variant="ghost"
            className="text-secondary"
            isDisabled={!isDirty || isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="bg-secondary text-white"
            isDisabled={!isDirty}
            isLoading={isSubmitting}
          >
            Create
          </Button>
        </div>
      </Form>
    </div>
  );
};
