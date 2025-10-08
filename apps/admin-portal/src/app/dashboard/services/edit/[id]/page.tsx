import { GoBackButton } from '@/components/buttons/GoBackButton';
import { EditServiceForm } from '@/components/forms/EditServiceForm';

export default function EditServicePage() {
  return (
    <div className="max-w-3xl mx-auto p-6 flex flex-col gap-4">
      <GoBackButton />
      <EditServiceForm />
    </div>
  );
}
