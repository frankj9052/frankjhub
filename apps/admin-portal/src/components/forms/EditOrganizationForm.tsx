'use client';

import {
  getOrganizationByIdAsync,
  getOrganizationTypeOptionsAsync,
  useDispatch,
  useSelector,
} from '@/libs/redux';
import {
  hardDeleteOrganization,
  restoreOrganization,
  updateOrganization,
} from '@/services/organization.service';
import { organizationUpdateSchema, OrganizationUpdateSchema } from '@frankjhub/shared-schema';
import { handleFormServerErrors } from '@frankjhub/shared-utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { LoadingSpinner } from '../loadings/LodingSpinner';
import { Button, Form, Input, Select, SelectItem } from '@heroui/react';
import { FrankModal } from '@frankjhub/shared-ui-hero-client';

export const EditOrganizationForm = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { id } = useParams();
  const target = useSelector(state => state.organization.target);
  const loading = useSelector(state => state.organization.status);
  const orgTypeOptions = useSelector(state => state.organizationType.options);

  const {
    handleSubmit,
    control,
    reset,
    setError,
    formState: { isDirty, isSubmitting, errors },
  } = useForm<OrganizationUpdateSchema>({
    resolver: zodResolver(organizationUpdateSchema),
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

  const initialValue = useMemo(() => {
    if (!target) return undefined;
    return {
      id: target.id,
      name: target.name,
      description: target.description,
      isActive: target.isActive,
      orgTypeId: target.orgTypeId,
    };
  }, [target]);

  useEffect(() => {
    if (target) {
      reset(initialValue);
    }
  }, [target, initialValue, reset]);

  useEffect(() => {
    if (orgTypeOptions.length === 0) {
      dispatch(getOrganizationTypeOptionsAsync());
    }
  }, [dispatch, orgTypeOptions.length]);

  useEffect(() => {
    if (id && id !== target?.id) {
      dispatch(getOrganizationByIdAsync({ id: String(id) }));
    }
  }, [id, dispatch, target?.id]);

  const onSubmit = (data: OrganizationUpdateSchema) => {
    setOpenModal({
      header: 'Update',
      body: `Are you sure you want to update organization: ${target?.name}`,
      color: 'secondary',
      text: 'Update',
      action: async () => {
        const result = await updateOrganization(data);
        if (result.status === 'success') {
          toast.success(result.data);
          setOpenModal(undefined);
          dispatch(getOrganizationByIdAsync({ id: String(id) }));
        } else if (result.status === 'error') {
          handleFormServerErrors(result, setError);
          setOpenModal(undefined);
        }
      },
    });
  };

  const handleHardDelete = () => {
    if (target) {
      setOpenModal({
        header: 'Delete Permanently',
        body: `Are you sure you want to delete the organization: ${target.name} permanently?`,
        color: 'danger',
        text: 'Delete Permanently',
        action: async () => {
          setLocalLoading(true);
          const result = await hardDeleteOrganization(target.id);
          if (result.status === 'success') {
            toast.success(result.data);
            setOpenModal(undefined);
            router.back();
          } else if (result.status === 'error') {
            toast.error(String(result.error));
          }
          setLocalLoading(false);
        },
      });
    }
  };

  const handleRecovery = () => {
    if (target) {
      setOpenModal({
        header: 'Recover',
        body: `Are you sure you want to recover the organization: ${target.name}?`,
        color: 'success',
        text: 'Recover',
        action: async () => {
          setLocalLoading(true);
          const result = await restoreOrganization(target.id);
          if (result.status === 'success') {
            toast.success(result.data);
            setOpenModal(undefined);
            dispatch(getOrganizationByIdAsync({ id: String(id) }));
          } else if (result.status === 'error') {
            toast.error(String(result.error));
          }
          setLocalLoading(false);
        },
      });
    }
  };

  const handleReset = () => {
    if (target) {
      reset(initialValue);
    }
  };
  if (!target || loading === 'loading') {
    return <LoadingSpinner />;
  }
  return (
    <>
      <Form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6 bg-white p-6 shadow-md rounded-2xl border border-secondary"
      >
        {/* Title */}
        <h2 className="text-2xl font-semibold text-secondary">Edit Organization</h2>
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
                  size="sm"
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
                  size="sm"
                />
              )}
            />
          </div>
          <div className="flex w-full gap-3">
            <Controller
              name="orgTypeId"
              control={control}
              render={({ field, fieldState }) => (
                <Select
                  size="sm"
                  fullWidth
                  label="Organization Type *"
                  variant="bordered"
                  selectedKeys={field.value ? new Set([field.value]) : new Set([])}
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
