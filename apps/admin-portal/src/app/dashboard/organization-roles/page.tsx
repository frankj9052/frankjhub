import clsx from 'clsx';
import { UserSelection } from './UserSelection';

const OrganizationRolesPage = () => {
  return (
    <div className="h-full py-4 px-8">
      <div className="flex flex-col gap-3 h-full">
        <div>
          <UserSelection />
        </div>
        <div className={clsx(['grid grid-cols-2 gap-4 flex-1'])}>
          <div className={clsx(['bg-yellow-200', ''])}>organization selection area</div>
          <div className="bg-pink-200">role selection area</div>
        </div>
      </div>
    </div>
  );
};
export default OrganizationRolesPage;
