'use client';

import { Gender, Honorific, userEditSchema, UserEditSchema } from '@frankjhub/shared-schema';
import { Input, Button, Form, Select, SelectItem } from '@heroui/react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useDispatch, useSelector } from '@/libs/redux';
import { useParams } from 'next/navigation';
import { useEffect, useMemo } from 'react';
import { getUserAllProfileByIdAsync } from '@/libs/redux/slices/usersSlice/thunk';
import { format, subYears } from 'date-fns';
import { testDelay } from '@frankjhub/shared-utils';
import { GoBackButton } from '@/components/buttons/GoBackButton';
import { LoadingSpinner } from '@/components/loadings/LodingSpinner';

export default function EditUserPage() {
  const dispatch = useDispatch();
  const { id } = useParams();
  const {
    handleSubmit,
    control,
    reset,
    formState: { isDirty, isSubmitting },
  } = useForm<UserEditSchema>({
    resolver: zodResolver(userEditSchema),
    mode: 'onTouched',
  });

  const user = useSelector(state => state.users.targetUser);
  const loading = useSelector(state => state.users.status);

  const initialUserValue = useMemo(() => {
    if (!user) return undefined;
    return {
      userName: user.userName,
      email: user.email ?? '',
      firstName: user.firstName,
      lastName: user.lastName ?? '',
      middleName: user.middleName ?? '',
      gender: user.gender,
      dateOfBirth: format(new Date(user.dateOfBirth ?? ''), 'yyyy-MM-dd'),
      honorific: user.honorific,
      avatarImage: user.avatarImage ?? '',
      isActive: user.isActive,
      emailVerified: user.emailVerified,
      profileCompleted: user.profileCompleted,
    };
  }, [user]);

  useEffect(() => {
    if (user) {
      reset(initialUserValue);
    }
  }, [user, initialUserValue, reset]);

  useEffect(() => {
    if (id) {
      dispatch(getUserAllProfileByIdAsync({ id: String(id) }));
    }
  }, [id, dispatch]);

  const onSubmit = async (data: UserEditSchema) => {
    await testDelay();
    dispatch(getUserAllProfileByIdAsync({ id: String(id) }));
  };

  const handleReset = () => {
    if (user) {
      reset(initialUserValue);
    }
  };

  if (!user || loading === 'loading') {
    return <LoadingSpinner />;
  }

  return (
    <div className="max-w-3xl mx-auto p-6 flex flex-col gap-4">
      <GoBackButton />
      <Form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6 bg-white p-6 shadow-md rounded-2xl border border-secondary"
      >
        <h2 className="text-2xl font-semibold text-secondary">Edit User Info</h2>
        <div className="flex flex-col gap-3">
          <div className="flex w-full gap-3">
            <Controller
              name="userName"
              control={control}
              render={({ field, fieldState }) => (
                <Input
                  label="UserName"
                  variant="bordered"
                  value={field.value ?? ''}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  isInvalid={!!fieldState.error}
                  errorMessage={fieldState.error?.message}
                  fullWidth
                />
              )}
            />
            <Controller
              name="email"
              control={control}
              render={({ field, fieldState }) => (
                <Input
                  label="Email"
                  variant="bordered"
                  value={field.value ?? ''}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  isInvalid={!!fieldState.error}
                  errorMessage={fieldState.error?.message}
                  fullWidth
                />
              )}
            />
          </div>

          <div className="flex w-full gap-3">
            <Controller
              name="firstName"
              control={control}
              render={({ field, fieldState }) => (
                <Input
                  label="FirstName"
                  variant="bordered"
                  value={field.value ?? ''}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  isInvalid={!!fieldState.error}
                  errorMessage={fieldState.error?.message}
                  fullWidth
                />
              )}
            />

            <Controller
              name="lastName"
              control={control}
              render={({ field, fieldState }) => (
                <Input
                  label="LastName"
                  variant="bordered"
                  value={field.value ?? ''}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  isInvalid={!!fieldState.error}
                  errorMessage={fieldState.error?.message}
                  fullWidth
                />
              )}
            />

            <Controller
              name="middleName"
              control={control}
              render={({ field, fieldState }) => (
                <Input
                  label="MiddleName"
                  variant="bordered"
                  value={field.value ?? ''}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  isInvalid={!!fieldState.error}
                  errorMessage={fieldState.error?.message}
                  fullWidth
                />
              )}
            />
          </div>

          <div className="flex w-full gap-3">
            <Controller
              name="gender"
              control={control}
              render={({ field, fieldState }) => (
                <Select
                  aria-label="Select gender"
                  label="Gender"
                  variant="bordered"
                  selectedKeys={field.value ? [field.value] : []}
                  onChange={e => field.onChange(e.target.value as Gender)}
                  isInvalid={!!fieldState.error}
                  errorMessage={fieldState.error?.message}
                >
                  {Object.values(Gender).map(item => (
                    <SelectItem key={item}>
                      {item.charAt(0).toUpperCase() + item.slice(1)}
                    </SelectItem>
                  ))}
                </Select>
              )}
            />

            <Controller
              name="dateOfBirth"
              control={control}
              render={({ field, fieldState }) => (
                <Input
                  label="Date of birth"
                  variant="bordered"
                  max={format(subYears(new Date(), 18), 'yyyy-MM-dd')}
                  type="date"
                  value={field.value ?? ''}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  isInvalid={!!fieldState.error}
                  errorMessage={fieldState.error?.message}
                />
              )}
            />

            <Controller
              name="honorific"
              control={control}
              render={({ field, fieldState }) => (
                <Select
                  aria-label="Select honorific"
                  label="Honorific"
                  variant="bordered"
                  selectedKeys={field.value ? [field.value] : []}
                  onChange={e => field.onChange(e.target.value as Honorific)}
                  isInvalid={!!fieldState.error}
                  errorMessage={fieldState.error?.message}
                >
                  {Object.values(Honorific).map(item => (
                    <SelectItem key={item}>
                      {item.charAt(0).toUpperCase() + item.slice(1)}
                    </SelectItem>
                  ))}
                </Select>
              )}
            />
          </div>

          <div className="flex w-full gap-3">
            <Controller
              name="avatarImage"
              control={control}
              render={({ field, fieldState }) => (
                <Input
                  label="AvatarImage"
                  variant="bordered"
                  value={field.value ?? ''}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  isInvalid={!!fieldState.error}
                  errorMessage={fieldState.error?.message}
                />
              )}
            />
          </div>

          <div className="flex w-full gap-3">
            <Controller
              name="isActive"
              control={control}
              render={({ field, fieldState }) => (
                <Select
                  aria-label="Select isActive"
                  label="IsActive"
                  variant="bordered"
                  selectedKeys={typeof field.value === 'boolean' ? [String(field.value)] : []}
                  onChange={e => field.onChange(e.target.value === 'true')}
                  isInvalid={!!fieldState.error}
                  errorMessage={fieldState.error?.message}
                >
                  {['true', 'false'].map(item => (
                    <SelectItem key={item}>
                      {item.charAt(0).toUpperCase() + item.slice(1)}
                    </SelectItem>
                  ))}
                </Select>
              )}
            />

            <Controller
              name="emailVerified"
              control={control}
              render={({ field, fieldState }) => (
                <Select
                  aria-label="Select emailVerified"
                  label="EmailVerified"
                  variant="bordered"
                  selectedKeys={typeof field.value === 'boolean' ? [String(field.value)] : []}
                  onChange={e => field.onChange(e.target.value === 'true')}
                  isInvalid={!!fieldState.error}
                  errorMessage={fieldState.error?.message}
                >
                  {['true', 'false'].map(item => (
                    <SelectItem key={item}>
                      {item.charAt(0).toUpperCase() + item.slice(1)}
                    </SelectItem>
                  ))}
                </Select>
              )}
            />

            <Controller
              name="profileCompleted"
              control={control}
              render={({ field, fieldState }) => (
                <Select
                  aria-label="Select profileCompleted"
                  label="ProfileCompleted"
                  variant="bordered"
                  selectedKeys={typeof field.value === 'boolean' ? [String(field.value)] : []}
                  onChange={e => field.onChange(e.target.value === 'true')}
                  isInvalid={!!fieldState.error}
                  errorMessage={fieldState.error?.message}
                >
                  {['true', 'false'].map(item => (
                    <SelectItem key={item}>
                      {item.charAt(0).toUpperCase() + item.slice(1)}
                    </SelectItem>
                  ))}
                </Select>
              )}
            />
          </div>
        </div>

        <div className="flex gap-4 justify-end">
          <Button
            type="button"
            onPress={handleReset}
            variant="ghost"
            className="text-secondary"
            isDisabled={!isDirty || isSubmitting}
          >
            Reset
          </Button>
          <Button
            type="submit"
            className="bg-secondary text-white"
            isDisabled={!isDirty}
            isLoading={isSubmitting}
          >
            Update
          </Button>
        </div>
      </Form>
    </div>
  );
}
