'use client';

import { useDispatch } from '@/libs/redux/store';
import { acceptInvitation } from '@/services/root-register.services';
import { AcceptInvitationRequest } from '@frankjhub/shared-schema';
import { CardWrapper, RootRegisterForm } from '@frankjhub/shared-ui-hero-client';
import { useRouter, useSearchParams } from 'next/navigation';
import { GiPadlock } from 'react-icons/gi';
import { toast } from 'react-toastify';

export const RootRegisterContent = () => {
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');

  const onSubmit = async (values: AcceptInvitationRequest) => {
    console.log('form data submitted ===> ', values);
    const result = await acceptInvitation(values);
    if (result.status === 'success') {
      toast.success(result.message);
      router.push('/');
    } else {
      toast.error(result.message);
    }
  };
  return (
    <div>
      <CardWrapper
        headerText="Clinic Root Register"
        subHeaderText="Register root account in clinic"
        headerIcon={GiPadlock}
        body={<RootRegisterForm onSubmit={onSubmit} token={token} />}
      />
    </div>
  );
};
