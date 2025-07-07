import { GoBackButton } from '@/components/buttons/GoBackButton';
import { EditActionForm } from './EditActionForm';

export default function EditActionPage() {
  return (
    <div className="max-w-3xl mx-auto p-6 flex flex-col gap-4">
      <GoBackButton />
      <EditActionForm />
    </div>
  );
}
