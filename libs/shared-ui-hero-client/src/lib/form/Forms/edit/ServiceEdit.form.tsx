import { ServiceUpdateRequest, serviceUpdateRequestSchema } from '@frankjhub/shared-schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { BaseSyntheticEvent, useEffect } from 'react';
import { Controller, useForm, UseFormSetError } from 'react-hook-form';
import { FrankForm } from '../../Base/FrankForm';
import { FrankInput } from '../../FormFields/Input/FrankInput';
import { FrankButton, IsLoading } from '@frankjhub/shared-ui-hero-ssr';
import { PasswordInput } from '../../FormFields/Input/PasswordInput';

export interface ServiceEditFormProps {
  onSubmit: (
    values: ServiceUpdateRequest,
    setError: UseFormSetError<ServiceUpdateRequest>,
    event: BaseSyntheticEvent<object, any, any> | undefined
  ) => void;
  onClose?: () => void;
  initialValue?: ServiceUpdateRequest | undefined;
  isLoading?: IsLoading;
}

export const ServiceEditForm = ({
  onSubmit,
  onClose,
  initialValue,
  isLoading,
}: ServiceEditFormProps) => {
  const {
    reset,
    control,
    handleSubmit,
    setError,
    formState: { errors, isDirty, isSubmitting },
  } = useForm<ServiceUpdateRequest>({
    resolver: zodResolver(serviceUpdateRequestSchema),
    mode: 'onBlur',
    reValidateMode: 'onBlur',
  });

  //   详情到位后重置表单
  useEffect(() => {
    console.log('initialValue => ', initialValue);
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

      {/* Buttons */}
      <div className="flex gap-4 justify-end">
        <FrankButton
          type="button"
          // onPress={handleReset}
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
        <FrankButton
          type="button"
          variant="solid"
          color="danger"
          isDisabled={isSubmitting}
          isLoading={isLoading}
          // onPress={handleHardDelete}
        >
          Delete permanently
        </FrankButton>
        <FrankButton
          type="button"
          variant="solid"
          color="success"
          isDisabled={isSubmitting || !initialValue?.deletedAt}
          isLoading={isLoading}
          // onPress={handleRecovery}
        >
          Recovery
        </FrankButton>
      </div>
    </FrankForm>
  );
};
