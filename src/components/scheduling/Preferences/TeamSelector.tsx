import React, { useState, useRef } from "react";
import { Users, ChevronRight, Check } from "lucide-react";
import { TeamOption } from "../types";
import { useOutsideClick } from "../hooks/useOutsideClick";

interface TeamSelectorProps {
  options: TeamOption[];
  selectedTeam?: string;
  onTeamChange?: (teamId: string) => void;
}

export const TeamSelector: React.FC<TeamSelectorProps> = ({
  options,
  selectedTeam,
  onTeamChange,
}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useOutsideClick(dropdownRef, () => setShowDropdown(false), showDropdown);

  const availableTeams = options.map((option) => ({
    ...option,
    available: option.available !== false,
  }));

  const selectedLabel =
    options.find((t) => t.id === selectedTeam)?.name || "Any team";

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 p-4">
      <div className="flex items-center gap-2 mb-3">
        <Users className="h-5 w-5 text-gray-600 dark:text-gray-400" />
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Preferred Team
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
                onTeamChange?.("");
                setShowDropdown(false);
              }}
              className={`w-full text-left px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center justify-between border-b border-gray-100 dark:border-gray-700 ${
                !selectedTeam
                  ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 font-medium"
                  : "text-gray-700 dark:text-gray-300"
              }`}
            >
              <span>Any team</span>
              {!selectedTeam && <Check className="h-4 w-4" />}
            </button>
            {availableTeams.map((team, index) => (
              <button
                key={team.id}
                onClick={() => {
                  onTeamChange?.(team.id);
                  setShowDropdown(false);
                }}
                disabled={!team.available}
                className={`w-full text-left px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center justify-between ${
                  index < availableTeams.length - 1
                    ? "border-b border-gray-100 dark:border-gray-700"
                    : ""
                } ${
                  selectedTeam === team.id
                    ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 font-medium"
                    : "text-gray-700 dark:text-gray-300"
                } ${!team.available ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <span>{team.name}</span>
                {selectedTeam === team.id && <Check className="h-4 w-4" />}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
