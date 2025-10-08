import React from "react";
import { Users } from "lucide-react";
import { TeamOption } from "../types";
import { Dropdown, DropdownItem } from "./Dropdown";

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
  const dropdownItems: DropdownItem[] = options.map((option) => ({
    id: option.id,
    label: option.name,
    available: option.available,
  }));

  return (
    <Dropdown
      label="Preferred Team"
      icon={Users}
      items={dropdownItems}
      selected={selectedTeam}
      onSelect={(id) => onTeamChange?.(id)}
      anyLabel="Any team"
    />
  );
};
