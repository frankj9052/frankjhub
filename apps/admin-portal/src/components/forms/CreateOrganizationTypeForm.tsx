import {
  OrganizationTypeCreateRequest,
  organizationTypeCreateRequestSchema,
} from '@frankjhub/shared-schema';
import { Button, Form, Input } from '@heroui/react';
import { Controller, useForm } from 'react-hook-form';
import { IoMdClose } from 'react-icons/io';
import { zodResolver } from '@hookform/resolvers/zod';
import { createOrganizationType } from '@/services/organizationType';
import { toast } from 'react-toastify';
import { getAllOrganizationTypesAsync, useDispatch, useSelector } from '@/libs/redux';
import { handleFormServerErrors } from '@frankjhub/shared-utils';

type Props = {
  onClose: () => void;
};
export const CreateOrganizationTypeForm = ({ onClose }: Props) => {
  const dispatch = useDispatch();
  const pagination = useSelector(state => state.organizationType.pagination);
  const {
    handleSubmit,
    control,
    reset,
    setError,
    formState: { isDirty, isSubmitting, errors },
  } = useForm<OrganizationTypeCreateRequest>({
    resolver: zodResolver(organizationTypeCreateRequestSchema),
    mode: 'onTouched',
  });
  const onSubmit = async (value: OrganizationTypeCreateRequest) => {
    const result = await createOrganizationType(value);
    if (result.status === 'success') {
      toast.success(result.message);
      reset({
        name: '',
        description: '',
      });
      onClose();
      dispatch(getAllOrganizationTypesAsync({ pagination }));
    } else {
      handleFormServerErrors(result, setError);
      onClose();
    }
  };
  return (
    <div className="p-4 flex flex-col gap-3">
      {/* Top */}
      <div className="flex justify-between">
        <h1 className="text-xl font-semibold">Create Organization Type</h1>
        <IoMdClose size={20} className="cursor-pointer" onClick={onClose} />
      </div>

      <h2 className="text-gray-400 text-xs">
        Please fill out the form — fields marked with an asterisk (*) are required.
      </h2>
      {/* Form */}
      <Form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col w-full">
          <div className="h-[90px] w-full">
            <Controller
              name="name"
              control={control}
              render={({ field, fieldState }) => (
                <Input
                  label="Orgnization Type Name *"
                  variant="bordered"
                  value={field.value ?? ''}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  isInvalid={!!fieldState.error}
                  errorMessage={fieldState.error?.message}
                  fullWidth
                />
              )}
            />
          </div>
          <div className="h-[90px] w-full">
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
