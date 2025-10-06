import React, { useState, useRef } from "react";
import { Clock, ChevronRight, Check } from "lucide-react";
import { WindowOption } from "../types";
import { useOutsideClick } from "../hooks/useOutsideClick";

interface TimeWindowSelectorProps {
  options: WindowOption[];
  selectedWindow?: string;
  onWindowChange?: (windowId: string) => void;
}

export const TimeWindowSelector: React.FC<TimeWindowSelectorProps> = ({
  options,
  selectedWindow,
  onWindowChange,
}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useOutsideClick(dropdownRef, () => setShowDropdown(false), showDropdown);

  const availableWindows = options.map((option) => ({
    ...option,
    available: option.available !== false,
  }));

  const selectedLabel =
    options.find((w) => w.id === selectedWindow)?.label || "Any time window";

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 p-4">
      <div className="flex items-center gap-2 mb-3">
        <Clock className="h-5 w-5 text-gray-600 dark:text-gray-400" />
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Preferred Time Window
        </label>
      </div>
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className="w-full flex items-center justify-between px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 hover:border-gray-400 dark:hover:border-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <span>{selectedLabel}</span>
          <ChevronRight
            className={`h-4 w-4 transition-transform ${
              showDropdown ? "rotate-90" : ""
            }`}
          />
        </button>
        {showDropdown && (
          <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-60 overflow-auto">
            <button
              onClick={() => {
                onWindowChange?.("");
                setShowDropdown(false);
              }}
              className={`w-full text-left px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center justify-between border-b border-gray-100 dark:border-gray-700 ${
                !selectedWindow
                  ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 font-medium"
                  : "text-gray-700 dark:text-gray-300"
              }`}
            >
              <span>Any time window</span>
              {!selectedWindow && <Check className="h-4 w-4" />}
            </button>
            {availableWindows.map((window, index) => (
              <button
                key={window.id}
                onClick={() => {
                  onWindowChange?.(window.id);
                  setShowDropdown(false);
                }}
                disabled={!window.available}
                className={`w-full text-left px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center justify-between ${
                  index < availableWindows.length - 1
                    ? "border-b border-gray-100 dark:border-gray-700"
                    : ""
                } ${
                  selectedWindow === window.id
                    ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 font-medium"
                    : "text-gray-700 dark:text-gray-300"
                } ${!window.available ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <span>{window.label}</span>
                {selectedWindow === window.id && <Check className="h-4 w-4" />}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
