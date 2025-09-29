import { Controller, FieldValues, UseFormReturn } from 'react-hook-form';
import { FrankForm } from '../../Base';
import { OnSubmit } from '@frankjhub/shared-ui-hero-ssr';
import { FrankInput } from '../../FormFields/Input/FrankInput';

export interface RootRegisterFormProps {
  methods?: UseFormReturn<FieldValues, any, FieldValues>;
  onSubmit?: OnSubmit;
}

export const RootRegisterForm = ({ methods, onSubmit }: RootRegisterFormProps) => {
  if (!methods) {
    return null;
  }
  const { control } = methods;
  return (
    <FrankForm onSubmit={onSubmit}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
        <div>
          <Controller
            name="name"
            control={control}
            render={({ field, fieldState }) => (
              <FrankInput
                label="Name"
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
              />
            )}
          />
        </div>
      </div>
    </FrankForm>
  );
};
