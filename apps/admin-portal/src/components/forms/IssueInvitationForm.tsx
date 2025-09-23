'use client';
import {
  getOrganizationOptionListAsync,
  getRoleOptionsAsync,
  useDispatch,
  useSelector,
} from '@/libs/redux';
import { getInvitationListAsync } from '@/libs/redux/slices/invitationSlice/thunk';
import { issueInvitation } from '@/services/invitation.service';
import { IssueInvitationRequest, issueInvitationRequestSchema } from '@frankjhub/shared-schema';
import {
  DefaultAutocompleteItemsType,
  FrankAutocomplete,
  FrankForm,
  FrankInput,
} from '@frankjhub/shared-ui-hero-client';
import { FrankButton } from '@frankjhub/shared-ui-hero-ssr';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { IoMdClose } from 'react-icons/io';
import { toast } from 'react-toastify';

type Props = {
  onClose: () => void;
};

export const IssueInvitationForm = ({ onClose }: Props) => {
  const dispatch = useDispatch();
  const {
    watch,
    handleSubmit,
    control,
    setValue,
    formState: { errors, isDirty, isSubmitting },
  } = useForm<IssueInvitationRequest>({
    resolver: zodResolver(issueInvitationRequestSchema),
    mode: 'onTouched',
  });
  const session = useSelector(state => state.currentUser.session);
  const pagination = useSelector(state => state.invitation.pagination);

  useEffect(() => {
    const currentUserId = session?.data.id ?? null;
    setValue('inviterUserId', currentUserId, {
      shouldDirty: false,
      shouldTouch: false,
      shouldValidate: false,
    });
  }, [session?.data.id, setValue]);

  // organization option list
  const orgOptionList = useSelector(state => state.organization.options);
  const defaultOrgOptionList = useMemo<DefaultAutocompleteItemsType[]>(() => {
    if (!orgOptionList?.data) return [];
    return orgOptionList.data.map(item => ({
      key: item.id,
      label: item.orgTypeName + ' - ' + item.name,
      textValue: item.orgTypeName + '-' + item.name,
    }));
  }, [orgOptionList?.data]);

  // submit
  const onSubmit = handleSubmit(async data => {
    const result = await issueInvitation(data);
    if (result.status === 'success') {
      toast.success(result.message ?? 'Invitation issued');
      onClose();
      dispatch(getInvitationListAsync({ data: pagination }));
    }
  });
  const selectedOrgId = watch('organizationId');

  // role option list
  const roleOptionList = useSelector(state => state.role.options);
  const defaultRoleOptionList = useMemo<DefaultAutocompleteItemsType[]>(() => {
    if (!roleOptionList?.data || !selectedOrgId || !orgOptionList?.data) return [];
    const selectedOrg = orgOptionList.data.find(org => org.id === selectedOrgId);
    if (!selectedOrg) return [];
    const list = roleOptionList.data.filter(role => {
      if (
        role.organizationId !== selectedOrg.id &&
        role.organizationTypeId !== selectedOrg.orgTypeId
      ) {
        return false;
      }
      return true;
    });
    return list.map(item => ({
      key: item.id,
      label: item.code,
      textValue: item.code,
    }));
  }, [orgOptionList?.data, roleOptionList?.data, selectedOrgId]);

  // 初始化
  useEffect(() => {
    dispatch(getOrganizationOptionListAsync());
    dispatch(getRoleOptionsAsync());
  }, [dispatch]);

  return (
    <div className="p-4 flex flex-col gap-3">
      {/* Top */}
      <div className="flex justify-between">
        <h1 className="text-xl font-semibold">Issue Invitation</h1>
        <IoMdClose size={20} className="cursor-pointer" onClick={onClose} />
      </div>

      <h2 className="text-gray-400 text-xs">Invite organization join the platform</h2>

      {/* Form */}
      <FrankForm onSubmit={onSubmit}>
        {/* Select an organization */}
        <div className="w-full">
          <Controller
            name="organizationId"
            control={control}
            render={({ field, fieldState }) => (
              <FrankAutocomplete
                ariaLabel="Select an organization"
                label="Select an organization"
                defaultFilter={true}
                defaultItems={defaultOrgOptionList}
                variant="bordered"
                size="sm"
                isInvalid={!!fieldState.error}
                onBlur={field.onBlur}
                errorMessage={fieldState.error?.message}
                height={48}
                onSelectionChange={key => {
                  field.onChange(key);
                }}
              />
            )}
          />
        </div>
        {/* Select a role from organization */}
        <div className="w-full">
          <Controller
            name="targetRoleId"
            control={control}
            render={({ field, fieldState }) => (
              <FrankAutocomplete
                ariaLabel="Select a target role"
                label="Select a target role"
                defaultFilter={true}
                defaultItems={defaultRoleOptionList}
                variant="bordered"
                size="sm"
                isDisabled={!selectedOrgId}
                isInvalid={!!fieldState.error}
                onBlur={field.onBlur}
                errorMessage={fieldState.error?.message}
                height={48}
                onSelectionChange={key => {
                  field.onChange(key);
                }}
              />
            )}
          />
        </div>
        {/* input target email */}
        <div className="w-full">
          <Controller
            name="email"
            control={control}
            render={({ field, fieldState }) => (
              <FrankInput
                label="Target email"
                variant="bordered"
                size="sm"
                type="email"
                onBlur={field.onBlur}
                isInvalid={!!fieldState.error}
                errorMessage={fieldState.error?.message}
                onValueChange={field.onChange}
              />
            )}
          />
        </div>

        {/* Server Errors */}
        {errors?.root?.serverError && (
          <p className="text-danger text-sm">
            {typeof errors.root.serverError.message === 'string'
              ? errors.root.serverError.message
              : JSON.stringify(errors.root.serverError.message)}
          </p>
        )}

        {/* Buttons */}
        <div className="flex gap-4">
          <FrankButton
            type="button"
            onPress={onClose}
            variant="ghost"
            className="text-secondary"
            isDisabled={!isDirty || isSubmitting}
          >
            Cancel
          </FrankButton>
          <FrankButton
            type="submit"
            className="bg-secondary text-white"
            isDisabled={!isDirty}
            isLoading={isSubmitting}
          >
            Create
          </FrankButton>
        </div>
      </FrankForm>
    </div>
  );
};
