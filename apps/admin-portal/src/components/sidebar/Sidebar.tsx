import { ReactNode } from 'react';
import { SidebarNavLink } from './SidebarNavLink';

type SidebarListType = {
  icon: ReactNode;
  label: string;
  src: string;
};

type SidebarDataType = {
  category: string;
  list: SidebarListType[];
};

const sidebarData: SidebarDataType[] = [
  {
    category: 'Account',
    list: [
      {
        icon: <div>3</div>,
        label: 'Dashboard',
        src: '/dashboard',
      },
      {
        icon: <div>1</div>,
        label: 'Users',
        src: '/dashboard/users',
      },
      {
        icon: <div>1</div>,
        label: "User's organization & roles",
        src: '/dashboard/organization-roles',
      },
    ],
  },
  {
    category: 'Organization',
    list: [
      {
        icon: <div>3</div>,
        label: 'Organization Types',
        src: '/dashboard/organization-types',
      },
      {
        icon: <div>1</div>,
        label: 'Organizations',
        src: '/dashboard/organizations',
      },
    ],
  },
  {
    category: 'Permission',
    list: [
      {
        icon: <div>3</div>,
        label: 'Actions',
        src: '/dashboard/actions',
      },
      {
        icon: <div>1</div>,
        label: 'Resources',
        src: '/dashboard/resources',
      },
      {
        icon: <div>1</div>,
        label: 'Permissions',
        src: '/dashboard/permissions',
      },
    ],
  },
  {
    category: 'Role',
    list: [
      {
        icon: <div>3</div>,
        label: 'Roles',
        src: '/dashboard/roles',
      },
    ],
  },
];

type Props = {
  width?: number | '100%';
};

export const Sidebar = ({ width }: Props) => {
  return (
    <div
      style={{
        width: width ? (width === '100%' ? '100%' : `${width}px`) : '250px',
      }}
      className="border-r-1 p-3"
    >
      {sidebarData &&
        sidebarData.map(category => (
          <div key={category.category} className="pb-3">
            <h1 className="text-xl text-black select-none">{category.category}</h1>
            {category.list &&
              category.list.map(item => (
                <div key={item.label}>
                  <SidebarNavLink text={item.label} href={item.src} />
                </div>
              ))}
          </div>
        ))}
    </div>
  );
};
