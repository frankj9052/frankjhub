import { RegisterCard } from '@/components/cards/registerCard';
import { RootRegisterForm } from '@/components/forms/root-register.form';
import clsx from 'clsx';

const RootRegisterPage = () => {
  return (
    <div className={clsx(['bg-red-200', 'w-full h-full p-10', 'flex items-center justify-center'])}>
      <RegisterCard>
        <RootRegisterForm />
      </RegisterCard>
    </div>
  );
};

export default RootRegisterPage;
