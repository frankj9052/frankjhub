'use client';

import {
  useDispatch,
  useSelector,
  getRoleByIdAsync,
  getRoleListAsync,
  getPermissionOptionsAsync,
} from '@/libs/redux';

import { updateRole, hardDeleteRole, restoreRole } from '@/services/role.service';

import { roleUpdateRequestSchema, RoleUpdateRequest } from '@frankjhub/shared-schema';

import { handleFormServerErrors } from '@frankjhub/shared-utils';
import { FrankSelect, FrankModal } from '@frankjhub/shared-ui-hero-client';
import { useConfirmModal } from '@frankjhub/shared-hooks';

import { Button, Form, Input } from '@heroui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { useEffect, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

export const EditRoleForm = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const router = useRouter();

  const target = useSelector(state => state.role.target?.data);
  const loading = useSelector(state => state.role.status);
  const pagination = useSelector(state => state.role.pagination);
  const permissionOptionList = useSelector(state => state.permission.options);

  const {
    isOpen,
    config,
    loading: localLoading,
    openModal,
    closeModal,
    confirmAction,
  } = useConfirmModal();

  const {
    handleSubmit,
    control,
    reset,
    setError,
    formState: { isDirty, isSubmitting, errors },
  } = useForm<RoleUpdateRequest>({
    resolver: zodResolver(roleUpdateRequestSchema),
    mode: 'onTouched',
  });

  const initialValue = useMemo<RoleUpdateRequest | undefined>(() => {
    if (!target) return undefined;

    return {
      id: target.id,
      name: target.name,
      description: target.description,
      roleSource: target.roleSource ?? undefined,
      sourceId: target?.organization?.id ?? target?.organizationType?.id,
      permissionIds: target.permissions?.map(p => p.id) ?? [],
    };
  }, [target]);

  // 加载选项
  useEffect(() => {
    dispatch(getPermissionOptionsAsync());
  }, [dispatch]);

  // 首次或 id 变化时拉取详情
  useEffect(() => {
    if (id && id !== target?.id) {
      dispatch(getRoleByIdAsync({ id: String(id) }));
    }
  }, [id, dispatch, target?.id]);

  // 详情到位后重置表单
  useEffect(() => {
    if (target && initialValue) {
      reset(initialValue);
    }
  }, [target, initialValue, reset]);

  const onSubmit = (data: RoleUpdateRequest) => {
    if (!target) return;

    openModal({
      header: 'Update Role',
      body: `Are you sure you want to update role: ${target.name}?`,
      color: 'secondary',
      text: 'Update',
      action: async () => {
        const result = await updateRole({ ...(data as any), id: target.id });
        if (result.status === 'success') {
          toast.success(result.message ?? 'Role updated successfully');
          dispatch(getRoleListAsync({ pagination }));
          router.back();
        } else {
          handleFormServerErrors(result, setError);
        }
      },
    });
  };

  const handleReset = () => {
    if (initialValue) reset(initialValue);
  };

  const handleHardDelete = () => {
    if (!target) return;
    openModal({
      header: 'Delete Permanently',
      body: `Are you sure you want to delete the role permanently?`,
      color: 'danger',
      text: 'Delete Permanently',
      action: async () => {
        const result = await hardDeleteRole(target.id);
        if (result.status === 'success') {
          toast.success(result.message ?? 'Deleted permanently');
          router.back();
        } else {
          toast.error(String(result.message));
        }
      },
    });
  };

  const handleRecovery = () => {
    if (!target) return;
    openModal({
      header: 'Recover',
      body: `Are you sure you want to recover this role?`,
      color: 'success',
      text: 'Recover',
      action: async () => {
        const result = await restoreRole(target.id);
        if (result.status === 'success') {
          toast.success(result.message ?? 'Recovered');
          // 恢复后刷新详情
          dispatch(getRoleByIdAsync({ id: String(id) }));
        } else {
          toast.error(String(result.message));
        }
      },
    });
  };

  if (!target || loading === 'loading') {
    return <div>Loading...</div>;
  }

  // 帮助函数：安全读取 options
  const permissionItems =
    permissionOptionList?.data?.map((p: any) => ({ label: p.name, key: p.id })) ?? [];

  return (
    <>
      <Form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6 bg-white p-6 shadow-md rounded-2xl border border-secondary"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-secondary">Edit Role</h2>
        </div>

        <div className="flex flex-col gap-3 w-full">
          {/* Name */}
          <div className="flex w-full gap-3">
            <Controller
              name="name"
              control={control}
              render={({ field, fieldState }) => (
                <Input
                  label="Role Name"
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

          {/* Code */}
          {/* <div className="flex w-full gap-3">
            <Controller
              name="code"
              control={control}
              render={({ field, fieldState }) => (
                <Input
                  label="Role Code"
                  description="Recommend uppercase, e.g., ADMIN, CLINIC_STAFF"
                  variant="bordered"
                  value={field.value ?? ''}
                  onChange={e => field.onChange(e.currentTarget.value.trim())}
                  onBlur={field.onBlur}
                  isInvalid={!!fieldState.error}
                  errorMessage={fieldState.error?.message}
                  fullWidth
                  size="sm"
                />
              )}
            />
          </div> */}

          {/* Permissions */}
          <div className="flex w-full gap-3">
            <Controller
              name="permissionIds"
              control={control}
              render={({ field, fieldState }) => (
                <FrankSelect
                  label="Permissions"
                  ariaLabel="permissions"
                  selectionMode="multiple"
                  selectedKeys={field.value ?? []}
                  onSelectionChange={sharedSelection => {
                    const selected: string[] =
                      sharedSelection === 'all'
                        ? permissionItems.map(i => String(i.key))
                        : Array.from(sharedSelection).map(k => String(k));
                    field.onChange(selected);
                  }}
                  onBlur={field.onBlur}
                  isInvalid={!!fieldState.error}
                  errorMessage={fieldState.error?.message}
                  items={permissionItems}
                  size="sm"
                  disallowEmptySelection={false}
                  variant="bordered"
                />
              )}
            />
          </div>

          {/* Description */}
          <div className="flex w-full gap-3">
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

          <div className="flex w-full gap-3">
            <Controller
              name="isActive"
              control={control}
              render={({ field, fieldState }) => (
                <FrankSelect
                  size="sm"
                  aria-label="Select isActive"
                  label="Is Active"
                  variant="bordered"
                  selectionMode="single"
                  selectedKeys={typeof field.value === 'boolean' ? [String(field.value)] : []}
                  onSelectionChange={keys => {
                    const key = [...keys][0];
                    field.onChange(key === 'true');
                  }}
                  isInvalid={!!fieldState.error}
                  errorMessage={fieldState.error?.message}
                  items={[
                    { label: 'True', key: 'true' },
                    { label: 'False', key: 'false' },
                  ]}
                />
              )}
            />
          </div>

          <div className="flex w-full gap-3">
            <Controller
              name="roleSource"
              control={control}
              render={({ field }) => (
                <Input
                  label="Role Source"
                  variant="bordered"
                  value={(field.value as any) ?? ''}
                  readOnly
                  fullWidth
                  size="sm"
                />
              )}
            />
          </div>

          <div className="flex w-full gap-3">
            <Controller
              name="sourceId"
              control={control}
              render={({ field }) => (
                <Input
                  label="Source ID"
                  variant="bordered"
                  value={field.value ?? ''}
                  readOnly
                  fullWidth
                  size="sm"
                />
              )}
            />
          </div>

          {/* Server error */}
          {errors?.root?.serverError && (
            <p className="text-danger text-sm">
              {typeof errors.root.serverError.message === 'string'
                ? errors.root.serverError.message
                : JSON.stringify(errors.root.serverError.message)}
            </p>
          )}
        </div>

        {/* Buttons */}
        <div className="flex gap-4 justify-end">
          <Button
            type="button"
            onPress={handleReset}
            variant="ghost"
            className="text-secondary"
            isDisabled={!isDirty || isSubmitting}
          >
            Reset
          </Button>
          <Button
            type="submit"
            className="bg-secondary text-white"
            isDisabled={!isDirty}
            isLoading={isSubmitting}
          >
            Update
          </Button>
          <Button
            type="button"
            variant="solid"
            color="danger"
            isDisabled={isSubmitting}
            isLoading={localLoading}
            onPress={handleHardDelete}
          >
            Delete permanently
          </Button>
          <Button
            type="button"
            variant="solid"
            color="success"
            isDisabled={isSubmitting || !target.deletedAt}
            isLoading={localLoading}
            onPress={handleRecovery}
          >
            Recovery
          </Button>
        </div>
      </Form>

      {/* Modal */}
      <FrankModal
        isOpen={isOpen}
        onClose={closeModal}
        header={config?.header}
        backdrop="opaque"
        body={config?.body}
        footerButtons={[
          {
            color: 'default',
            variant: 'light',
            customizeContent: <div className="h-8 flex items-center justify-center">Cancel</div>,
            onPress: closeModal,
            isLoading: localLoading,
          },
          {
            color: config?.color ?? 'secondary',
            variant: 'solid',
            customizeContent: (
              <div className="h-8 flex items-center justify-center">{config?.text}</div>
            ),
            onPress: confirmAction,
            isLoading: localLoading,
          },
        ]}
      />
    </>
  );
};

export default EditRoleForm;
