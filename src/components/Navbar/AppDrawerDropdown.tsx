import type { FC } from "react";
import { Dropdown } from "flowbite-react";
import { HiViewGrid } from "react-icons/hi";
import AppButton from "./AppButton";
import { Link } from "react-router-dom";

export interface AppSection {
  label: string;
  appButtons: { icon: React.ReactNode; title: string; to: string }[];
}

interface AppDrawerDropdownProps {
  sections: AppSection[];
}

const AppDrawerDropdown: FC<AppDrawerDropdownProps> = ({ sections }) => {
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
      <div className="space-y-6 p-4 bg-white dark:bg-gray-700 rounded-lg">
        {sections.map((section, sectionIndex) => (
          <div key={sectionIndex}>
            <div className="mb-2 text-sm text-gray-600 dark:text-gray-300">
              {section.label.toUpperCase()}
            </div>
            <div className="grid grid-cols-3 gap-4">
              {section.appButtons.map((appButton, buttonIndex) => (
                <AppButton
                  key={buttonIndex}
                  icon={appButton.icon}
                  title={appButton.title}
                  to={appButton.to}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </Dropdown>
  );
};

export default AppDrawerDropdown;
