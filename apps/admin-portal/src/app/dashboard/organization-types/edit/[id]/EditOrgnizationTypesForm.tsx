import { LoadingSpinner } from '@/components/loadings/LodingSpinner';
import { getOrganizationTypeByIdAsync, useDispatch, useSelector } from '@/libs/redux';
import {
  hardDeleteOrganizationType,
  restoreOrganizationType,
  updateOrganizationType,
} from '@/services/organizationType';
import {
  OrganizationTypeUpdateRequest,
  organizationTypeUpdateRequestSchema,
} from '@frankjhub/shared-schema';
import { FrankModal } from '@frankjhub/shared-ui-hero-client';
import { handleFormServerErrors } from '@frankjhub/shared-utils';
import { Button, Form, Input, Select, SelectItem } from '@heroui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

export const EditOrganizationTypesForm = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { id } = useParams();
  const orgType = useSelector(state => state.organizationType.target?.data);
  const loading = useSelector(state => state.organizationType.status);
  const {
    handleSubmit,
    control,
    reset,
    setError,
    formState: { isDirty, isSubmitting, errors },
  } = useForm<OrganizationTypeUpdateRequest>({
    resolver: zodResolver(organizationTypeUpdateRequestSchema),
    mode: 'onTouched',
  });
  const [localLoading, setLocalLoading] = useState(false);
  const [openModal, setOpenModal] = useState<
    | {
        header: string;
        body: string;
        action: () => void;
        color: 'danger' | 'success' | 'secondary';
        text: 'Delete Permanently' | 'Recover' | 'Update';
      }
    | undefined
  >(undefined);

  const initialOrgTypeValue = useMemo(() => {
    if (!orgType) return undefined;
    return {
      id: orgType.id,
      name: orgType.name,
      description: orgType.description,
      isActive: orgType.isActive,
    };
  }, [orgType]);

  useEffect(() => {
    if (orgType) {
      reset(initialOrgTypeValue);
    }
  }, [orgType, initialOrgTypeValue, reset]);

  useEffect(() => {
    if (id) {
      dispatch(getOrganizationTypeByIdAsync({ id: String(id) }));
    }
  }, [id, dispatch]);

  const onSubmit = (data: OrganizationTypeUpdateRequest) => {
    setOpenModal({
      header: 'Update',
      body: `Are you sure you want to update organization type: ${orgType?.name}`,
      color: 'secondary',
      text: 'Update',
      action: async () => {
        const result = await updateOrganizationType(data);
        if (result.status === 'success') {
          toast.success(result.message);
          setOpenModal(undefined);
          dispatch(getOrganizationTypeByIdAsync({ id: String(id) }));
        } else {
          handleFormServerErrors(result, setError);
          setOpenModal(undefined);
        }
      },
    });
  };

  const handleReset = () => {
    if (orgType) {
      reset(initialOrgTypeValue);
    }
  };
  if (!orgType || loading === 'loading') {
    return <LoadingSpinner />;
  }
  return (
    <>
      <Form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6 bg-white p-6 shadow-md rounded-2xl border border-secondary"
      >
        {/* Title */}
        <h2 className="text-2xl font-semibold text-secondary">Edit Organization Type</h2>
        {/* Form */}
        <div className="flex flex-col gap-3 w-full">
          <div className="flex w-full gap-3">
            <Controller
              name="name"
              control={control}
              render={({ field, fieldState }) => (
                <Input
                  label="Name"
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
                />
              )}
            />
          </div>
          <div className="flex w-full gap-3">
            <Controller
              name="isActive"
              control={control}
              render={({ field, fieldState }) => (
                <Select
                  aria-label="Select isActive"
                  label="IsActive"
                  variant="bordered"
                  selectedKeys={typeof field.value === 'boolean' ? [String(field.value)] : []}
                  onChange={e => field.onChange(e.target.value === 'true')}
                  isInvalid={!!fieldState.error}
                  errorMessage={fieldState.error?.message}
                >
                  {['true', 'false'].map(item => (
                    <SelectItem key={item}>
                      {item.charAt(0).toUpperCase() + item.slice(1)}
                    </SelectItem>
                  ))}
                </Select>
              )}
            />
          </div>
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
            onPress={() => {
              setOpenModal({
                header: 'Delete Permanently',
                body: `Are you sure you want to delete the orgniazation type: ${orgType.name} permanently?`,
                color: 'danger',
                text: 'Delete Permanently',
                action: async () => {
                  setLocalLoading(true);
                  const result = await hardDeleteOrganizationType(orgType.id);
                  if (result.status === 'success') {
                    toast.success(result.message);
                    setOpenModal(undefined);
                    router.back();
                  } else {
                    toast.error(String(result.message));
                  }
                  setLocalLoading(false);
                },
              });
            }}
          >
            Delete permanently
          </Button>
          <Button
            type="button"
            variant="solid"
            color="success"
            isDisabled={isSubmitting || !orgType.deletedAt}
            isLoading={localLoading}
            onPress={() => {
              setOpenModal({
                header: 'Recover',
                body: `Are you sure you want to recover the organization type: ${orgType.name}?`,
                color: 'success',
                text: 'Recover',
                action: async () => {
                  setLocalLoading(true);
                  const result = await restoreOrganizationType(orgType.id);
                  if (result.status === 'success') {
                    toast.success(result.message);
                    setOpenModal(undefined);
                    dispatch(getOrganizationTypeByIdAsync({ id: String(id) }));
                  } else {
                    toast.error(String(result.message));
                  }
                  setLocalLoading(false);
                },
              });
            }}
          >
            Recovery
          </Button>
        </div>
      </Form>
      <FrankModal
        isOpen={!!openModal}
        onClose={() => {
          setOpenModal(undefined);
        }}
        header={openModal?.header}
        backdrop="opaque"
        body={openModal?.body}
        footerButtons={[
          {
            color: 'default',
            variant: 'light',
            customizeContent: <div className="h-8 flex items-center justify-center">Cancel</div>,
            onPress: () => {
              setOpenModal(undefined);
            },
            isLoading: localLoading,
          },
          {
            color: openModal?.color,
            variant: 'solid',
            customizeContent: (
              <div className="h-8 flex items-center justify-center">{openModal?.text}</div>
            ),
            onPress: openModal?.action,
            isLoading: localLoading,
          },
        ]}
      />
    </>
  );
};
