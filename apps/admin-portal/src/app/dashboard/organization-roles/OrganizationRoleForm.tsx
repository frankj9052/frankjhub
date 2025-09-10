'use client';

import {
  UserOrganizationRoleUpdateRequest,
  userOrganizationRoleUpdateRequestSchema,
} from '@frankjhub/shared-schema';
import { FrankForm } from '@frankjhub/shared-ui-hero-client';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useForm } from 'react-hook-form';
import { UserSelection } from './UserSelection';
import clsx from 'clsx';
import { OrganizationSelection } from './OrganizationSelection';
import { FrankButton } from '@frankjhub/shared-ui-hero-ssr';

export const OrganizationRoleForm = () => {
  const methods = useForm<UserOrganizationRoleUpdateRequest>({
    resolver: zodResolver(userOrganizationRoleUpdateRequestSchema),
    mode: 'onSubmit',
  });

  const onSubmit = methods.handleSubmit(data => {
    console.log('submit ===> ', data);
  });

  console.log('error check ==> ', methods.formState.errors);
  return (
    <FormProvider {...methods}>
      <FrankForm onSubmit={onSubmit} className="flex flex-col gap-3 h-full w-full">
        <div className="w-full">
          <UserSelection />
        </div>
        <div className={clsx(['grid grid-cols-2 gap-4 flex-1 w-full'])}>
          <div className={clsx(['', ''])}>
            <OrganizationSelection />
          </div>
          <div className="bg-pink-200">role selection area</div>
        </div>
        <FrankButton type="submit">Apply Change</FrankButton>
      </FrankForm>
    </FormProvider>
  );
};
