import { GoBackButton } from '@/components/buttons/GoBackButton';
import { EditPermissionForm } from '@/components/forms/EditPermissionForm';

export default function EditPermissionPage() {
  return (
    <div className="max-w-3xl mx-auto p-6 flex flex-col gap-4">
      <GoBackButton />
      <EditPermissionForm />
    </div>
  );
}
