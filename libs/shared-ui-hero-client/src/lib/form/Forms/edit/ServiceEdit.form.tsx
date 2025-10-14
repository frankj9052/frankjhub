import {
  PermissionOptionList,
  ServiceUpdateRequest,
  serviceUpdateRequestSchema,
} from '@frankjhub/shared-schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { BaseSyntheticEvent, useEffect } from 'react';
import { Controller, useForm, UseFormSetError } from 'react-hook-form';
import { FrankForm } from '../../Base/FrankForm';
import { FrankInput } from '../../FormFields/Input/FrankInput';
import { FrankButton, IsLoading } from '@frankjhub/shared-ui-hero-ssr';
import { PasswordInput } from '../../FormFields/Input/PasswordInput';
import { AddPermission } from '../add/AddPermission';
import { AddRoute } from '../add/AddRoute';
import { FrankTextArea } from '../../FormFields/Textarea/FrankTextarea';
import { ActiveChip, DeletedChip } from '../../../dataDisplay';
import { ActiveSwitch } from '../../FormFields';

export interface ServiceEditFormProps {
  onSubmit: (
    values: ServiceUpdateRequest,
    setError: UseFormSetError<ServiceUpdateRequest>,
    event: BaseSyntheticEvent<object, any, any> | undefined
  ) => void;
  initialValue?: ServiceUpdateRequest | undefined;
  isLoading?: IsLoading;
  permissionOptionList?: PermissionOptionList;
  handleHardDelete?: (id: string) => void;
  handleRecovery?: (id: string) => void;
}

