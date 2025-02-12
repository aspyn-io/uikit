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
      className="block rounded-lg p-4 text-center hover:bg-gray-100 dark:hover:bg-gray-600"
      onClick={onClick}
    >
      <div className="mx-auto mb-1 h-7 w-7 text-gray-500 dark:text-white">
        {icon}
      </div>
      <div className="text-sm font-medium text-gray-900 dark:text-white">
        {title}
      </div>
    </a>
  );
};

export default AppButton;
