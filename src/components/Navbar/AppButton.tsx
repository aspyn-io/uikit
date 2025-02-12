import type { FC, ReactNode } from "react";

interface AppButtonProps {
  icon: ReactNode;
  title: string;
  onClick?: () => void;
}

const AppButton: FC<AppButtonProps> = ({ icon, title, onClick }) => {
  return (
    <a
      href="#"
      className="flex flex-col items-center justify-center rounded-lg p-4 text-center hover:bg-gray-100 dark:hover:bg-gray-600 transition"
      onClick={onClick}
    >
      <div className="flex h-10 w-10 items-center justify-center text-gray-500 dark:text-white">
        {icon}
      </div>
      <div className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
        {title}
      </div>
    </a>
  );
};

export default AppButton;
