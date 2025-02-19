import type { FC, ReactNode } from "react";
import classNames from "classnames";

interface AppButtonProps {
  icon: ReactNode;
  title: string;
  onClick?: () => void;
  className?: string; // Add optional className property
}

const AppButton: FC<AppButtonProps> = ({ icon, title, onClick, className }) => {
  return (
    <a
      href="#"
      className={classNames(
        "flex flex-col items-center justify-center rounded-lg p-4 text-center bg-gray-100 dark:bg-gray-600 hover:bg-gray-200 dark:hover:bg-gray-500 text-black dark:text-white transition",
        className // Apply optional className
      )}
      onClick={onClick}
    >
      <div className="flex h-10 w-10 items-center justify-center text-gray-700 dark:text-white">
        {icon}
      </div>
      <div className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
        {title}
      </div>
    </a>
  );
};

export default AppButton;
