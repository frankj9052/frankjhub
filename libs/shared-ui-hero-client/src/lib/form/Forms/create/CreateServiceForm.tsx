import { ServiceCreateRequest, serviceCreateRequestSchema } from '@frankjhub/shared-schema';
import { BaseSyntheticEvent } from 'react';
import { Controller, useForm, UseFormSetError } from 'react-hook-form';
import { FrankForm } from '../../Base';
import { zodResolver } from '@hookform/resolvers/zod';
import { FrankInput } from '../../FormFields/Input/FrankInput';
import { FrankButton } from '@frankjhub/shared-ui-hero-ssr';
import { FrankTextArea } from '../../FormFields/Textarea/FrankTextarea';

const defaultValues: ServiceCreateRequest = {
  serviceId: '',
  name: '',
  baseUrl: '',
  serviceSecret: '',
  audPrefix: 'api://',
  routes: [],
  requiredScopes: [],
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
}

export const CreateServiceForm = ({ onSubmit }: CreateServiceFormProps) => {
  const {
    control,
    getValues,
    handleSubmit,
    trigger,
    setValue,
    setError,
    formState: { errors },
  } = useForm<ServiceCreateRequest>({
    resolver: zodResolver(serviceCreateRequestSchema),
    mode: 'onBlur',
    reValidateMode: 'onBlur',
    defaultValues,
  });
  return (
    <FrankForm
      onSubmit={handleSubmit((values, e) => {
        onSubmit(values, setError, e);
      })}
    >
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
        <div>
          <Controller
            name="serviceSecret"
            control={control}
            render={({ field, fieldState }) => (
              <FrankInput
                type="password"
                label="Service Secret"
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
      <div className="w-[200px]">
        <FrankButton type="submit" fullWidth={true} color="primary">
          Submit
        </FrankButton>
      </div>
    </FrankForm>
  );
};
