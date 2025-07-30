import { GoBackButton } from '@/components/buttons/GoBackButton';
import { EditResourceForm } from '@/components/forms/EditResourceForm';

export default function EditResourcePage() {
  return (
    <div className="max-w-3xl mx-auto p-6 flex flex-col gap-4">
      <GoBackButton />
      <EditResourceForm />
    </div>
  );
}
