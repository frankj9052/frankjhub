import FrankAvatar from './FrankAvatar';

export type UserListItemProps = {
  user?: {
    name?: string;
    image?: string;
    email?: string;
  };
};

/**
 * A simple user list item component displaying a user's avatar, name, and email.
 *
 * @param {object} [user] - Optional. User information to display.
 * @param {string} [user.name] - Optional. User's display name.
 * @param {string} [user.image] - Optional. URL of the user's avatar image.
 * @param {string} [user.email] - Optional. User's email address.
 */
export function UserListItem({ user }: UserListItemProps) {
  return (
    <div className="flex gap-2 items-center w-full">
      <FrankAvatar alt={user?.name} className="flex-shrink-0" size="sm" src={user?.image} />
      <div className="flex flex-col">
        <span className="text-small">{user?.name}</span>
        <span className="text-tiny text-default-400">{user?.email}</span>
      </div>
    </div>
  );
}

export default UserListItem;
