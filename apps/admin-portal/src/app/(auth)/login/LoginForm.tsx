'use client';
import { LoginSchema, loginSchema } from '@/libs/schemas/loginSchema';
import { loginClient } from '@/services/auth';
import { Button, Card, CardBody, CardHeader, Input } from '@heroui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import React from 'react';
import { useForm } from 'react-hook-form';
import { GiPadlock } from 'react-icons/gi';
import { toast } from 'react-toastify';

export default function LoginForm() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    mode: 'onTouched',
  });
  const onSubmit = async (data: LoginSchema) => {
    const result = await loginClient(data);
    if (result.status === 'success') {
      toast.success('Login successful!');
      router.back(); // 登录成功返回上一页
    } else if (result.status === 'error') {
      const message = Array.isArray(result.error)
        ? result.error.map(err => err.message).join('\n') // 取出 zod 的错误信息
        : result.error;

      toast.error(message);
    }
  };
  return (
    <Card className="w-2/5 mx-auto">
      <CardHeader className="flex flex-col items-center justify-center">
        <div className="flex flex-col gap-2 items-center text-secondary">
          <div className="flex flex-row items-center gap-3">
            <GiPadlock size={30} />
            <h1 className="text-3xl font-semibold">Login</h1>
          </div>
          <p className="text-neutral-500">Welcome back to Admin Portal</p>
        </div>
      </CardHeader>
      <CardBody>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <Input
              defaultValue=""
              label="Email"
              variant="bordered"
              {...register('email')}
              isInvalid={!!errors.email}
              errorMessage={errors.email?.message as string}
            />
            <Input
              defaultValue=""
              label="Password"
              variant="bordered"
              type="password"
              {...register('password')}
              isInvalid={!!errors.password}
              errorMessage={errors.password?.message as string}
            />
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
      </CardBody>
    </Card>
  );
}
