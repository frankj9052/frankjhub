import { getPermissionListAsync, useDispatch, useSelector } from '@/libs/redux';
import { createPermission } from '@/services/permission.service';
import { PermissionCreateRequest, permissionCreateRequestSchema } from '@frankjhub/shared-schema';
import { handleFormServerErrors } from '@frankjhub/shared-utils';
import { Button, Form, Input } from '@heroui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { IoMdClose } from 'react-icons/io';
import { toast } from 'react-toastify';

type Props = {
  onClose: () => void;
};

export const CreatePermissionForm = ({ onClose }: Props) => {
  const dispatch = useDispatch();
  const pagination = useSelector(state => state.permission.pagination);

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
        name: '',
        description: '',
      });
      onClose();
      dispatch(getPermissionListAsync({ pagination }));
    } else {
      handleFormServerErrors(result, setError);
      onClose();
    }
  };

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
              name="name"
              control={control}
              render={({ field, fieldState }) => (
                <Input
                  label="Permission Name *"
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
