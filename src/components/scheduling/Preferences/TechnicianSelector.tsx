import React from "react";
import { User, Check, Star } from "lucide-react";
import { TechnicianOption } from "../types";
import { Dropdown, DropdownItem } from "./Dropdown";

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
  const dropdownItems: DropdownItem[] = options.map((option) => ({
    id: option.id,
    label: option.name,
    available: option.available,
    metadata: {
      avatar: option.avatar,
      rating: option.rating,
      experience: option.experience,
    },
  }));

  return (
    <Dropdown
      label="Preferred Technician"
      icon={User}
      items={dropdownItems}
      selected={selectedTechnician}
      onSelect={(id) => onTechnicianChange?.(id)}
      anyLabel="Any technician"
      renderItem={(item, isSelected) => {
        const metadata = item.metadata as {
          avatar?: string;
          rating?: number;
          experience?: string;
        };

        return (
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
              {metadata.avatar && (
                <img
                  src={metadata.avatar}
                  alt={item.label}
                  className="h-6 w-6 rounded-full"
                />
              )}
              <div>
                <div className="font-medium">{item.label}</div>
                {(metadata.rating || metadata.experience) && (
                  <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-2">
                    {metadata.rating && (
                      <span className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        {metadata.rating}
                      </span>
                    )}
                    {metadata.experience && <span>{metadata.experience}</span>}
                  </div>
                )}
              </div>
            </div>
            {isSelected && <Check className="h-4 w-4" />}
          </div>
        );
      }}
    />
  );
};
