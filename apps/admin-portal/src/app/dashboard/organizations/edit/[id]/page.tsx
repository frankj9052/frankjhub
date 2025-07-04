import { GoBackButton } from '@/components/buttons/GoBackButton';
import { EditOrganizationForm } from '@/components/forms/EditOrganizationForm';

export default function EditOrganizationPage() {
  return (
    <div className="max-w-3xl mx-auto p-6 flex flex-col gap-4">
      <GoBackButton />
      <EditOrganizationForm />
    </div>
  );
}
