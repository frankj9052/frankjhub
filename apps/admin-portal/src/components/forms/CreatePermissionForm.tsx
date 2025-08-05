'use client';
import {
  getActoinOptionsAsync,
  getPermissionListAsync,
  getResourceOptionsAsync,
  useDispatch,
  useSelector,
} from '@/libs/redux';
import { createPermission } from '@/services/permission.service';
import { PermissionCreateRequest, permissionCreateRequestSchema } from '@frankjhub/shared-schema';
import { FrankAutocomplete, FrankSelect } from '@frankjhub/shared-ui-hero-client';
import { handleFormServerErrors } from '@frankjhub/shared-utils';
import { Button, Form, Input } from '@heroui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { IoMdClose } from 'react-icons/io';
import { toast } from 'react-toastify';

type Props = {
  onClose: () => void;
};

export const CreatePermissionForm = ({ onClose }: Props) => {
  const dispatch = useDispatch();
  const pagination = useSelector(state => state.permission.pagination);
  const resourceOptionList = useSelector(state => state.resource.options);
  const actionOptionList = useSelector(state => state.action.options);
  const {
    handleSubmit,
    control,
    reset,
    setError,
    formState: { isDirty, isSubmitting, errors },
  } = useForm<PermissionCreateRequest>({
    resolver: zodResolver(permissionCreateRequestSchema),
    mode: 'onTouched',
  });

  const onSubmit = async (value: PermissionCreateRequest) => {
    const result = await createPermission(value);
    if (result.status === 'success') {
      toast.success(result.message);
      reset({
        resourceId: '',
        actionIds: [],
        fields: [],
        condition: {},
        description: '',
      });
      onClose();
      dispatch(getPermissionListAsync({ pagination }));
    } else {
      handleFormServerErrors(result, setError);
      onClose();
    }
  };

  useEffect(() => {
    dispatch(getResourceOptionsAsync());
    dispatch(getActoinOptionsAsync());
  }, [dispatch]);

  return (
    <div className="p-4 flex flex-col gap-3">
      {/* Top */}
      <div className="flex justify-between">
        <h1 className="text-xl font-semibold">Create Permission</h1>
        <IoMdClose size={20} className="cursor-pointer" onClick={onClose} />
      </div>

      <h2 className="text-gray-400 text-xs">
        Please fill out the form — fields marked with an asterisk (*) are required.
      </h2>

      {/* Form */}
      <Form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col w-full">
          <div className="h-[70px] w-full">
            <Controller
              name="resourceId"
              control={control}
              render={({ field, fieldState }) => (
                <FrankAutocomplete
                  label="Select Resource"
                  ariaLabel="Select resource"
                  variant="bordered"
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
                  defaultFilter={true}
                  height={48}
                />
              )}
            />
          </div>
          <div className="h-[70px] w-full">
            <Controller
              name="actionIds"
              control={control}
              render={({ field, fieldState }) => (
                <FrankSelect
                  label="Select Actions"
                  ariaLabel="select actions"
                  selectionMode="multiple"
                  selectedKeys={field.value}
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
                  disallowEmptySelection={true}
                />
              )}
            />
          </div>
          <div className="h-[70px] w-full">
            <Controller
              name="fields"
              control={control}
              render={({ field, fieldState }) => (
                <Input
                  label="Fields"
                  variant="bordered"
                  value={Array.isArray(field.value) ? field.value.join(', ') : ''}
                  onChange={event => {
                    const value = event.currentTarget.value;
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
