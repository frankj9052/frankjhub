'use client';
import { LoadingSpinner } from '@/components/loadings/LodingSpinner';
import { getResourceByIdAsync, useDispatch, useSelector } from '@/libs/redux';
import { hardDeleteResource, restoreResource, updateResource } from '@/services/resource.service';
import { ResourceUpdateRequest, resourceUpdateRequestSchema } from '@frankjhub/shared-schema';
import { FrankModal } from '@frankjhub/shared-ui-hero-client';
import { handleFormServerErrors } from '@frankjhub/shared-utils';
import { Button, Form, Input, Select, SelectItem } from '@heroui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

export const EditResourceForm = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { id } = useParams();
  const target = useSelector(state => state.resource.target?.data);
  const loading = useSelector(state => state.resource.status);
  const {
    handleSubmit,
    control,
    reset,
    setError,
    formState: { isDirty, isSubmitting, errors },
  } = useForm<ResourceUpdateRequest>({
    resolver: zodResolver(resourceUpdateRequestSchema),
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
    };
  }, [target]);

  useEffect(() => {
    if (target) {
      reset(initialValue);
    }
  }, [target, initialValue, reset]);

  useEffect(() => {
    if (id && id !== target?.id) {
      dispatch(getResourceByIdAsync({ id: String(id) }));
    }
  }, [id, dispatch, target?.id]);

  const onSubmit = (data: ResourceUpdateRequest) => {
    setOpenModal({
      header: 'Update',
      body: `Are you sure you want to update resource: ${target?.name}?`,
      color: 'secondary',
      text: 'Update',
      action: async () => {
        const result = await updateResource(data);
        if (result.status === 'success') {
          toast.success(result.message);
          setOpenModal(undefined);
          dispatch(getResourceByIdAsync({ id: String(id) }));
        } else {
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
        body: `Are you sure you want to delete the resource: ${target.name} permanently?`,
        color: 'danger',
        text: 'Delete Permanently',
        action: async () => {
          setLocalLoading(true);
          const result = await hardDeleteResource(target.id);
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
    }
  };

  const handleRecovery = () => {
    if (target) {
      setOpenModal({
        header: 'Recover',
        body: `Are you sure you want to recover the resource: ${target.name}?`,
        color: 'success',
        text: 'Recover',
        action: async () => {
          setLocalLoading(true);
          const result = await restoreResource(target.id);
          if (result.status === 'success') {
            toast.success(result.message);
            setOpenModal(undefined);
            dispatch(getResourceByIdAsync({ id: String(id) }));
          } else {
            toast.error(String(result.message));
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
        <h2 className="text-2xl font-semibold text-secondary">Edit Resource</h2>
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
