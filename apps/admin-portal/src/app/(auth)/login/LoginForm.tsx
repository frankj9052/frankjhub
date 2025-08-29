'use client';
import { useDispatch } from '@/libs/redux';
import { getSessionAsync } from '@/libs/redux/slices/currentUserSlice/thunks';
import { loginClient } from '@/services/auth';
import { LoginRequest, loginRequestSchema } from '@frankjhub/shared-schema';
import { FrankCard } from '@frankjhub/shared-ui-hero-ssr';
import { Button, Input } from '@heroui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import React from 'react';
import { useForm } from 'react-hook-form';
import { GiPadlock } from 'react-icons/gi';
import { toast } from 'react-toastify';

export default function LoginForm() {
  const router = useRouter();
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm<LoginRequest>({
    resolver: zodResolver(loginRequestSchema),
    mode: 'onTouched',
  });
  const onSubmit = async (data: LoginRequest) => {
    const result = await loginClient(data);
    if (result.status === 'success') {
      toast.success(result.message);
      dispatch(getSessionAsync());
      router.replace('/dashboard'); // 不要用back, 和refresh打架
      router.refresh();
    } else {
      toast.error(typeof result?.details === 'string' ? result.details : result.message);
    }
  };
  return (
    <FrankCard
      className="w-2/5 mx-auto"
      cardHeight={370}
      cardHeader={
        <div className="flex flex-col items-center justify-center w-full">
          <div className="flex flex-col gap-2 items-center text-secondary">
            <div className="flex flex-row items-center gap-3">
              <GiPadlock size={30} />
              <h1 className="text-3xl font-semibold">Login</h1>
            </div>
            <p className="text-neutral-500">Welcome back to Admin Portal</p>
          </div>
        </div>
      }
      cardBody={
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <div className="h-[70px]">
              <Input
                defaultValue=""
                label="Email"
                variant="bordered"
                {...register('email')}
                isInvalid={!!errors.email}
                errorMessage={errors.email?.message as string}
              />
            </div>
            <div className="h-[70px]">
              <Input
                defaultValue=""
                label="Password"
                variant="bordered"
                type="password"
                {...register('password')}
                isInvalid={!!errors.password}
                errorMessage={errors.password?.message as string}
              />
            </div>
            <Button
              isDisabled={!isValid}
              fullWidth
              color="secondary"
              type="submit"
              isLoading={isSubmitting}
            >
              Login
            </Button>
          </div>
        </form>
      }
    />
  );
}
