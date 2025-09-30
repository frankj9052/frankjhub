import clsx from 'clsx';
import { RootRegisterContent } from './RootRegisterContent';

const RootRegisterPage = () => {
  return (
    <div className={clsx(['w-full h-full p-10', 'flex items-center justify-center'])}>
      <RootRegisterContent />
    </div>
  );
};

export default RootRegisterPage;
