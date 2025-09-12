'use client';

import {
  UserOrganizationRoleUpdateRequest,
  userOrganizationRoleUpdateRequestSchema,
} from '@frankjhub/shared-schema';
import { FrankForm } from '@frankjhub/shared-ui-hero-client';
import { zodResolver } from '@hookform/resolvers/zod';
import { FieldErrors, FormProvider, useForm } from 'react-hook-form';
import { UserSelection } from './UserSelection';
import clsx from 'clsx';
import { OrganizationSelection } from './OrganizationSelection';
import { FrankButton } from '@frankjhub/shared-ui-hero-ssr';
import { RoleSelection } from './RoleSelection';
import { toast } from 'react-toastify';
import { updateUserOrganizationRoleByUserId } from '@/services/userOrganizationRole.service';
import { useRouter } from 'next/navigation';

function getFirstErrorMessage(errors: FieldErrors): string | undefined {
  // 深度优先，找到第一条 message
  const visit = (node: unknown): string | undefined => {
    if (!node || typeof node !== 'object') return undefined;

    // FieldError: { type, message, ref }
    if ('message' in (node as any) && typeof (node as any).message === 'string') {
      return (node as any).message as string;
    }

    // 遍历对象或数组的子节点
    for (const val of Array.isArray(node) ? node : Object.values(node as any)) {
      const m = visit(val);
      if (m) return m;
    }
    return undefined;
  };

  return visit(errors);
}

export const OrganizationRoleForm = () => {
  const router = useRouter();
  const methods = useForm<UserOrganizationRoleUpdateRequest>({
    resolver: zodResolver(userOrganizationRoleUpdateRequestSchema),
    mode: 'onSubmit',
  });

  const onError = (errors: FieldErrors) => {
    const msg = getFirstErrorMessage(errors) ?? 'Error in form';
    toast.error(msg);
  };

  const onSubmit = methods.handleSubmit(async data => {
    console.log('submit ===> ', data);
    const result = await updateUserOrganizationRoleByUserId(data);
    console.log('result check ===> ', result);
    router.refresh();
  }, onError);

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
          <div className="">
            <RoleSelection />
          </div>
        </div>
        <FrankButton
          type="submit"
          isDisabled={!methods.formState.isDirty}
          isLoading={methods.formState.isSubmitting}
        >
          Apply Change
        </FrankButton>
      </FrankForm>
    </FormProvider>
  );
};
