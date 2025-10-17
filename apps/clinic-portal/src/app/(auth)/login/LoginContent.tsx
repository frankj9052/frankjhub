'use client';
import { currentUserSlice, useDispatch } from '@/libs/redux';
import { login } from '@/services/auth.services';
import { LoginRequest } from '@frankjhub/shared-schema';
import { CardWrapper, LoginForm } from '@frankjhub/shared-ui-hero-client';
import { OnSubmitForForm } from '@frankjhub/shared-ui-hero-ssr';
import { handleFormServerErrors } from '@frankjhub/shared-utils';
import { useRouter } from 'next/navigation';
import { GiPadlock } from 'react-icons/gi';
import { toast } from 'react-toastify';

export const LoginContent = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const onSubmit: OnSubmitForForm<LoginRequest> = async (data, setError) => {
    const result = await login(data);
    if (result.status === 'success') {
      toast.success(result.message ?? 'Login Successful');
      dispatch(currentUserSlice.actions.setSession(result.data));
      router.replace('/');
    } else {
      handleFormServerErrors(result, setError);
    }
  };
  return (
    <div>
      <CardWrapper
        headerText="Clinic Portal Login"
        subHeaderText="Login your clinic account from here"
        headerIcon={GiPadlock}
        body={<LoginForm onSubmit={onSubmit} />}
      />
    </div>
  );
};
