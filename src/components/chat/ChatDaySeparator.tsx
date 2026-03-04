import React from "react";

interface ChatDaySeparatorProps {
  label: string;
  /** Called when the label is clicked */
  onClick?: () => void;
}

/**
 * A visual day separator that appears between message groups.
 * Shows a horizontal line with the day label centered.
 * When onClick is provided, the label becomes clickable.
 */
export const ChatDaySeparator: React.FC<ChatDaySeparatorProps> = ({
  label,
  onClick,
}) => {
  return (
    <div className="flex items-center gap-4 my-4">
      <div className="flex-1 h-px bg-gray-200 dark:bg-gray-600" />
      {onClick ? (
        <button
          onClick={onClick}
          className="text-xs font-medium text-gray-500 dark:text-gray-400 whitespace-nowrap px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 hover:text-gray-700 dark:hover:text-gray-300 transition-colors cursor-pointer"
        >
          {label}
        </button>
      ) : (
        <span className="text-xs font-medium text-gray-500 dark:text-gray-400 whitespace-nowrap px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-700">
          {label}
        </span>
      )}
      <div className="flex-1 h-px bg-gray-200 dark:bg-gray-600" />
    </div>
  );
};

export default ChatDaySeparator;
