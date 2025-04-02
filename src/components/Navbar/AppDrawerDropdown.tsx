import type { FC } from "react";
import { Dropdown } from "flowbite-react";
import { HiViewGrid } from "react-icons/hi";
import AppButton from "./AppButton";

interface AppDrawerDropdownProps {
  appButtons: { icon: React.ReactNode; title: string; onClick?: () => void }[];
  onClickExploreProducts?: () => void; // Add optional onClickExploreProducts prop
}

const AppDrawerDropdown: FC<AppDrawerDropdownProps> = ({ appButtons, onClickExploreProducts }) => {
  return (
    <Dropdown
      arrowIcon={false}
      inline
      className="z-[999]"
      label={
        <span className="cursor-pointer rounded p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
          <span className="sr-only">Apps</span>
          <HiViewGrid className="h-6 w-6" />
        </span>
      }
    >
      <div className="block rounded-t-lg bg-white dark:bg-gray-700 py-2 px-4 text-center text-base font-medium text-gray-700 dark:text-gray-400">
        Apps
      </div>
      <div className="border-b border-gray-300 dark:border-gray-500 mx-4"></div> {/* Darker grey divider */}
      <div className="grid grid-cols-3 gap-4 p-4 bg-white dark:bg-gray-700 rounded-b-lg">
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
