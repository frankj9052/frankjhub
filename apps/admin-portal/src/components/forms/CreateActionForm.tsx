import { getActionListAsync, useDispatch, useSelector } from '@/libs/redux';
import { createAction } from '@/services/action.service';
import { ActionCreateRequest, actionCreateRequestSchema } from '@frankjhub/shared-schema';
import { handleFormServerErrors } from '@frankjhub/shared-utils';
import { Button, Form, Input } from '@heroui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { IoMdClose } from 'react-icons/io';
import { toast } from 'react-toastify';

type Props = {
  onClose: () => void;
};
export const CreateActionForm = ({ onClose }: Props) => {
  const dispatch = useDispatch();
  const pagination = useSelector(state => state.action.pagination);
  const {
    handleSubmit,
    control,
    reset,
    setError,
    formState: { isDirty, isSubmitting, errors },
  } = useForm<ActionCreateRequest>({
    resolver: zodResolver(actionCreateRequestSchema),
    mode: 'onTouched',
  });
  const onSubmit = async (value: ActionCreateRequest) => {
    const result = await createAction(value);
    if (result.status === 'success') {
      toast.success(result.data.message);
      reset({
        name: '',
        description: '',
      });
      onClose();
      dispatch(getActionListAsync({ pagination }));
    } else if (result.status === 'error') {
      handleFormServerErrors(result, setError);
      onClose();
    }
  };

  return (
    <div className="p-4 flex flex-col gap-3">
      {/* Top */}
      <div className="flex justify-between">
        <h1 className="text-xl font-semibold">Create Action</h1>
        <IoMdClose size={20} className="cursor-pointer" onClick={onClose} />
      </div>

      <h2 className="text-gray-400 text-xs">
        Please fill out the form — fields marked with an asterisk (*) are required.
      </h2>
      {/* Form */}
      <Form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col w-full">
          <div className="h-[70px] w-full">
            <Controller
              name="name"
              control={control}
              render={({ field, fieldState }) => (
                <Input
                  label="Action Name *"
                  variant="bordered"
                  value={field.value ?? ''}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  isInvalid={!!fieldState.error}
                  errorMessage={fieldState.error?.message}
                  fullWidth
                  size="sm"
                />
              )}
            />
          </div>
          <div className="h-[70px] w-full">
            <Controller
              name="description"
              control={control}
              render={({ field, fieldState }) => (
                <Input
                  label="Description"
                  variant="bordered"
                  value={field.value ?? ''}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  isInvalid={!!fieldState.error}
                  errorMessage={fieldState.error?.message}
                  fullWidth
                  size="sm"
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
        </div>
        {/* Buttons */}
        <div className="flex gap-4">
          <Button
            type="button"
            onPress={onClose}
            variant="ghost"
            className="text-secondary"
            isDisabled={!isDirty || isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="bg-secondary text-white"
            isDisabled={!isDirty}
            isLoading={isSubmitting}
          >
            Create
          </Button>
        </div>
      </Form>
    </div>
  );
};
