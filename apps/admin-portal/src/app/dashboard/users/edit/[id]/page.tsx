'use client';

import {
  Gender,
  Honorific,
  UserUpdateRequest,
  userUpdateRequestSchema,
} from '@frankjhub/shared-schema';
import { Input, Button, Form, Select, SelectItem } from '@heroui/react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useDispatch, useSelector } from '@/libs/redux';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { getUserAllProfileByIdAsync } from '@/libs/redux/slices/usersSlice/thunk';
import { format, subYears } from 'date-fns';
import { handleFormServerErrors } from '@frankjhub/shared-utils';
import { GoBackButton } from '@/components/buttons/GoBackButton';
import { LoadingSpinner } from '@/components/loadings/LodingSpinner';
import { adminUpdateUser, hardDeleteUser, restoreDeletedUser } from '@/services/user';
import { FrankModal } from '@frankjhub/shared-ui-hero-client';
import { toast } from 'react-toastify';

export default function EditUserPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { id } = useParams();
  const user = useSelector(state => state.users.targetUser?.data);
  const {
    handleSubmit,
    control,
    reset,
    setError,
    getValues,
    formState: { isDirty, isSubmitting, errors },
  } = useForm<UserUpdateRequest>({
    resolver: zodResolver(userUpdateRequestSchema),
    mode: 'onTouched',
  });

  const loading = useSelector(state => state.users.status);
  const [localLoading, setLocalLoading] = useState(false);
  const [openModal, setOpenModal] = useState<
    | {
        header: string;
        body: string;
        action: () => void;
        color: 'danger' | 'success' | 'secondary';
        text: 'Delete Permanently' | 'Recover' | 'Update';
      }
    | undefined
  >(undefined);

  const initialUserValue = useMemo(() => {
    if (!user) return undefined;
    return {
      id: user.id,
      userName: user.userName,
      email: user.email ?? '',
      firstName: user.firstName,
      lastName: user.lastName ?? '',
      middleName: user.middleName ?? '',
      gender: user.gender,
      dateOfBirth: user?.dateOfBirth ? format(new Date(user.dateOfBirth), 'yyyy-MM-dd') : '',
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

  const onSubmit = (data: UserUpdateRequest) => {
    setOpenModal({
      header: 'Update',
      body: `Are you sure you want to update user ${user?.userName}`,
      color: 'secondary',
      text: 'Update',
      action: async () => {
        const result = await adminUpdateUser(data);
        if (result.status === 'success') {
          toast.success(result.message);
          setOpenModal(undefined);
          dispatch(getUserAllProfileByIdAsync({ id: String(id) }));
        } else {
          handleFormServerErrors(result, setError);
          setOpenModal(undefined);
        }
      },
    });
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
          {errors?.root?.serverError && (
            <p className="text-danger text-sm">{errors.root.serverError.message}</p>
          )}
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
            onPress={() => {
              onSubmit(getValues());
            }}
          >
            Update
          </Button>
          <Button
            type="button"
            variant="solid"
            color="danger"
            isDisabled={isSubmitting}
            isLoading={localLoading}
            onPress={() => {
              setOpenModal({
                header: 'Delete Permanently',
                body: `Are you sure you want to delete the user: ${user.userName} permanently?`,
                color: 'danger',
                text: 'Delete Permanently',
                action: async () => {
                  setLocalLoading(true);
                  const result = await hardDeleteUser(user.id);
                  if (result.status === 'success') {
                    toast.success(result.message);
                    setOpenModal(undefined);
                    router.back();
                  } else {
                    toast.error(String(result.message));
                  }
                  setLocalLoading(false);
                },
              });
            }}
          >
            Delete permanently
          </Button>
          <Button
            type="button"
            variant="solid"
            color="success"
            isDisabled={isSubmitting || !user.deletedAt}
            isLoading={localLoading}
            onPress={() => {
              setOpenModal({
                header: 'Recover',
                body: `Are you sure you want to recover the user: ${user.userName}?`,
                color: 'success',
                text: 'Recover',
                action: async () => {
                  setLocalLoading(true);
                  const result = await restoreDeletedUser(user.id);
                  if (result.status === 'success') {
                    toast.success(result.message);
                    setOpenModal(undefined);
                    dispatch(getUserAllProfileByIdAsync({ id: String(id) }));
                  } else {
                    toast.error(String(result.message));
                  }
                  setLocalLoading(false);
                },
              });
            }}
          >
            Recovery
          </Button>
        </div>
      </Form>
      <FrankModal
        isOpen={!!openModal}
        onClose={() => {
          setOpenModal(undefined);
        }}
        header={openModal?.header}
        backdrop="opaque"
        body={openModal?.body}
        footerButtons={[
          {
            color: 'default',
            variant: 'light',
            customizeContent: <div className="h-8 flex items-center justify-center">Cancel</div>,
            onPress: () => {
              setOpenModal(undefined);
            },
            isLoading: localLoading,
          },
          {
            color: openModal?.color,
            variant: 'solid',
            customizeContent: (
              <div className="h-8 flex items-center justify-center">{openModal?.text}</div>
            ),
            onPress: openModal?.action,
            isLoading: localLoading,
          },
        ]}
      />
    </div>
  );
}
