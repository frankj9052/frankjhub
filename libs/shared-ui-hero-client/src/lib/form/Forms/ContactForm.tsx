import { Controller, useForm } from 'react-hook-form';
import { FrankForm } from '../Base';
import { ContactCreateRequest, contactCreateRequestSchema } from '@frankjhub/shared-schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { FrankInput } from '../Input/FrankInput';
import { FrankTextArea } from '../Textarea';
import { FrankButton } from '@frankjhub/shared-ui-hero-ssr';
import { FormEvent, useEffect, useState } from 'react';

export interface ContactFormProps {
  width?: number;
  onSubmit?: (value: ContactCreateRequest, e: FormEvent<HTMLFormElement>) => Promise<void> | void;
}
export const ContactForm = ({ width, onSubmit }: ContactFormProps) => {
  const [loading, setLoading] = useState(false);
  const {
    watch,
    trigger,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ContactCreateRequest>({
    resolver: zodResolver(contactCreateRequestSchema),
    mode: 'onTouched',
  });

  const emailVal = watch('email');
  const phoneVal = watch('phone');

  useEffect(() => {
    void trigger(['email', 'phone']);
  }, [emailVal, phoneVal, trigger]);

  return (
    <FrankForm
      style={{
        width: width ? `${width}px` : '100%',
      }}
      className="gap-4"
      onSubmit={handleSubmit(async (value, e) => {
        try {
          setLoading(true);
          await onSubmit?.(value, e as FormEvent<HTMLFormElement>);
        } finally {
          setLoading(false);
        }
      })}
    >
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

      <div className="w-full">
        <Controller
          name="phone"
          control={control}
          render={({ field, fieldState }) => (
            <FrankInput
              label="Phone (optional)"
              variant="bordered"
              type="tel"
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
      <div className="w-full">
        <Controller
          name="subject"
          control={control}
          render={({ field, fieldState }) => (
            <FrankInput
              label="Subject"
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
          name="message"
          control={control}
          render={({ field, fieldState }) => (
            <FrankTextArea
              label="Message"
              variant="bordered"
              isRequired={true}
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

      {/* Honeypot (hidden) */}
      <Controller
        name="hp_company"
        control={control}
        render={({ field, fieldState }) => (
          <FrankInput
            value={field.value ?? ''}
            onValueChange={field.onChange}
            onBlur={field.onBlur}
            isInvalid={!!fieldState.error}
            errorMessage={fieldState.error?.message}
            size="sm"
            tabIndex={-1}
            autoComplete="off"
            className="hidden"
          />
        )}
      />

      {/* Server Errors */}
      {errors?.root?.serverError && (
        <p className="text-danger text-sm pl-[4px] font-semibold">
          {typeof errors.root.serverError.message === 'string'
            ? errors.root.serverError.message
            : JSON.stringify(errors.root.serverError.message)}
        </p>
      )}
      {/* Buttons */}
      <div className="flex gap-4">
        <FrankButton type="submit" variant="solid" color="primary" isLoading={loading}>
          Send Message
        </FrankButton>
      </div>
    </FrankForm>
  );
};
