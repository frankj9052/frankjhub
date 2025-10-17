import clsx from 'clsx';
import { LoginContent } from './LoginContent';

const LoginPage = () => {
  return (
    <div className={clsx(['w-full h-full p-10', 'flex items-center justify-center'])}>
      <LoginContent />
    </div>
  );
};

export default LoginPage;