export const ServiceEditForm = ({
  onSubmit,
  initialValue,
  isLoading,
  permissionOptionList,
  handleHardDelete,
  handleRecovery,
}: ServiceEditFormProps) => {
  const {
    reset,
    control,
    handleSubmit,
    setError,
    formState: { isDirty, isSubmitting },
  } = useForm<ServiceUpdateRequest>({
    resolver: zodResolver(serviceUpdateRequestSchema),
    mode: 'onBlur',
    reValidateMode: 'onBlur',
  });

  // 重置表格
  const handleReset = () => {
    if (initialValue) {
      reset(initialValue);
    }
  };

  //   详情到位后重置表单
  useEffect(() => {
    if (initialValue) {
      reset(initialValue);
    }
  }, [initialValue, reset]);
  return (
    <FrankForm
      onSubmit={handleSubmit((values, e) => {
        onSubmit(values, setError, e);
      })}
    >
      {/* serviceId & serviceName */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
        <div>
          <Controller
            name="serviceId"
            control={control}
            render={({ field, fieldState }) => (
              <FrankInput
                label="ServiceId"
                variant="bordered"
                value={field.value ?? ''}
                onValueChange={field.onChange}
                onBlur={field.onBlur}
                isInvalid={!!fieldState.error}
                errorMessage={fieldState.error?.message}
                size="sm"
              />
            )}
          />
        </div>
        <div>
          <Controller
            name="name"
            control={control}
            render={({ field, fieldState }) => (
              <FrankInput
                label="Service Name"
                variant="bordered"
                value={field.value ?? ''}
                onValueChange={field.onChange}
                onBlur={field.onBlur}
                isInvalid={!!fieldState.error}
                errorMessage={fieldState.error?.message}
                size="sm"
              />
            )}
          />
        </div>
      </div>

      {/* BaseUrl */}
      <div className="w-full">
        <div>
          <Controller
            name="baseUrl"
            control={control}
            render={({ field, fieldState }) => (
              <FrankInput
                label="Base URL"
                variant="bordered"
                value={field.value ?? ''}
                onValueChange={field.onChange}
                onBlur={field.onBlur}
                isInvalid={!!fieldState.error}
                errorMessage={fieldState.error?.message}
                size="sm"
              />
            )}
          />
        </div>
      </div>

      {/* ServiceSecret & AudPrefix & OwnerTeam */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
        <div>
          <Controller
            name="serviceSecret"
            control={control}
            render={({ field, fieldState }) => {
              return (
                <PasswordInput
                  label="Service Secret"
                  value={field.value ?? ''}
                  onValueChange={field.onChange}
                  onBlur={field.onBlur}
                  isInvalid={!!fieldState.error}
                  errorMessage={fieldState.error?.message}
                  isRequired={false}
                />
              );
            }}
          />
        </div>
        <div>
          <Controller
            name="audPrefix"
            control={control}
            render={({ field, fieldState }) => (
              <FrankInput
                label="Audience Prefix"
                variant="bordered"
                value={field.value ?? ''}
                onValueChange={field.onChange}
                onBlur={field.onBlur}
                isInvalid={!!fieldState.error}
                errorMessage={fieldState.error?.message}
                size="sm"
              />
            )}
          />
        </div>
        <div>
          <Controller
            name="ownerTeam"
            control={control}
            render={({ field, fieldState }) => (
              <FrankInput
                label="Owner Team"
                variant="bordered"
                value={field.value ?? ''}
                onValueChange={field.onChange}
                onBlur={field.onBlur}
                isInvalid={!!fieldState.error}
                errorMessage={fieldState.error?.message}
                size="sm"
              />
            )}
          />
        </div>
      </div>

      {/* HealthCheckPath */}
      <div className="w-full">
        <div>
          <Controller
            name="healthCheckPath"
            control={control}
            render={({ field, fieldState }) => (
              <FrankInput
                label="Health Check Path"
                variant="bordered"
                value={field.value ?? ''}
                onValueChange={field.onChange}
                onBlur={field.onBlur}
                isInvalid={!!fieldState.error}
                errorMessage={fieldState.error?.message}
                size="sm"
                isRequired={false}
              />
            )}
          />
        </div>
      </div>

      {/* Description */}
      <div className="w-full">
        <div>
          <Controller
            name="description"
            control={control}
            render={({ field, fieldState }) => (
              <FrankTextArea
                label="Description"
                variant="bordered"
                isRequired={false}
                minRows={6}
                maxRows={6}
                value={field.value ?? ''}
                onValueChange={field.onChange}
                onBlur={field.onBlur}
                isInvalid={!!fieldState.error}
                errorMessage={fieldState.error?.message}
                size="sm"
              />
            )}
          />
        </div>
      </div>

      {/* Require scopes */}
      <div className="w-full rounded-lg bg-gray-50 p-3">
        <h1 className="font-semibold">Edit Basic Permission</h1>
        <div>
          <Controller
            name="requiredScopes"
            control={control}
            render={({ field, fieldState }) => (
              <AddPermission
                permissionOptionList={permissionOptionList ?? []}
                value={field.value}
                onChange={field.onChange}
                isDisabled={isSubmitting}
                errorMessage={fieldState.error?.message}
              />
            )}
          />
        </div>
      </div>

      {/* routes */}
      <div className="w-full bg-gray-50 p-4 rounded-lg">
        <div>
          <Controller
            name="routes"
            control={control}
            render={({ field, fieldState }) => {
              const value = field.value
                ? field.value.map(item => ({
                    path: item.path,
                    methods: item.methods,
                    requiredScopes: item.requiredScopes ?? [],
                    rewrite: item.rewrite,
                    rateLimit: item.rateLimit,
                  }))
                : [];
              return (
                <AddRoute
                  routes={value}
                  onChange={field.onChange}
                  permissionOptionList={permissionOptionList}
                  errorMessage={fieldState.error?.message}
                  isDisabled={isSubmitting}
                />
              );
            }}
          />
        </div>
      </div>

      {/* Active Switch */}
      <div className="w-full mt-3">
        <div>
          <Controller
            name="isActive"
            control={control}
            render={({ field }) => (
              <ActiveSwitch
                isSelected={field.value ?? false}
                onValueChange={field.onChange}
                color="secondary"
              />
            )}
          />
        </div>
      </div>

      {/* Current Status */}
      <h1 className="font-semibold">Current Status:</h1>
      <div className="flex gap-3">
        <ActiveChip isActive={initialValue?.isActive} />
        <DeletedChip isDeleted={!!initialValue?.deletedAt} />
      </div>
      {/* Buttons */}
      <div className="flex gap-4 justify-end mt-3">
        <FrankButton
          type="button"
          onPress={handleReset}
          variant="ghost"
          className="text-secondary"
          isDisabled={!isDirty || isSubmitting}
        >
          Reset
        </FrankButton>
        <FrankButton
          type="submit"
          className="bg-secondary text-white"
          isDisabled={!isDirty}
          isLoading={isSubmitting}
        >
          Update
        </FrankButton>
        {handleHardDelete && (
          <FrankButton
            type="button"
            variant="solid"
            color="danger"
            isDisabled={isSubmitting}
            isLoading={isLoading}
            onPress={() => {
              if (handleHardDelete && initialValue) {
                handleHardDelete(initialValue.id);
              }
            }}
          >
            Delete permanently
          </FrankButton>
        )}
        {handleRecovery && (
          <FrankButton
            type="button"
            variant="solid"
            color="success"
            isDisabled={isSubmitting || !initialValue?.deletedAt}
            isLoading={isLoading}
            onPress={() => {
              if (handleRecovery && initialValue) {
                handleRecovery(initialValue.id);
              }
            }}
          >
            Recovery
          </FrankButton>
        )}
      </div>
    </FrankForm>
  );
};
