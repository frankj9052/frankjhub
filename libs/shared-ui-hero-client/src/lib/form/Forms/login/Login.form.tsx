import { Controller, useForm } from 'react-hook-form';
import { FrankForm } from '../../Base';
import { LoginRequest, loginRequestSchema } from '@frankjhub/shared-schema';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  ButtonColor,
  FrankButton,
  FrankLink,
  OnSubmitForForm,
} from '@frankjhub/shared-ui-hero-ssr';
import { FrankInput, PasswordInput } from '../../FormFields';

export interface LoginFormProps {
  onSubmit: OnSubmitForForm<LoginRequest>;
  registerUrl?: string;
  forgotUrl?: string;
  color?: ButtonColor;
}

export const LoginForm = ({
  onSubmit,
  forgotUrl,
  registerUrl,
  color = 'primary',
}: LoginFormProps) => {
  const {
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginRequest>({
    resolver: zodResolver(loginRequestSchema),
    mode: 'onBlur',
    reValidateMode: 'onBlur',
    defaultValues: {
      email: '',
      password: '',
    },
  });
  return (
    <FrankForm
      onSubmit={handleSubmit((values, e) => {
        onSubmit(values, setError, e);
      })}
    >
      <div className="w-full">
        <Controller
          name="email"
          control={control}
          render={({ field, fieldState }) => (
            <FrankInput
              label="Email"
              type="email"
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
      <div className="w-full">
        <Controller
          name="password"
          control={control}
          render={({ field, fieldState }) => (
            <PasswordInput
              label="Password"
              value={field.value ?? ''}
              onValueChange={field.onChange}
              onBlur={field.onBlur}
              isInvalid={!!fieldState.error}
              errorMessage={fieldState.error?.message}
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
      {/* Buttons */}
      <div className="w-full">
        <FrankButton
          type="submit"
          fullWidth={true}
          color={color}
          className="font-semibold"
          isLoading={isSubmitting}
        >
          Login
        </FrankButton>
      </div>
      {/* others */}
      <div className="flex justify-between w-full">
        {forgotUrl && (
          <FrankLink
            href={forgotUrl}
            className="cursor-pointer text-sm opacity-50"
            color="foreground"
          >
            Forgot Password
          </FrankLink>
        )}
        {registerUrl && (
          <FrankLink
            href={registerUrl}
            className="cursor-pointer text-sm opacity-50"
            color="foreground"
          >
            Register
          </FrankLink>
        )}
      </div>
    </FrankForm>
  );
};
