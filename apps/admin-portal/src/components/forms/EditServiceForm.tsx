'use client';

import { getPermissionOptionsAsync, useDispatch, useSelector } from '@/libs/redux';
import { getServiceByIdAsync, getServiceListAsync } from '@/libs/redux/slices/serviceSlice';
import { hardDeleteService, restoreService, updateService } from '@/services/service.service';
import { useConfirmModal } from '@frankjhub/shared-hooks';
import { ServiceUpdateRequest } from '@frankjhub/shared-schema';
import { FrankModal, ServiceEditForm } from '@frankjhub/shared-ui-hero-client';
import { handleFormServerErrors } from '@frankjhub/shared-utils';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useMemo } from 'react';
import { UseFormSetError } from 'react-hook-form';
import { toast } from 'react-toastify';

export const EditServiceForm = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const router = useRouter();

  const target = useSelector(state => state.service.target);
  const loading = useSelector(state => state.service.status);
  const pagination = useSelector(state => state.service.pagination);
  const permissionOptionList = useSelector(state => state.permission.options?.data);

  const {
    isOpen,
    config,
    loading: localLoading,
    openModal,
    closeModal,
    confirmAction,
  } = useConfirmModal();

  const initialValue = useMemo<ServiceUpdateRequest | undefined>(() => {
    if (!target) return undefined;
    return {
      id: target.id,
      description: target.description,
      name: target.name,
      serviceId: target.serviceId,
      baseUrl: target.baseUrl,
      audPrefix: target.audPrefix,
      requiredScopes: target.requiredScopes,
      routes: target.routes,
      healthCheckPath: target.healthCheckPath,
      ownerTeam: target.ownerTeam,
      serviceSecret: null,
      deletedAt: target.deletedAt,
      isActive: target.isActive,
    };
  }, [target]);

  // 首次或id变化时候拉取详情
  useEffect(() => {
    if (id && id !== target?.id) {
      dispatch(getServiceByIdAsync({ id: Array.isArray(id) ? id[0] : id }));
    }
  }, [id, dispatch, target?.id]);

  // 初始化permission option list
  useEffect(() => {
    dispatch(getPermissionOptionsAsync());
  }, [dispatch]);

  // 递交表单
  const onSubmit = (
    data: ServiceUpdateRequest,
    setError: UseFormSetError<ServiceUpdateRequest>
  ) => {
    if (!target) return;
    openModal({
      header: 'Update Service',
      body: `Are you sure you want to update Service: ${target.name}?`,
      color: 'secondary',
      text: 'Update',
      action: async () => {
        const result = await updateService({
          ...data,
          serviceSecret: data.serviceSecret ?? undefined,
        });
        if (result.status === 'success') {
          toast.success(result.message ?? 'Service updated successfully');
          dispatch(getServiceListAsync({ data: pagination }));
          router.back();
        } else {
          handleFormServerErrors(result, setError);
        }
      },
    });
  };

  // 永久删除
  const handleHardDelete = (id: string) => {
    openModal({
      header: 'Delete Permanently',
      body: `Are you sure you want to delete the service permanently?`,
      color: 'danger',
      text: 'Delete Permanently',
      action: async () => {
        const result = await hardDeleteService(id);
        if (result.status === 'success') {
          toast.success(result.message ?? 'Deleted permanently');
          router.back();
        } else {
          toast.error(String(result.message));
        }
      },
    });
  };

  // 恢复临时删除
  const handleRecovery = (id: string) => {
    openModal({
      header: 'Recover',
      body: `Are you sure you want to recover this service?`,
      color: 'success',
      text: 'Recover',
      action: async () => {
        const result = await restoreService(id);
        if (result.status === 'success') {
          toast.success(result.message ?? 'Recovered');
          // 恢复后刷新详情
          dispatch(getServiceByIdAsync({ id }));
        } else {
          toast.error(String(result.message));
        }
      },
    });
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-secondary">Edit Service</h2>
      </div>
      <div>
        <ServiceEditForm
          onSubmit={onSubmit}
          initialValue={initialValue}
          permissionOptionList={permissionOptionList}
          handleHardDelete={handleHardDelete}
          handleRecovery={handleRecovery}
          isLoading={loading === 'loading'}
        />
        <FrankModal
          isOpen={isOpen}
          onClose={closeModal}
          header={config?.header}
          backdrop="opaque"
          body={config?.body}
          footerButtons={[
            {
              color: 'default',
              variant: 'light',
              customizeContent: <div className="h-8 flex items-center justify-center">Cancel</div>,
              onPress: closeModal,
              isLoading: localLoading,
            },
            {
              color: config?.color ?? 'secondary',
              variant: 'solid',
              customizeContent: (
                <div className="h-8 flex items-center justify-center">{config?.text}</div>
              ),
              onPress: confirmAction,
              isLoading: localLoading,
            },
          ]}
        />
      </div>
    </div>
  );
};
