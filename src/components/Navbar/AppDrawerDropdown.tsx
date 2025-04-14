import type { FC } from "react";
import { useState } from "react";
import { Dropdown } from "flowbite-react";
import { HiViewGrid } from "react-icons/hi";
import AppButton from "./AppButton";
import { Spinner } from "flowbite-react";

export interface AppSection {
  label: string;
  appButtons: { icon: React.ReactNode; title: string; onClick?: () => void }[];
}

interface AppDrawerDropdownProps {
  sections: AppSection[]; // Update to accept sections
  onClickExploreProducts?: () => void;
}

const AppDrawerDropdown: FC<AppDrawerDropdownProps> = ({
  sections,
  onClickExploreProducts,
}) => {
  const [loadingButtonIndex, setLoadingButtonIndex] = useState<{
    section: number;
    button: number;
  } | null>(null);

  const handleButtonClick = (
    sectionIndex: number,
    buttonIndex: number,
    onClick?: () => void
  ) =>
    onClick &&
    (async () => {
      setLoadingButtonIndex({ section: sectionIndex, button: buttonIndex });
      await Promise.resolve(onClick()).finally(() =>
        setLoadingButtonIndex(null)
      );
    })();

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
      <div className="border-b border-gray-300 dark:border-gray-500 mx-4"></div>
      <div className="space-y-6 p-4 bg-white dark:bg-gray-700 rounded-b-lg">
        {sections.map((section, sectionIndex) => (
          <div key={sectionIndex}>
            <div className="mb-2 text-sm text-gray-600 dark:text-gray-300">
              {section.label.toUpperCase()}
            </div>
            <div className="grid grid-cols-3 gap-4">
              {section.appButtons.map((appButton, buttonIndex) => (
                <AppButton
                  key={buttonIndex}
                  icon={
                    loadingButtonIndex?.section === sectionIndex &&
                    loadingButtonIndex?.button === buttonIndex ? (
                      <Spinner />
                    ) : (
                      appButton.icon
                    )
                  }
                  title={appButton.title}
                  onClick={() =>
                    handleButtonClick(
                      sectionIndex,
                      buttonIndex,
                      appButton.onClick
                    )
                  }
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
