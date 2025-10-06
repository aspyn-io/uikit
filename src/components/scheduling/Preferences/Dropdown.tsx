import React, { useState, useRef, ReactNode } from "react";
import { ChevronRight, Check } from "lucide-react";
import { useOutsideClick } from "../hooks/useOutsideClick";

export interface DropdownItem {
  id: string;
  label: string;
  available?: boolean;
  metadata?: any; // For additional content like ratings, avatars, etc.
}

interface DropdownProps {
  label: string;
  icon: React.ElementType;
  items: DropdownItem[];
  selected?: string;
  onSelect: (id: string) => void;
  anyLabel?: string;
  renderItem?: (item: DropdownItem, isSelected: boolean) => ReactNode;
}

export const Dropdown: React.FC<DropdownProps> = ({
  label,
  icon: Icon,
  items,
  selected,
  onSelect,
  anyLabel = "Any",
  renderItem,
}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useOutsideClick(dropdownRef, () => setShowDropdown(false), showDropdown);

  const availableItems = items.map((item) => ({
    ...item,
    available: item.available !== false,
  }));

  const selectedLabel = items.find((i) => i.id === selected)?.label ?? anyLabel;

  const handleSelect = (id: string) => {
    onSelect(id);
    setShowDropdown(false);
  };

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 p-4">
      <div className="flex items-center gap-2 mb-3">
        <Icon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
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
            {/* "Any" option */}
            <button
              onClick={() => handleSelect("")}
              className={`w-full text-left px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center justify-between border-b border-gray-100 dark:border-gray-700 ${
                !selected
                  ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 font-medium"
                  : "text-gray-700 dark:text-gray-300"
              }`}
            >
              <span>{anyLabel}</span>
              {!selected && <Check className="h-4 w-4" />}
            </button>

            {/* Items */}
            {availableItems.map((item, index) => {
              const isSelected = selected === item.id;
              const isLast = index === availableItems.length - 1;

              return (
                <button
                  key={item.id}
                  onClick={() => handleSelect(item.id)}
                  disabled={!item.available}
                  className={`w-full text-left px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center justify-between ${
                    !isLast
                      ? "border-b border-gray-100 dark:border-gray-700"
                      : ""
                  } ${
                    isSelected
                      ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 font-medium"
                      : "text-gray-700 dark:text-gray-300"
                  } ${!item.available ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  {renderItem ? (
                    renderItem(item, isSelected)
                  ) : (
                    <>
                      <span>{item.label}</span>
                      {isSelected && <Check className="h-4 w-4" />}
                    </>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
