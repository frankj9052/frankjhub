import { Controller, useForm, UseFormSetError } from 'react-hook-form';
import { FrankForm } from '../../Base';
import { FrankButton } from '@frankjhub/shared-ui-hero-ssr';
import { FrankInput } from '../../FormFields/Input/FrankInput';
import { AcceptInvitationRequest, acceptInvitationRequestSchema } from '@frankjhub/shared-schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { BaseSyntheticEvent, useEffect } from 'react';
import { Input } from '@heroui/react';

export interface RootRegisterFormProps {
  onSubmit: (
    values: AcceptInvitationRequest,
    setError: UseFormSetError<AcceptInvitationRequest>,
    event: BaseSyntheticEvent<object, any, any> | undefined
  ) => void;
  token?: string | undefined | null;
}

export const RootRegisterForm = ({ onSubmit, token }: RootRegisterFormProps) => {
  const {
    control,
    getValues,
    handleSubmit,
    trigger,
    setValue,
    setError,
    formState: { errors },
  } = useForm<AcceptInvitationRequest>({
    resolver: zodResolver(acceptInvitationRequestSchema),
    mode: 'onBlur',
    reValidateMode: 'onBlur',
    defaultValues: {
      userName: '',
      email: '',
      password: '',
      rePassword: '',
      firstName: '',
      lastName: '',
      middleName: null,
      token: token ?? undefined,
    },
  });

  // token check
  useEffect(() => {
    if (token && token.length > 0) {
      setValue('token', token, {
        shouldDirty: false,
        shouldValidate: false,
        shouldTouch: false,
      });
    } else {
      setError('root.serverError', {
        type: 'required',
        message: 'Token is missing!',
      });
    }
  }, [setValue, token, setError]);

  return (
    <FrankForm
      onSubmit={handleSubmit((values, e) => {
        onSubmit(values, setError, e);
      })}
    >
      {/* User Name & Email */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
        <div>
          <Controller
            name="userName"
            control={control}
            render={({ field, fieldState }) => (
              <FrankInput
                label="User Name"
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
            name="email"
            control={control}
            render={({ field, fieldState }) => (
              <FrankInput
                label="Email"
                variant="bordered"
                type="email"
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
      {/* Password */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
        <div>
          <Controller
            name="password"
            control={control}
            render={({ field, fieldState }) => (
              <Input
                label="Password"
                variant="bordered"
                type="password"
                value={field.value ?? ''}
                onValueChange={field.onChange}
                onBlur={async () => {
                  trigger(['password', 'rePassword']);
                  field.onBlur();
                }}
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
            name="rePassword"
            control={control}
            rules={{
              validate: val => val === getValues('password') || "Passwords don't match",
            }}
            render={({ field, fieldState }) => (
              <Input
                label="Re-Password"
                variant="bordered"
                type="password"
                value={field.value ?? ''}
                onValueChange={field.onChange}
                onBlur={async () => {
                  trigger(['password', 'rePassword']);
                  field.onBlur();
                }}
                isInvalid={!!fieldState.error}
                errorMessage={fieldState.error?.message}
                size="sm"
                isRequired={true}
              />
            )}
          />
        </div>
      </div>
      {/* Name */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
        <div>
          <Controller
            name="lastName"
            control={control}
            render={({ field, fieldState }) => (
              <FrankInput
                label="Last Name"
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
            name="firstName"
            control={control}
            render={({ field, fieldState }) => (
              <FrankInput
                label="First Name"
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
            name="middleName"
            control={control}
            render={({ field, fieldState }) => (
              <FrankInput
                label="Middle Name"
                variant="bordered"
                value={field.value ?? ''}
                onValueChange={value => {
                  if (value.length > 0) {
                    field.onChange(value);
                  } else {
                    field.onChange(null);
                  }
                }}
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
