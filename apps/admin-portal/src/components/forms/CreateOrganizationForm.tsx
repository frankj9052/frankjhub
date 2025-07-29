import {
  OrganizationCreateRequest,
  organizationCreateRequestSchema,
} from '@frankjhub/shared-schema';
import { Button, Form, Input, Select, SelectItem } from '@heroui/react';
import { Controller, useForm } from 'react-hook-form';
import { IoMdClose } from 'react-icons/io';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-toastify';
import {
  getAllOrganizationsAsync,
  getOrganizationTypeOptionsAsync,
  useDispatch,
  useSelector,
} from '@/libs/redux';
import { handleFormServerErrors } from '@frankjhub/shared-utils';
import { createOrganization } from '@/services/organization.service';
import { useEffect } from 'react';

type Props = {
  onClose: () => void;
};
export const CreateOrganizationForm = ({ onClose }: Props) => {
  const dispatch = useDispatch();
  const pagination = useSelector(state => state.organization.pagination);
  const orgTypeOptions = useSelector(state => state.organizationType.options?.data);
  const {
    handleSubmit,
    control,
    reset,
    setError,
    formState: { isDirty, isSubmitting, errors },
  } = useForm<OrganizationCreateRequest>({
    resolver: zodResolver(organizationCreateRequestSchema),
    mode: 'onTouched',
  });
  const onSubmit = async (value: OrganizationCreateRequest) => {
    const result = await createOrganization(value);
    if (result.status === 'success') {
      toast.success(result.message);
      reset({
        name: '',
        description: '',
        orgTypeId: '',
      });
      onClose();
      dispatch(getAllOrganizationsAsync({ pagination }));
    } else {
      handleFormServerErrors(result, setError);
      onClose();
    }
  };
  useEffect(() => {
    dispatch(getOrganizationTypeOptionsAsync());
  }, [dispatch]);
  return (
    <div className="p-4 flex flex-col gap-3">
      {/* Top */}
      <div className="flex justify-between">
        <h1 className="text-xl font-semibold">Create Organization</h1>
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
                  label="Orgnization Name *"
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
          <div className="h-[70px] w-full">
            {orgTypeOptions && (
              <Controller
                name="orgTypeId"
                control={control}
                render={({ field, fieldState }) => (
                  <Select
                    size="sm"
                    fullWidth
                    label="Organization Type *"
                    variant="bordered"
                    selectedKeys={new Set([field.value])}
                    onSelectionChange={value => {
                      const selection = [...value][0];
                      field.onChange(selection);
                    }}
                    onBlur={field.onBlur}
                    isInvalid={!!fieldState.error}
                    errorMessage={fieldState.error?.message}
                  >
                    {orgTypeOptions.map(option => (
                      <SelectItem key={option.id}>{option.name}</SelectItem>
                    ))}
                  </Select>
                )}
              />
            )}
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
