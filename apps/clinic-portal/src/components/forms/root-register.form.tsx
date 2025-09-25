'use client';

import { useDispatch } from '@/libs/redux';
import { useForm } from 'react-hook-form';
import { AcceptInvitationRequest, acceptInvitationRequestSchema } from '@frankjhub/shared-schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSearchParams } from 'next/navigation';
import { FrankForm } from '@frankjhub/shared-ui-hero-client';
import { useEffect } from 'react';

export const RootRegisterForm = () => {
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const { handleSubmit, setValue, setError } = useForm<AcceptInvitationRequest>({
    resolver: zodResolver(acceptInvitationRequestSchema),
    mode: 'onTouched',
  });

  const onSubmit = handleSubmit(async data => {
    console.log('submit ===> ', data);
  });

  useEffect(() => {
    if (token) {
      setValue('token', token, {
        shouldDirty: false,
        shouldValidate: false,
        shouldTouch: false,
      });
    } else {
      setError('root', {
        type: 'required',
        message: 'Token is missing!',
      });
    }
  }, [setValue, token, setError]);

  return (
    <FrankForm onSubmit={onSubmit}>
      <div className="p-4 flex flex-col gap-3">{/* Top */}</div>
    </FrankForm>
  );
};
