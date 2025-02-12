import type { FC } from "react";
import { Avatar, Dropdown } from "flowbite-react";

interface UserDropdownItem {
  title: string;
  onClick?: () => void;
}

interface UserDropdownProps {
  avatar: string;
  username: string;
  email: string;
  items: UserDropdownItem[];
}

const UserDropdown: FC<UserDropdownProps> = ({ avatar, username, email, items }) => {
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
        <span className="block text-sm">{username}</span>
        <span className="block truncate text-sm font-medium">
          {email}
        </span>
      </Dropdown.Header>
      {items.map((item, index) => (
        <Dropdown.Item key={index} onClick={item.onClick}>
          {item.title}
        </Dropdown.Item>
      ))}
    </Dropdown>
  );
};

export default UserDropdown;
