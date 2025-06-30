'use client';
import { GoBackButton } from '@/components/buttons/GoBackButton';
import { EditOrganizationTypesForm } from './EditOrgnizationTypesForm';

export default function EditOrganizationTypesPage() {
  return (
    <div className="max-w-3xl mx-auto p-6 flex flex-col gap-4">
      <GoBackButton />
      <EditOrganizationTypesForm />
    </div>
  );
}
