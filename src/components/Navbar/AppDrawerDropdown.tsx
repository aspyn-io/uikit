import type { FC } from "react";
import { Dropdown } from "flowbite-react";
import { HiViewGrid } from "react-icons/hi";
import AppButton from "./AppButton";

interface AppDrawerDropdownProps {
  appButtons: { icon: React.ReactNode; title: string; onClick?: () => void }[];
}

const AppDrawerDropdown: FC<AppDrawerDropdownProps> = ({ appButtons }) => {
  return (
    <Dropdown
      arrowIcon={false}
      inline
      label={
        <span className="rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-700">
          <span className="sr-only">Apps</span>
          <HiViewGrid className="text-2xl text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white" />
        </span>
      }
    >
      <div className="block rounded-t-lg border-b bg-gray-50 py-2 px-4 text-center text-base font-medium text-gray-700 dark:border-b-gray-600 dark:bg-gray-700 dark:text-white">
        Apps
      </div>
      <div className="grid grid-cols-3 gap-4 p-4">
        {appButtons.map((appButton, index) => (
          <AppButton
            key={index}
            icon={appButton.icon}
            title={appButton.title}
            onClick={appButton.onClick}
          />
        ))}
      </div>
    </Dropdown>
  );
};

export default AppDrawerDropdown;
