'use client';

import {
  getActoinOptionsAsync,
  getPermissionByIdAsync,
  getPermissionListAsync,
  getResourceOptionsAsync,
  useDispatch,
  useSelector,
} from '@/libs/redux';
import {
  hardDeletePermission,
  restorePermission,
  updatePermission,
} from '@/services/permission.service';
import { PermissionUpdateRequest, permissionUpdateRequestSchema } from '@frankjhub/shared-schema';
import {
  FrankCustomizedAutocomplete,
  FrankSelect,
  FrankTextArea,
  FrankModal,
} from '@frankjhub/shared-ui-hero-client';
import { handleFormServerErrors } from '@frankjhub/shared-utils';
import { Button, Form, Input } from '@heroui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { useConfirmModal } from '@frankjhub/shared-hooks';

export const EditPermissionForm = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const router = useRouter();

  const target = useSelector(state => state.permission.target?.data);
  const loading = useSelector(state => state.permission.status);
  const pagination = useSelector(state => state.permission.pagination);
  const resourceOptionList = useSelector(state => state.resource.options);
  const actionOptionList = useSelector(state => state.action.options);

  const {
    handleSubmit,
    control,
    reset,
    setError,
    clearErrors,
    formState: { isDirty, isSubmitting, errors },
  } = useForm<PermissionUpdateRequest>({
    resolver: zodResolver(permissionUpdateRequestSchema),
    mode: 'onTouched',
  });

  const {
    isOpen,
    config,
    loading: localLoading,
    openModal,
    closeModal,
    confirmAction,
  } = useConfirmModal();

  const [conditionText, setConditionText] = useState('');

  const initialValue = useMemo(() => {
    if (!target) return undefined;
    return {
      id: target.id,
      resourceId: target.resource.id,
      actionIds: target.actions.map(action => action.id),
      fields: target.fields,
      condition: target.condition ?? undefined,
      description: target.description ?? '',
      isActive: target.isActive,
    };
  }, [target]);

  useEffect(() => {
    dispatch(getResourceOptionsAsync());
    dispatch(getActoinOptionsAsync());
  }, [dispatch]);

  useEffect(() => {
    if (id && id !== target?.id) {
      dispatch(getPermissionByIdAsync({ id: String(id) }));
    }
  }, [id, dispatch, target?.id]);

  useEffect(() => {
    if (target && initialValue) {
      reset(initialValue);
      setConditionText(JSON.stringify(initialValue.condition, null, 2));
    }
  }, [target, initialValue, reset]);

  const onSubmit = (data: PermissionUpdateRequest) => {
    if (!target) return;

    openModal({
      header: 'Update Permission',
      body: `Are you sure you want to update permission for resource: ${target.resource.name}?`,
      color: 'secondary',
      text: 'Update',
      action: async () => {
        const result = await updatePermission({ ...data, id: target.id });
        if (result.status === 'success') {
          toast.success(result.message);
          dispatch(getPermissionListAsync({ pagination }));
          router.back();
        } else {
          handleFormServerErrors(result, setError);
        }
      },
    });
  };

  const handleReset = () => {
    if (initialValue) {
      reset(initialValue);
      setConditionText(JSON.stringify(initialValue.condition, null, 2));
    }
  };

  const handleHardDelete = () => {
    if (target) {
      openModal({
        header: 'Delete Permanently',
        body: `Are you sure you want to delete the permission permanently?`,
        color: 'danger',
        text: 'Delete Permanently',
        action: async () => {
          const result = await hardDeletePermission(target.id);
          if (result.status === 'success') {
            toast.success(result.message);
            router.back();
          } else {
            toast.error(String(result.message));
          }
        },
      });
    }
  };

  const handleRecovery = () => {
    if (target) {
      openModal({
        header: 'Recover',
        body: `Are you sure you want to recover this permission?`,
        color: 'success',
        text: 'Recover',
        action: async () => {
          const result = await restorePermission(target.id);
          if (result.status === 'success') {
            toast.success(result.message);
            dispatch(getPermissionByIdAsync({ id: String(id) }));
          } else {
            toast.error(String(result.message));
          }
        },
      });
    }
  };

  if (!target || loading === 'loading') {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6 bg-white p-6 shadow-md rounded-2xl border border-secondary"
      >
        <h2 className="text-2xl font-semibold text-secondary">Edit Permission</h2>

        <div className="flex flex-col gap-3 w-full">
          {/* Resource */}
          <div className="flex w-full gap-3">
            <Controller
              name="resourceId"
              control={control}
              render={({ field, fieldState }) => (
                <FrankCustomizedAutocomplete
                  label="Resource"
                  ariaLabel="resource"
                  selectedKey={field.value ?? ''}
                  onSelectionChange={field.onChange}
                  onBlur={field.onBlur}
                  isInvalid={!!fieldState.error}
                  errorMessage={fieldState.error?.message}
                  defaultItems={
                    resourceOptionList?.data?.map(item => ({
                      label: item.name,
                      key: item.id,
                    })) ?? []
                  }
                  variant="bordered"
                  height={48}
                />
              )}
            />
          </div>

          {/* Actions */}
          <div className="flex w-full gap-3">
            <Controller
              name="actionIds"
              control={control}
              render={({ field, fieldState }) => (
                <FrankSelect
                  label="Actions"
                  ariaLabel="actions"
                  selectionMode="multiple"
                  selectedKeys={field.value ?? []}
                  onSelectionChange={sharedSelection => {
                    const selected: string[] =
                      sharedSelection === 'all'
                        ? actionOptionList?.data?.map(item => item.id) ?? []
                        : Array.from(sharedSelection).map(key => String(key));
                    field.onChange(selected);
                  }}
                  onBlur={field.onBlur}
                  isInvalid={!!fieldState.error}
                  errorMessage={fieldState.error?.message}
                  items={
                    actionOptionList?.data?.map(item => ({
                      label: item.name,
                      key: item.id,
                    })) ?? []
                  }
                  size="sm"
                  disallowEmptySelection
                  variant="bordered"
                />
              )}
            />
          </div>

          {/* Fields */}
          <div className="flex w-full gap-3">
            <Controller
              name="fields"
              control={control}
              render={({ field, fieldState }) => (
                <Input
                  label="Fields (comma-separated)"
                  variant="bordered"
                  value={Array.isArray(field.value) ? field.value.join(', ') : ''}
                  onChange={e => {
                    const value = e.currentTarget.value;
                    const fields = value.split(',').map(item => item.trim());
                    field.onChange(fields);
                  }}
                  onBlur={field.onBlur}
                  isInvalid={!!fieldState.error}
                  errorMessage={fieldState.error?.message}
                  fullWidth
                  size="sm"
                />
              )}
            />
          </div>

          {/* Condition */}
          <div className="flex w-full gap-3">
            <Controller
              name="condition"
              control={control}
              render={({ field, fieldState }) => (
                <FrankTextArea
                  label="Condition (JSON format)"
                  variant="bordered"
                  value={conditionText}
                  onValueChange={input => {
                    setConditionText(input);
                    try {
                      const parsed = input.trim() === '' ? {} : JSON.parse(input);
                      field.onChange(parsed);
                      clearErrors('condition');
                    } catch {
                      setError('condition', { message: 'Invalid JSON format' });
                      field.onChange(undefined);
                    }
                  }}
                  onBlur={field.onBlur}
                  isInvalid={!!fieldState.error}
                  errorMessage={fieldState.error?.message}
                  size="sm"
                  minRows={4}
                  maxRows={4}
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
                  label="IsActive"
                  variant="bordered"
                  selectionMode="single"
                  selectedKeys={typeof field.value === 'boolean' ? [String(field.value)] : []}
                  onSelectionChange={keys => {
                    const key = [...keys][0]; // keys 是 Set<string> 类型
                    field.onChange(key === 'true');
                  }}
                  isInvalid={!!fieldState.error}
                  errorMessage={fieldState.error?.message}
                  items={[
                    {
                      label: 'True',
                      key: 'true',
                    },
                    {
                      label: 'False',
                      key: 'false',
                    },
                  ]}
                />
              )}
            />
          </div>

          {/* Server error */}
          {errors?.root?.serverError && (
            <p className="text-danger text-sm">{errors.root.serverError.message}</p>
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
