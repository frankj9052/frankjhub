'use client';

import { useDispatch } from '@/libs/redux/store';
import { AcceptInvitationRequest } from '@frankjhub/shared-schema';
import { CardWrapper, RootRegisterForm } from '@frankjhub/shared-ui-hero-client';
import { useSearchParams } from 'next/navigation';
import { GiPadlock } from 'react-icons/gi';

export const RootRegisterContent = () => {
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const onSubmit = (values: AcceptInvitationRequest) => {
    console.log('form data submitted ===> ', values);
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
