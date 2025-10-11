'use client';

import { useDispatch, useSelector } from '@/libs/redux';
import { getServiceByIdAsync } from '@/libs/redux/slices/serviceSlice';
import { useConfirmModal } from '@frankjhub/shared-hooks';
import { ServiceUpdateRequest } from '@frankjhub/shared-schema';
import { ServiceEditForm } from '@frankjhub/shared-ui-hero-client';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useMemo } from 'react';

export const EditServiceForm = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const router = useRouter();

  const target = useSelector(state => state.service.target);
  const loading = useSelector(state => state.service.status);
  const pagination = useSelector(state => state.service.pagination);

  const { isOpen } = useConfirmModal();

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

  // 递交表单
  const onSubmit = (data: ServiceUpdateRequest) => {
    console.log('submitted => ', data);
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-secondary">Edit Service</h2>
      </div>
      <div>
        <ServiceEditForm onSubmit={onSubmit} initialValue={initialValue} />
      </div>
    </div>
  );
};
