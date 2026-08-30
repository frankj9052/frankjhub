import {
  PermissionOptionList,
  ServiceCreateRequest,
  serviceCreateRequestSchema,
  ServiceRouteCreateRequest,
} from '@frankjhub/shared-schema';
import { BaseSyntheticEvent, useState } from 'react';
import { Controller, useForm, UseFormSetError } from 'react-hook-form';
import { FrankForm } from '../../Base';
import { zodResolver } from '@hookform/resolvers/zod';
import { FrankInput } from '../../FormFields/Input/FrankInput';
import { FrankButton } from '@frankjhub/shared-ui-hero-ssr';
import { FrankTextArea } from '../../FormFields/Textarea/FrankTextarea';
import { AddPermission, AddRoute } from '../add';
import { PasswordInput } from '../../FormFields';

const defaultValues: ServiceCreateRequest = {
  serviceId: '',
  name: '',
  baseUrl: '',
  serviceSecret: '',
  audPrefix: 'api://',
  baselineRequiredScopes: [],
  description: '',
  healthCheckPath: '',
  ownerTeam: '',
};

export interface CreateServiceFormProps {
  onSubmit: (
    values: ServiceCreateRequest,
    setError: UseFormSetError<ServiceCreateRequest>,
    event: BaseSyntheticEvent<object, any, any> | undefined
  ) => void;
  onClose?: () => void;
  permissionOptionList?: PermissionOptionList;
}

export const CreateServiceForm = ({
  onSubmit,
  onClose,
  permissionOptionList,
}: CreateServiceFormProps) => {
  const {
    control,
    handleSubmit,
    setError,
    watch,
    formState: { errors, isDirty, isSubmitting },
  } = useForm<ServiceCreateRequest>({
    resolver: zodResolver(serviceCreateRequestSchema),
    mode: 'onBlur',
    reValidateMode: 'onBlur',
    defaultValues,
  });

  const serviceId = watch('serviceId');

  // 单独管理 routes 状态（因为 ServiceCreateRequest 中不包含 routes）
  const [routes, setRoutes] = useState<ServiceRouteCreateRequest[]>([]);

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
                isRequired={true}
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
                isRequired={true}
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
                isRequired={true}
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
            render={({ field, fieldState }) => (
              <PasswordInput
                label="Service Secret"
                value={field.value ?? ''}
                onValueChange={field.onChange}
                onBlur={field.onBlur}
                isInvalid={!!fieldState.error}
                errorMessage={fieldState.error?.message}
              />
            )}
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
                isRequired={true}
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
                isRequired={false}
              />
            )}
          />
        </div>
      </div>
      {/* Require scopes */}
      <div className="w-full">
        <div>
          <Controller
            name="baselineRequiredScopes"
            control={control}
            render={({ field, fieldState }) => (
              <AddPermission
                permissionOptionList={permissionOptionList}
                value={field.value ?? []}
                onChange={field.onChange}
                isDisabled={isSubmitting}
                errorMessage={fieldState.error?.message}
              />
            )}
          />
        </div>
      </div>
      {/* routes */}
      <div className="w-full bg-gray-100 p-4 rounded-lg">
        <div>
          <AddRoute
            serviceId={serviceId || ''}
            routes={routes}
            onChange={setRoutes}
            errorMessage={undefined}
            isDisabled={isSubmitting}
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
      {errors?.root?.serverError && (
        <p className="text-danger text-sm">
          {typeof errors.root.serverError.message === 'string'
            ? errors.root.serverError.message
            : JSON.stringify(errors.root.serverError.message)}
        </p>
      )}
      {/* Buttons */}
      <div className="flex gap-4">
        {onClose && (
          <FrankButton
            type="button"
            onPress={onClose}
            variant="ghost"
            className="text-secondary"
            isDisabled={!isDirty || isSubmitting}
          >
            Cancel
          </FrankButton>
        )}

        <FrankButton
          type="submit"
          className="bg-secondary text-white"
          isDisabled={!isDirty}
          isLoading={isSubmitting}
        >
          Create
        </FrankButton>
      </div>
    </FrankForm>
  );
};
