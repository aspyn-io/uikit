import type { FC } from "react";
import { Avatar, Dropdown } from "flowbite-react";

interface UserDropdownProps {
  avatar: string;
}

const UserDropdown: FC<UserDropdownProps> = ({ avatar }) => {
  return (
    <Dropdown
      arrowIcon={false}
      inline
      label={
        <span>
          <span className="sr-only">User menu</span>
          <Avatar
            alt=""
            img={avatar}
            rounded
            size="sm"
          />
        </span>
      }
    >
      <Dropdown.Header>
        <span className="block text-sm">Neil Sims</span>
        <span className="block truncate text-sm font-medium">
          neil.sims@flowbite.com
        </span>
      </Dropdown.Header>
      <Dropdown.Item>Dashboard</Dropdown.Item>
      <Dropdown.Item>Settings</Dropdown.Item>
      <Dropdown.Item>Earnings</Dropdown.Item>
      <Dropdown.Divider />
      <Dropdown.Item>Sign out</Dropdown.Item>
    </Dropdown>
  );
};

export default UserDropdown;
