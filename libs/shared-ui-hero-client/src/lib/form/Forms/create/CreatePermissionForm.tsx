import {
  ActionOptionList,
  PermissionCreateRequest,
  permissionCreateRequestSchema,
  ResourceOptionList,
} from '@frankjhub/shared-schema';
import { FrankForm } from '../../Base/FrankForm';
import { Controller, useForm, UseFormSetError } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { BaseSyntheticEvent } from 'react';
import { FrankInput } from '../../FormFields/Input/FrankInput';
import FrankAutocomplete from '../../FormFields/AutoComplete/FrankAutocomplete';
import { FrankSelect } from '../../FormFields/Select/FrankSelect';

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
}

export const CreatePermissionForm = ({
  onSubmit,
  resourceOptionList = [],
  actionOptionList = [],
}: CreatePermissionFormProps) => {
  const {
    control,
    getValues,
    handleSubmit,
    trigger,
    setValue,
    setError,
    formState: { errors },
  } = useForm<PermissionCreateRequest>({
    resolver: zodResolver(permissionCreateRequestSchema),
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
            name="resourceId"
            control={control}
            render={({ field, fieldState }) => (
              <FrankAutocomplete
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
                defaultFilter={true}
                height={48}
              />
            )}
          />
        </div>
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
    </FrankForm>
  );
};
