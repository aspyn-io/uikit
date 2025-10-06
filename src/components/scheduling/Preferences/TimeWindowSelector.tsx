import React from "react";
import { Clock } from "lucide-react";
import { WindowOption } from "../types";
import { Dropdown, DropdownItem } from "./Dropdown";

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
  const dropdownItems: DropdownItem[] = options.map((option) => ({
    id: option.id,
    label: option.label,
    available: option.available,
  }));

  return (
    <Dropdown
      label="Preferred Time Window"
      icon={Clock}
      items={dropdownItems}
      selected={selectedWindow}
      onSelect={(id) => onWindowChange?.(id)}
      anyLabel="Any time window"
    />
  );
};
