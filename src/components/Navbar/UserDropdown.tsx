import type { FC } from 'react';
import { Dropdown, Avatar } from 'flowbite-react';

const UserDropdown: FC = function () {
  const userInfo = {
    given_name: "John",
    family_name: "Doe",
    email: "john.doe@example.com",
  }; // Replace with actual user info if needed

  const fullName = `${userInfo.given_name} ${userInfo.family_name}`;

  const handleSignOut = () => {
    // Add sign out logic here
  };

  return (
    <Dropdown
      arrowIcon={false}
      inline
      className="overflow-hidden"
      label={
        <span>
          <span className="sr-only">User menu</span>
          <Avatar
            alt={fullName}
            img="/images/users/neil-sims.png" // Replace with actual user image if needed
            rounded
            size="sm"
          />
        </span>
      }
    >
      <Dropdown.Header>
        <span className="block text-sm">{fullName}</span>
        <span className="block truncate text-sm font-medium">
          {userInfo.email}
        </span>
      </Dropdown.Header>
      <Dropdown.Item href="/profile">
        My Profile
      </Dropdown.Item>
      <Dropdown.Item href="/settings">
        Settings
      </Dropdown.Item>
      <Dropdown.Divider />
      <Dropdown.Item href="/" onClick={handleSignOut}>
        Sign out
      </Dropdown.Item>
    </Dropdown>
  );
};

export default UserDropdown;
