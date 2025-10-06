import React, { useState, useRef } from "react";
import { User, ChevronRight, Check, Star } from "lucide-react";
import { TechnicianOption } from "../types";
import { useOutsideClick } from "../hooks/useOutsideClick";

interface TechnicianSelectorProps {
  options: TechnicianOption[];
  selectedTechnician?: string;
  onTechnicianChange?: (technicianId: string) => void;
}

export const TechnicianSelector: React.FC<TechnicianSelectorProps> = ({
  options,
  selectedTechnician,
  onTechnicianChange,
}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useOutsideClick(dropdownRef, () => setShowDropdown(false), showDropdown);

  const availableTechnicians = options.map((option) => ({
    ...option,
    available: option.available !== false,
  }));

  const selectedLabel =
    options.find((t) => t.id === selectedTechnician)?.name || "Any technician";

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 p-4">
      <div className="flex items-center gap-2 mb-3">
        <User className="h-5 w-5 text-gray-600 dark:text-gray-400" />
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Preferred Technician
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
                onTechnicianChange?.("");
                setShowDropdown(false);
              }}
              className={`w-full text-left px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center justify-between border-b border-gray-100 dark:border-gray-700 ${
                !selectedTechnician
                  ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 font-medium"
                  : "text-gray-700 dark:text-gray-300"
              }`}
            >
              <span>Any technician</span>
              {!selectedTechnician && <Check className="h-4 w-4" />}
            </button>
            {availableTechnicians.map((technician, index) => (
              <button
                key={technician.id}
                onClick={() => {
                  onTechnicianChange?.(technician.id);
                  setShowDropdown(false);
                }}
                disabled={!technician.available}
                className={`w-full text-left px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-700 ${
                  index < availableTechnicians.length - 1
                    ? "border-b border-gray-100 dark:border-gray-700"
                    : ""
                } ${
                  selectedTechnician === technician.id
                    ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 font-medium"
                    : "text-gray-700 dark:text-gray-300"
                } ${
                  !technician.available ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {technician.avatar && (
                      <img
                        src={technician.avatar}
                        alt={technician.name}
                        className="h-6 w-6 rounded-full"
                      />
                    )}
                    <div>
                      <div className="font-medium">{technician.name}</div>
                      {(technician.rating || technician.experience) && (
                        <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-2">
                          {technician.rating && (
                            <span className="flex items-center gap-1">
                              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                              {technician.rating}
                            </span>
                          )}
                          {technician.experience && (
                            <span>{technician.experience}</span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  {selectedTechnician === technician.id && (
                    <Check className="h-4 w-4" />
                  )}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
