'use client';

import { GoBackButton } from '@/components/buttons/GoBackButton';
import { LoadingSpinner } from '@/components/loadings/LodingSpinner';
import { useDispatch, useSelector } from '@/libs/redux';
import { getUserAllProfileByIdAsync } from '@/libs/redux/slices/usersSlice/thunk';
import { Card, CardBody } from '@heroui/react';
import { format } from 'date-fns';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { useEffect } from 'react';

const ViewUserPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const user = useSelector(state => state.users.targetUser);
  const loading = useSelector(state => state.users.status);
  useEffect(() => {
    if (id) {
      dispatch(getUserAllProfileByIdAsync({ id: String(id) }));
    }
  }, [id, dispatch]);
  if (!user || loading === 'loading') {
    return <LoadingSpinner />;
  }
  return (
    <div className="max-w-4xl mx-auto p-6 flex flex-col gap-4">
      <GoBackButton />
      <Card className="shadow-lg rounded-2xl border border-secondary">
        <CardBody className="flex flex-col md:flex-row gap-6 items-center p-6">
          <div className="w-40 h-40 relative rounded-full overflow-hidden border-4 border-secondary">
            <Image
              src={user.avatarImage ?? ''}
              alt={user.userName}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 160px"
              priority
            />
          </div>
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <Detail label="User ID" value={user.id} />
            <Detail label="Username" value={user.userName} />
            <Detail label="Email" value={user.email ?? ''} />
            <Detail label="Email Verified" value={String(user.emailVerified)} />
            <Detail label="First Name" value={user.firstName} />
            <Detail label="Middle Name" value={user.middleName ?? ''} />
            <Detail label="Last Name" value={user.lastName} />
            <Detail label="Honorific" value={user.honorific ?? ''} />
            <Detail label="Gender" value={user.gender ?? ''} />
            <Detail
              label="Date of Birth"
              value={user.dateOfBirth ? format(new Date(user.dateOfBirth), 'yyyy-MM-dd') : ''}
            />
            <Detail label="Profile Completed" value={String(user.profileCompleted)} />
            <Detail label="Session Version" value={user.sessionVersion} />
            <Detail label="Active Status" value={String(user.isActive)} />
            <Detail
              label="Created At"
              value={format(new Date(user.createdAt), 'yyyy-MM-dd HH:mm')}
            />
            <Detail
              label="Updated At"
              value={format(new Date(user.updatedAt), 'yyyy-MM-dd HH:mm')}
            />
          </div>
        </CardBody>
      </Card>
    </div>
  );
};
export default ViewUserPage;

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col">
      <span className="text-secondary font-semibold">{label}</span>
      <span className="text-gray-700">{value}</span>
    </div>
  );
}
