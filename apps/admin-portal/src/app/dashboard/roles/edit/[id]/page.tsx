import { GoBackButton } from '@/components/buttons/GoBackButton';
import EditRoleForm from '@/components/forms/EditRoleForm';

export default function EditRolePage() {
  return (
    <div className="max-w-3xl mx-auto p-6 flex flex-col gap-4">
      <GoBackButton />
      <EditRoleForm />
    </div>
  );
}
