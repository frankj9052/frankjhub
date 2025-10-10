import {
  ActionOptionList,
  PermissionCreateRequest,
  permissionCreateRequestSchema,
  ResourceOptionList,
} from '@frankjhub/shared-schema';
import { FrankForm } from '../../Base/FrankForm';
import { Controller, useForm, UseFormSetError, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { BaseSyntheticEvent, useEffect, useRef, useState } from 'react';
import { FrankInput } from '../../FormFields/Input/FrankInput';
import { FrankSelect } from '../../FormFields/Select/FrankSelect';
import { FrankTextArea } from '../../FormFields/Textarea/FrankTextarea';
import { FrankButton } from '@frankjhub/shared-ui-hero-ssr';
import { FrankAutocompleteGeneral } from '../../FormFields';

const defaultValues: PermissionCreateRequest = {
  resourceId: '',
  actionIds: [],
  description: undefined,
  fields: undefined,
  condition: undefined,
};

export interface CreatePermissionFormProps {
  onSubmit: (
    values: PermissionCreateRequest,
    setError: UseFormSetError<PermissionCreateRequest>,
    event: BaseSyntheticEvent<object, any, any> | undefined
  ) => void;
  resourceOptionList?: ResourceOptionList;
  actionOptionList?: ActionOptionList;
  onClose?: () => void;
}

export const CreatePermissionForm = ({
  onSubmit,
  resourceOptionList = [],
  actionOptionList = [],
  onClose,
}: CreatePermissionFormProps) => {
  const {
    control,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors, isDirty, isSubmitting },
  } = useForm<PermissionCreateRequest>({
    resolver: zodResolver(permissionCreateRequestSchema),
    mode: 'onBlur',
    reValidateMode: 'onBlur',
    defaultValues,
  });

  // textarea value
  const watchedCondition = useWatch({ control, name: 'condition' });
  const [conditionText, setConditionText] = useState('');
  const hasMountedRef = useRef(false);
  // 同步 RHF 初始值（仅当首次或 reset 后更新）
  useEffect(() => {
    if (!hasMountedRef.current) {
      if (watchedCondition && typeof watchedCondition === 'object') {
        setConditionText(JSON.stringify(watchedCondition, null, 2));
      } else {
        setConditionText('');
      }
      hasMountedRef.current = true;
    }
  }, []);
  return (
    <FrankForm
      onSubmit={handleSubmit((values, e) => {
        onSubmit(values, setError, e);
      })}
    >
      <div className="w-full">
        <div>
          <Controller
            name="resourceId"
            control={control}
            render={({ field, fieldState }) => (
              <FrankAutocompleteGeneral
                label="Select Resource (*)"
                ariaLabel="Select resource"
                variant="bordered"
                selectedKey={field.value ?? ''}
                onSelectionChange={field.onChange}
                onBlur={field.onBlur}
                isInvalid={!!fieldState.error}
                errorMessage={fieldState.error?.message}
                defaultItems={
                  resourceOptionList?.map(item => ({
                    label: item.name,
                    key: item.id,
                  })) ?? []
                }
                size="sm"
              />
            )}
          />
        </div>
      </div>
      <div className="w-full">
        <div>
          <Controller
            name="actionIds"
            control={control}
            render={({ field, fieldState }) => (
              <FrankSelect
                label="Select Actions (*)"
                ariaLabel="select actions"
                selectionMode="multiple"
                selectedKeys={field.value ?? []}
                onSelectionChange={sharedSelection => {
                  const selected: string[] =
                    sharedSelection === 'all'
                      ? actionOptionList?.map(item => item.id) ?? []
                      : Array.from(sharedSelection).map(key => String(key));

                  field.onChange(selected);
                }}
                onBlur={field.onBlur}
                isInvalid={!!fieldState.error}
                errorMessage={fieldState.error?.message}
                items={
                  actionOptionList?.map(item => ({
                    label: item.name,
                    key: item.id,
                  })) ?? []
                }
                size="sm"
                disallowEmptySelection={true}
                variant="bordered"
              />
            )}
          />
        </div>
      </div>
      <div className="w-full">
        <div>
          <Controller
            name="fields"
            control={control}
            render={({ field, fieldState }) => (
              <FrankInput
                label="Fields (Use commas to separate)"
                variant="bordered"
                value={Array.isArray(field.value) ? field.value.join(', ') : ''}
                onValueChange={value => {
                  const fields = value.split(',').map(item => item.trim());
                  field.onChange(fields);
                }}
                onBlur={field.onBlur}
                isInvalid={!!fieldState.error}
                errorMessage={fieldState.error?.message}
                fullWidth
                size="sm"
              />
            )}
          />
        </div>
      </div>
      <div className="w-full">
        <div>
          <Controller
            name="condition"
            control={control}
            render={({ field, fieldState }) => {
              return (
                <FrankTextArea
                  label="Condition (JSON format)"
                  variant="bordered"
                  value={conditionText}
                  onValueChange={(input: string) => {
                    setConditionText(input);
                    try {
                      const parsed = input.trim() === '' ? null : JSON.parse(input);
                      field.onChange(parsed);
                      clearErrors('condition');
                    } catch {
                      field.onChange(undefined); // 表单上保留 undefined/null
                      setError('condition', { message: 'Invalid JSON format' });
                    }
                  }}
                  onBlur={field.onBlur}
                  isInvalid={!!fieldState.error}
                  errorMessage={fieldState.error?.message ?? undefined}
                  size="sm"
                  minRows={4}
                  maxRows={4}
                />
              );
            }}
          />
        </div>
      </div>
      <div className="w-full">
        <div>
          <Controller
            name="description"
            control={control}
            render={({ field, fieldState }) => (
              <FrankInput
                label="Description"
                variant="bordered"
                value={field.value ?? ''}
                onValueChange={field.onChange}
                onBlur={field.onBlur}
                isInvalid={!!fieldState.error}
                errorMessage={fieldState.error?.message}
                fullWidth
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
        <FrankButton
          type="button"
          onPress={onClose}
          variant="ghost"
          className="text-secondary"
          isDisabled={!isDirty || isSubmitting}
        >
          Cancel
        </FrankButton>
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
